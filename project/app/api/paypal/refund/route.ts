import { NextRequest, NextResponse } from 'next/server'
import { refundPayPalPayment, isPayPalConfigured } from '@/lib/paypal'

export async function POST(request: NextRequest) {
  try {
    // Check if PayPal is configured
    if (!isPayPalConfigured()) {
      return NextResponse.json(
        { error: 'PayPal is not configured. Please set up PayPal credentials.' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { captureId, amount, currency, reason, bookingId } = body

    // Validate required fields
    if (!captureId) {
      return NextResponse.json(
        { error: 'Capture ID is required' },
        { status: 400 }
      )
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid refund amount is required' },
        { status: 400 }
      )
    }

    if (!currency) {
      return NextResponse.json(
        { error: 'Currency is required' },
        { status: 400 }
      )
    }

    // Process the refund
    const refundResult = await refundPayPalPayment({
      captureId,
      amount,
      currency,
      reason,
      bookingId
    })

    return NextResponse.json({
      success: true,
      refund: {
        id: refundResult.id,
        status: refundResult.status,
        amount: refundResult.amount,
      }
    })
  } catch (error) {
    console.error('PayPal refund error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process refund',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
