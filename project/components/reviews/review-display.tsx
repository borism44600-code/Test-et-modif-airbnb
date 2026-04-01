'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, CheckCircle, ChevronDown, ChevronUp, MapPin, MessageSquare, ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/provider'

interface Review {
  id: string
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
  created_at: string
  response?: {
    response_text: string
    created_at: string
  } | null
}

interface ReviewStats {
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

interface ReviewDisplayProps {
  reviews: Review[]
  stats: ReviewStats
  propertyName: string
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= rating
              ? 'fill-gold text-gold'
              : star - 0.5 <= rating
              ? 'fill-gold/50 text-gold'
              : 'fill-muted text-muted'
          )}
        />
      ))}
    </div>
  )
}

function RatingBar({ label, value, max = 5 }: { label: string; value: number; max?: number }) {
  const percentage = (value / max) * 100

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground w-28">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gold rounded-full"
        />
      </div>
      <span className="text-sm font-medium w-8">{value.toFixed(1)}</span>
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const shouldTruncate = review.comment.length > 300

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-b border-border pb-6 last:border-0"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
            <span className="font-semibold text-gold">
              {review.guest_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{review.guest_name}</span>
              {review.is_verified && (
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Verified Stay
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {review.guest_country && (
                <>
                  <MapPin className="w-3 h-3" />
                  <span>{review.guest_country}</span>
                  <span>•</span>
                </>
              )}
              <span>{formatDate(review.stay_date)}</span>
            </div>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      {review.title && (
        <h4 className="font-semibold mb-2">{review.title}</h4>
      )}

      <div className="text-muted-foreground">
        <p className={cn(!isExpanded && shouldTruncate && 'line-clamp-3')}>
          {review.comment}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary text-sm mt-2 flex items-center gap-1 hover:underline"
          >
            {isExpanded ? (
              <>
                Show less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Read more <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Sub-ratings */}
      {(review.cleanliness_rating || review.location_rating || review.communication_rating || review.value_rating) && (
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          {review.cleanliness_rating && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Cleanliness:</span>
              <span className="font-medium">{review.cleanliness_rating}/5</span>
            </div>
          )}
          {review.location_rating && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">{review.location_rating}/5</span>
            </div>
          )}
          {review.communication_rating && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Communication:</span>
              <span className="font-medium">{review.communication_rating}/5</span>
            </div>
          )}
          {review.value_rating && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Value:</span>
              <span className="font-medium">{review.value_rating}/5</span>
            </div>
          )}
        </div>
      )}

      {/* Owner Response */}
      {review.response && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 ml-6 p-4 bg-muted/50 rounded-lg border-l-4 border-gold"
        >
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-gold" />
            <span className="font-semibold text-sm">Response from Marrakech Riads Rent</span>
          </div>
          <p className="text-sm text-muted-foreground">{review.response.response_text}</p>
        </motion.div>
      )}
    </motion.div>
  )
}

export function ReviewDisplay({ reviews, stats, propertyName }: ReviewDisplayProps) {
  const [visibleCount, setVisibleCount] = useState(5)
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent')
  const t = useTranslations('common')

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  const visibleReviews = sortedReviews.slice(0, visibleCount)

  if (stats.total_reviews === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-xl">
        <Star className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
        <p className="text-muted-foreground">
          Be the first to share your experience at {propertyName}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Summary */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Overall Rating */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
            <span className="text-5xl font-bold">{stats.average_rating.toFixed(1)}</span>
            <div>
              <StarRating rating={stats.average_rating} size="lg" />
              <p className="text-sm text-muted-foreground mt-1">
                {stats.total_reviews} verified {stats.total_reviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
          
          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.rating_breakdown[rating as keyof typeof stats.rating_breakdown]
              const percentage = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0
              
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-3">{rating}</span>
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gold rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Category Ratings */}
        <div className="space-y-3">
          <h4 className="font-semibold mb-4">Rating Categories</h4>
          <RatingBar label="Cleanliness" value={stats.category_averages.cleanliness} />
          <RatingBar label="Location" value={stats.category_averages.location} />
          <RatingBar label="Communication" value={stats.category_averages.communication} />
          <RatingBar label="Value for money" value={stats.category_averages.value} />
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Guest Reviews</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'highest' | 'lowest')}
            className="text-sm border rounded-lg px-3 py-1.5 bg-background"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <AnimatePresence>
          {visibleReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </AnimatePresence>
      </div>

      {/* Load More */}
      {visibleCount < reviews.length && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setVisibleCount(prev => prev + 5)}
          >
            Show more reviews ({reviews.length - visibleCount} remaining)
          </Button>
        </div>
      )}
    </div>
  )
}

// Compact review summary for property cards
export function ReviewSummary({ rating, count }: { rating: number; count: number }) {
  if (count === 0) return null

  return (
    <div className="flex items-center gap-1.5">
      <Star className="w-4 h-4 fill-gold text-gold" />
      <span className="font-semibold">{rating.toFixed(1)}</span>
      <span className="text-muted-foreground text-sm">({count})</span>
    </div>
  )
}
