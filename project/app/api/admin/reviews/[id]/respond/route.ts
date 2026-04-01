import { NextRequest, NextResponse } from 'next/server'
import { addReviewResponse } from '@/lib/services/reviews'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  if (!body.response_text?.trim()) {
    return NextResponse.json({ success: false, error: 'Response text is required' }, { status: 400 })
  }

  const result = await addReviewResponse(id, body.response_text)
  return NextResponse.json(result)
}
