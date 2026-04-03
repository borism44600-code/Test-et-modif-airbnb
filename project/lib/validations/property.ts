import { z } from 'zod'

/**
 * Canonical Zod schema for property form data.
 * Single source of truth for both create and edit forms.
 * Maps 1:1 to DB columns (snake_case) after transform.
 */

// ─── Form schema (camelCase, what the UI state looks like) ────────────
export const propertyFormSchema = z.object({
  // A. General identity
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  type: z.enum(['riad', 'villa', 'apartment', 'house', 'other']),
  subtitle: z.string().optional().default(''),
  shortDescription: z.string().optional().default(''),
  description: z.string().optional().default(''),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false),

  // B. Location
  city: z.string().default('Marrakech'),
  district: z.string().optional().default(''),
  subDistrict: z.string().optional().default(''),
  address: z.string().optional().default(''),
  mapLocation: z.string().optional().default(''),
  nearbyInfo: z.string().optional().default(''),

  // C. Capacity
  numberOfBedrooms: z.number().int().min(1).default(1),
  numberOfBathrooms: z.number().int().min(1).default(1),
  bedroomGuestCapacity: z.number().int().min(1).default(2),
  additionalGuestCapacity: z.number().int().min(0).default(0),
  totalGuestCapacity: z.number().int().min(1).default(2),

  // D. Pricing
  pricePerNight: z.number().min(0).default(0),
  cleaningFee: z.number().min(0).default(0),
  serviceFee: z.number().min(0).default(0),
  securityDeposit: z.number().min(0).default(0),
  currency: z.string().default('EUR'),
  priceDisplayNote: z.string().optional().default(''),

  // E. Parking
  parkingType: z.string().default('nearby'),
  parkingSpots: z.number().int().min(0).default(0),
  parkingNotes: z.string().optional().default(''),

  // F. Sync
  airbnbIcalUrl: z.string().optional().default(''),
  bookingIcalUrl: z.string().optional().default(''),
  internalIcalUrl: z.string().optional().default(''),

  // G. SEO
  seoTitle: z.string().optional().default(''),
  seoDescription: z.string().optional().default(''),
  seoKeywords: z.string().optional().default(''), // comma-separated in form

  // H. Features (stored as JSONB array of enabled feature keys)
  features: z.record(z.boolean()).optional().default({}),
})

export type PropertyFormData = z.infer<typeof propertyFormSchema>

/**
 * Transform validated form data → DB columns.
 * This is the ONLY place where camelCase → snake_case happens.
 */
export function formToDbPayload(form: PropertyFormData, publish?: boolean) {
  const status = publish ? 'published' : form.status

  // Build amenities array from features map
  const amenities = Object.entries(form.features ?? {})
    .filter(([, v]) => v)
    .map(([k]) => k)

  // Parse SEO keywords
  const seoKeywords = form.seoKeywords
    ? form.seoKeywords.split(',').map(k => k.trim()).filter(Boolean)
    : []

  return {
    // identity
    title: form.title,
    slug: form.slug,
    type: form.type,
    subtitle: form.subtitle || null,
    description_short: form.shortDescription || null,
    description_long: form.description || null,
    status,
    is_active: status === 'published',
    featured: form.featured,

    // location
    city: form.city || 'Marrakech',
    district: form.district || null,
    sub_district: form.subDistrict || null,
    address: form.address || null,
    map_location: form.mapLocation || null,
    nearby_info: form.nearbyInfo || null,

    // capacity
    num_bedrooms: form.numberOfBedrooms,
    num_bathrooms: form.numberOfBathrooms,
    bedroom_guest_capacity: form.bedroomGuestCapacity,
    additional_guest_capacity: form.additionalGuestCapacity,
    total_guest_capacity: form.totalGuestCapacity,

    // pricing
    price_per_night: form.pricePerNight,
    cleaning_fee: form.cleaningFee,
    service_fee: form.serviceFee,
    security_deposit: form.securityDeposit,
    currency: form.currency,
    price_display_note: form.priceDisplayNote || null,

    // parking
    parking_type: form.parkingType,
    parking_spots: form.parkingSpots,
    parking_notes: form.parkingNotes || null,

    // sync
    airbnb_ical_url: form.airbnbIcalUrl || null,
    booking_ical_url: form.bookingIcalUrl || null,
    internal_ical_url: form.internalIcalUrl || null,

    // SEO
    seo_title: form.seoTitle || null,
    seo_description: form.seoDescription || null,
    seo_keywords: seoKeywords,

    // features stored as JSONB array of string keys
    amenities,
  }
}

/**
 * Transform DB row → form data (for editing).
 * Inverse of formToDbPayload.
 */
export function dbToFormData(db: Record<string, unknown>): PropertyFormData {
  // Convert amenities array back to features map
  const amenitiesArr = Array.isArray(db.amenities) ? db.amenities : []
  const features: Record<string, boolean> = {}
  for (const key of amenitiesArr) {
    if (typeof key === 'string') features[key] = true
  }

  const seoKeywords = Array.isArray(db.seo_keywords)
    ? (db.seo_keywords as string[]).join(', ')
    : ''

  return {
    title: (db.title as string) || (db.name_en as string) || '',
    slug: (db.slug as string) || '',
    type: ((db.type as string) || (db.category as string) || 'riad') as PropertyFormData['type'],
    subtitle: (db.subtitle as string) || '',
    shortDescription: (db.description_short as string) || (db.short_description_en as string) || '',
    description: (db.description_long as string) || (db.description_en as string) || '',
    status: ((db.status as string) || 'draft') as PropertyFormData['status'],
    featured: (db.featured as boolean) || false,
    city: (db.city as string) || 'Marrakech',
    district: (db.district as string) || '',
    subDistrict: (db.sub_district as string) || '',
    address: (db.address as string) || '',
    mapLocation: (db.map_location as string) || (db.map_url as string) || '',
    nearbyInfo: (db.nearby_info as string) || '',
    numberOfBedrooms: (db.num_bedrooms as number) || (db.bedrooms as number) || 1,
    numberOfBathrooms: (db.num_bathrooms as number) || (db.bathrooms as number) || 1,
    bedroomGuestCapacity: (db.bedroom_guest_capacity as number) || 2,
    additionalGuestCapacity: (db.additional_guest_capacity as number) || 0,
    totalGuestCapacity: (db.total_guest_capacity as number) || (db.max_guests as number) || 2,
    pricePerNight: (db.price_per_night as number) || 0,
    cleaningFee: (db.cleaning_fee as number) || 0,
    serviceFee: (db.service_fee as number) || 0,
    securityDeposit: (db.security_deposit as number) || 0,
    currency: (db.currency as string) || 'EUR',
    priceDisplayNote: (db.price_display_note as string) || '',
    parkingType: (db.parking_type as string) || 'nearby',
    parkingSpots: (db.parking_spots as number) || 0,
    parkingNotes: (db.parking_notes as string) || '',
    airbnbIcalUrl: (db.airbnb_ical_url as string) || '',
    bookingIcalUrl: (db.booking_ical_url as string) || '',
    internalIcalUrl: (db.internal_ical_url as string) || '',
    seoTitle: (db.seo_title as string) || (db.meta_title as string) || '',
    seoDescription: (db.seo_description as string) || (db.meta_description as string) || '',
    seoKeywords,
    features,
  }
}
