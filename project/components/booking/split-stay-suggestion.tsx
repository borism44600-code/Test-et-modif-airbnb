'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRight, Calendar, MapPin, Bed, Bath, Users, 
  Sparkles, Check, ChevronRight, Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Property } from '@/lib/types'
import { 
  SplitStaySuggestion, 
  formatDateShort, 
  formatDateRange,
  calculateNights 
} from '@/lib/availability'
import { cn } from '@/lib/utils'

interface SplitStaySuggestionCardProps {
  suggestion: SplitStaySuggestion
  properties: Property[]
  onAccept: () => void
  onDecline: () => void
  className?: string
}

export function SplitStaySuggestionCard({
  suggestion,
  properties,
  onAccept,
  onDecline,
  className
}: SplitStaySuggestionCardProps) {
  // Calculate total price
  const totalPrice = suggestion.segments.reduce((sum, segment) => {
    const property = properties.find(p => p.id === segment.propertyId)
    return sum + (property ? property.pricePerNight * segment.nights : 0)
  }, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-gradient-to-br from-gold/5 via-background to-gold/5 border border-gold/30 rounded-2xl overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="bg-gold/10 px-6 py-4 border-b border-gold/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Premium Split-Stay Suggestion</h3>
            <p className="text-sm text-muted-foreground">
              A curated solution for your complete stay
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Message */}
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {suggestion.message}
        </p>

        {/* Segments */}
        <div className="space-y-4 mb-6">
          {suggestion.segments.map((segment, index) => {
            const property = properties.find(p => p.id === segment.propertyId)
            if (!property) return null

            const isFirst = index === 0
            const isLast = index === suggestion.segments.length - 1

            return (
              <motion.div
                key={`${segment.propertyId}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connector line */}
                {!isLast && (
                  <div className="absolute left-6 top-full h-4 w-px bg-gold/30" />
                )}

                <div className={cn(
                  'bg-card rounded-xl border border-border overflow-hidden',
                  isFirst && 'ring-2 ring-gold/30'
                )}>
                  <div className="flex items-stretch">
                    {/* Property Image */}
                    <div className="relative w-32 h-auto min-h-[100px] flex-shrink-0">
                      <Image
                        src={property.images[0] || '/images/placeholder-property.jpg'}
                        alt={property.title}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                      {isFirst && (
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-0.5 bg-gold text-black text-[10px] uppercase tracking-wider rounded-full">
                            Your Choice
                          </span>
                        </div>
                      )}
                      {!isFirst && (
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-0.5 bg-background/90 text-[10px] uppercase tracking-wider rounded-full">
                            Alternative
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Property Details */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-xs uppercase tracking-wider text-gold mb-1">
                            {property.type}
                          </p>
                          <h4 className="font-semibold">{property.title}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {property.location.district}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{property.pricePerNight}€</p>
                          <p className="text-xs text-muted-foreground">per night</p>
                        </div>
                      </div>

                      {/* Date Range */}
                      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gold" />
                          <span>{formatDateRange(segment.start, segment.end)}</span>
                        </div>
                        <span className="text-sm font-medium">
                          {segment.nights} {segment.nights === 1 ? 'night' : 'nights'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="bg-secondary/50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground">Total Stay</span>
            <span className="font-medium">{suggestion.totalNights} nights</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Estimated Total</span>
            <span className="text-2xl font-semibold">{totalPrice}€</span>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-2 mb-6">
          {[
            'Seamless transition between properties',
            'Same quality and service standard',
            'One dedicated concierge for your entire stay',
            'Complimentary luggage transfer'
          ].map((benefit, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-gold flex-shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onAccept}
            className="flex-1 bg-gold hover:bg-gold/90 text-black gap-2"
          >
            Accept Split-Stay
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={onDecline}
            className="flex-1"
          >
            View Other Options
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

// Compact version for inline display
interface SplitStayBannerProps {
  availableNights: number
  totalNights: number
  onViewSuggestion: () => void
  className?: string
}

export function SplitStayBanner({
  availableNights,
  totalNights,
  onViewSuggestion,
  className
}: SplitStayBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-gold/10 border border-gold/20 rounded-xl p-4',
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-gold" />
          </div>
          <div>
            <p className="font-medium text-sm">
              Available for {availableNights} of {totalNights} nights
            </p>
            <p className="text-xs text-muted-foreground">
              We can arrange a premium split-stay for your complete visit
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewSuggestion}
          className="text-gold hover:text-gold hover:bg-gold/10 gap-1"
        >
          View
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}
