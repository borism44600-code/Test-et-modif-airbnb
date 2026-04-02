import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  generateInternalIcalUrl,
  isValidAirbnbUrl,
  isValidBookingUrl,
  syncExternalCalendars
} from '@/lib/ical'

export const runtime = 'nodejs'

/**
 * GET /api/ical/sync?propertyId=xxx
 * Retourne le statut de sync pour une propriété (ou toutes).
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const propertyId = searchParams.get('propertyId')
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin

  if (!propertyId) {
    // Toutes les propriétés + leur statut de sync
    const { data: properties } = await supabase
      .from('properties')
      .select('id, title, name_en, availability_sync(airbnb_ical_url, booking_ical_url, last_sync_at, sync_status, overall_status:sync_status)')
      .or('status.eq.published,is_active.eq.true')
      .order('created_at', { ascending: false })

    const allStatus = (properties || []).map((p: Record<string, unknown>) => {
      const sync = Array.isArray(p.availability_sync)
        ? (p.availability_sync[0] as Record<string, unknown> | undefined)
        : undefined
      return {
        propertyId: p.id,
        propertyTitle: (p.title as string) || (p.name_en as string) || '',
        internalIcalUrl: generateInternalIcalUrl(p.id as string, baseUrl),
        airbnbConfigured: !!(sync?.airbnb_ical_url),
        bookingConfigured: !!(sync?.booking_ical_url),
        overallStatus: sync?.sync_status || 'idle',
        lastExternalSyncAt: sync?.last_sync_at,
      }
    })

    return NextResponse.json({ properties: allStatus })
  }

  // Propriété spécifique
  const { data: property } = await supabase
    .from('properties')
    .select('id, title, name_en')
    .eq('id', propertyId)
    .single()

  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 })
  }

  const { data: syncRow } = await supabase
    .from('availability_sync')
    .select('*')
    .eq('property_id', propertyId)
    .single()

  const channels = [
    {
      channel: 'airbnb',
      name: 'Airbnb',
      icalUrl: syncRow?.airbnb_ical_url,
      lastSyncAt: syncRow?.last_sync_at,
      syncStatus: syncRow?.sync_status || 'idle',
      eventsCount: undefined,
      error: syncRow?.sync_error || undefined,
    },
    {
      channel: 'booking',
      name: 'Booking.com',
      icalUrl: syncRow?.booking_ical_url,
      lastSyncAt: syncRow?.last_sync_at,
      syncStatus: syncRow?.sync_status || 'idle',
      eventsCount: undefined,
      error: undefined,
    },
  ]

  return NextResponse.json({
    propertyId,
    propertyTitle: property.title || property.name_en || '',
    internalIcalUrl: generateInternalIcalUrl(propertyId, baseUrl),
    channels,
    lastExternalSyncAt: syncRow?.last_sync_at,
    overallStatus: syncRow?.sync_status || 'idle',
  })
}

/**
 * POST /api/ical/sync
 * Sauvegarde les URLs et/ou déclenche un sync.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { propertyId, airbnbIcalUrl, bookingIcalUrl, action } = body as {
      propertyId: string
      airbnbIcalUrl?: string
      bookingIcalUrl?: string
      action: 'save' | 'sync' | 'sync-airbnb' | 'sync-booking'
    }

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 })
    }

    // Vérifier que la propriété existe
    const { data: property } = await supabase
      .from('properties')
      .select('id')
      .eq('id', propertyId)
      .single()

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Valider les URLs si fournies
    if (airbnbIcalUrl && !isValidAirbnbUrl(airbnbIcalUrl)) {
      return NextResponse.json(
        { error: 'URL Airbnb iCal invalide. Utiliser l\'URL depuis l\'export de calendrier Airbnb.' },
        { status: 400 }
      )
    }
    if (bookingIcalUrl && !isValidBookingUrl(bookingIcalUrl)) {
      return NextResponse.json(
        { error: 'URL Booking.com iCal invalide. Utiliser l\'URL depuis l\'export de calendrier Booking.com.' },
        { status: 400 }
      )
    }

    // Lire le statut actuel depuis availability_sync
    const { data: existingSync } = await supabase
      .from('availability_sync')
      .select('*')
      .eq('property_id', propertyId)
      .single()

    if (action === 'save') {
      const upsertData: Record<string, unknown> = {
        property_id: propertyId,
        sync_enabled: true,
        updated_at: new Date().toISOString(),
      }
      if (airbnbIcalUrl !== undefined) upsertData.airbnb_ical_url = airbnbIcalUrl || null
      if (bookingIcalUrl !== undefined) upsertData.booking_ical_url = bookingIcalUrl || null

      await supabase
        .from('availability_sync')
        .upsert(upsertData, { onConflict: 'property_id' })

      return NextResponse.json({ success: true, message: 'URLs de calendrier sauvegardées.' })
    }

    if (action === 'sync' || action === 'sync-airbnb' || action === 'sync-booking') {
      const airbnbUrl = airbnbIcalUrl ?? existingSync?.airbnb_ical_url
      const bookingUrl = bookingIcalUrl ?? existingSync?.booking_ical_url

      const syncAirbnb = (action === 'sync' || action === 'sync-airbnb') && !!airbnbUrl
      const syncBooking = (action === 'sync' || action === 'sync-booking') && !!bookingUrl

      if (!syncAirbnb && !syncBooking) {
        return NextResponse.json(
          { error: 'Aucune URL de calendrier configurée.' },
          { status: 400 }
        )
      }

      // Marquer comme "syncing"
      await supabase
        .from('availability_sync')
        .upsert({
          property_id: propertyId,
          airbnb_ical_url: airbnbUrl || null,
          booking_ical_url: bookingUrl || null,
          sync_status: 'pending',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'property_id' })

      const syncResult = await syncExternalCalendars(
        syncAirbnb ? airbnbUrl : undefined,
        syncBooking ? bookingUrl : undefined
      )

      // Persister le résultat
      await supabase
        .from('availability_sync')
        .upsert({
          property_id: propertyId,
          airbnb_ical_url: airbnbUrl || null,
          booking_ical_url: bookingUrl || null,
          sync_status: syncResult.overallStatus === 'success' ? 'success' : 'error',
          sync_error: syncResult.airbnb?.error || syncResult.booking?.error || null,
          last_sync_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'property_id' })

      return NextResponse.json({
        success: syncResult.overallStatus !== 'error',
        overallStatus: syncResult.overallStatus,
        airbnb: syncResult.airbnb,
        booking: syncResult.booking,
        totalBlockedPeriods: syncResult.mergedPeriods.length,
        message:
          syncResult.overallStatus === 'success'
            ? 'Tous les calendriers synchronisés.'
            : syncResult.overallStatus === 'partial'
            ? 'Certains calendriers ont eu des erreurs.'
            : 'Échec de la synchronisation.',
      })
    }

    return NextResponse.json({ error: 'Action invalide. Utiliser "save" ou "sync".' }, { status: 400 })

  } catch (error) {
    console.error('Calendar sync error:', error)
    return NextResponse.json({ error: 'Internal server error during sync' }, { status: 500 })
  }
}
