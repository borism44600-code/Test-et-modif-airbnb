'use server'

import { createClient } from '@/lib/supabase/server'

export interface VerifiedReview {
  id: string
  booking_id: string
  property_id: string
  guest_name: string
  guest_country: string | null
  rating: number
  cleanliness_rating: number | null
  location_rating: number | null
  communication_rating: number | null
  value_rating: number | null
  title: string | null
  comment: string
  stay_date: string
  is_verified: boolean
  is_published: boolean
  created_at: string
  response?: {
    response_text: string
    created_at: string
  } | null
}

export interface ReviewStats {
  average_rating: number
  total_reviews: number
  rating_breakdown: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  category_averages: {
    cleanliness: number
    location: number
    communication: number
    value: number
  }
}

// Get reviews for a property
export async function getPropertyReviews(propertyId: string): Promise<VerifiedReview[]> {
  const supabase = await createClient()
  
  const { data: reviews, error } = await supabase
    .from('verified_reviews')
    .select(`
      *,
      review_responses (
        response_text,
        created_at
      )
    `)
    .eq('property_id', propertyId)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  return reviews.map(review => ({
    ...review,
    response: review.review_responses?.[0] || null
  }))
}

// Get review stats for a property
export async function getPropertyReviewStats(propertyId: string): Promise<ReviewStats> {
  const supabase = await createClient()
  
  const { data: reviews, error } = await supabase
    .from('verified_reviews')
    .select('rating, cleanliness_rating, location_rating, communication_rating, value_rating')
    .eq('property_id', propertyId)
    .eq('is_published', true)

  if (error || !reviews || reviews.length === 0) {
    return {
      average_rating: 0,
      total_reviews: 0,
      rating_breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      category_averages: { cleanliness: 0, location: 0, communication: 0, value: 0 }
    }
  }

  const total = reviews.length
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach(r => {
    const rating = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5
    if (rating >= 1 && rating <= 5) {
      breakdown[rating]++
    }
  })

  const categoryAverages = {
    cleanliness: reviews.filter(r => r.cleanliness_rating).reduce((acc, r) => acc + (r.cleanliness_rating || 0), 0) / reviews.filter(r => r.cleanliness_rating).length || 0,
    location: reviews.filter(r => r.location_rating).reduce((acc, r) => acc + (r.location_rating || 0), 0) / reviews.filter(r => r.location_rating).length || 0,
    communication: reviews.filter(r => r.communication_rating).reduce((acc, r) => acc + (r.communication_rating || 0), 0) / reviews.filter(r => r.communication_rating).length || 0,
    value: reviews.filter(r => r.value_rating).reduce((acc, r) => acc + (r.value_rating || 0), 0) / reviews.filter(r => r.value_rating).length || 0,
  }

  return {
    average_rating: sum / total,
    total_reviews: total,
    rating_breakdown: breakdown,
    category_averages: categoryAverages
  }
}

// Validate review token
export async function validateReviewToken(token: string) {
  const supabase = await createClient()
  
  const { data: booking, error } = await supabase
    .from('bookings')
    .select('id, property_id, guest_name, guest_email, check_out, review_submitted')
    .eq('review_token', token)
    .single()

  if (error || !booking) {
    return { valid: false, error: 'Invalid or expired review link' }
  }

  if (booking.review_submitted) {
    return { valid: false, error: 'You have already submitted a review for this stay' }
  }

  const checkOutDate = new Date(booking.check_out)
  const now = new Date()
  
  if (checkOutDate > now) {
    return { valid: false, error: 'You can only submit a review after your stay is complete' }
  }

  // Token expires 60 days after checkout
  const expiryDate = new Date(checkOutDate)
  expiryDate.setDate(expiryDate.getDate() + 60)
  
  if (now > expiryDate) {
    return { valid: false, error: 'This review link has expired' }
  }

  return { 
    valid: true, 
    booking: {
      id: booking.id,
      property_id: booking.property_id,
      guest_name: booking.guest_name,
      guest_email: booking.guest_email,
      stay_date: booking.check_out
    }
  }
}

// Submit a review
export async function submitReview(
  token: string,
  review: {
    rating: number
    cleanliness_rating?: number
    location_rating?: number
    communication_rating?: number
    value_rating?: number
    title?: string
    comment: string
    guest_country?: string
  }
) {
  const validation = await validateReviewToken(token)
  
  if (!validation.valid || !validation.booking) {
    return { success: false, error: validation.error }
  }

  const supabase = await createClient()

  // Create the review
  const { error: reviewError } = await supabase
    .from('verified_reviews')
    .insert({
      booking_id: validation.booking.id,
      property_id: validation.booking.property_id,
      guest_name: validation.booking.guest_name,
      guest_country: review.guest_country,
      rating: review.rating,
      cleanliness_rating: review.cleanliness_rating,
      location_rating: review.location_rating,
      communication_rating: review.communication_rating,
      value_rating: review.value_rating,
      title: review.title,
      comment: review.comment,
      stay_date: validation.booking.stay_date,
      is_verified: true,
      is_published: true // Auto-publish, admin can moderate later
    })

  if (reviewError) {
    console.error('Error submitting review:', reviewError)
    return { success: false, error: 'Failed to submit review' }
  }

  // Mark booking as review submitted
  await supabase
    .from('bookings')
    .update({ review_submitted: true })
    .eq('id', validation.booking.id)

  return { success: true }
}

// Admin: Get all reviews
export async function getAllReviews(options?: {
  propertyId?: string
  isPublished?: boolean
  limit?: number
  offset?: number
}) {
  const supabase = await createClient()
  
  let query = supabase
    .from('verified_reviews')
    .select(`
      *,
      review_responses (
        id,
        response_text,
        created_at
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })

  if (options?.propertyId) {
    query = query.eq('property_id', options.propertyId)
  }
  
  if (options?.isPublished !== undefined) {
    query = query.eq('is_published', options.isPublished)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching all reviews:', error)
    return { reviews: [], total: 0 }
  }

  return { 
    reviews: data.map(review => ({
      ...review,
      response: review.review_responses?.[0] || null
    })),
    total: count || 0
  }
}

// Admin: Toggle review publish status
export async function toggleReviewPublished(reviewId: string, isPublished: boolean) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('verified_reviews')
    .update({ is_published: isPublished })
    .eq('id', reviewId)

  if (error) {
    console.error('Error toggling review status:', error)
    return { success: false }
  }

  return { success: true }
}

// Admin: Add response to review
export async function addReviewResponse(reviewId: string, responseText: string) {
  const supabase = await createClient()
  
  // Check if response already exists
  const { data: existing } = await supabase
    .from('review_responses')
    .select('id')
    .eq('review_id', reviewId)
    .single()

  if (existing) {
    // Update existing response
    const { error } = await supabase
      .from('review_responses')
      .update({ response_text: responseText })
      .eq('review_id', reviewId)

    if (error) {
      console.error('Error updating response:', error)
      return { success: false }
    }
  } else {
    // Insert new response
    const { error } = await supabase
      .from('review_responses')
      .insert({
        review_id: reviewId,
        response_text: responseText
      })

    if (error) {
      console.error('Error adding response:', error)
      return { success: false }
    }
  }

  return { success: true }
}

// Admin: Delete a review
export async function deleteReview(reviewId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('verified_reviews')
    .delete()
    .eq('id', reviewId)

  if (error) {
    console.error('Error deleting review:', error)
    return { success: false }
  }

  return { success: true }
}
