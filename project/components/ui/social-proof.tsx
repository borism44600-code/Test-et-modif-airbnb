'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const testimonials = [
  {
    name: 'Sophie L.',
    location: 'Paris, France',
    rating: 5,
    text: 'A beautiful riad with genuine warmth. The team helped us discover hidden corners of the medina we would never have found on our own.',
    property: 'Riad Al Jazira',
    avatar: '/images/testimonials/avatar1.svg'
  },
  {
    name: 'James M.',
    location: 'London, UK',
    rating: 5,
    text: 'We came back for the third time. The attention to detail and the warm welcome make all the difference.',
    property: 'Villa Palmeraie',
    avatar: '/images/testimonials/avatar2.svg'
  },
  {
    name: 'Elena R.',
    location: 'Madrid, Spain',
    rating: 5,
    text: 'What struck us most was the personal touch. From local restaurant tips to arranging a cooking class, nothing was too much trouble.',
    property: 'Dar Yasmine',
    avatar: '/images/testimonials/avatar3.svg'
  }
]

const stats = [
  { value: '500+', label: 'Guests Welcomed' },
  { value: '6+', label: 'Years in Marrakech' },
  { value: '30+', label: 'Properties' },
  { value: '24/7', label: 'Available' }
]

interface TestimonialCardProps {
  testimonial: typeof testimonials[0]
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
  const displayTestimonials = testimonials.slice(0, limit)

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {displayTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-secondary/50 rounded-xl"
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
      </div>
    </section>
  )
}

// Mini testimonial for sidebars/cards
export function MiniTestimonial({ className }: { className?: string }) {
  const testimonial = testimonials[0]
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
