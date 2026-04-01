import { NextRequest, NextResponse } from 'next/server'
import { validateReviewToken } from '@/lib/services/reviews'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ valid: false, error: 'No token provided' }, { status: 400 })
  }

  const result = await validateReviewToken(token)
  return NextResponse.json(result)
}
