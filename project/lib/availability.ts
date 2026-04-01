import { Property } from './types'

// ============================================
// DATE BLOCKING SYSTEM
// ============================================

export type DateBlockType = 'maintenance' | 'owner_use' | 'booking' | 'other'

export interface DateBlock {
  id: string
  propertyId: string
  startDate: string
  endDate: string
  type: DateBlockType
  reason?: string
  bookingId?: string // If blocked due to a booking
  createdBy?: string
  createdAt: string
}

// In-memory store for date blocks (would be database in production)
const dateBlocks: DateBlock[] = []

/**
 * Add a date block for a property
 */
export function addDateBlock(block: Omit<DateBlock, 'id' | 'createdAt'>): DateBlock {
  const newBlock: DateBlock = {
    ...block,
    id: `DB-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString()
  }
  dateBlocks.push(newBlock)
  return newBlock
}

/**
 * Remove a date block
 */
export function removeDateBlock(blockId: string): boolean {
  const index = dateBlocks.findIndex(b => b.id === blockId)
  if (index !== -1) {
    dateBlocks.splice(index, 1)
    return true
  }
  return false
}

/**
 * Get all date blocks for a property
 */
export function getDateBlocksForProperty(propertyId: string): DateBlock[] {
  return dateBlocks.filter(b => b.propertyId === propertyId)
}

/**
 * Check if a date is blocked for a property
 */
export function isDateBlocked(propertyId: string, date: Date): boolean {
  const dateStr = date.toISOString().split('T')[0]
  return dateBlocks.some(block => {
    if (block.propertyId !== propertyId) return false
    return dateStr >= block.startDate && dateStr < block.endDate
  })
}

/**
 * Get blocked dates within a range for a property
 */
export function getBlockedDatesInRange(
  propertyId: string,
  startDate: Date,
  endDate: Date
): DateBlock[] {
  const start = startDate.toISOString().split('T')[0]
  const end = endDate.toISOString().split('T')[0]
  
  return dateBlocks.filter(block => {
    if (block.propertyId !== propertyId) return false
    // Check if block overlaps with the range
    return block.startDate < end && block.endDate > start
  })
}

// ============================================
// AVAILABILITY DATA STRUCTURES
// ============================================

export interface DateRange {
  start: Date
  end: Date
}

export interface AvailabilitySegment {
  propertyId: string
  start: Date
  end: Date
  nights: number
}

export interface SplitStaySuggestion {
  type: 'full' | 'split'
  totalNights: number
  segments: AvailabilitySegment[]
  properties: Property[]
  message: string
}

export interface PropertyAvailabilityResult {
  property: Property
  status: 'available' | 'partial' | 'unavailable'
  availableNights: number
  totalRequestedNights: number
  availableDates?: DateRange[]
  unavailableDates?: DateRange[]
}

export interface BookingSegment {
  propertyId: string
  propertyTitle: string
  checkIn: Date
  checkOut: Date
  nights: number
  pricePerNight: number
  totalPrice: number
}

export interface BookingPlan {
  type: 'single' | 'split'
  segments: BookingSegment[]
  totalNights: number
  totalPrice: number
  guests: {
    adults: number
    children: number
  }
}

// ============================================
// AVAILABILITY UTILITY FUNCTIONS
// ============================================

/**
 * Calculate the number of nights between two dates
 */
export function calculateNights(start: Date, end: Date): number {
  const diffTime = end.getTime() - start.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Check if a specific date is within availability ranges
 * Also checks against date blocks if propertyId is provided
 */
export function isDateAvailable(
  date: Date,
  availability: { start: string; end: string }[],
  propertyId?: string
): boolean {
  // First check if date is in availability ranges
  const inAvailabilityRange = availability.some(range => {
    const start = new Date(range.start)
    const end = new Date(range.end)
    return date >= start && date <= end
  })
  
  if (!inAvailabilityRange) return false
  
  // If propertyId provided, also check date blocks
  if (propertyId) {
    return !isDateBlocked(propertyId, date)
  }
  
  return true
}

/**
 * Check if a date range is fully available
 */
export function isRangeFullyAvailable(
  checkIn: Date,
  checkOut: Date,
  availability: { start: string; end: string }[]
): boolean {
  const currentDate = new Date(checkIn)
  while (currentDate < checkOut) {
    if (!isDateAvailable(currentDate, availability)) {
      return false
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return true
}

/**
 * Get the available nights within a requested range
 */
export function getAvailableNightsInRange(
  checkIn: Date,
  checkOut: Date,
  availability: { start: string; end: string }[]
): { availableNights: number; availableDates: DateRange[]; unavailableDates: DateRange[] } {
  const availableDates: DateRange[] = []
  const unavailableDates: DateRange[] = []
  let availableNights = 0
  
  let currentRangeStart: Date | null = null
  let currentRangeIsAvailable: boolean | null = null
  const currentDate = new Date(checkIn)
  
  while (currentDate < checkOut) {
    const isAvailable = isDateAvailable(currentDate, availability)
    
    if (isAvailable) {
      availableNights++
    }
    
    // Track contiguous ranges
    if (currentRangeIsAvailable === null) {
      currentRangeStart = new Date(currentDate)
      currentRangeIsAvailable = isAvailable
    } else if (currentRangeIsAvailable !== isAvailable) {
      // Close the current range
      const range = { start: currentRangeStart!, end: new Date(currentDate) }
      if (currentRangeIsAvailable) {
        availableDates.push(range)
      } else {
        unavailableDates.push(range)
      }
      // Start a new range
      currentRangeStart = new Date(currentDate)
      currentRangeIsAvailable = isAvailable
    }
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  // Close the final range
  if (currentRangeStart && currentRangeIsAvailable !== null) {
    const range = { start: currentRangeStart, end: new Date(currentDate) }
    if (currentRangeIsAvailable) {
      availableDates.push(range)
    } else {
      unavailableDates.push(range)
    }
  }
  
  return { availableNights, availableDates, unavailableDates }
}

/**
 * Check property availability and return detailed status
 */
export function checkPropertyAvailability(
  property: Property,
  checkIn: Date,
  checkOut: Date
): PropertyAvailabilityResult {
  const totalRequestedNights = calculateNights(checkIn, checkOut)
  const { availableNights, availableDates, unavailableDates } = getAvailableNightsInRange(
    checkIn,
    checkOut,
    property.availability
  )
  
  let status: 'available' | 'partial' | 'unavailable'
  if (availableNights === totalRequestedNights) {
    status = 'available'
  } else if (availableNights > 0) {
    status = 'partial'
  } else {
    status = 'unavailable'
  }
  
  return {
    property,
    status,
    availableNights,
    totalRequestedNights,
    availableDates: availableDates.length > 0 ? availableDates : undefined,
    unavailableDates: unavailableDates.length > 0 ? unavailableDates : undefined
  }
}

/**
 * Filter properties by availability for given dates
 */
export function filterPropertiesByAvailability(
  properties: Property[],
  checkIn: Date | null,
  checkOut: Date | null
): { available: Property[]; partial: PropertyAvailabilityResult[]; unavailable: Property[] } {
  if (!checkIn || !checkOut) {
    return { available: properties, partial: [], unavailable: [] }
  }
  
  const available: Property[] = []
  const partial: PropertyAvailabilityResult[] = []
  const unavailable: Property[] = []
  
  properties.forEach(property => {
    const result = checkPropertyAvailability(property, checkIn, checkOut)
    if (result.status === 'available') {
      available.push(property)
    } else if (result.status === 'partial') {
      partial.push(result)
    } else {
      unavailable.push(property)
    }
  })
  
  return { available, partial, unavailable }
}

// ============================================
// SPLIT-STAY LOGIC
// ============================================

/**
 * Find alternative properties for unavailable nights
 * Prioritizes: same type > same district > similar price > any available
 */
export function findAlternativeProperties(
  originalProperty: Property,
  unavailableDates: DateRange[],
  allProperties: Property[]
): Property[] {
  const alternatives: Property[] = []
  
  for (const dateRange of unavailableDates) {
    // Filter properties that are available for these dates
    const availableForRange = allProperties.filter(p => {
      if (p.id === originalProperty.id) return false
      return isRangeFullyAvailable(dateRange.start, dateRange.end, p.availability)
    })
    
    // Sort by similarity to original property
    availableForRange.sort((a, b) => {
      let scoreA = 0
      let scoreB = 0
      
      // Same type +3
      if (a.type === originalProperty.type) scoreA += 3
      if (b.type === originalProperty.type) scoreB += 3
      
      // Same district +2
      if (a.location.district === originalProperty.location.district) scoreA += 2
      if (b.location.district === originalProperty.location.district) scoreB += 2
      
      // Similar price range (+/- 30%) +1
      const priceRangeMin = originalProperty.pricePerNight * 0.7
      const priceRangeMax = originalProperty.pricePerNight * 1.3
      if (a.pricePerNight >= priceRangeMin && a.pricePerNight <= priceRangeMax) scoreA += 1
      if (b.pricePerNight >= priceRangeMin && b.pricePerNight <= priceRangeMax) scoreB += 1
      
      // Similar guest capacity +1
      if (a.totalGuestCapacity >= originalProperty.totalGuestCapacity) scoreA += 1
      if (b.totalGuestCapacity >= originalProperty.totalGuestCapacity) scoreB += 1
      
      return scoreB - scoreA
    })
    
    if (availableForRange.length > 0) {
      alternatives.push(availableForRange[0])
    }
  }
  
  return alternatives
}

/**
 * Generate a split-stay suggestion when a property is partially available
 */
export function generateSplitStaySuggestion(
  selectedProperty: Property,
  checkIn: Date,
  checkOut: Date,
  allProperties: Property[]
): SplitStaySuggestion | null {
  const result = checkPropertyAvailability(selectedProperty, checkIn, checkOut)
  
  // If fully available, no split needed
  if (result.status === 'available') {
    return {
      type: 'full',
      totalNights: result.totalRequestedNights,
      segments: [{
        propertyId: selectedProperty.id,
        start: checkIn,
        end: checkOut,
        nights: result.totalRequestedNights
      }],
      properties: [selectedProperty],
      message: 'Your selected property is available for your entire stay.'
    }
  }
  
  // If completely unavailable
  if (result.status === 'unavailable' || !result.availableDates || !result.unavailableDates) {
    return null
  }
  
  // Find alternatives for unavailable dates
  const alternatives = findAlternativeProperties(
    selectedProperty,
    result.unavailableDates,
    allProperties
  )
  
  // If no alternatives found, can't create a split stay
  if (alternatives.length < result.unavailableDates.length) {
    return null
  }
  
  // Build segments
  const segments: AvailabilitySegment[] = []
  const properties: Property[] = [selectedProperty]
  
  // Add available segments from original property
  result.availableDates.forEach(range => {
    segments.push({
      propertyId: selectedProperty.id,
      start: range.start,
      end: range.end,
      nights: calculateNights(range.start, range.end)
    })
  })
  
  // Add alternative segments
  result.unavailableDates.forEach((range, index) => {
    const alternative = alternatives[index]
    if (alternative) {
      segments.push({
        propertyId: alternative.id,
        start: range.start,
        end: range.end,
        nights: calculateNights(range.start, range.end)
      })
      if (!properties.find(p => p.id === alternative.id)) {
        properties.push(alternative)
      }
    }
  })
  
  // Sort segments by start date
  segments.sort((a, b) => a.start.getTime() - b.start.getTime())
  
  return {
    type: 'split',
    totalNights: result.totalRequestedNights,
    segments,
    properties,
    message: `Your selected property is available for ${result.availableNights} nights. We have prepared a seamless premium alternative for the remaining nights.`
  }
}

/**
 * Create a booking plan from segments
 */
export function createBookingPlan(
  segments: AvailabilitySegment[],
  properties: Property[],
  guests: { adults: number; children: number }
): BookingPlan {
  const bookingSegments: BookingSegment[] = segments.map(segment => {
    const property = properties.find(p => p.id === segment.propertyId)!
    return {
      propertyId: segment.propertyId,
      propertyTitle: property.title,
      checkIn: segment.start,
      checkOut: segment.end,
      nights: segment.nights,
      pricePerNight: property.pricePerNight,
      totalPrice: property.pricePerNight * segment.nights
    }
  })
  
  const totalNights = bookingSegments.reduce((sum, seg) => sum + seg.nights, 0)
  const totalPrice = bookingSegments.reduce((sum, seg) => sum + seg.totalPrice, 0)
  
  return {
    type: bookingSegments.length > 1 ? 'split' : 'single',
    segments: bookingSegments,
    totalNights,
    totalPrice,
    guests
  }
}

// ============================================
// DATE FORMATTING UTILITIES
// ============================================

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })
}

export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  })
}

export function formatDateRange(start: Date, end: Date): string {
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${startStr} - ${endStr}`
}
