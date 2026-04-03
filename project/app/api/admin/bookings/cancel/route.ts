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

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )
}

async function getBookingById(bookingId: string): Promise<BookingData | null> {
  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    checkIn: data.check_in,
    nights: data.nights || 1,
    status: data.status as BookingStatus,
    pricing: {
      nightlyRate: data.nightly_rate || 0,
      subtotal: data.subtotal || 0,
      cleaningFee: data.cleaning_fee || 0,
      extras: data.extras_total || 0,
      total: data.total || 0,
    },
    payment: {
      method: data.payment_method || 'card',
      status: data.payment_status || 'pending',
      captureId: data.payment_capture_id,
    },
  }
}

async function updateBookingStatus(
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
): Promise<boolean> {
  const supabase = await getSupabase()
  const { error } = await supabase
    .from('bookings')
    .update({
      status,
      cancelled_at: cancellationData.cancelledAt,
      cancellation_reason: cancellationData.reason,
      refund_status: cancellationData.refundStatus,
      refund_amount: cancellationData.refundAmount,
      refund_transaction_id: cancellationData.refundTransactionId,
      processed_by: cancellationData.processedBy,
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)

  if (error) {
    console.error('Error updating booking:', error)
    return false
  }
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

    // Fetch booking from database
    const booking = await getBookingById(bookingId)
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

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

    // Update booking status in database
    const cancellationData = {
      cancelledAt: new Date().toISOString(),
      reason,
      refundStatus,
      refundAmount: finalRefundAmount,
      refundTransactionId,
      processedBy: processedBy || 'admin'
    }

    await updateBookingStatus(bookingId, 'cancelled', cancellationData)

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
