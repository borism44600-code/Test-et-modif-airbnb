'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PropertyFilters, PropertyFiltersState } from '@/components/properties/property-filters'
import { PropertiesGrid } from '@/components/properties/properties-grid'
import { DisplayModeToggle, DisplayMode } from '@/components/properties/display-mode-toggle'
import { fetchPublishedPropertiesClient } from '@/lib/data-fetcher-client'
import { Property, PropertyFeatures } from '@/lib/types'

const defaultFilters: PropertyFiltersState = {
  priceRange: [0, 2000],
  districts: [],
  distanceFromCenter: [],
  features: [],
  parking: [],
  availability: { start: null, end: null }
}

interface CategoryConfig {
  type: Property['type']
  title: string
  subtitle: string
  description: string
  heroImage: string
  pluralName: string
}

interface PropertyCategoryPageProps {
  config: CategoryConfig
}

export function PropertyCategoryPage({ config }: PropertyCategoryPageProps) {
  const [filters, setFilters] = useState<PropertyFiltersState>(defaultFilters)
  const [displayMode, setDisplayMode] = useState<DisplayMode>('medium')
  const [allProperties, setAllProperties] = useState<Property[]>([])

  useEffect(() => {
    fetchPublishedPropertiesClient().then(props => setAllProperties(props as unknown as Property[]))
  }, [])

  const categoryProperties = allProperties.filter(p => p.type === config.type)

  const filteredProperties = useMemo(() => {
    return categoryProperties.filter(property => {
      if (property.pricePerNight < filters.priceRange[0] || 
          property.pricePerNight > filters.priceRange[1]) {
        return false
      }
      if (filters.districts.length > 0) {
        const propertyDistrict = property.location.subDistrict || property.location.district
        if (!filters.districts.some(d => propertyDistrict.includes(d))) {
          return false
        }
      }
      if (filters.distanceFromCenter.length > 0 && property.location.distanceFromCenter) {
        if (!filters.distanceFromCenter.includes(property.location.distanceFromCenter)) {
          return false
        }
      }
      if (filters.features.length > 0) {
        const hasAllFeatures = filters.features.every(
          feature => property.features[feature as keyof PropertyFeatures]
        )
        if (!hasAllFeatures) return false
      }
      if (filters.parking.length > 0 && !filters.parking.includes(property.parking)) {
        return false
      }
      return true
    })
  }, [filters, categoryProperties])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
          <div className="absolute inset-0">
            <Image
              src={config.heroImage}
              alt={config.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 text-center text-white px-6">
            <p className="luxury-subheading text-white/80 mb-4">{config.subtitle}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold luxury-heading">
              {config.title}
            </h1>
            <p className="mt-6 text-lg text-white/90 max-w-2xl mx-auto">
              {config.description}
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="flex gap-8">
            <PropertyFilters 
              filters={filters}
              onFiltersChange={setFilters}
              onReset={() => setFilters(defaultFilters)}
            />

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">{filteredProperties.length}</span>
                  {' '}{config.pluralName} found
                </p>
                <div className="flex items-center gap-4">
                  <div className="lg:hidden">
                    <PropertyFilters 
                      filters={filters}
                      onFiltersChange={setFilters}
                      onReset={() => setFilters(defaultFilters)}
                    />
                  </div>
                  <DisplayModeToggle mode={displayMode} onModeChange={setDisplayMode} />
                </div>
              </div>

              {filteredProperties.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground font-medium">No {config.pluralName} found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {categoryProperties.length === 0
                      ? `Our ${config.pluralName} will appear here once they are published.`
                      : 'Try adjusting your filters to see more results.'}
                  </p>
                </div>
              ) : (
                <PropertiesGrid
                  properties={filteredProperties}
                  displayMode={displayMode}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
