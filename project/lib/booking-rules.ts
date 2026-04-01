/**
 * Booking Rules Engine
 * Handles cancellation policies, refund calculations, and booking rules
 * 
 * Reference timezone: Africa/Casablanca (Marrakech)
 * Cutoff time: 15:00 (3:00 PM)
 */

// Marrakech timezone
export const MARRAKECH_TIMEZONE = 'Africa/Casablanca'
export const CANCELLATION_CUTOFF_HOUR = 15 // 3:00 PM
export const FREE_CANCELLATION_DAYS = 15

// Booking status types
export type BookingStatus = 
  | 'pending'
  | 'confirmed' 
  | 'paid'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded'

// Refund status types
export type RefundStatus = 
  | 'not_applicable'
  | 'pending'
  | 'completed'
  | 'refused'

// Date block types for manual blocking
export type DateBlockType = 
  | 'maintenance'
  | 'owner_use'
  | 'other'

export interface DateBlock {
  id: string
  propertyId: string
  startDate: string
  endDate: string
  type: DateBlockType
  reason?: string
  createdBy: string
  createdAt: string
}

export interface CancellationPolicy {
  nightsRetained: number
  percentageRetained: number
  description: string
}

export interface RefundCalculation {
  originalAmount: number
  nightsBooked: number
  nightlyRate: number
  nightsRetained: number
  amountRetained: number
  refundableAmount: number
  isWithinFreeCancellation: boolean
  daysUntilCheckIn: number
  cancellationDeadline: Date
  policy: CancellationPolicy
}

export interface BookingCancellation {
  bookingId: string
  cancelledAt: string
  reason?: string
  refundCalculation: RefundCalculation
  refundStatus: RefundStatus
  refundedAmount?: number
  refundOverride?: boolean
  refundOverrideAmount?: number
  refundOverrideReason?: string
  paymentTransactionId?: string
  refundTransactionId?: string
  processedBy?: string
}

export interface EnhancedBooking {
  id: string
  propertyId: string
  propertyTitle: string
  checkIn: string
  checkOut: string
  nights: number
  guests: {
    adults: number
    children: number
  }
  pricing: {
    nightlyRate: number
    subtotal: number
    cleaningFee: number
    extras: number
    total: number
  }
  status: BookingStatus
  payment: {
    method: 'card' | 'paypal' | 'bank_transfer'
    status: 'pending' | 'paid' | 'refunded' | 'partial_refund'
    transactionId?: string
    paidAt?: string
  }
  cancellation?: BookingCancellation
  contactInfo: {
    name: string
    email: string
    phone: string
  }
  source: 'website' | 'airbnb' | 'booking' | 'manual'
  notes?: string
  createdAt: string
  updatedAt: string
}

/**
 * Get the current time in Marrakech timezone
 */
export function getMarrakechTime(date?: Date): Date {
  const d = date || new Date()
  // Convert to Marrakech time
  const marrakechString = d.toLocaleString('en-US', { timeZone: MARRAKECH_TIMEZONE })
  return new Date(marrakechString)
}

/**
 * Get the cancellation deadline for a check-in date
 * Returns the date/time when free cancellation ends (15 days before at 3:00 PM Marrakech time)
 */
export function getCancellationDeadline(checkInDate: Date | string): Date {
  const checkIn = typeof checkInDate === 'string' ? new Date(checkInDate) : checkInDate
  
  // Create deadline: 15 days before check-in at 15:00 Marrakech time
  const deadline = new Date(checkIn)
  deadline.setDate(deadline.getDate() - FREE_CANCELLATION_DAYS)
  deadline.setHours(CANCELLATION_CUTOFF_HOUR, 0, 0, 0)
  
  return deadline
}

/**
 * Calculate days until check-in from a given date
 */
export function getDaysUntilCheckIn(checkInDate: Date | string, fromDate?: Date): number {
  const checkIn = typeof checkInDate === 'string' ? new Date(checkInDate) : checkInDate
  const from = fromDate || getMarrakechTime()
  
  // Reset time parts for accurate day calculation
  const checkInDay = new Date(checkIn)
  checkInDay.setHours(0, 0, 0, 0)
  
  const fromDay = new Date(from)
  fromDay.setHours(0, 0, 0, 0)
  
  const diffTime = checkInDay.getTime() - fromDay.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

/**
 * Check if a cancellation is within the free cancellation period
 */
export function isWithinFreeCancellation(checkInDate: Date | string, cancellationDate?: Date): boolean {
  const deadline = getCancellationDeadline(checkInDate)
  const cancelDate = cancellationDate || getMarrakechTime()
  
  return cancelDate < deadline
}

/**
 * Get the cancellation policy based on number of nights
 */
export function getCancellationPolicy(nights: number): CancellationPolicy {
  if (nights <= 2) {
    return {
      nightsRetained: nights,
      percentageRetained: 100,
      description: `Non-refundable: ${nights} night${nights > 1 ? 's' : ''} retained (100%)`
    }
  } else if (nights >= 3 && nights <= 7) {
    return {
      nightsRetained: 2,
      percentageRetained: Math.round((2 / nights) * 100),
      description: '2 nights retained for cancellations more than 15 days before check-in'
    }
  } else if (nights >= 8 && nights <= 14) {
    return {
      nightsRetained: 3,
      percentageRetained: Math.round((3 / nights) * 100),
      description: '3 nights retained for cancellations more than 15 days before check-in'
    }
  } else if (nights >= 15 && nights <= 21) {
    return {
      nightsRetained: 4,
      percentageRetained: Math.round((4 / nights) * 100),
      description: '4 nights retained for cancellations more than 15 days before check-in'
    }
  } else if (nights >= 22 && nights <= 29) {
    return {
      nightsRetained: 5,
      percentageRetained: Math.round((5 / nights) * 100),
      description: '5 nights retained for cancellations more than 15 days before check-in'
    }
  } else {
    // 30+ nights
    return {
      nightsRetained: 7,
      percentageRetained: Math.round((7 / nights) * 100),
      description: '7 nights retained for cancellations more than 15 days before check-in'
    }
  }
}

/**
 * Calculate refund amount for a booking cancellation
 */
export function calculateRefund(
  booking: {
    checkIn: string
    nights: number
    pricing: {
      nightlyRate: number
      subtotal: number
      cleaningFee: number
      extras: number
      total: number
    }
  },
  cancellationDate?: Date
): RefundCalculation {
  const cancelDate = cancellationDate || getMarrakechTime()
  const deadline = getCancellationDeadline(booking.checkIn)
  const daysUntilCheckIn = getDaysUntilCheckIn(booking.checkIn, cancelDate)
  const isWithinFree = isWithinFreeCancellation(booking.checkIn, cancelDate)
  
  const policy = getCancellationPolicy(booking.nights)
  
  // If cancelled less than 15 days before check-in: no refund
  if (!isWithinFree) {
    return {
      originalAmount: booking.pricing.total,
      nightsBooked: booking.nights,
      nightlyRate: booking.pricing.nightlyRate,
      nightsRetained: booking.nights,
      amountRetained: booking.pricing.total,
      refundableAmount: 0,
      isWithinFreeCancellation: false,
      daysUntilCheckIn,
      cancellationDeadline: deadline,
      policy: {
        nightsRetained: booking.nights,
        percentageRetained: 100,
        description: 'Cancelled less than 15 days before check-in: 100% retained'
      }
    }
  }
  
  // Calculate retained amount based on nights retained
  const nightsRetained = policy.nightsRetained
  const amountRetained = nightsRetained * booking.pricing.nightlyRate
  
  // Refundable = total accommodation cost - retained nights cost
  // Note: Cleaning fee and extras could be handled differently based on policy
  // For now, cleaning fee is non-refundable, extras are refundable
  const refundableAmount = Math.max(0, booking.pricing.subtotal - amountRetained + booking.pricing.extras)
  
  return {
    originalAmount: booking.pricing.total,
    nightsBooked: booking.nights,
    nightlyRate: booking.pricing.nightlyRate,
    nightsRetained,
    amountRetained: amountRetained + booking.pricing.cleaningFee, // Include cleaning fee in retained
    refundableAmount,
    isWithinFreeCancellation: true,
    daysUntilCheckIn,
    cancellationDeadline: deadline,
    policy
  }
}

/**
 * Format cancellation policy for display
 */
export function formatCancellationPolicy(nights: number): {
  summary: string
  details: string[]
  deadline: string
} {
  const policy = getCancellationPolicy(nights)
  
  const details = [
    `Free cancellation until 15 days before check-in (3:00 PM Marrakech time)`,
    policy.nightsRetained === nights 
      ? `Short stays (1-2 nights) are non-refundable`
      : `If cancelled more than 15 days before: ${policy.nightsRetained} night${policy.nightsRetained > 1 ? 's' : ''} retained`,
    `If cancelled less than 15 days before check-in: no refund (100% retained)`,
  ]
  
  return {
    summary: policy.description,
    details,
    deadline: '15 days before check-in at 3:00 PM (Marrakech time)'
  }
}

/**
 * Format date for display in Marrakech timezone
 */
export function formatMarrakechDate(date: Date | string, includeTime: boolean = false): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  const options: Intl.DateTimeFormatOptions = {
    timeZone: MARRAKECH_TIMEZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  
  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }
  
  return d.toLocaleDateString('en-US', options)
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Validate if a booking can be cancelled
 */
export function canCancelBooking(booking: { status: BookingStatus; checkIn: string }): {
  canCancel: boolean
  reason?: string
} {
  // Already cancelled or refunded
  if (booking.status === 'cancelled' || booking.status === 'refunded') {
    return { canCancel: false, reason: 'Booking is already cancelled' }
  }
  
  // Check if check-in has passed
  const checkInDate = new Date(booking.checkIn)
  const now = getMarrakechTime()
  
  if (now > checkInDate) {
    return { canCancel: false, reason: 'Cannot cancel after check-in date' }
  }
  
  return { canCancel: true }
}

/**
 * Generate cancellation summary for admin
 */
export function generateCancellationSummary(
  refundCalc: RefundCalculation
): {
  title: string
  lines: { label: string; value: string; highlight?: boolean }[]
} {
  const lines: { label: string; value: string; highlight?: boolean }[] = []
  
  lines.push({ label: 'Original booking amount', value: formatCurrency(refundCalc.originalAmount) })
  lines.push({ label: 'Nights booked', value: `${refundCalc.nightsBooked} night${refundCalc.nightsBooked > 1 ? 's' : ''}` })
  lines.push({ label: 'Nightly rate', value: formatCurrency(refundCalc.nightlyRate) })
  lines.push({ label: 'Days until check-in', value: `${refundCalc.daysUntilCheckIn} day${refundCalc.daysUntilCheckIn !== 1 ? 's' : ''}` })
  lines.push({ label: 'Within free cancellation', value: refundCalc.isWithinFreeCancellation ? 'Yes' : 'No' })
  lines.push({ label: 'Nights retained', value: `${refundCalc.nightsRetained} night${refundCalc.nightsRetained > 1 ? 's' : ''}` })
  lines.push({ label: 'Amount retained', value: formatCurrency(refundCalc.amountRetained) })
  lines.push({ label: 'Refundable amount', value: formatCurrency(refundCalc.refundableAmount), highlight: true })
  
  return {
    title: refundCalc.isWithinFreeCancellation 
      ? 'Partial Refund Available' 
      : 'No Refund (Late Cancellation)',
    lines
  }
}

/**
 * Get booking status badge variant
 */
export function getStatusBadgeVariant(status: BookingStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'confirmed':
    case 'paid':
      return 'default'
    case 'pending':
      return 'secondary'
    case 'cancelled':
      return 'destructive'
    case 'refunded':
    case 'partially_refunded':
      return 'outline'
    default:
      return 'secondary'
  }
}

/**
 * Get refund status badge variant
 */
export function getRefundStatusBadgeVariant(status: RefundStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'completed':
      return 'default'
    case 'pending':
      return 'secondary'
    case 'refused':
      return 'destructive'
    case 'not_applicable':
      return 'outline'
    default:
      return 'secondary'
  }
}
