/**
 * Data fetching utilities for public pages (SERVER-ONLY)
 * Fetches from Supabase — NO mock data fallback in production.
 * Returns empty arrays when DB is unavailable or empty.
 */

import { createClient } from '@/lib/supabase/server'
import { adaptPropertiesToUi, adaptPropertyToUi, type DbProperty, type UiProperty } from '@/lib/adapters/property-adapter'

/**
 * Fetch all published properties for public pages
 */
export async function fetchPublishedProperties(): Promise<UiProperty[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (
          id,
          image_url,
          alt_text,
          display_order,
          is_cover
        ),
        property_rooms (
          id,
          room_name,
          room_number,
          bed_type,
          bed_count,
          max_guests,
          has_bathroom,
          has_shower,
          has_bathtub
        )
      `)
      .or('status.eq.published,is_active.eq.true')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching properties:', error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    return adaptPropertiesToUi(data as DbProperty[])
  } catch (error) {
    console.error('Error in fetchPublishedProperties:', error)
    return []
  }
}

/**
 * Fetch featured properties only
 */
export async function fetchFeaturedProperties(): Promise<UiProperty[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (id, image_url, alt_text, display_order, is_cover),
        property_rooms (id, room_name, room_number, bed_type, bed_count, max_guests, has_bathroom, has_shower, has_bathtub)
      `)
      .eq('featured', true)
      .or('status.eq.published,is_active.eq.true')
      .order('created_at', { ascending: false })
      .limit(6)

    if (error || !data) return []
    return adaptPropertiesToUi(data as DbProperty[])
  } catch {
    return []
  }
}

/**
 * Fetch a single property by ID or slug
 */
export async function fetchPropertyByIdOrSlug(idOrSlug: string): Promise<UiProperty | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (
          id,
          image_url,
          alt_text,
          display_order,
          is_cover
        ),
        property_rooms (
          id,
          room_name,
          room_number,
          bed_type,
          bed_count,
          max_guests,
          has_bathroom,
          has_shower,
          has_bathtub
        )
      `)
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .single()

    if (error || !data) {
      return null
    }

    return adaptPropertyToUi(data as DbProperty)
  } catch (error) {
    console.error('Error in fetchPropertyByIdOrSlug:', error)
    return null
  }
}

/**
 * Fetch all published partners
 */
export async function fetchPublishedPartners() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    if (error || !data) return []

    return data.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description_short || p.description_en || p.description_fr || '',
      image: p.image_url || p.image || '/placeholder-partner.jpg',
      website: p.website,
      discountCode: p.discount,
      bookingProcedure: undefined
    }))
  } catch (error) {
    console.error('Error in fetchPublishedPartners:', error)
    return []
  }
}

/**
 * Fetch services
 */
export async function fetchServices() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true })

    if (error || !data) return []

    return data.map(s => ({
      id: s.id,
      name: s.name_en || s.name_fr || '',
      category: s.category,
      description: s.description_en || s.description_fr || '',
      image: s.image || '/placeholder-service.jpg',
      price: s.price,
      priceType: s.price_unit
    }))
  } catch (error) {
    console.error('Error in fetchServices:', error)
    return []
  }
}

/**
 * Fetch add-ons / booking extras
 */
export async function fetchAddons() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .in('category', ['breakfast', 'meals', 'transport', 'spa'])
      .order('sort_order', { ascending: true })

    if (error || !data) return []

    return data.map(s => ({
      id: s.id,
      name: s.name_en || s.name_fr || '',
      description: s.description_en || s.description_fr || '',
      pricePerPerson: s.price_unit === 'per_person' ? s.price : undefined,
      priceFlat: s.price_unit === 'flat' ? s.price : undefined,
      image: s.image,
    }))
  } catch {
    return []
  }
}

// Aliases for backward compatibility
export const getPublicProperties = fetchPublishedProperties
export const getPublicPropertyBySlug = fetchPropertyByIdOrSlug
export const getPropertyBySlug = fetchPropertyByIdOrSlug
export const getPublishedPartners = fetchPublishedPartners
