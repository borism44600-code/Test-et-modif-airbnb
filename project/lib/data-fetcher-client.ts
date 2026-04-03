/**
 * Client-side data fetching utilities — Supabase only, no mock fallback.
 */

import { createClient } from '@/lib/supabase/client'
import { adaptPropertiesToUi, adaptPropertyToUi, type DbProperty, type UiProperty } from '@/lib/adapters/property-adapter'

export async function fetchPublishedPropertiesClient(): Promise<UiProperty[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (id, image_url, alt_text, display_order, is_cover),
        property_rooms (id, room_name, room_number, bed_type, bed_count, max_guests, has_bathroom, has_shower, has_bathtub)
      `)
      .or('status.eq.published,is_active.eq.true')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) return []
    return adaptPropertiesToUi(data as DbProperty[])
  } catch {
    return []
  }
}

export async function fetchPropertyByIdOrSlugClient(idOrSlug: string): Promise<UiProperty | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (id, image_url, alt_text, display_order, is_cover),
        property_rooms (id, room_name, room_number, bed_type, bed_count, max_guests, has_bathroom, has_shower, has_bathtub)
      `)
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .single()

    if (error || !data) return null
    return adaptPropertyToUi(data as DbProperty)
  } catch {
    return null
  }
}

export async function fetchPublishedPartnersClient() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) return []
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
  } catch {
    return []
  }
}

export async function fetchServicesClient() {
  try {
    const supabase = createClient()
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
  } catch {
    return []
  }
}

export async function fetchAddonsClient() {
  try {
    const supabase = createClient()
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

export const getPublicPropertiesClient = fetchPublishedPropertiesClient
export const getPropertyBySlugClient = fetchPropertyByIdOrSlugClient
