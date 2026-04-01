'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Star, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface BookingInfo {
  id: string
  property_id: string
  guest_name: string
  guest_email: string
  stay_date: string
}

export default function ReviewPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [isValidating, setIsValidating] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [booking, setBooking] = useState<BookingInfo | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Form state
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [cleanlinessRating, setCleanlinessRating] = useState(0)
  const [locationRating, setLocationRating] = useState(0)
  const [communicationRating, setCommunicationRating] = useState(0)
  const [valueRating, setValueRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [country, setCountry] = useState('')

  useEffect(() => {
    async function validateToken() {
      try {
        const response = await fetch(`/api/reviews/validate?token=${token}`)
        const data = await response.json()

        if (data.valid) {
          setIsValid(true)
          setBooking(data.booking)
        } else {
          setError(data.error)
        }
      } catch {
        setError('Unable to validate review link. Please try again.')
      } finally {
        setIsValidating(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      setError('Please select an overall rating')
      return
    }

    if (comment.trim().length < 20) {
      setError('Please write at least 20 characters in your review')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          rating,
          cleanliness_rating: cleanlinessRating || undefined,
          location_rating: locationRating || undefined,
          communication_rating: communicationRating || undefined,
          value_rating: valueRating || undefined,
          title: title.trim() || undefined,
          comment: comment.trim(),
          guest_country: country.trim() || undefined
        })
      })

      const data = await response.json()

      if (data.success) {
        setIsSubmitted(true)
      } else {
        setError(data.error || 'Failed to submit review')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Star rating component
  const StarRatingInput = ({ 
    value, 
    onChange, 
    label,
    size = 'lg'
  }: { 
    value: number
    onChange: (val: number) => void
    label?: string
    size?: 'sm' | 'lg'
  }) => {
    const [hover, setHover] = useState(0)
    const sizeClass = size === 'lg' ? 'w-10 h-10' : 'w-6 h-6'

    return (
      <div>
        {label && <Label className="mb-2 block">{label}</Label>}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  sizeClass,
                  'transition-colors',
                  star <= (hover || value)
                    ? 'fill-gold text-gold'
                    : 'fill-muted text-muted-foreground'
                )}
              />
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Loading state
  if (isValidating) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-gold mb-4" />
            <p className="text-muted-foreground">Validating your review link...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Invalid token state
  if (!isValid) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <AlertCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Invalid Review Link</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => router.push('/')}>Return to Home</Button>
          </motion.div>
        </main>
        <Footer />
      </>
    )
  }

  // Success state
  if (isSubmitted) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-6" />
            <h1 className="text-3xl font-semibold mb-4">Thank You!</h1>
            <p className="text-muted-foreground mb-8">
              Your review has been submitted successfully. We truly appreciate you taking the time 
              to share your experience. Your feedback helps us improve and helps future guests 
              make informed decisions.
            </p>
            <Button onClick={() => router.push('/')}>Return to Home</Button>
          </motion.div>
        </main>
        <Footer />
      </>
    )
  }

  // Review form
  return (
    <>
      <Header />
      <main className="min-h-screen py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-10">
              <p className="luxury-subheading text-gold mb-3">Share Your Experience</p>
              <h1 className="text-3xl md:text-4xl font-semibold luxury-heading mb-4">
                Write a Review
              </h1>
              <p className="text-muted-foreground">
                Hello {booking?.guest_name}, thank you for staying with us! 
                We would love to hear about your experience.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Overall Rating */}
              <div className="text-center p-6 bg-muted/30 rounded-xl">
                <Label className="text-lg mb-4 block">Overall Rating *</Label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          'w-12 h-12 transition-colors',
                          star <= (hoverRating || rating)
                            ? 'fill-gold text-gold'
                            : 'fill-muted text-muted-foreground'
                        )}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {rating === 0 && 'Click to rate'}
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </p>
              </div>

              {/* Category Ratings */}
              <div className="grid sm:grid-cols-2 gap-6">
                <StarRatingInput
                  label="Cleanliness"
                  value={cleanlinessRating}
                  onChange={setCleanlinessRating}
                  size="sm"
                />
                <StarRatingInput
                  label="Location"
                  value={locationRating}
                  onChange={setLocationRating}
                  size="sm"
                />
                <StarRatingInput
                  label="Communication"
                  value={communicationRating}
                  onChange={setCommunicationRating}
                  size="sm"
                />
                <StarRatingInput
                  label="Value for Money"
                  value={valueRating}
                  onChange={setValueRating}
                  size="sm"
                />
              </div>

              {/* Review Title */}
              <div>
                <Label htmlFor="title">Review Title (Optional)</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience in a few words"
                  maxLength={100}
                  className="mt-2"
                />
              </div>

              {/* Review Comment */}
              <div>
                <Label htmlFor="comment">Your Review *</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your stay. What did you enjoy? Any suggestions for improvement?"
                  rows={6}
                  className="mt-2"
                  required
                  minLength={20}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 20 characters ({comment.length}/20)
                </p>
              </div>

              {/* Country */}
              <div>
                <Label htmlFor="country">Where are you from? (Optional)</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g., France, United States, Morocco"
                  className="mt-2"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By submitting this review, you confirm that you stayed at this property 
                and that your review reflects your genuine experience.
              </p>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
