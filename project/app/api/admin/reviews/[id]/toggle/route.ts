import { NextRequest, NextResponse } from 'next/server'
import { toggleReviewPublished } from '@/lib/services/reviews'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const result = await toggleReviewPublished(id, body.is_published)
  return NextResponse.json(result)
}
