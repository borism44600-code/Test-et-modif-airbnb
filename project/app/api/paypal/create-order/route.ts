import { NextRequest, NextResponse } from 'next/server'
import { createPayPalOrder, generateBookingReference, isPayPalConfigured, PayPalOrderData } from '@/lib/paypal'

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

    // Validate required fields
    const { propertyId, propertyTitle, checkIn, checkOut, nights, guests, totalAmount, currency = 'EUR', customerEmail, customerName } = body

    if (!propertyId || !propertyTitle || !checkIn || !checkOut || !nights || !guests || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required booking information' },
        { status: 400 }
      )
    }

    // Generate a unique booking reference
    const bookingId = generateBookingReference()

    // Create order data
    const orderData: PayPalOrderData = {
      bookingId,
      propertyId,
      propertyTitle,
      checkIn,
      checkOut,
      nights,
      guests,
      totalAmount: Number(totalAmount),
      currency,
      customerEmail,
      customerName,
    }

    // Create PayPal order
    const order = await createPayPalOrder(orderData)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      bookingId,
      status: order.status,
    })
  } catch (error) {
    console.error('Error creating PayPal order:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create payment order',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
