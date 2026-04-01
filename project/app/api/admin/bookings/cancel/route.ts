import { NextRequest, NextResponse } from 'next/server'
import { 
  calculateRefund, 
  canCancelBooking,
  BookingStatus
} from '@/lib/booking-rules'
import { refundPayPalPayment, isPayPalConfigured } from '@/lib/paypal'

interface CancelBookingRequest {
  bookingId: string
  reason?: string
  refundOverride?: boolean
  overrideAmount?: number
  overrideReason?: string
  processedBy?: string
}

interface BookingData {
  id: string
  checkIn: string
  nights: number
  status: BookingStatus
  pricing: {
    nightlyRate: number
    subtotal: number
    cleaningFee: number
    extras: number
    total: number
  }
  payment: {
    method: 'card' | 'paypal' | 'bank_transfer'
    status: 'pending' | 'paid' | 'refunded' | 'partial_refund'
    captureId?: string
  }
}

// In production, this would fetch from database
function getBookingById(bookingId: string): BookingData | null {
  // Mock implementation - in production, fetch from database
  return null
}

// In production, this would update the database
function updateBookingStatus(
  bookingId: string, 
  status: BookingStatus,
  cancellationData: {
    cancelledAt: string
    reason?: string
    refundStatus: 'not_applicable' | 'pending' | 'completed' | 'refused'
    refundAmount?: number
    refundTransactionId?: string
    processedBy?: string
  }
): boolean {
  // Mock implementation - in production, update database
  console.log('Updating booking:', bookingId, status, cancellationData)
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body: CancelBookingRequest = await request.json()
    const { 
      bookingId, 
      reason, 
      refundOverride, 
      overrideAmount, 
      overrideReason,
      processedBy 
    } = body

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // In production, fetch booking from database
    // For now, we'll use mock data passed in the request
    const bookingData = request.headers.get('X-Booking-Data')
    if (!bookingData) {
      return NextResponse.json(
        { error: 'Booking data is required (in production, this would be fetched from database)' },
        { status: 400 }
      )
    }

    const booking: BookingData = JSON.parse(bookingData)

    // Check if booking can be cancelled
    const cancelCheck = canCancelBooking({
      status: booking.status,
      checkIn: booking.checkIn
    })

    if (!cancelCheck.canCancel) {
      return NextResponse.json(
        { error: cancelCheck.reason },
        { status: 400 }
      )
    }

    // Calculate refund
    const refundCalc = calculateRefund(booking)

    // Determine final refund amount
    let finalRefundAmount = refundOverride && overrideAmount !== undefined
      ? overrideAmount
      : refundCalc.refundableAmount

    // Process refund if payment was made via PayPal
    let refundTransactionId: string | undefined
    let refundStatus: 'not_applicable' | 'pending' | 'completed' | 'refused' = 'not_applicable'

    if (booking.payment.status === 'paid' && finalRefundAmount > 0) {
      if (booking.payment.method === 'paypal' && booking.payment.captureId) {
        if (!isPayPalConfigured()) {
          return NextResponse.json(
            { error: 'PayPal is not configured. Cannot process refund.' },
            { status: 503 }
          )
        }

        try {
          const refundResult = await refundPayPalPayment({
            captureId: booking.payment.captureId,
            amount: finalRefundAmount,
            currency: 'EUR',
            reason: reason || 'Booking cancellation',
            bookingId: bookingId
          })

          refundTransactionId = refundResult.id
          refundStatus = refundResult.status === 'COMPLETED' ? 'completed' : 'pending'
        } catch (error) {
          console.error('PayPal refund failed:', error)
          // Mark as pending so admin can process manually
          refundStatus = 'pending'
        }
      } else {
        // For other payment methods, mark as pending for manual processing
        refundStatus = 'pending'
      }
    }

    // Update booking status (in production, this would update the database)
    const cancellationData = {
      cancelledAt: new Date().toISOString(),
      reason,
      refundStatus,
      refundAmount: finalRefundAmount,
      refundTransactionId,
      processedBy: processedBy || 'admin'
    }

    updateBookingStatus(bookingId, 'cancelled', cancellationData)

    return NextResponse.json({
      success: true,
      bookingId,
      cancellation: {
        ...cancellationData,
        refundCalculation: {
          original: refundCalc.originalAmount,
          retained: refundCalc.amountRetained,
          refundable: refundCalc.refundableAmount,
          final: finalRefundAmount,
          wasOverridden: refundOverride || false,
          overrideReason: refundOverride ? overrideReason : undefined
        }
      }
    })
  } catch (error) {
    console.error('Booking cancellation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process cancellation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET - Calculate refund preview for a booking
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const checkIn = searchParams.get('checkIn')
    const nights = searchParams.get('nights')
    const nightlyRate = searchParams.get('nightlyRate')
    const subtotal = searchParams.get('subtotal')
    const cleaningFee = searchParams.get('cleaningFee')
    const extras = searchParams.get('extras')
    const total = searchParams.get('total')

    if (!checkIn || !nights || !nightlyRate || !total) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const booking = {
      checkIn,
      nights: parseInt(nights),
      pricing: {
        nightlyRate: parseFloat(nightlyRate),
        subtotal: parseFloat(subtotal || '0'),
        cleaningFee: parseFloat(cleaningFee || '0'),
        extras: parseFloat(extras || '0'),
        total: parseFloat(total)
      }
    }

    const refundCalc = calculateRefund(booking)

    return NextResponse.json({
      refundCalculation: refundCalc
    })
  } catch (error) {
    console.error('Refund calculation error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate refund' },
      { status: 500 }
    )
  }
}
