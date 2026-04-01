'use client'

import { useState } from 'react'
import { X, ChevronDown, SlidersHorizontal, CheckSquare, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { 
  KASBAH_DISTRICTS,
  MEDINA_DISTRICTS, 
  APARTMENT_DISTRICTS, 
  DISTANCE_OPTIONS, 
  PARKING_OPTIONS,
  FEATURE_LABELS,
  BEDROOM_OPTIONS,
  GUEST_CAPACITY_OPTIONS,
  type PropertyFeatures
} from '@/lib/types'

export interface PropertyFiltersState {
  priceRange: [number, number]
  districts: string[]
  distanceFromCenter: string[]
  features: (keyof PropertyFeatures)[]
  parking: string[]
  availability: {
    start: string | null
    end: string | null
  }
  // Room and guest capacity filters
  numberOfBedrooms: number[]
  totalGuestCapacity: number | null
}

interface PropertyFiltersProps {
  filters: PropertyFiltersState
  onFiltersChange: (filters: PropertyFiltersState) => void
  onReset: () => void
}

const featuresList = Object.entries(FEATURE_LABELS) as [keyof PropertyFeatures, string][]

export function PropertyFilters({ filters, onFiltersChange, onReset }: PropertyFiltersProps) {
  const [openSections, setOpenSections] = useState<string[]>(['price', 'features'])

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    )
  }

  const updateFilters = (updates: Partial<PropertyFiltersState>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const toggleArrayItem = <T,>(array: T[] | undefined, item: T): T[] => {
    const arr = array || []
    return arr.includes(item) 
      ? arr.filter(i => i !== item) 
      : [...arr, item]
  }

  // Select/Deselect all districts in a group
  const selectAllDistricts = (districtList: readonly string[]) => {
    const newDistricts = [...filters.districts]
    districtList.forEach(district => {
      if (!newDistricts.includes(district)) {
        newDistricts.push(district)
      }
    })
    updateFilters({ districts: newDistricts })
  }

  const deselectAllDistricts = (districtList: readonly string[]) => {
    const newDistricts = filters.districts.filter(d => !districtList.includes(d))
    updateFilters({ districts: newDistricts })
  }

  const areAllSelected = (districtList: readonly string[]) => {
    return districtList.every(d => filters.districts.includes(d))
  }

  const areSomeSelected = (districtList: readonly string[]) => {
    return districtList.some(d => filters.districts.includes(d))
  }

  const activeFiltersCount = 
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000 ? 1 : 0) +
    (filters.districts?.length || 0) +
    (filters.distanceFromCenter?.length || 0) +
    (filters.features?.length || 0) +
    (filters.parking?.length || 0) +
    (filters.numberOfBedrooms?.length || 0) +
    (filters.totalGuestCapacity ? 1 : 0)

  const SelectAllButton = ({ districtList, label }: { districtList: readonly string[], label: string }) => {
    const allSelected = areAllSelected(districtList)
    const someSelected = areSomeSelected(districtList)
    
    return (
      <button
        type="button"
        onClick={() => allSelected ? deselectAllDistricts(districtList) : selectAllDistricts(districtList)}
        className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors mb-3"
      >
        {allSelected ? (
          <>
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Deselect All</span>
          </>
        ) : (
          <>
            <Square className="w-3.5 h-3.5" />
            <span>{someSelected ? 'Select All' : 'Select All'}</span>
          </>
        )}
      </button>
    )
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <Collapsible open={openSections.includes('price')} onOpenChange={() => toggleSection('price')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left">
          <span className="font-medium">Price per Night</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes('price') ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 pb-2">
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              min={0}
              max={2000}
              step={50}
              onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
              className="mb-4"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{filters.priceRange[0]}€</span>
              <span>{filters.priceRange[1]}€+</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Number of Bedrooms */}
      <Collapsible open={openSections.includes('bedrooms')} onOpenChange={() => toggleSection('bedrooms')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left">
          <span className="font-medium">Number of Bedrooms</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes('bedrooms') ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {BEDROOM_OPTIONS.map((option) => {
              const isSelected = filters.numberOfBedrooms?.includes(option.value) || false
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateFilters({ 
                    numberOfBedrooms: toggleArrayItem(filters.numberOfBedrooms, option.value) 
                  })}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {option.value === 7 ? '7+' : option.value}
                </button>
              )
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Total Guest Capacity */}
      <Collapsible open={openSections.includes('capacity')} onOpenChange={() => toggleSection('capacity')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left">
          <span className="font-medium">Total Guest Capacity</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes('capacity') ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 pb-2">
          <Label className="text-xs text-muted-foreground mb-3 block">Minimum number of guests</Label>
          <div className="flex flex-wrap gap-2">
            {GUEST_CAPACITY_OPTIONS.map((option) => {
              const isSelected = filters.totalGuestCapacity === option.value
              return (
                <button
                  key={`capacity-${option.value}`}
                  type="button"
                  onClick={() => updateFilters({ 
                    totalGuestCapacity: isSelected ? null : option.value 
                  })}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {option.value}+
                </button>
              )
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Location - Kasbah Royal District */}
      <Collapsible open={openSections.includes('kasbah')} onOpenChange={() => toggleSection('kasbah')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left">
          <span className="font-medium">Kasbah Royal District</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes('kasbah') ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 pb-2">
          <div className="space-y-3">
            {KASBAH_DISTRICTS.map((district) => (
              <div key={district} className="flex items-center gap-3">
                <Checkbox
                  id={`kasbah-${district}`}
                  checked={filters.districts.includes(district)}
                  onCheckedChange={() => updateFilters({ districts: toggleArrayItem(filters.districts, district) })}
                />
                <Label htmlFor={`kasbah-${district}`} className="text-sm font-normal cursor-pointer">
                  {district}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Location - Medina Districts */}
      <Collapsible open={openSections.includes('medina')} onOpenChange={() => toggleSection('medina')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left">
          <span className="font-medium">Medina Districts</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes('medina') ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 pb-2">
          <SelectAllButton districtList={MEDINA_DISTRICTS} label="Medina Districts" />
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {MEDINA_DISTRICTS.map((district) => (
              <div key={district} className="flex items-center gap-3">
                <Checkbox
                  id={`district-${district}`}
                  checked={filters.districts.includes(district)}
                  onCheckedChange={() => updateFilters({ districts: toggleArrayItem(filters.districts, district) })}
                />
                <Label htmlFor={`district-${district}`} className="text-sm font-normal cursor-pointer">
                  {district}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Apartment Districts */}
      <Collapsible open={openSections.includes('apartments')} onOpenChange={() => toggleSection('apartments')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left">
          <span className="font-medium">Modern Districts</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes('apartments') ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 pb-2">
          <SelectAllButton districtList={APARTMENT_DISTRICTS} label="Modern Districts" />
          <div className="space-y-3">
            {APARTMENT_DISTRICTS.map((district) => (
              <div key={district} className="flex items-center gap-3">
                <Checkbox
                  id={`apt-${district}`}
                  checked={filters.districts.includes(district)}
                  onCheckedChange={() => updateFilters({ districts: toggleArrayItem(filters.districts, district) })}
                />
                <Label htmlFor={`apt-${district}`} className="text-sm font-normal cursor-pointer">
                  {district}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Distance from Center */}
      <Collapsible open={openSections.includes('distance')} onOpenChange={() => toggleSection('distance')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left">
          <span className="font-medium">Distance from Center</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes('distance') ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 pb-2">
          <div className="space-y-3">
            {DISTANCE_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center gap-3">
                <Checkbox
                  id={`distance-${option.value}`}
                  checked={filters.distanceFromCenter.includes(option.value)}
                  onCheckedChange={() => updateFilters({ distanceFromCenter: toggleArrayItem(filters.distanceFromCenter, option.value) })}
                />
                <Label htmlFor={`distance-${option.value}`} className="text-sm font-normal cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Features */}
      <Collapsible open={openSections.includes('features')} onOpenChange={() => toggleSection('features')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left">
          <span className="font-medium">Features</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes('features') ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 pb-2 max-h-64 overflow-y-auto">
          <div className="space-y-3">
            {featuresList.map(([key, label]) => (
              <div key={key} className="flex items-center gap-3">
                <Checkbox
                  id={`feature-${key}`}
                  checked={filters.features.includes(key)}
                  onCheckedChange={() => updateFilters({ features: toggleArrayItem(filters.features, key) })}
                />
                <Label htmlFor={`feature-${key}`} className="text-sm font-normal cursor-pointer">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Parking */}
      <Collapsible open={openSections.includes('parking')} onOpenChange={() => toggleSection('parking')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left">
          <span className="font-medium">Parking</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes('parking') ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 pb-2">
          <div className="space-y-3">
            {PARKING_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center gap-3">
                <Checkbox
                  id={`parking-${option.value}`}
                  checked={filters.parking.includes(option.value)}
                  onCheckedChange={() => updateFilters({ parking: toggleArrayItem(filters.parking, option.value) })}
                />
                <Label htmlFor={`parking-${option.value}`} className="text-sm font-normal cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Reset Button */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={onReset} className="w-full">
          <X className="w-4 h-4 mr-2" />
          Clear All Filters ({activeFiltersCount})
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Filters */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-24 bg-card rounded-lg p-6 border border-border">
          <h3 className="font-semibold text-lg mb-6">Filters</h3>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Filters */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
<SheetHeader>
  <SheetTitle>Filters</SheetTitle>
  <SheetDescription>Refine your property search with the options below.</SheetDescription>
  </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
