import { NextRequest, NextResponse } from 'next/server'
import { getAllReviews } from '@/lib/services/reviews'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const propertyId = searchParams.get('propertyId') || undefined
  const published = searchParams.get('published')
  
  const isPublished = published === 'true' ? true : published === 'false' ? false : undefined

  const result = await getAllReviews({
    propertyId,
    isPublished,
    limit: 50
  })

  return NextResponse.json(result)
}
