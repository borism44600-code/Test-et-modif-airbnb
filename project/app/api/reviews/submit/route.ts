import { NextRequest, NextResponse } from 'next/server'
import { submitReview } from '@/lib/services/reviews'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, ...reviewData } = body

    if (!token) {
      return NextResponse.json({ success: false, error: 'No token provided' }, { status: 400 })
    }

    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      return NextResponse.json({ success: false, error: 'Invalid rating' }, { status: 400 })
    }

    if (!reviewData.comment || reviewData.comment.trim().length < 20) {
      return NextResponse.json({ success: false, error: 'Review must be at least 20 characters' }, { status: 400 })
    }

    const result = await submitReview(token, reviewData)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error submitting review:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
