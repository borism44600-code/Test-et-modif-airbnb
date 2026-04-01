'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, SlidersHorizontal, Info } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PropertyFilters, PropertyFiltersState } from '@/components/properties/property-filters'
import { PropertiesGrid } from '@/components/properties/properties-grid'
import { DisplayModeToggle, DisplayMode } from '@/components/properties/display-mode-toggle'
import { DateSearchBar } from '@/components/search/date-search-bar'
import { PropertyFeatures } from '@/lib/types'
import { filterPropertiesByAvailability, PropertyAvailabilityResult } from '@/lib/availability'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/provider'
import { UiProperty } from '@/lib/adapters/property-adapter'

const defaultFilters: PropertyFiltersState = {
  priceRange: [0, 2000],
  districts: [],
  distanceFromCenter: [],
  features: [],
  parking: [],
  availability: { start: null, end: null },
  numberOfBedrooms: [],
  totalGuestCapacity: null
}

interface PropertiesClientProps {
  initialProperties: UiProperty[]
}

export function PropertiesClient({ initialProperties }: PropertiesClientProps) {
  const t = useTranslations('properties')
  const tCommon = useTranslations('common')
  const [filters, setFilters] = useState<PropertyFiltersState>(defaultFilters)
  const [displayMode, setDisplayMode] = useState<DisplayMode>('medium')
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [guests, setGuests] = useState(2)
  const [hasSearched, setHasSearched] = useState(false)

  const handleDatesChange = (newCheckIn: Date | null, newCheckOut: Date | null) => {
    setCheckIn(newCheckIn)
    setCheckOut(newCheckOut)
    if (!newCheckIn && !newCheckOut) {
      setHasSearched(false)
    }
  }

  const handleSearch = () => {
    setHasSearched(true)
  }

  // First apply standard filters
  const filteredByStandard = useMemo(() => {
    return initialProperties.filter(property => {
      // Price filter
      if (property.pricePerNight < filters.priceRange[0] || 
          property.pricePerNight > filters.priceRange[1]) {
        return false
      }

      // District filter
      if (filters.districts.length > 0 && 
          !filters.districts.includes(property.location.district)) {
        return false
      }

      // Number of bedrooms filter
      if (filters.numberOfBedrooms.length > 0) {
        const bedroomStr = property.numberOfBedrooms.toString()
        const hasMatch = filters.numberOfBedrooms.some(filter => {
          if (filter === '5+') {
            return property.numberOfBedrooms >= 5
          }
          return bedroomStr === filter
        })
        if (!hasMatch) return false
      }

      // Guest capacity filter
      if (filters.totalGuestCapacity !== null && 
          property.totalGuestCapacity < filters.totalGuestCapacity) {
        return false
      }

      // Features filter
      if (filters.features.length > 0) {
        const propertyFeatures = property.features as PropertyFeatures
        const hasAllFeatures = filters.features.every(
          feature => propertyFeatures[feature as keyof PropertyFeatures]
        )
        if (!hasAllFeatures) return false
      }

      // Parking filter
      if (filters.parking.length > 0) {
        if (filters.parking.includes('available') && !property.parking.available) {
          return false
        }
      }

      return true
    })
  }, [initialProperties, filters])

  // Then apply availability filter if dates are set
  const { filteredProperties, availabilityResults } = useMemo(() => {
    if (!checkIn || !checkOut || !hasSearched) {
      return { 
        filteredProperties: filteredByStandard, 
        availabilityResults: new Map<string, PropertyAvailabilityResult>() 
      }
    }

    const results = filterPropertiesByAvailability(filteredByStandard, checkIn, checkOut)
    const resultsMap = new Map<string, PropertyAvailabilityResult>()
    results.forEach(r => resultsMap.set(r.property.id, r))
    
    // Sort by availability: available first, then by conflict count
    const sorted = [...results].sort((a, b) => {
      if (a.isAvailable && !b.isAvailable) return -1
      if (!a.isAvailable && b.isAvailable) return 1
      return a.conflictingDates.length - b.conflictingDates.length
    })
    
    return { 
      filteredProperties: sorted.map(r => r.property), 
      availabilityResults: resultsMap 
    }
  }, [filteredByStandard, checkIn, checkOut, hasSearched])

  const availableCount = useMemo(() => {
    if (!hasSearched || availabilityResults.size === 0) return filteredProperties.length
    return Array.from(availabilityResults.values()).filter(r => r.isAvailable).length
  }, [filteredProperties, availabilityResults, hasSearched])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-8 md:py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
                {t('title')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('subtitle')}
              </p>
            </div>

            {/* Date Search Bar */}
            <div className="max-w-4xl mx-auto">
              <DateSearchBar
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
                onDatesChange={handleDatesChange}
                onGuestsChange={setGuests}
                onSearch={handleSearch}
              />
            </div>
          </div>
        </section>

        {/* Filters and Properties */}
        <section className="py-8">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside className="lg:w-72 flex-shrink-0">
                <div className="lg:sticky lg:top-24">
                  <PropertyFilters 
                    filters={filters} 
                    onFiltersChange={setFilters}
                    properties={initialProperties}
                  />
                </div>
              </aside>

              {/* Properties Grid */}
              <div className="flex-1">
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {hasSearched && availabilityResults.size > 0 ? (
                        <>
                          <span className="font-medium text-foreground">{availableCount}</span>
                          {' '}{t('available')} / {filteredProperties.length} {t('properties')}
                        </>
                      ) : (
                        <>
                          <span className="font-medium text-foreground">{filteredProperties.length}</span>
                          {' '}{t('properties')}
                        </>
                      )}
                    </span>
                  </div>
                  <DisplayModeToggle mode={displayMode} onModeChange={setDisplayMode} />
                </div>

                {/* Properties */}
                <PropertiesGrid 
                  properties={filteredProperties} 
                  displayMode={displayMode}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  guests={guests}
                  availabilityResults={hasSearched ? availabilityResults : undefined}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
