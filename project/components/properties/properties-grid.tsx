'use client'

import { motion } from 'framer-motion'
import { PropertyCard } from './property-card'
import { Property } from '@/lib/types'
import { PropertyAvailabilityResult } from '@/lib/availability'
import { DisplayMode } from './display-mode-toggle'
import { cn } from '@/lib/utils'

interface PropertiesGridProps {
  properties: Property[]
  displayMode: DisplayMode
  checkIn?: Date | null
  checkOut?: Date | null
  partialAvailability?: PropertyAvailabilityResult[]
}

export function PropertiesGrid({ 
  properties, 
  displayMode,
  checkIn,
  checkOut,
  partialAvailability
}: PropertiesGridProps) {
  const gridClass = {
    large: 'grid-cols-1',
    medium: 'grid-cols-1 md:grid-cols-2',
    small: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }

  const cardVariant = {
    large: 'large' as const,
    medium: 'medium' as const,
    small: 'small' as const,
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">No properties match your filters.</p>
        <p className="text-muted-foreground mt-2">Try adjusting your search criteria.</p>
      </div>
    )
  }

  const getPartialInfo = (propertyId: string) => {
    if (!partialAvailability) return undefined
    return partialAvailability.find(p => p.property.id === propertyId)
  }

  return (
    <div className={cn('grid gap-6', gridClass[displayMode])}>
      {properties.map((property, index) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <PropertyCard 
            property={property} 
            variant={cardVariant[displayMode]}
            checkIn={checkIn}
            checkOut={checkOut}
            partialAvailability={getPartialInfo(property.id)}
          />
        </motion.div>
      ))}
    </div>
  )
}
