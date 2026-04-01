'use server'

import { createClient } from '@/lib/supabase/server'
import { Locale, SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/i18n/config'

// Types for multilingual content
export interface MultilingualText {
  en: string
  fr: string
  es: string
  ar: string
  ma: string
  zh: string
}

export interface PropertyML {
  id: string
  slug: string
  name: MultilingualText
  description: MultilingualText
  short_description: MultilingualText
  location: MultilingualText
  neighborhood: MultilingualText
  price_per_night: number
  bedrooms: number
  bathrooms: number
  max_guests: number
  category: string
  images: string[]
  amenities: string[]
  featured: boolean
  instant_booking: boolean
  created_at: string
  updated_at: string
}

export interface ServiceML {
  id: string
  slug: string
  name: MultilingualText
  description: MultilingualText
  short_description: MultilingualText
  category: string
  price: number
  price_type: string
  duration: string | null
  image: string | null
  featured: boolean
  created_at: string
  updated_at: string
}

export interface PartnerML {
  id: string
  slug: string
  name: string
  description: MultilingualText
  short_description: MultilingualText
  category: string
  location: MultilingualText
  contact_email: string | null
  contact_phone: string | null
  website: string | null
  logo: string | null
  images: string[]
  discount_percentage: number | null
  featured: boolean
  created_at: string
  updated_at: string
}

// Get localized text from multilingual object
export function getLocalizedText(
  ml: MultilingualText | null | undefined, 
  locale: Locale
): string {
  if (!ml) return ''
  return ml[locale] || ml[DEFAULT_LOCALE] || ml.en || ml.fr || ''
}

// Build multilingual text object from form data
export function buildMultilingualText(
  data: Record<string, string>,
  fieldPrefix: string
): MultilingualText {
  return {
    en: data[`${fieldPrefix}_en`] || '',
    fr: data[`${fieldPrefix}_fr`] || '',
    es: data[`${fieldPrefix}_es`] || '',
    ar: data[`${fieldPrefix}_ar`] || '',
    ma: data[`${fieldPrefix}_ma`] || '',
    zh: data[`${fieldPrefix}_zh`] || '',
  }
}

// Fetch all properties with multilingual content
export async function getPropertiesML(): Promise<PropertyML[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties_ml')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching properties:', error)
    return []
  }
  
  return (data || []).map(row => ({
    id: row.id,
    slug: row.slug,
    name: {
      en: row.name_en || '',
      fr: row.name_fr || '',
      es: row.name_es || '',
      ar: row.name_ar || '',
      ma: row.name_ma || '',
      zh: row.name_zh || '',
    },
    description: {
      en: row.description_en || '',
      fr: row.description_fr || '',
      es: row.description_es || '',
      ar: row.description_ar || '',
      ma: row.description_ma || '',
      zh: row.description_zh || '',
    },
    short_description: {
      en: row.short_description_en || '',
      fr: row.short_description_fr || '',
      es: row.short_description_es || '',
      ar: row.short_description_ar || '',
      ma: row.short_description_ma || '',
      zh: row.short_description_zh || '',
    },
    location: {
      en: row.location_en || '',
      fr: row.location_fr || '',
      es: row.location_es || '',
      ar: row.location_ar || '',
      ma: row.location_ma || '',
      zh: row.location_zh || '',
    },
    neighborhood: {
      en: row.neighborhood_en || '',
      fr: row.neighborhood_fr || '',
      es: row.neighborhood_es || '',
      ar: row.neighborhood_ar || '',
      ma: row.neighborhood_ma || '',
      zh: row.neighborhood_zh || '',
    },
    price_per_night: row.price_per_night,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    max_guests: row.max_guests,
    category: row.category,
    images: row.images || [],
    amenities: row.amenities || [],
    featured: row.featured,
    instant_booking: row.instant_booking,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }))
}

// Fetch single property by slug
export async function getPropertyBySlugML(slug: string): Promise<PropertyML | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties_ml')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error || !data) {
    return null
  }
  
  return {
    id: data.id,
    slug: data.slug,
    name: {
      en: data.name_en || '',
      fr: data.name_fr || '',
      es: data.name_es || '',
      ar: data.name_ar || '',
      ma: data.name_ma || '',
      zh: data.name_zh || '',
    },
    description: {
      en: data.description_en || '',
      fr: data.description_fr || '',
      es: data.description_es || '',
      ar: data.description_ar || '',
      ma: data.description_ma || '',
      zh: data.description_zh || '',
    },
    short_description: {
      en: data.short_description_en || '',
      fr: data.short_description_fr || '',
      es: data.short_description_es || '',
      ar: data.short_description_ar || '',
      ma: data.short_description_ma || '',
      zh: data.short_description_zh || '',
    },
    location: {
      en: data.location_en || '',
      fr: data.location_fr || '',
      es: data.location_es || '',
      ar: data.location_ar || '',
      ma: data.location_ma || '',
      zh: data.location_zh || '',
    },
    neighborhood: {
      en: data.neighborhood_en || '',
      fr: data.neighborhood_fr || '',
      es: data.neighborhood_es || '',
      ar: data.neighborhood_ar || '',
      ma: data.neighborhood_ma || '',
      zh: data.neighborhood_zh || '',
    },
    price_per_night: data.price_per_night,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    max_guests: data.max_guests,
    category: data.category,
    images: data.images || [],
    amenities: data.amenities || [],
    featured: data.featured,
    instant_booking: data.instant_booking,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

// Save property with multilingual content
export async function savePropertyML(property: Partial<PropertyML> & { id?: string }) {
  const supabase = await createClient()
  
  const dbData = {
    slug: property.slug,
    name_en: property.name?.en,
    name_fr: property.name?.fr,
    name_es: property.name?.es,
    name_ar: property.name?.ar,
    name_ma: property.name?.ma,
    name_zh: property.name?.zh,
    description_en: property.description?.en,
    description_fr: property.description?.fr,
    description_es: property.description?.es,
    description_ar: property.description?.ar,
    description_ma: property.description?.ma,
    description_zh: property.description?.zh,
    short_description_en: property.short_description?.en,
    short_description_fr: property.short_description?.fr,
    short_description_es: property.short_description?.es,
    short_description_ar: property.short_description?.ar,
    short_description_ma: property.short_description?.ma,
    short_description_zh: property.short_description?.zh,
    location_en: property.location?.en,
    location_fr: property.location?.fr,
    location_es: property.location?.es,
    location_ar: property.location?.ar,
    location_ma: property.location?.ma,
    location_zh: property.location?.zh,
    neighborhood_en: property.neighborhood?.en,
    neighborhood_fr: property.neighborhood?.fr,
    neighborhood_es: property.neighborhood?.es,
    neighborhood_ar: property.neighborhood?.ar,
    neighborhood_ma: property.neighborhood?.ma,
    neighborhood_zh: property.neighborhood?.zh,
    price_per_night: property.price_per_night,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    max_guests: property.max_guests,
    category: property.category,
    images: property.images,
    amenities: property.amenities,
    featured: property.featured,
    instant_booking: property.instant_booking,
  }
  
  if (property.id) {
    const { error } = await supabase
      .from('properties_ml')
      .update(dbData)
      .eq('id', property.id)
    
    if (error) throw error
    return property.id
  } else {
    const { data, error } = await supabase
      .from('properties_ml')
      .insert(dbData)
      .select('id')
      .single()
    
    if (error) throw error
    return data.id
  }
}

// Fetch all services with multilingual content
export async function getServicesML(): Promise<ServiceML[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services_ml')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching services:', error)
    return []
  }
  
  return (data || []).map(row => ({
    id: row.id,
    slug: row.slug,
    name: {
      en: row.name_en || '',
      fr: row.name_fr || '',
      es: row.name_es || '',
      ar: row.name_ar || '',
      ma: row.name_ma || '',
      zh: row.name_zh || '',
    },
    description: {
      en: row.description_en || '',
      fr: row.description_fr || '',
      es: row.description_es || '',
      ar: row.description_ar || '',
      ma: row.description_ma || '',
      zh: row.description_zh || '',
    },
    short_description: {
      en: row.short_description_en || '',
      fr: row.short_description_fr || '',
      es: row.short_description_es || '',
      ar: row.short_description_ar || '',
      ma: row.short_description_ma || '',
      zh: row.short_description_zh || '',
    },
    category: row.category,
    price: row.price,
    price_type: row.price_type,
    duration: row.duration,
    image: row.image,
    featured: row.featured,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }))
}

// Fetch all partners with multilingual content  
export async function getPartnersML(): Promise<PartnerML[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('partners_ml')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching partners:', error)
    return []
  }
  
  return (data || []).map(row => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: {
      en: row.description_en || '',
      fr: row.description_fr || '',
      es: row.description_es || '',
      ar: row.description_ar || '',
      ma: row.description_ma || '',
      zh: row.description_zh || '',
    },
    short_description: {
      en: row.short_description_en || '',
      fr: row.short_description_fr || '',
      es: row.short_description_es || '',
      ar: row.short_description_ar || '',
      ma: row.short_description_ma || '',
      zh: row.short_description_zh || '',
    },
    category: row.category,
    location: {
      en: row.location_en || '',
      fr: row.location_fr || '',
      es: row.location_es || '',
      ar: row.location_ar || '',
      ma: row.location_ma || '',
      zh: row.location_zh || '',
    },
    contact_email: row.contact_email,
    contact_phone: row.contact_phone,
    website: row.website,
    logo: row.logo,
    images: row.images || [],
    discount_percentage: row.discount_percentage,
    featured: row.featured,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }))
}
