/**
 * Adapts database property format to the UI Property format
 * This ensures backwards compatibility with existing components
 */

import { PropertyFeatures, SleepingSpace } from '@/lib/types'

// Database property type (matches actual Supabase schema after scripts 001–004)
export interface DbProperty {
  id: string
  slug: string

  // --- Colonnes "admin flat" ajoutées par script 004 (prioritaires en lecture) ---
  title?: string           // = name_en
  type?: string            // = category
  status?: string          // 'draft' | 'published' | 'archived'
  description_short?: string   // = short_description_en
  description_long?: string    // = description_en
  num_bedrooms?: number    // = bedrooms
  num_bathrooms?: number   // = bathrooms
  total_guest_capacity?: number // = max_guests
  map_location?: string    // = map_url
  seo_title?: string       // = meta_title
  seo_description?: string // = meta_description
  service_fee?: number
  parking_notes?: string
  airbnb_ical_url?: string
  booking_ical_url?: string
  internal_ical_url?: string

  // --- Colonnes multilingues d'origine (script 001, fallback) ---
  name_en?: string
  name_fr?: string
  name_es?: string
  name_ar?: string
  name_ma?: string
  name_zh?: string
  category?: string
  description_en?: string
  description_fr?: string
  short_description_en?: string
  short_description_fr?: string
  location?: string
  district?: string
  sub_district?: string
  address?: string
  map_url?: string
  price_per_night: number
  cleaning_fee?: number
  security_deposit?: number
  bedrooms?: number
  bathrooms?: number
  bedroom_guest_capacity?: number
  additional_guest_capacity?: number
  max_guests?: number
  size_sqm?: number
  minimum_stay?: number
  amenities?: Record<string, unknown>
  features?: Record<string, unknown>
  parking_type?: string
  parking_spots?: number
  meta_title?: string
  meta_description?: string
  is_active?: boolean
  featured?: boolean
  instant_booking?: boolean
  cover_image?: string
  images?: string[]
  created_at?: string
  updated_at?: string
  property_images?: {
    id: string
    image_url: string
    alt_text?: string
    is_cover: boolean
    display_order: number
  }[]
  property_rooms?: {
    id: string
    room_name: string
    room_number?: number
    bed_type?: string
    bed_count?: number
    max_guests?: number
    has_bathroom?: boolean
    has_shower?: boolean
    has_bathtub?: boolean
  }[]
}

// UI property type (matching existing mockProperties format)
export interface UiProperty {
  id: string
  slug: string
  title: string
  subtitle?: string
  shortDescription: string
  description: string
  type: 'riad' | 'villa' | 'apartment'
  pricePerNight: number
  priceDisplayNote?: string
  currency: string
  numberOfBedrooms: number
  numberOfBathrooms: number
  bathrooms: number // alias for numberOfBathrooms (used by detail page)
  bedroomGuestCapacity: number
  additionalGuestCapacity: number
  totalGuestCapacity: number
  images: string[]
  amenities: string[]
  location: {
    city: string
    district: string
    subDistrict?: string
    address?: string
    nearbyInfo?: string
    mapLocation?: string
    distanceFromCenter?: string
    coordinates?: { lat: number; lng: number }
  }
  sleepingArrangements: SleepingSpace[]
  features: PropertyFeatures
  parking: {
    available: boolean
    type?: string
    spots?: number
    notes?: string
  }
  availability: { start: string; end: string }[]
  featured: boolean
}

// Default features (all false)
const defaultFeatures: PropertyFeatures = {
  heatedPool: false,
  unheatedPool: false,
  heatedPlungePool: false,
  unheatedPlungePool: false,
  jacuzzi: false,
  hammam: false,
  bathtub: false,
  fireplace: false,
  terrace: false,
  rooftop: false,
  privateTerminate: false,
  wifi: true,
  airConditioning: true,
  breakfastPossible: false,
  mealsPossible: false,
  airportTransferPossible: false,
  privateDriverPossible: false,
  excursionsPossible: false,
  gasStove: false,
  washingMachine: false,
  iron: false,
  dishwasher: false,
  oven: false,
  coffeeMachine: false,
  fridge: false,
  mountainView: false,
  koutboubiaView: false,
  mouleyYazidView: false,
  monumentsView: false,
  souks: false,
}

/**
 * Convert amenities array to features object
 */
function amenitiestoFeatures(amenities: string[] = []): PropertyFeatures {
  const features = { ...defaultFeatures }
  
  for (const amenity of amenities) {
    if (amenity in features) {
      (features as Record<string, boolean>)[amenity] = true
    }
  }
  
  return features
}

/**
 * Convert database rooms to sleeping arrangements
 */
function roomsToSleepingArrangements(rooms: DbProperty['property_rooms'] = []): SleepingSpace[] {
  return rooms.map((room, index) => ({
    id: room.id,
    name: room.room_name || `Bedroom ${index + 1}`,
    bedTypes: room.bed_type ? [{
      type: room.bed_type as 'king' | 'queen' | 'double' | 'single' | 'sofa_bed' | 'bunk',
      quantity: room.bed_count || 1
    }] : [],
    bathroom: {
      hasPrivate: room.has_bathroom || false,
      hasShower: room.has_shower || false,
      hasBathtub: room.has_bathtub || false
    }
  }))
}

/**
 * Adapt a database property to UI format
 */
export function adaptPropertyToUi(dbProperty: DbProperty): UiProperty {
  // Get cover image or first image, fallback to placeholder
  const sortedImages = (dbProperty.property_images || [])
    .sort((a, b) => {
      if (a.is_cover) return -1
      if (b.is_cover) return 1
      return a.display_order - b.display_order
    })
  
  const images = sortedImages.length > 0 
    ? sortedImages.map(img => img.image_url)
    : ['/placeholder-property.jpg']

  // Colonnes "flat admin" (script 004) en priorité, fallback sur colonnes multilingues
  const title = dbProperty.title || dbProperty.name_en || dbProperty.name_fr || 'Untitled Property'
  const shortDesc = dbProperty.description_short || dbProperty.short_description_en || dbProperty.short_description_fr || ''
  const description = dbProperty.description_long || dbProperty.description_en || dbProperty.description_fr || shortDesc
  
  // Get images from cover_image or images array
  let propertyImages: string[] = []
  if (dbProperty.cover_image) {
    propertyImages.push(dbProperty.cover_image)
  }
  if (dbProperty.images && Array.isArray(dbProperty.images)) {
    propertyImages = [...propertyImages, ...dbProperty.images]
  }
  // Also add from property_images relation
  if (images.length > 0 && images[0] !== '/placeholder-property.jpg') {
    propertyImages = [...propertyImages, ...images]
  }
  // Dedupe and fallback
  propertyImages = [...new Set(propertyImages)]
  if (propertyImages.length === 0) {
    propertyImages = ['/placeholder-property.jpg']
  }

  // Convert features/amenities object to PropertyFeatures
  const featuresObj = typeof dbProperty.features === 'object' ? dbProperty.features : {}
  const amenitiesObj = typeof dbProperty.amenities === 'object' ? dbProperty.amenities : {}
  const combinedFeatures = { ...featuresObj, ...amenitiesObj }
  const featureKeys = Object.keys(combinedFeatures).filter(k => combinedFeatures[k] === true)

  const numBathrooms = dbProperty.num_bathrooms || dbProperty.bathrooms || 1

  // Build amenities string array from features keys
  const amenitiesList = featureKeys.length > 0 ? featureKeys : []

  return {
    id: dbProperty.id,
    slug: dbProperty.slug || dbProperty.id,
    title,
    subtitle: (dbProperty as unknown as Record<string, unknown>).subtitle as string || '',
    shortDescription: shortDesc,
    description,
    type: (dbProperty.type || dbProperty.category || 'riad') as 'riad' | 'villa' | 'apartment',
    pricePerNight: dbProperty.price_per_night || 0,
    priceDisplayNote: (dbProperty as unknown as Record<string, unknown>).price_display_note as string || undefined,
    currency: (dbProperty as unknown as Record<string, unknown>).currency as string || 'EUR',
    numberOfBedrooms: dbProperty.num_bedrooms || dbProperty.bedrooms || 1,
    numberOfBathrooms: numBathrooms,
    bathrooms: numBathrooms,
    bedroomGuestCapacity: dbProperty.bedroom_guest_capacity || dbProperty.total_guest_capacity || dbProperty.max_guests || 2,
    additionalGuestCapacity: dbProperty.additional_guest_capacity || 0,
    totalGuestCapacity: dbProperty.total_guest_capacity || dbProperty.max_guests || dbProperty.bedroom_guest_capacity || 2,
    images: propertyImages,
    amenities: amenitiesList,
    location: {
      city: dbProperty.location || 'Marrakech',
      district: dbProperty.district || 'Medina',
      subDistrict: dbProperty.sub_district,
      address: dbProperty.address,
      nearbyInfo: (dbProperty as unknown as Record<string, unknown>).nearby_info as string || undefined,
      mapLocation: dbProperty.map_location || dbProperty.map_url,
      distanceFromCenter: (dbProperty as unknown as Record<string, unknown>).distance_from_center as string || undefined,
    },
    sleepingArrangements: roomsToSleepingArrangements(dbProperty.property_rooms),
    features: amenitiestoFeatures(featureKeys),
    parking: {
      available: !!dbProperty.parking_type && dbProperty.parking_type !== 'none',
      type: dbProperty.parking_type,
      spots: dbProperty.parking_spots,
      notes: dbProperty.parking_notes,
    },
    availability: [],
    featured: dbProperty.featured || false
  }
}

/**
 * Adapt multiple database properties to UI format
 */
export function adaptPropertiesToUi(dbProperties: DbProperty[]): UiProperty[] {
  return dbProperties.map(adaptPropertyToUi)
}
