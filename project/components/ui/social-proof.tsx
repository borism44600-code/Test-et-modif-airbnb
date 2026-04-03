'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface Testimonial {
  name: string
  location: string
  rating: number
  text: string
  property: string
}

interface TestimonialCardProps {
  testimonial: Testimonial
  className?: string
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  return (
    <div className={cn(
      'bg-card border border-border rounded-lg p-6 h-full flex flex-col',
      className
    )}>
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-gold text-gold" />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="flex-1 text-muted-foreground leading-relaxed mb-6">
        <Quote className="w-8 h-8 text-primary/20 mb-2" />
        {testimonial.text}
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-secondary">
          <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-muted-foreground">
            {testimonial.name.charAt(0)}
          </div>
        </div>
        <div>
          <p className="font-medium text-sm">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.location}</p>
        </div>
      </div>
    </div>
  )
}

interface TestimonialsSectionProps {
  className?: string
  limit?: number
}

export function TestimonialsSection({ className, limit = 3 }: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [stats, setStats] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    async function fetchReviews() {
      try {
        const supabase = createClient()

        // Fetch reviews from Supabase
        const { data: reviews } = await supabase
          .from('reviews')
          .select('guest_name, guest_location, rating, text, properties(name)')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(limit)

        if (reviews && reviews.length > 0) {
          setTestimonials(reviews.map((r: any) => ({
            name: r.guest_name,
            location: r.guest_location || '',
            rating: r.rating || 5,
            text: r.text,
            property: r.properties?.name || '',
          })))
        }

        // Fetch real counts for stats
        const { count: propertyCount } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published')

        setStats([
          { value: propertyCount ? `${propertyCount}` : '0', label: 'Properties Available' },
          { value: '24/7', label: 'Concierge Available' },
        ])
      } catch (err) {
        console.error('Error fetching reviews:', err)
        setStats([
          { value: '0', label: 'Properties Available' },
          { value: '24/7', label: 'Concierge Available' },
        ])
      }
    }
    fetchReviews()
  }, [limit])

  // Don't render the section at all if there are no testimonials
  if (testimonials.length === 0 && stats.length === 0) return null

  return (
    <section className={cn('py-24 md:py-32 bg-background', className)}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="luxury-subheading text-muted-foreground mb-4">Guest Stories</p>
          <h2 className="text-3xl md:text-5xl font-semibold luxury-heading mb-6">
            What Our Guests Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The warmth of their experience speaks for itself.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name + index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 mb-16 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mb-4" />
            <p className="font-medium text-foreground">No guest reviews yet</p>
            <p className="text-sm mt-1">Reviews will appear here once guests share their experience.</p>
          </div>
        )}

        {/* Stats */}
        {stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-8 p-8 bg-secondary/50 rounded-xl max-w-md mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-semibold text-primary luxury-heading">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}

// Mini testimonial for sidebars/cards — only renders if reviews exist
export function MiniTestimonial({ className }: { className?: string }) {
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null)

  useEffect(() => {
    async function fetchOne() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('reviews')
          .select('guest_name, rating, text')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (data) {
          setTestimonial({
            name: data.guest_name,
            location: '',
            rating: data.rating || 5,
            text: data.text,
            property: '',
          })
        }
      } catch {
        // No reviews available — component stays hidden
      }
    }
    fetchOne()
  }, [])

  if (!testimonial) return null

  return (
    <div className={cn('flex items-start gap-3 p-4 bg-secondary/50 rounded-lg', className)}>
      <Quote className="w-6 h-6 text-primary/30 flex-shrink-0" />
      <div>
        <p className="text-sm text-muted-foreground italic line-clamp-2">
          &quot;{testimonial.text.slice(0, 80)}...&quot;
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-gold text-gold" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">- {testimonial.name}</span>
        </div>
      </div>
    </div>
  )
}
