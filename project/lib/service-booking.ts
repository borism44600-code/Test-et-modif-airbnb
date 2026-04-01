/**
 * Service Booking Engine
 * Handles breakfast, meals, taxi, and other service bookings
 * 
 * Reference timezone: Africa/Casablanca (Marrakech)
 * Cutoff time: 15:00 (3:00 PM) day before service
 */

import { MARRAKECH_TIMEZONE } from './booking-rules'

export const SERVICE_MODIFICATION_CUTOFF_HOUR = 15 // 3:00 PM

// ============================================
// SERVICE TYPES
// ============================================

export type ServiceCategory = 
  | 'breakfast'
  | 'meal'
  | 'taxi'
  | 'excursion'
  | 'driver'
  | 'spa'
  | 'concierge'

export type MealType = 'lunch' | 'dinner'
export type TaxiDirection = 'airport_to_property' | 'property_to_airport'

// ============================================
// SERVICE BOOKING INTERFACES
// ============================================

export interface BreakfastBooking {
  id: string
  bookingId: string
  date: string // YYYY-MM-DD
  numberOfGuests: number
  pricePerPerson: number
  total: number
  status: 'pending' | 'confirmed' | 'locked' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface MealBooking {
  id: string
  bookingId: string
  date: string // YYYY-MM-DD
  mealType: MealType
  numberOfAdults: number
  numberOfChildren: number
  pricePerAdult: number
  pricePerChild: number
  total: number
  status: 'pending' | 'confirmed' | 'locked' | 'cancelled'
  dietaryRequirements?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface TaxiBooking {
  id: string
  bookingId: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  direction: TaxiDirection
  numberOfPassengers: number
  flightNumber?: string
  price: number
  status: 'pending' | 'confirmed' | 'locked' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OtherServiceBooking {
  id: string
  bookingId: string
  serviceType: 'excursion' | 'driver' | 'spa' | 'concierge'
  serviceName: string
  date: string // YYYY-MM-DD
  time?: string // HH:MM - optional for some services
  numberOfAdults: number
  numberOfChildren?: number
  duration?: string // e.g., "half_day", "full_day", "60min"
  pricePerAdult: number
  pricePerChild?: number
  total: number
  status: 'pending' | 'confirmed' | 'locked' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
}

// Combined service booking for a reservation
export interface BookingServices {
  bookingId: string
  breakfasts: BreakfastBooking[]
  meals: MealBooking[]
  taxis: TaxiBooking[]
  otherServices: OtherServiceBooking[]
  totalServicesAmount: number
}

// ============================================
// SERVICE PRICING
// ============================================

export interface ServicePricing {
  breakfast: {
    pricePerPerson: number
  }
  meals: {
    lunch: {
      pricePerAdult: number
      pricePerChild: number
    }
    dinner: {
      pricePerAdult: number
      pricePerChild: number
    }
  }
  taxi: {
    airportToProperty: number
    propertyToAirport: number
    perExtraPassenger?: number // After 4 passengers
  }
  excursions: {
    [key: string]: {
      name: string
      pricePerAdult: number
      pricePerChild: number
      duration: string
      description: string
    }
  }
  driver: {
    halfDay: number
    fullDay: number
  }
  spa: {
    [key: string]: {
      name: string
      duration: string
      pricePerPerson: number
      description: string
    }
  }
}

// Default pricing
export const DEFAULT_SERVICE_PRICING: ServicePricing = {
  breakfast: {
    pricePerPerson: 25
  },
  meals: {
    lunch: {
      pricePerAdult: 45,
      pricePerChild: 25
    },
    dinner: {
      pricePerAdult: 60,
      pricePerChild: 35
    }
  },
  taxi: {
    airportToProperty: 25,
    propertyToAirport: 25,
    perExtraPassenger: 5
  },
  excursions: {
    atlas_day: {
      name: 'Atlas Mountains Day Trip',
      pricePerAdult: 85,
      pricePerChild: 45,
      duration: 'full_day',
      description: 'Discover Berber villages and stunning mountain landscapes'
    },
    essaouira: {
      name: 'Essaouira Coastal Escape',
      pricePerAdult: 95,
      pricePerChild: 50,
      duration: 'full_day',
      description: 'Visit the charming coastal town of Essaouira'
    },
    ourika_valley: {
      name: 'Ourika Valley Adventure',
      pricePerAdult: 65,
      pricePerChild: 35,
      duration: 'half_day',
      description: 'Explore waterfalls and traditional villages'
    },
    medina_tour: {
      name: 'Guided Medina Tour',
      pricePerAdult: 45,
      pricePerChild: 25,
      duration: 'half_day',
      description: 'Expert-led tour of the historic medina'
    },
    cooking_class: {
      name: 'Moroccan Cooking Class',
      pricePerAdult: 75,
      pricePerChild: 40,
      duration: 'half_day',
      description: 'Learn to prepare authentic Moroccan dishes'
    }
  },
  driver: {
    halfDay: 80,
    fullDay: 150
  },
  spa: {
    hammam_traditional: {
      name: 'Traditional Hammam',
      duration: '60min',
      pricePerPerson: 45,
      description: 'Authentic Moroccan steam bath with scrub'
    },
    massage_relaxation: {
      name: 'Relaxation Massage',
      duration: '60min',
      pricePerPerson: 80,
      description: 'Full body relaxation massage with argan oil'
    },
    massage_deep: {
      name: 'Deep Tissue Massage',
      duration: '60min',
      pricePerPerson: 90,
      description: 'Therapeutic deep tissue massage'
    },
    hammam_vip: {
      name: 'VIP Hammam Experience',
      duration: '90min',
      pricePerPerson: 95,
      description: 'Premium hammam with massage and facial'
    }
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get current time in Marrakech
 */
export function getMarrakechTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: MARRAKECH_TIMEZONE }))
}

/**
 * Check if a service date can still be modified
 * Services can be modified until the day before at 15:00 Marrakech time
 */
export function canModifyService(serviceDate: string): boolean {
  const serviceDateObj = new Date(serviceDate)
  const now = getMarrakechTime()
  
  // Get day before service at 15:00
  const deadline = new Date(serviceDateObj)
  deadline.setDate(deadline.getDate() - 1)
  deadline.setHours(SERVICE_MODIFICATION_CUTOFF_HOUR, 0, 0, 0)
  
  return now < deadline
}

/**
 * Get the modification deadline for a service
 */
export function getServiceModificationDeadline(serviceDate: string): Date {
  const serviceDateObj = new Date(serviceDate)
  const deadline = new Date(serviceDateObj)
  deadline.setDate(deadline.getDate() - 1)
  deadline.setHours(SERVICE_MODIFICATION_CUTOFF_HOUR, 0, 0, 0)
  return deadline
}

/**
 * Format deadline for display
 */
export function formatDeadline(deadline: Date): string {
  return deadline.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) + ' at 3:00 PM'
}

/**
 * Check if service is locked (past modification deadline)
 */
export function isServiceLocked(serviceDate: string): boolean {
  return !canModifyService(serviceDate)
}

/**
 * Generate a unique service ID
 */
export function generateServiceId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
}

/**
 * Calculate breakfast total
 */
export function calculateBreakfastTotal(
  numberOfGuests: number,
  pricing: ServicePricing = DEFAULT_SERVICE_PRICING
): number {
  return numberOfGuests * pricing.breakfast.pricePerPerson
}

/**
 * Calculate meal total
 */
export function calculateMealTotal(
  mealType: MealType,
  numberOfAdults: number,
  numberOfChildren: number,
  pricing: ServicePricing = DEFAULT_SERVICE_PRICING
): number {
  const mealPricing = pricing.meals[mealType]
  return (numberOfAdults * mealPricing.pricePerAdult) + (numberOfChildren * mealPricing.pricePerChild)
}

/**
 * Calculate taxi total
 */
export function calculateTaxiTotal(
  direction: TaxiDirection,
  numberOfPassengers: number,
  pricing: ServicePricing = DEFAULT_SERVICE_PRICING
): number {
  const basePrice = direction === 'airport_to_property' 
    ? pricing.taxi.airportToProperty 
    : pricing.taxi.propertyToAirport
  
  // Extra charge for more than 4 passengers
  const extraPassengers = Math.max(0, numberOfPassengers - 4)
  const extraCharge = extraPassengers * (pricing.taxi.perExtraPassenger || 0)
  
  return basePrice + extraCharge
}

/**
 * Calculate excursion total
 */
export function calculateExcursionTotal(
  excursionKey: string,
  numberOfAdults: number,
  numberOfChildren: number,
  pricing: ServicePricing = DEFAULT_SERVICE_PRICING
): number {
  const excursion = pricing.excursions[excursionKey]
  if (!excursion) return 0
  return (numberOfAdults * excursion.pricePerAdult) + (numberOfChildren * excursion.pricePerChild)
}

/**
 * Calculate driver total
 */
export function calculateDriverTotal(
  duration: 'half_day' | 'full_day',
  pricing: ServicePricing = DEFAULT_SERVICE_PRICING
): number {
  return duration === 'half_day' ? pricing.driver.halfDay : pricing.driver.fullDay
}

/**
 * Calculate spa total
 */
export function calculateSpaTotal(
  serviceKey: string,
  numberOfPersons: number,
  pricing: ServicePricing = DEFAULT_SERVICE_PRICING
): number {
  const spaService = pricing.spa[serviceKey]
  if (!spaService) return 0
  return numberOfPersons * spaService.pricePerPerson
}

/**
 * Calculate total for all services in a booking
 */
export function calculateTotalServices(services: BookingServices): number {
  let total = 0
  
  services.breakfasts.forEach(b => {
    if (b.status !== 'cancelled') total += b.total
  })
  
  services.meals.forEach(m => {
    if (m.status !== 'cancelled') total += m.total
  })
  
  services.taxis.forEach(t => {
    if (t.status !== 'cancelled') total += t.price
  })
  
  services.otherServices.forEach(s => {
    if (s.status !== 'cancelled') total += s.total
  })
  
  return total
}

/**
 * Generate dates array for a booking stay
 */
export function generateStayDates(checkIn: string, checkOut: string): string[] {
  const dates: string[] = []
  const startDate = new Date(checkIn)
  const endDate = new Date(checkOut)
  
  const currentDate = new Date(startDate)
  while (currentDate < endDate) {
    dates.push(currentDate.toISOString().split('T')[0])
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return dates
}

/**
 * Create empty booking services structure
 */
export function createEmptyBookingServices(bookingId: string): BookingServices {
  return {
    bookingId,
    breakfasts: [],
    meals: [],
    taxis: [],
    otherServices: [],
    totalServicesAmount: 0
  }
}

// ============================================
// SERVICE LABELS AND DISPLAY
// ============================================

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  lunch: 'Lunch',
  dinner: 'Dinner'
}

export const TAXI_DIRECTION_LABELS: Record<TaxiDirection, string> = {
  airport_to_property: 'Airport to Property',
  property_to_airport: 'Property to Airport'
}

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  breakfast: 'Breakfast',
  meal: 'Meals',
  taxi: 'Airport Transfer',
  excursion: 'Excursions',
  driver: 'Private Driver',
  spa: 'Spa & Wellness',
  concierge: 'Concierge Services'
}

export const SERVICE_CATEGORY_ICONS: Record<ServiceCategory, string> = {
  breakfast: 'coffee',
  meal: 'utensils',
  taxi: 'car',
  excursion: 'mountain',
  driver: 'car-taxi-front',
  spa: 'sparkles',
  concierge: 'concierge-bell'
}
