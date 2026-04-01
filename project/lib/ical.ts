import { Property, CalendarChannel } from './types'

// ============================================
// iCAL DATA STRUCTURES
// ============================================

export interface ICalEvent {
  uid: string
  summary: string
  description?: string
  dtstart: Date
  dtend: Date
  source: CalendarChannel
}

export interface ICalParseResult {
  events: ICalEvent[]
  lastSync: Date
  calendarName?: string
}

export interface PropertyCalendarSync {
  propertyId: string
  airbnbIcalUrl?: string
  internalIcalUrl: string
  lastSyncAt?: Date
  syncStatus: 'idle' | 'syncing' | 'success' | 'error'
  syncError?: string
  importedEvents: ICalEvent[]
}

export interface BookedPeriod {
  start: Date
  end: Date
  source: CalendarChannel
  bookingId?: string
  guestName?: string
}

// ============================================
// iCAL PARSING (RFC 5545 compliant)
// ============================================

/**
 * Parse an ICS date string to a JavaScript Date object
 * Handles both DATE and DATE-TIME formats
 */
export function parseICalDate(icalDate: string): Date {
  // Remove any parameter prefixes like VALUE=DATE:
  const cleanDate = icalDate.replace(/^[A-Z]+[=;][^:]*:/i, '')
  
  // Format: YYYYMMDD or YYYYMMDDTHHMMSS or YYYYMMDDTHHMMSSZ
  if (cleanDate.length === 8) {
    // DATE format: YYYYMMDD
    const year = parseInt(cleanDate.substring(0, 4))
    const month = parseInt(cleanDate.substring(4, 6)) - 1
    const day = parseInt(cleanDate.substring(6, 8))
    return new Date(year, month, day)
  } else if (cleanDate.length >= 15) {
    // DATE-TIME format: YYYYMMDDTHHMMSS[Z]
    const year = parseInt(cleanDate.substring(0, 4))
    const month = parseInt(cleanDate.substring(4, 6)) - 1
    const day = parseInt(cleanDate.substring(6, 8))
    const hour = parseInt(cleanDate.substring(9, 11))
    const minute = parseInt(cleanDate.substring(11, 13))
    const second = parseInt(cleanDate.substring(13, 15))
    
    if (cleanDate.endsWith('Z')) {
      return new Date(Date.UTC(year, month, day, hour, minute, second))
    }
    return new Date(year, month, day, hour, minute, second)
  }
  
  // Fallback to standard Date parsing
  return new Date(cleanDate)
}

/**
 * Format a JavaScript Date to ICS DATE format (YYYYMMDD)
 */
export function formatICalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

/**
 * Format a JavaScript Date to ICS DATE-TIME format (YYYYMMDDTHHMMSSZ)
 */
export function formatICalDateTime(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hour = String(date.getUTCHours()).padStart(2, '0')
  const minute = String(date.getUTCMinutes()).padStart(2, '0')
  const second = String(date.getUTCSeconds()).padStart(2, '0')
  return `${year}${month}${day}T${hour}${minute}${second}Z`
}

/**
 * Unfold ICS content (RFC 5545: lines may be folded at 75 characters)
 */
function unfoldIcsContent(content: string): string {
  return content.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '')
}

/**
 * Parse ICS content and extract VEVENT components
 * @param icsContent - The raw ICS file content
 * @param source - The calendar source (airbnb, booking, platform)
 */
export function parseICalContent(icsContent: string, source: CalendarChannel = 'airbnb'): ICalParseResult {
  const unfolded = unfoldIcsContent(icsContent)
  const lines = unfolded.split(/\r?\n/)
  const events: ICalEvent[] = []
  let calendarName: string | undefined
  
  let currentEvent: Partial<ICalEvent> | null = null
  let inVEvent = false
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // Parse calendar name
    if (trimmedLine.startsWith('X-WR-CALNAME:')) {
      calendarName = trimmedLine.substring(13)
      continue
    }
    
    // Start of VEVENT
    if (trimmedLine === 'BEGIN:VEVENT') {
      inVEvent = true
      currentEvent = {
        source // Use the provided source
      }
      continue
    }
    
    // End of VEVENT
    if (trimmedLine === 'END:VEVENT' && currentEvent) {
      if (currentEvent.uid && currentEvent.dtstart && currentEvent.dtend) {
        events.push(currentEvent as ICalEvent)
      }
      currentEvent = null
      inVEvent = false
      continue
    }
    
    // Parse VEVENT properties
    if (inVEvent && currentEvent) {
      if (trimmedLine.startsWith('UID:')) {
        currentEvent.uid = trimmedLine.substring(4)
      } else if (trimmedLine.startsWith('SUMMARY:')) {
        currentEvent.summary = trimmedLine.substring(8)
      } else if (trimmedLine.startsWith('DESCRIPTION:')) {
        currentEvent.description = trimmedLine.substring(12)
      } else if (trimmedLine.startsWith('DTSTART')) {
        const colonIndex = trimmedLine.indexOf(':')
        if (colonIndex !== -1) {
          currentEvent.dtstart = parseICalDate(trimmedLine.substring(colonIndex + 1))
        }
      } else if (trimmedLine.startsWith('DTEND')) {
        const colonIndex = trimmedLine.indexOf(':')
        if (colonIndex !== -1) {
          currentEvent.dtend = parseICalDate(trimmedLine.substring(colonIndex + 1))
        }
      }
    }
  }
  
  return {
    events,
    lastSync: new Date(),
    calendarName
  }
}

// ============================================
// iCAL GENERATION (RFC 5545 compliant)
// ============================================

/**
 * Generate a unique UID for ICS events
 */
export function generateEventUid(propertyId: string, bookingId: string): string {
  return `booking-${bookingId}-${propertyId}@marrakechriadsrent.com`
}

/**
 * Escape special characters in ICS text values
 */
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

/**
 * Generate ICS content for a property's bookings
 */
export function generateICalContent(
  property: Property,
  bookings: BookedPeriod[],
  baseUrl: string
): string {
  const now = formatICalDateTime(new Date())
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Marrakech Riads Rent//Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(property.title)}`,
    `X-WR-CALDESC:Booking calendar for ${escapeIcsText(property.title)}`,
  ]
  
  // Add each booking as a VEVENT
  for (const booking of bookings) {
    const uid = generateEventUid(property.id, booking.bookingId || Date.now().toString())
    const summary = booking.guestName 
      ? `Booked: ${escapeIcsText(booking.guestName)}`
      : 'Reserved'
    
    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${formatICalDate(booking.start)}`,
      `DTEND;VALUE=DATE:${formatICalDate(booking.end)}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:Booking for ${escapeIcsText(property.title)}`,
      'TRANSP:OPAQUE',
      'STATUS:CONFIRMED',
      'END:VEVENT'
    )
  }
  
  lines.push('END:VCALENDAR')
  
  // Fold lines longer than 75 characters (RFC 5545)
  return lines.map(line => {
    if (line.length <= 75) return line
    let result = ''
    let remaining = line
    while (remaining.length > 75) {
      result += remaining.substring(0, 75) + '\r\n '
      remaining = remaining.substring(75)
    }
    result += remaining
    return result
  }).join('\r\n')
}

// ============================================
// AVAILABILITY INTEGRATION
// ============================================

/**
 * Convert ICS events to booked periods
 */
export function icsEventsToBookedPeriods(
  events: ICalEvent[],
  source: CalendarChannel = 'airbnb'
): BookedPeriod[] {
  return events.map(event => ({
    start: event.dtstart,
    end: event.dtend,
    source,
    bookingId: event.uid,
    guestName: event.summary?.replace(/^(Reserved|Booked|Blocked|Not available)[:]*\s*/i, '') || undefined
  }))
}

/**
 * Merge booked periods from multiple sources, removing duplicates
 */
export function mergeBookedPeriods(
  ...periodSets: BookedPeriod[][]
): BookedPeriod[] {
  const allPeriods = periodSets.flat()
  
  // Sort by start date
  allPeriods.sort((a, b) => a.start.getTime() - b.start.getTime())
  
  // Remove overlapping periods (keep the first one)
  const merged: BookedPeriod[] = []
  for (const period of allPeriods) {
    const overlapping = merged.find(
      existing => 
        period.start < existing.end && period.end > existing.start
    )
    if (!overlapping) {
      merged.push(period)
    }
  }
  
  return merged
}

/**
 * Check if a date range conflicts with booked periods
 */
export function hasBookingConflict(
  checkIn: Date,
  checkOut: Date,
  bookedPeriods: BookedPeriod[]
): { hasConflict: boolean; conflictingPeriod?: BookedPeriod } {
  for (const period of bookedPeriods) {
    // Check if date ranges overlap
    if (checkIn < period.end && checkOut > period.start) {
      return { hasConflict: true, conflictingPeriod: period }
    }
  }
  return { hasConflict: false }
}

/**
 * Convert booked periods to availability ranges (inverse)
 * Returns available date ranges within a given window
 */
export function bookedPeriodsToAvailability(
  bookedPeriods: BookedPeriod[],
  windowStart: Date,
  windowEnd: Date
): { start: string; end: string }[] {
  const availability: { start: string; end: string }[] = []
  
  // Sort periods by start date
  const sortedPeriods = [...bookedPeriods].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  )
  
  let currentDate = new Date(windowStart)
  
  for (const period of sortedPeriods) {
    // If there's a gap before this period, it's available
    if (currentDate < period.start) {
      availability.push({
        start: currentDate.toISOString().split('T')[0],
        end: new Date(period.start.getTime() - 86400000).toISOString().split('T')[0]
      })
    }
    // Move current date to after this period
    if (period.end > currentDate) {
      currentDate = new Date(period.end)
    }
  }
  
  // If there's remaining time after the last period, it's available
  if (currentDate < windowEnd) {
    availability.push({
      start: currentDate.toISOString().split('T')[0],
      end: windowEnd.toISOString().split('T')[0]
    })
  }
  
  return availability
}

// ============================================
// SYNC UTILITIES
// ============================================

/**
 * Generate the internal iCal URL for a property
 */
export function generateInternalIcalUrl(propertyId: string, baseUrl: string): string {
  return `${baseUrl}/api/ical/export/${propertyId}.ics`
}

/**
 * Validate if a URL looks like a valid iCal URL
 */
export function isValidIcalUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    // Must be https and end with .ics or contain ical/calendar patterns
    return (
      parsed.protocol === 'https:' &&
      (parsed.pathname.endsWith('.ics') || 
       parsed.pathname.includes('ical') ||
       parsed.pathname.includes('calendar') ||
       parsed.hostname.includes('airbnb') ||
       parsed.hostname.includes('booking'))
    )
  } catch {
    return false
  }
}

/**
 * Detect the calendar source from URL patterns
 */
export function detectCalendarSource(url: string): CalendarChannel {
  const lowerUrl = url.toLowerCase()
  if (lowerUrl.includes('airbnb')) return 'airbnb'
  if (lowerUrl.includes('booking.com') || lowerUrl.includes('admin.booking')) return 'booking'
  return 'platform'
}

/**
 * Validate Airbnb iCal URL format
 */
export function isValidAirbnbUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return (
      parsed.protocol === 'https:' &&
      parsed.hostname.includes('airbnb') &&
      (parsed.pathname.includes('calendar') || parsed.pathname.includes('ical'))
    )
  } catch {
    return false
  }
}

/**
 * Validate Booking.com iCal URL format
 */
export function isValidBookingUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return (
      parsed.protocol === 'https:' &&
      (parsed.hostname.includes('booking.com') || 
       parsed.hostname.includes('admin.booking') ||
       parsed.pathname.includes('ical'))
    )
  } catch {
    return false
  }
}

/**
 * Fetch and parse iCal content from a URL
 */
export async function fetchAndParseIcal(
  url: string, 
  source: CalendarChannel
): Promise<{ success: true; result: ICalParseResult } | { success: false; error: string }> {
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'text/calendar, text/plain, */*',
        'User-Agent': 'MarrakechRiadsRent/1.0'
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    })
    
    if (!response.ok) {
      return { 
        success: false, 
        error: `Failed to fetch calendar: ${response.status} ${response.statusText}` 
      }
    }
    
    const content = await response.text()
    
    if (!content.includes('BEGIN:VCALENDAR')) {
      return { 
        success: false, 
        error: 'Invalid iCal format: No VCALENDAR found' 
      }
    }
    
    const result = parseICalContent(content, source)
    return { success: true, result }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error fetching calendar' 
    }
  }
}

/**
 * Sync multiple external calendars for a property
 */
export interface MultiChannelSyncResult {
  airbnb?: {
    success: boolean
    eventsCount?: number
    error?: string
    lastSyncAt?: Date
  }
  booking?: {
    success: boolean
    eventsCount?: number
    error?: string
    lastSyncAt?: Date
  }
  mergedPeriods: BookedPeriod[]
  overallStatus: 'success' | 'partial' | 'error'
}

export async function syncExternalCalendars(
  airbnbUrl?: string,
  bookingUrl?: string
): Promise<MultiChannelSyncResult> {
  const results: MultiChannelSyncResult = {
    mergedPeriods: [],
    overallStatus: 'success'
  }
  
  const allPeriods: BookedPeriod[][] = []
  let hasSuccess = false
  let hasError = false
  
  // Sync Airbnb
  if (airbnbUrl) {
    const airbnbResult = await fetchAndParseIcal(airbnbUrl, 'airbnb')
    if (airbnbResult.success) {
      const periods = icsEventsToBookedPeriods(airbnbResult.result.events, 'airbnb')
      allPeriods.push(periods)
      results.airbnb = {
        success: true,
        eventsCount: airbnbResult.result.events.length,
        lastSyncAt: new Date()
      }
      hasSuccess = true
    } else {
      results.airbnb = {
        success: false,
        error: airbnbResult.error
      }
      hasError = true
    }
  }
  
  // Sync Booking.com
  if (bookingUrl) {
    const bookingResult = await fetchAndParseIcal(bookingUrl, 'booking')
    if (bookingResult.success) {
      const periods = icsEventsToBookedPeriods(bookingResult.result.events, 'booking')
      allPeriods.push(periods)
      results.booking = {
        success: true,
        eventsCount: bookingResult.result.events.length,
        lastSyncAt: new Date()
      }
      hasSuccess = true
    } else {
      results.booking = {
        success: false,
        error: bookingResult.error
      }
      hasError = true
    }
  }
  
  // Merge all booked periods
  results.mergedPeriods = mergeBookedPeriods(...allPeriods)
  
  // Determine overall status
  if (hasSuccess && hasError) {
    results.overallStatus = 'partial'
  } else if (hasError && !hasSuccess) {
    results.overallStatus = 'error'
  } else {
    results.overallStatus = 'success'
  }
  
  return results
}
