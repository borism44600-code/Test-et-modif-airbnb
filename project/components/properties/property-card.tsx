'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Bed, Bath, Users, MapPin, ArrowRight, Calendar, Check, Clock, Sofa } from 'lucide-react'
import { motion } from 'framer-motion'
import { Property } from '@/lib/types'
import { PropertyAvailabilityResult, calculateNights } from '@/lib/availability'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface PropertyCardProps {
  property: Property
  variant?: 'large' | 'medium' | 'small'
  checkIn?: Date | null
  checkOut?: Date | null
  partialAvailability?: PropertyAvailabilityResult
}

export function PropertyCard({ 
  property, 
  variant = 'medium',
  checkIn,
  checkOut,
  partialAvailability
}: PropertyCardProps) {
  const isLarge = variant === 'large'
  const isSmall = variant === 'small'

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0
  const totalPrice = nights > 0 ? property.pricePerNight * nights : 0

  // Build booking URL with dates if provided
  const bookingUrl = checkIn && checkOut 
    ? `/booking?property=${property.id}&checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}`
    : `/properties/${property.id}`

  return (
    <article
      className={cn(
        'bg-card rounded-lg overflow-hidden transition-all duration-500 hover:shadow-xl group',
        isLarge && 'flex flex-col lg:flex-row',
        isSmall && 'flex flex-row'
      )}
    >
      {/* Image Container */}
      <Link 
        href={`/properties/${property.id}`}
        className={cn(
          'relative overflow-hidden block',
          isLarge && 'lg:w-1/2 aspect-[4/3] lg:aspect-auto',
          !isLarge && !isSmall && 'aspect-[4/3]',
          isSmall && 'w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0'
        )}
      >
        <Image
          src={property.images[0] || '/images/placeholder-property.jpg'}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes={isLarge ? '(max-width: 1024px) 100vw, 50vw' : isSmall ? '160px' : '(max-width: 768px) 100vw, 33vw'}
        />
        {/* Property Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-background/90 backdrop-blur-sm text-xs uppercase tracking-wider rounded-full">
            {property.type}
          </span>
        </div>
        
        {/* Availability Badge */}
        {partialAvailability && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-gold text-black text-xs uppercase tracking-wider rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {partialAvailability.availableNights} of {partialAvailability.totalRequestedNights} nights
            </span>
          </div>
        )}
        
        {!partialAvailability && property.featured && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-gold text-foreground text-xs uppercase tracking-wider rounded-full">
              Featured
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div
        className={cn(
          'p-5 flex flex-col',
          isLarge && 'lg:w-1/2 lg:p-8 lg:justify-center',
          isSmall && 'p-3 sm:p-4 flex-1 justify-center'
        )}
      >
        {/* Location */}
        <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span className={cn('text-xs uppercase tracking-wider', isSmall && 'text-[10px]')}>
            {property.location.subDistrict || property.location.district}
          </span>
        </div>

        {/* Title */}
        <Link href={`/properties/${property.id}`}>
          <h3
            className={cn(
              'font-semibold text-foreground hover:text-primary transition-colors',
              isLarge && 'text-2xl lg:text-3xl',
              !isLarge && !isSmall && 'text-lg',
              isSmall && 'text-sm sm:text-base line-clamp-2'
            )}
          >
            {property.title}
          </h3>
        </Link>

        {/* Description (only for large cards) */}
        {isLarge && (
          <p className="mt-4 text-muted-foreground leading-relaxed line-clamp-3">
            {property.shortDescription}
          </p>
        )}

        {/* Features */}
        <div
          className={cn(
            'flex items-center gap-4 text-muted-foreground flex-wrap',
            isLarge && 'mt-6',
            !isLarge && !isSmall && 'mt-3',
            isSmall && 'mt-2 gap-2'
          )}
        >
          <div className="flex items-center gap-1.5" title={`${property.numberOfBedrooms} bedrooms`}>
            <Bed className={cn('w-4 h-4', isSmall && 'w-3 h-3')} />
            <span className={cn('text-sm', isSmall && 'text-xs')}>{property.numberOfBedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5" title={`${property.bathrooms} bathrooms`}>
            <Bath className={cn('w-4 h-4', isSmall && 'w-3 h-3')} />
            <span className={cn('text-sm', isSmall && 'text-xs')}>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5" title={`${property.bedroomGuestCapacity} guests in bedrooms`}>
            <Users className={cn('w-4 h-4', isSmall && 'w-3 h-3')} />
            <span className={cn('text-sm', isSmall && 'text-xs')}>{property.bedroomGuestCapacity}</span>
          </div>
          {property.additionalGuestCapacity > 0 && !isSmall && (
            <div className="flex items-center gap-1.5" title={`+${property.additionalGuestCapacity} additional guests`}>
              <Sofa className="w-4 h-4" />
              <span className="text-sm">+{property.additionalGuestCapacity}</span>
            </div>
          )}
        </div>

        {/* Price & CTA */}
        <div
          className={cn(
            'flex items-center justify-between mt-auto',
            isLarge && 'mt-8 pt-6 border-t border-border',
            !isLarge && !isSmall && 'mt-4 pt-4 border-t border-border',
            isSmall && 'mt-2'
          )}
        >
          <div>
            {nights > 0 ? (
              <>
                <span className={cn('text-2xl font-semibold text-foreground', isSmall && 'text-lg')}>
                  {totalPrice}€
                </span>
                <span className={cn('text-sm text-muted-foreground ml-1', isSmall && 'text-xs')}>
                  total ({nights} nights)
                </span>
              </>
            ) : (
              <>
                <span className={cn('text-2xl font-semibold text-foreground', isSmall && 'text-lg')}>
                  {property.pricePerNight}€
                </span>
                <span className={cn('text-sm text-muted-foreground ml-1', isSmall && 'text-xs')}>
                  / night
                </span>
              </>
            )}
          </div>
          
          {!isSmall && (
            <div className="flex items-center gap-2">
              <Link href={`/properties/${property.id}`}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <span>View</span>
                </Button>
              </Link>
              {nights > 0 && (
                <Link href={bookingUrl}>
                  <Button size="sm" className="gap-2 bg-gold hover:bg-gold/90 text-black">
                    <Calendar className="w-4 h-4" />
                    <span>Book</span>
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Partial Availability Message */}
        {partialAvailability && !isSmall && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-gold/10 border border-gold/20 rounded-lg"
          >
            <p className="text-sm text-gold flex items-center gap-2">
              <Check className="w-4 h-4" />
              Split-stay available with a similar property
            </p>
          </motion.div>
        )}
      </div>
    </article>
  )
}
