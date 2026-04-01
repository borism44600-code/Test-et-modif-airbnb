import { NextRequest, NextResponse } from 'next/server'
import { generateICalContent, BookedPeriod } from '@/lib/ical'
import { mockProperties } from '@/lib/data'

export const runtime = 'nodejs'

// In a real app, this would come from a database
// For now, we'll use mock bookings data
const mockBookings: Record<string, BookedPeriod[]> = {
  '1': [
    { 
      start: new Date('2026-04-11'), 
      end: new Date('2026-04-20'), 
      source: 'platform',
      bookingId: 'BK-2026-001',
      guestName: 'John Smith'
    },
    { 
      start: new Date('2026-07-01'), 
      end: new Date('2026-07-14'), 
      source: 'platform',
      bookingId: 'BK-2026-002',
      guestName: 'Marie Dupont'
    }
  ],
  '2': [
    { 
      start: new Date('2026-04-01'), 
      end: new Date('2026-04-10'), 
      source: 'platform',
      bookingId: 'BK-2026-003'
    },
    { 
      start: new Date('2026-07-15'), 
      end: new Date('2026-07-31'), 
      source: 'platform',
      bookingId: 'BK-2026-004',
      guestName: 'James Wilson'
    }
  ]
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params
    
    // Remove .ics extension if present
    const cleanPropertyId = propertyId.replace(/\.ics$/, '')

    // Find the property
    const property = mockProperties.find(p => p.id === cleanPropertyId)
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Get bookings for this property
    const bookings = mockBookings[cleanPropertyId] || []

    // Get the base URL from the request
    const baseUrl = request.nextUrl.origin

    // Generate the ICS content
    const icsContent = generateICalContent(property, bookings, baseUrl)

    // Return as downloadable ICS file
    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${property.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-calendar.ics"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('iCal export error:', error)
    return NextResponse.json(
      { error: 'Failed to generate calendar' },
      { status: 500 }
    )
  }
}
