import { NextRequest, NextResponse } from 'next/server'
import { deleteReview } from '@/lib/services/reviews'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const result = await deleteReview(id)
  return NextResponse.json(result)
}
