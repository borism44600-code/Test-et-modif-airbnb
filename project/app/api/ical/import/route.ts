import { NextRequest, NextResponse } from 'next/server'
import { 
  parseICalContent, 
  icsEventsToBookedPeriods, 
  isValidIcalUrl,
  detectCalendarSource
} from '@/lib/ical'
import { CalendarChannel } from '@/lib/types'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { propertyId, icalUrl, source } = await request.json() as {
      propertyId: string
      icalUrl: string
      source?: CalendarChannel
    }

    if (!propertyId || !icalUrl) {
      return NextResponse.json(
        { error: 'Property ID and iCal URL are required' },
        { status: 400 }
      )
    }

    // Validate URL format
    if (!isValidIcalUrl(icalUrl)) {
      return NextResponse.json(
        { error: 'Invalid iCal URL. Please provide a valid HTTPS calendar URL.' },
        { status: 400 }
      )
    }

    // Detect source from URL if not provided
    const calendarSource: CalendarChannel = source || detectCalendarSource(icalUrl)

    // Fetch the iCal content
    const response = await fetch(icalUrl, {
      headers: {
        'User-Agent': 'MarrakechRiadsRent/1.0 (Calendar Sync)',
        'Accept': 'text/calendar, application/ics, */*'
      },
      // Cache for 5 minutes to avoid rate limiting
      next: { revalidate: 300 }
    })

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: `Failed to fetch calendar: ${response.status} ${response.statusText}`,
          details: 'Please check that the iCal URL is correct and accessible'
        },
        { status: 502 }
      )
    }

    const icsContent = await response.text()

    // Verify it's valid ICS content
    if (!icsContent.includes('BEGIN:VCALENDAR')) {
      return NextResponse.json(
        { error: 'Invalid calendar format. Expected ICS/iCal content.' },
        { status: 400 }
      )
    }

    // Parse the ICS content with the detected source
    const parseResult = parseICalContent(icsContent, calendarSource)
    
    // Convert to booked periods
    const bookedPeriods = icsEventsToBookedPeriods(parseResult.events, calendarSource)

    // Filter to only future bookings (or current)
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const futureBookings = bookedPeriods.filter(period => period.end >= now)

    return NextResponse.json({
      success: true,
      propertyId,
      source: calendarSource,
      calendarName: parseResult.calendarName,
      syncedAt: parseResult.lastSync.toISOString(),
      totalEvents: parseResult.events.length,
      futureBookings: futureBookings.length,
      bookedPeriods: futureBookings.map(p => ({
        start: p.start.toISOString().split('T')[0],
        end: p.end.toISOString().split('T')[0],
        source: p.source,
        guestName: p.guestName
      }))
    })

  } catch (error) {
    console.error('iCal import error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to import calendar',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
