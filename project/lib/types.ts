export type PropertyType = 'riad' | 'villa' | 'apartment' | 'other'

export type PropertyStatus = 'draft' | 'published' | 'archived'

// Bed types for sleeping arrangements (per specification)
export type BedType = 
  | 'king' 
  | 'queen' 
  | 'double' 
  | 'single' 
  | 'sofa-bed-double' 
  | 'sofa-bed-single'
  | 'extra-bed-single'
  | 'extra-bed-double'
  | 'bench-single'
  | 'bench-double'
  | 'bunk-bed'
  | 'crib'

export const BED_TYPE_LABELS: Record<BedType, string> = {
  'king': 'King-size bed (2 people)',
  'queen': 'Queen-size bed (2 people)',
  'double': 'Standard double bed (2 people)',
  'single': 'Single bed (1 person)',
  'sofa-bed-double': 'Sofa bed for 2 people',
  'sofa-bed-single': 'Sofa bed for 1 person',
  'extra-bed-single': 'Extra bed for 1 person',
  'extra-bed-double': 'Extra bed for 2 people',
  'bench-single': 'Converted bench for 1 person',
  'bench-double': 'Converted bench for 2 people',
  'bunk-bed': 'Bunk bed',
  'crib': 'Crib'
}

// Bathroom types for ensuite details
export type BathroomType = 'shower' | 'bathtub' | 'both' | 'none'

export const BATHROOM_TYPE_LABELS: Record<BathroomType, string> = {
  'shower': 'Shower',
  'bathtub': 'Bathtub',
  'both': 'Shower & Bathtub',
  'none': 'No bathroom'
}

export interface SleepingSpace {
  roomName: string // e.g., "Bedroom 1", "Living room"
  roomType: 'bedroom' | 'living-room' | 'other'
  beds: {
    type: BedType
    quantity: number
  }[]
  ensuite?: boolean // Has private bathroom
  bathroomType?: BathroomType // Type of bathroom facilities
  notes?: string // Additional notes like "with balcony"
}

export type DistanceFromCenter = 
  | 'walking' 
  | 'less-5-min' 
  | 'less-15-min' 
  | 'less-30-min' 
  | 'more-30-min'

export type ParkingType = 
  | 'private' 
  | 'nearby' 
  | 'door-dropoff' 
  | 'door-parking' 
  | 'walk-3-min' 
  | 'walk-5-min' 
  | 'less-500m'

export interface PropertyFeatures {
  // Pool options
  heatedPool: boolean
  unheatedPool: boolean
  heatedPlungePool: boolean
  unheatedPlungePool: boolean
  // Wellness
  jacuzzi: boolean
  hammam: boolean
  bathtub: boolean
  fireplace: boolean
  // Outdoor
  terrace: boolean
  rooftop: boolean
  privateTerminate: boolean
  // Services possible
  wifi: boolean
  airConditioning: boolean
  breakfastPossible: boolean
  mealsPossible: boolean
  airportTransferPossible: boolean
  privateDriverPossible: boolean
  excursionsPossible: boolean
  // Kitchen
  gasStove: boolean
  washingMachine: boolean
  iron: boolean
  dishwasher: boolean
  oven: boolean
  coffeeMachine: boolean
  fridge: boolean
  // Views
  mountainView: boolean
  koutboubiaView: boolean
  mouleyYazidView: boolean
  monumentsView: boolean
  souks: boolean
}

export interface Property {
  id: string
  // A. General identity
  title: string
  slug: string
  type: PropertyType
  subtitle?: string
  shortDescription: string
  description: string
  status: PropertyStatus
  
  // B. Location
  location: {
    city: string
    district: string
    subDistrict?: string
    address?: string
    mapLocation?: string
    nearbyInfo?: string
    distanceFromCenter?: DistanceFromCenter
  }
  
  // C. Capacity
  numberOfBedrooms: number
  bathrooms: number
  bedroomGuestCapacity: number // Guests who can sleep in bedrooms
  additionalGuestCapacity: number // Guests in additional spaces (sofa beds, etc.)
  totalGuestCapacity: number // Total = bedroomGuestCapacity + additionalGuestCapacity
  sleepingArrangements?: SleepingSpace[]
  
  // D. Pricing
  pricePerNight: number
  monthlyPrices?: Record<number, number> // Month (1-12) to price mapping
  cleaningFee?: number
  securityDeposit?: number
  currency: string
  priceDisplayNote?: string
  
  // E. Amenities / Features
  features: PropertyFeatures
  amenities: string[]
  
  // F. Parking
  parking: ParkingType
  parkingNotes?: string
  
  // G. Booking / sync settings
  airbnbIcalUrl?: string
  bookingIcalUrl?: string
  internalIcalUrl?: string
  lastExternalSyncAt?: string
  externalSyncStatus?: 'idle' | 'syncing' | 'success' | 'error'
  externalSyncError?: string
  airbnbSyncStatus?: 'idle' | 'syncing' | 'success' | 'error'
  airbnbLastSyncAt?: string
  airbnbEventsCount?: number
  bookingSyncStatus?: 'idle' | 'syncing' | 'success' | 'error'
  bookingLastSyncAt?: string
  bookingEventsCount?: number
  
  // H. SEO
  metaTitle?: string
  metaDescription?: string
  seoKeywords?: string[]
  
  // I. Media
  images: string[]
  coverImage?: string
  imageAltTexts?: Record<string, string>
  
  // Availability
  availability: {
    start: string
    end: string
  }[]
  
  // System fields
  featured: boolean
  createdAt: string
  updatedAt: string
}

// External calendar sync types
export type CalendarChannel = 'airbnb' | 'booking' | 'platform'

export interface ExternalCalendarConfig {
  channel: CalendarChannel
  name: string
  icalUrl?: string
  lastSyncAt?: string
  syncStatus: 'idle' | 'syncing' | 'success' | 'error'
  eventsCount?: number
  error?: string
}

export interface PropertyCalendarSync {
  propertyId: string
  propertyTitle: string
  internalIcalUrl: string
  channels: ExternalCalendarConfig[]
  lastExternalSyncAt?: string
  overallStatus: 'idle' | 'syncing' | 'success' | 'error' | 'partial'
}

export interface PartnerCategory {
  id: string
  name: string
  slug: string
}

export interface Partner {
  id: string
  name: string
  category: 'restaurant' | 'spa' | 'tour' | 'activity' | 'transport'
  description: string
  image: string
  website?: string
  discountCode?: string
  bookingProcedure?: string
}

export interface BookingAddon {
  id: string
  name: string
  description: string
  pricePerPerson?: number
  priceFlat?: number
  image?: string
}

export interface Booking {
  id: string
  propertyId: string
  propertyTitle?: string
  checkIn: string
  checkOut: string
  nights: number
  guests: {
    adults: number
    children: number
  }
  addons: {
    addonId: string
    quantity: number
    persons?: number
  }[]
  pricing: {
    nightlyRate: number
    subtotal: number
    cleaningFee: number
    extras: number
    total: number
  }
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'refunded' | 'partially_refunded'
  payment: {
    method: 'card' | 'paypal' | 'bank_transfer'
    status: 'pending' | 'paid' | 'refunded' | 'partial_refund'
    transactionId?: string
    captureId?: string // PayPal capture ID for refunds
    paidAt?: string
  }
  cancellation?: {
    cancelledAt: string
    reason?: string
    refundStatus: 'not_applicable' | 'pending' | 'completed' | 'refused'
    refundAmount?: number
    refundTransactionId?: string
    processedBy?: string
  }
  contactInfo: {
    name: string
    email: string
    phone: string
  }
  source: 'website' | 'airbnb' | 'booking' | 'manual'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  name: string
  description: string
  image: string
  category: 'breakfast' | 'meals' | 'excursion' | 'spa' | 'transport'
}

// Date blocking types
export type DateBlockType = 'maintenance' | 'owner_use' | 'booking' | 'other'

export interface DateBlock {
  id: string
  propertyId: string
  startDate: string
  endDate: string
  type: DateBlockType
  reason?: string
  bookingId?: string
  createdBy?: string
  createdAt: string
}

// Cancellation and refund types
export type RefundStatus = 'not_applicable' | 'pending' | 'completed' | 'refused'

export interface BookingCancellation {
  cancelledAt: string
  reason?: string
  refundStatus: RefundStatus
  refundAmount?: number
  refundTransactionId?: string
  processedBy?: string
}

// Location districts
export const KASBAH_DISTRICTS = [
  'Kasbah Royal District'
] as const

export const MEDINA_DISTRICTS = [
  'Arset el Houta',
  'Arset El Maach', 
  'Arset Moulay Moussa',
  'Assouel',
  'Azbezd, les Souks',
  'Bab Doukkala',
  'Bab El Hmar',
  'Ben Salah',
  'Derb Dabachi',
  'Derb el Bacha',
  'El Moukef',
  'Kaât Benahid ou Medersa Ben Youssef',
  'Kennaria',
  'Le Mellah',
  'Mouassine',
  'Rahba Kedima',
  'Riad Laârous',
  'Riad Zitoun',
  'Rmila',
  'Sidi Ben Slimane',
  'Sidi Bou Amar',
  'Bab El Khemis',
  'Bab Aylan & Bab Ghmat',
  'Sidi Mimoun'
] as const

export const APARTMENT_DISTRICTS = [
  'Guéliz',
  'Hivernage', 
  'Airport'
] as const

export const MAIN_DISTRICTS = [
  'Kasbah Royal District',
  'Medina of Marrakech',
  ...APARTMENT_DISTRICTS
] as const

export const DISTANCE_OPTIONS = [
  { value: 'walking', label: 'Within walking distance' },
  { value: 'less-5-min', label: 'Less than 5 minutes by car' },
  { value: 'less-15-min', label: 'Less than 15 minutes by car' },
  { value: 'less-30-min', label: 'Less than 30 minutes by car' },
  { value: 'more-30-min', label: 'More than 30 minutes by car' }
] as const

export const PARKING_OPTIONS = [
  { value: 'private', label: 'Property with private parking' },
  { value: 'nearby', label: 'Parking nearby' },
  { value: 'door-dropoff', label: 'Drop-off at the door' },
  { value: 'door-parking', label: 'Parking at the door' },
  { value: 'walk-3-min', label: '< 3-minute walk' },
  { value: 'walk-5-min', label: '< 5-minute walk' },
  { value: 'less-500m', label: '< 500m' }
] as const

export const BEDROOM_OPTIONS = [
  { value: 1, label: '1 bedroom' },
  { value: 2, label: '2 bedrooms' },
  { value: 3, label: '3 bedrooms' },
  { value: 4, label: '4 bedrooms' },
  { value: 5, label: '5 bedrooms' },
  { value: 6, label: '6 bedrooms' },
  { value: 7, label: '7+ bedrooms' }
] as const

export const GUEST_CAPACITY_OPTIONS = [
  { value: 1, label: '1 guest' },
  { value: 2, label: '2 guests' },
  { value: 3, label: '3 guests' },
  { value: 4, label: '4 guests' },
  { value: 5, label: '5 guests' },
  { value: 6, label: '6 guests' },
  { value: 8, label: '8 guests' },
  { value: 10, label: '10 guests' },
  { value: 12, label: '12+ guests' }
] as const

export const FEATURE_LABELS: Record<keyof PropertyFeatures, string> = {
  heatedPool: 'Heated Swimming Pool',
  unheatedPool: 'Unheated Swimming Pool',
  heatedPlungePool: 'Heated Plunge Pool / Basin',
  unheatedPlungePool: 'Unheated Plunge Pool / Basin',
  jacuzzi: 'Jacuzzi',
  hammam: 'Hammam',
  bathtub: 'Bathtub',
  fireplace: 'Fireplace',
  terrace: 'Terrace',
  rooftop: 'Rooftop',
  privateTerminate: 'Private Terrace',
  wifi: 'WiFi',
  airConditioning: 'Air Conditioning',
  breakfastPossible: 'Breakfast Possible',
  mealsPossible: 'Meals Possible',
  airportTransferPossible: 'Airport Transfer Possible',
  privateDriverPossible: 'Private Driver Possible',
  excursionsPossible: 'Excursion Options Possible',
  gasStove: 'Gas Stove / Kitchen',
  washingMachine: 'Washing Machine',
  iron: 'Iron / Ironing Board',
  dishwasher: 'Dishwasher',
  oven: 'Oven',
  coffeeMachine: 'Coffee / Tea Maker',
  fridge: 'Fridge(s)',
  mountainView: 'Mountain View',
  koutboubiaView: 'Koutoubia View',
  mouleyYazidView: 'Moulay Lyazid Mosque View',
  monumentsView: 'View of Monuments',
  souks: 'Near Souks'
}
