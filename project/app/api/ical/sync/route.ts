import { NextRequest, NextResponse } from 'next/server'
import { mockProperties } from '@/lib/data'
import { 
  generateInternalIcalUrl, 
  isValidAirbnbUrl, 
  isValidBookingUrl,
  syncExternalCalendars
} from '@/lib/ical'
import { PropertyCalendarSync, ExternalCalendarConfig } from '@/lib/types'

export const runtime = 'nodejs'

// In-memory storage for sync status (would be database in production)
const syncStatusStore = new Map<string, {
  airbnbIcalUrl?: string
  bookingIcalUrl?: string
  airbnbLastSyncAt?: string
  airbnbEventsCount?: number
  airbnbSyncStatus: 'idle' | 'syncing' | 'success' | 'error'
  airbnbError?: string
  bookingLastSyncAt?: string
  bookingEventsCount?: number
  bookingSyncStatus: 'idle' | 'syncing' | 'success' | 'error'
  bookingError?: string
  lastExternalSyncAt?: string
  overallStatus: 'idle' | 'syncing' | 'success' | 'error' | 'partial'
}>()

/**
 * GET /api/ical/sync?propertyId=xxx
 * Returns the current sync status for a property
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const propertyId = searchParams.get('propertyId')
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin
  
  // Return all properties if no propertyId specified
  if (!propertyId) {
    const allStatus = mockProperties.map(property => {
      const stored = syncStatusStore.get(property.id)
      return {
        propertyId: property.id,
        propertyTitle: property.title,
        internalIcalUrl: generateInternalIcalUrl(property.id, baseUrl),
        airbnbConfigured: !!stored?.airbnbIcalUrl,
        bookingConfigured: !!stored?.bookingIcalUrl,
        overallStatus: stored?.overallStatus || 'idle',
        lastExternalSyncAt: stored?.lastExternalSyncAt
      }
    })
    return NextResponse.json({ properties: allStatus })
  }
  
  const property = mockProperties.find(p => p.id === propertyId)
  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 })
  }
  
  const storedStatus = syncStatusStore.get(propertyId)
  
  // Build channels array
  const channels: ExternalCalendarConfig[] = [
    {
      channel: 'airbnb',
      name: 'Airbnb',
      icalUrl: storedStatus?.airbnbIcalUrl,
      lastSyncAt: storedStatus?.airbnbLastSyncAt,
      syncStatus: storedStatus?.airbnbSyncStatus || 'idle',
      eventsCount: storedStatus?.airbnbEventsCount,
      error: storedStatus?.airbnbError
    },
    {
      channel: 'booking',
      name: 'Booking.com',
      icalUrl: storedStatus?.bookingIcalUrl,
      lastSyncAt: storedStatus?.bookingLastSyncAt,
      syncStatus: storedStatus?.bookingSyncStatus || 'idle',
      eventsCount: storedStatus?.bookingEventsCount,
      error: storedStatus?.bookingError
    }
  ]
  
  const response: PropertyCalendarSync = {
    propertyId,
    propertyTitle: property.title,
    internalIcalUrl: generateInternalIcalUrl(propertyId, baseUrl),
    channels,
    lastExternalSyncAt: storedStatus?.lastExternalSyncAt,
    overallStatus: storedStatus?.overallStatus || 'idle'
  }
  
  return NextResponse.json(response)
}

/**
 * POST /api/ical/sync
 * Save URLs and/or trigger sync
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      propertyId, 
      airbnbIcalUrl, 
      bookingIcalUrl, 
      action 
    } = body as {
      propertyId: string
      airbnbIcalUrl?: string
      bookingIcalUrl?: string
      action: 'save' | 'sync' | 'sync-airbnb' | 'sync-booking'
    }
    
    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 })
    }
    
    const property = mockProperties.find(p => p.id === propertyId)
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }
    
    // Get or create stored status
    let storedStatus = syncStatusStore.get(propertyId) || {
      airbnbSyncStatus: 'idle' as const,
      bookingSyncStatus: 'idle' as const,
      overallStatus: 'idle' as const
    }
    
    // Validate URLs if provided
    if (airbnbIcalUrl && !isValidAirbnbUrl(airbnbIcalUrl)) {
      return NextResponse.json(
        { error: 'Invalid Airbnb iCal URL format. Please use the URL from your Airbnb calendar export.' },
        { status: 400 }
      )
    }
    
    if (bookingIcalUrl && !isValidBookingUrl(bookingIcalUrl)) {
      return NextResponse.json(
        { error: 'Invalid Booking.com iCal URL format. Please use the URL from your Booking.com calendar export.' },
        { status: 400 }
      )
    }
    
    // Save action - just store the URLs
    if (action === 'save') {
      if (airbnbIcalUrl !== undefined) {
        storedStatus.airbnbIcalUrl = airbnbIcalUrl || undefined
        if (!airbnbIcalUrl) {
          storedStatus.airbnbSyncStatus = 'idle'
          storedStatus.airbnbLastSyncAt = undefined
          storedStatus.airbnbEventsCount = undefined
          storedStatus.airbnbError = undefined
        }
      }
      if (bookingIcalUrl !== undefined) {
        storedStatus.bookingIcalUrl = bookingIcalUrl || undefined
        if (!bookingIcalUrl) {
          storedStatus.bookingSyncStatus = 'idle'
          storedStatus.bookingLastSyncAt = undefined
          storedStatus.bookingEventsCount = undefined
          storedStatus.bookingError = undefined
        }
      }
      
      // Update overall status
      const hasAirbnb = !!storedStatus.airbnbIcalUrl
      const hasBoth = hasAirbnb && !!storedStatus.bookingIcalUrl
      if (!hasAirbnb && !storedStatus.bookingIcalUrl) {
        storedStatus.overallStatus = 'idle'
      }
      
      syncStatusStore.set(propertyId, storedStatus)
      
      return NextResponse.json({
        success: true,
        message: 'Calendar URLs saved successfully'
      })
    }
    
    // Sync action - fetch and parse calendars
    if (action === 'sync' || action === 'sync-airbnb' || action === 'sync-booking') {
      // Update URLs if provided
      if (airbnbIcalUrl) storedStatus.airbnbIcalUrl = airbnbIcalUrl
      if (bookingIcalUrl) storedStatus.bookingIcalUrl = bookingIcalUrl
      
      // Determine which calendars to sync
      const syncAirbnb = (action === 'sync' || action === 'sync-airbnb') && storedStatus.airbnbIcalUrl
      const syncBooking = (action === 'sync' || action === 'sync-booking') && storedStatus.bookingIcalUrl
      
      if (!syncAirbnb && !syncBooking) {
        return NextResponse.json(
          { error: 'No calendar URLs configured. Please add at least one external calendar URL.' },
          { status: 400 }
        )
      }
      
      // Set syncing status
      if (syncAirbnb) storedStatus.airbnbSyncStatus = 'syncing'
      if (syncBooking) storedStatus.bookingSyncStatus = 'syncing'
      storedStatus.overallStatus = 'syncing'
      syncStatusStore.set(propertyId, storedStatus)
      
      // Perform sync
      const syncResult = await syncExternalCalendars(
        syncAirbnb ? storedStatus.airbnbIcalUrl : undefined,
        syncBooking ? storedStatus.bookingIcalUrl : undefined
      )
      
      // Update status with results
      if (syncResult.airbnb) {
        storedStatus.airbnbSyncStatus = syncResult.airbnb.success ? 'success' : 'error'
        storedStatus.airbnbLastSyncAt = syncResult.airbnb.lastSyncAt?.toISOString()
        storedStatus.airbnbEventsCount = syncResult.airbnb.eventsCount
        storedStatus.airbnbError = syncResult.airbnb.error
      }
      
      if (syncResult.booking) {
        storedStatus.bookingSyncStatus = syncResult.booking.success ? 'success' : 'error'
        storedStatus.bookingLastSyncAt = syncResult.booking.lastSyncAt?.toISOString()
        storedStatus.bookingEventsCount = syncResult.booking.eventsCount
        storedStatus.bookingError = syncResult.booking.error
      }
      
      storedStatus.overallStatus = syncResult.overallStatus
      storedStatus.lastExternalSyncAt = new Date().toISOString()
      
      syncStatusStore.set(propertyId, storedStatus)
      
      return NextResponse.json({
        success: syncResult.overallStatus !== 'error',
        overallStatus: syncResult.overallStatus,
        airbnb: syncResult.airbnb,
        booking: syncResult.booking,
        totalBlockedPeriods: syncResult.mergedPeriods.length,
        message: syncResult.overallStatus === 'success' 
          ? 'All calendars synced successfully'
          : syncResult.overallStatus === 'partial'
          ? 'Some calendars synced with errors'
          : 'Calendar sync failed'
      })
    }
    
    return NextResponse.json({ error: 'Invalid action. Use "save" or "sync".' }, { status: 400 })
    
  } catch (error) {
    console.error('Calendar sync error:', error)
    return NextResponse.json({ error: 'Internal server error during sync' }, { status: 500 })
  }
}
