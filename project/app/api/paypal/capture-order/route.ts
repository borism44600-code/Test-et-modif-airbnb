import { NextRequest, NextResponse } from 'next/server'
import { capturePayPalOrder, isPayPalConfigured } from '@/lib/paypal'

export async function POST(request: NextRequest) {
  try {
    // Check if PayPal is configured
    if (!isPayPalConfigured()) {
      return NextResponse.json(
        { 
          error: 'PayPal is not configured',
          message: 'Please configure NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET environment variables.'
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId' },
        { status: 400 }
      )
    }

    // Capture the PayPal order
    const captureResult = await capturePayPalOrder(orderId)

    // Extract relevant information from capture result
    const payerEmail = captureResult.payer?.email_address
    const payerName = captureResult.payer?.name 
      ? `${captureResult.payer.name.given_name || ''} ${captureResult.payer.name.surname || ''}`.trim()
      : null
    
    const capture = captureResult.purchase_units?.[0]?.payments?.captures?.[0]
    const captureId = capture?.id
    const captureStatus = capture?.status
    const amount = capture?.amount

    // Here you would typically:
    // 1. Update your database with the confirmed booking
    // 2. Send confirmation emails
    // 3. Update property availability
    // 4. Create invoice/receipt records

    return NextResponse.json({
      success: true,
      orderId: captureResult.id,
      status: captureResult.status,
      captureId,
      captureStatus,
      amount,
      payer: {
        email: payerEmail,
        name: payerName,
      },
      // Include booking reference from the custom_id if available
      bookingId: captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.id,
    })
  } catch (error) {
    console.error('Error capturing PayPal order:', error)
    return NextResponse.json(
      { 
        error: 'Failed to capture payment',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
