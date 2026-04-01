'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Trash2, 
  Eye, 
  EyeOff,
  Search,
  Filter,
  Loader2,
  Send,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Review {
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
    id: string
    response_text: string
    created_at: string
  } | null
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'w-4 h-4',
            star <= rating ? 'fill-gold text-gold' : 'fill-muted text-muted'
          )}
        />
      ))}
    </div>
  )
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'unpublished'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [responseText, setResponseText] = useState('')
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [filter])

  async function fetchReviews() {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') {
        params.set('published', filter === 'published' ? 'true' : 'false')
      }
      
      const response = await fetch(`/api/admin/reviews?${params}`)
      const data = await response.json()
      setReviews(data.reviews || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function togglePublished(review: Review) {
    try {
      const response = await fetch(`/api/admin/reviews/${review.id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !review.is_published })
      })

      if (response.ok) {
        setReviews(prev => prev.map(r => 
          r.id === review.id ? { ...r, is_published: !r.is_published } : r
        ))
      }
    } catch (error) {
      console.error('Error toggling review:', error)
    }
  }

  async function submitResponse() {
    if (!selectedReview || !responseText.trim()) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/reviews/${selectedReview.id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response_text: responseText })
      })

      if (response.ok) {
        setReviews(prev => prev.map(r => 
          r.id === selectedReview.id 
            ? { ...r, response: { id: 'new', response_text: responseText, created_at: new Date().toISOString() } } 
            : r
        ))
        setIsResponseDialogOpen(false)
        setResponseText('')
      }
    } catch (error) {
      console.error('Error submitting response:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function deleteReview() {
    if (!selectedReview) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/reviews/${selectedReview.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setReviews(prev => prev.filter(r => r.id !== selectedReview.id))
        setIsDeleteDialogOpen(false)
      }
    } catch (error) {
      console.error('Error deleting review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredReviews = reviews.filter(review => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        review.guest_name.toLowerCase().includes(query) ||
        review.comment.toLowerCase().includes(query) ||
        (review.title?.toLowerCase().includes(query) ?? false)
      )
    }
    return true
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Reviews Management</h1>
          <p className="text-muted-foreground">
            Manage guest reviews, respond to feedback, and moderate content.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-4 border">
            <p className="text-sm text-muted-foreground">Total Reviews</p>
            <p className="text-2xl font-semibold">{reviews.length}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border">
            <p className="text-sm text-muted-foreground">Published</p>
            <p className="text-2xl font-semibold text-green-600">
              {reviews.filter(r => r.is_published).length}
            </p>
          </div>
          <div className="bg-card rounded-xl p-4 border">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-semibold text-amber-600">
              {reviews.filter(r => !r.is_published).length}
            </p>
          </div>
          <div className="bg-card rounded-xl p-4 border">
            <p className="text-sm text-muted-foreground">Avg. Rating</p>
            <p className="text-2xl font-semibold">
              {reviews.length > 0 
                ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                : '0.0'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filter} onValueChange={(val: 'all' | 'published' | 'unpublished') => setFilter(val)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="unpublished">Unpublished</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-xl">
            <Star className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No reviews found</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredReviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-card rounded-xl border p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                        <span className="font-semibold text-gold text-lg">
                          {review.guest_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{review.guest_name}</span>
                          {review.guest_country && (
                            <span className="text-sm text-muted-foreground">
                              from {review.guest_country}
                            </span>
                          )}
                          {review.is_verified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <Badge variant={review.is_published ? 'default' : 'secondary'}>
                            {review.is_published ? 'Published' : 'Hidden'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <StarRating rating={review.rating} />
                          <span className="text-sm text-muted-foreground">
                            {formatDate(review.stay_date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePublished(review)}
                      >
                        {review.is_published ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-1" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-1" />
                            Publish
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedReview(review)
                          setResponseText(review.response?.response_text || '')
                          setIsResponseDialogOpen(true)
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {review.response ? 'Edit Response' : 'Respond'}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setSelectedReview(review)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Review
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {review.title && (
                    <h4 className="font-semibold mb-2">{review.title}</h4>
                  )}
                  
                  <p className="text-muted-foreground mb-4">{review.comment}</p>

                  {/* Category Ratings */}
                  <div className="flex flex-wrap gap-4 text-sm mb-4">
                    {review.cleanliness_rating && (
                      <span>Cleanliness: <strong>{review.cleanliness_rating}/5</strong></span>
                    )}
                    {review.location_rating && (
                      <span>Location: <strong>{review.location_rating}/5</strong></span>
                    )}
                    {review.communication_rating && (
                      <span>Communication: <strong>{review.communication_rating}/5</strong></span>
                    )}
                    {review.value_rating && (
                      <span>Value: <strong>{review.value_rating}/5</strong></span>
                    )}
                  </div>

                  {/* Response */}
                  {review.response && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg border-l-4 border-gold">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-gold" />
                        <span className="font-semibold text-sm">Your Response</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(review.response.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.response.response_text}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedReview?.response ? 'Edit Response' : 'Respond to Review'}
            </DialogTitle>
            <DialogDescription>
              Your response will be visible to all visitors on the property page.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Thank you for your review..."
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitResponse} disabled={isSubmitting || !responseText.trim()}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {selectedReview?.response ? 'Update Response' : 'Post Response'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review from {selectedReview?.guest_name}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteReview} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
