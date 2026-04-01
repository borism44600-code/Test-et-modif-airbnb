'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface PropertyFormData {
  title: string
  slug: string
  type: 'riad' | 'villa' | 'apartment' | 'house'
  description_short?: string
  description_long?: string
  city: string
  district?: string
  address?: string
  map_location?: string
  price_per_night: number
  cleaning_fee?: number
  service_fee?: number
  num_bedrooms: number
  num_bathrooms: number
  bedroom_guest_capacity?: number
  additional_guest_capacity?: number
  total_guest_capacity: number
  amenities?: string[]
  parking_type?: string
  parking_spots?: number
  parking_notes?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string[]
  status: 'draft' | 'published' | 'archived'
  featured?: boolean
  airbnb_ical_url?: string
  booking_ical_url?: string
  internal_ical_url?: string
}

export interface PropertyRoom {
  id?: string
  property_id: string
  room_name: string
  room_number?: number
  bed_type?: string
  num_beds?: number
  has_bathroom?: boolean
  has_shower?: boolean
  has_bathtub?: boolean
  equipment?: string[]
  notes?: string
}

export interface PropertyImage {
  id?: string
  property_id: string
  image_url: string
  alt_text?: string
  caption?: string
  display_order: number
  is_cover: boolean
}

// Get all properties
export async function getProperties() {
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
      )
    `)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching properties:', error)
    throw new Error('Failed to fetch properties')
  }
  
  return data
}

// Get single property by ID
export async function getPropertyById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      property_images (
        id,
        image_url,
        alt_text,
        caption,
        display_order,
        is_cover
      ),
      property_rooms (
        id,
        room_name,
        room_number,
        bed_type,
        num_beds,
        has_bathroom,
        has_shower,
        has_bathtub,
        equipment,
        notes
      ),
      availability_sync (
        id,
        airbnb_ical_url,
        booking_ical_url,
        internal_ical_url,
        last_sync_at,
        sync_status
      )
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching property:', error)
    throw new Error('Failed to fetch property')
  }
  
  return data
}

// Get property by slug (for public pages)
export async function getPropertyBySlug(slug: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      property_images (
        id,
        image_url,
        alt_text,
        caption,
        display_order,
        is_cover
      ),
      property_rooms (
        id,
        room_name,
        room_number,
        bed_type,
        num_beds,
        has_bathroom,
        has_shower,
        has_bathtub,
        equipment,
        notes
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  
  if (error) {
    console.error('Error fetching property by slug:', error)
    return null
  }
  
  return data
}

// Create new property
export async function createProperty(formData: PropertyFormData) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('properties')
    .insert({
      title: formData.title,
      slug: formData.slug,
      type: formData.type,
      description_short: formData.description_short,
      description_long: formData.description_long,
      city: formData.city,
      district: formData.district,
      address: formData.address,
      map_location: formData.map_location,
      price_per_night: formData.price_per_night,
      cleaning_fee: formData.cleaning_fee,
      service_fee: formData.service_fee,
      num_bedrooms: formData.num_bedrooms,
      num_bathrooms: formData.num_bathrooms,
      bedroom_guest_capacity: formData.bedroom_guest_capacity,
      additional_guest_capacity: formData.additional_guest_capacity,
      total_guest_capacity: formData.total_guest_capacity,
      amenities: formData.amenities,
      parking_type: formData.parking_type,
      parking_spots: formData.parking_spots,
      parking_notes: formData.parking_notes,
      seo_title: formData.seo_title,
      seo_description: formData.seo_description,
      seo_keywords: formData.seo_keywords,
      status: formData.status,
      featured: formData.featured || false
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating property:', error)
    throw new Error('Failed to create property')
  }
  
  // Create availability sync record if URLs provided
  if (formData.airbnb_ical_url || formData.booking_ical_url || formData.internal_ical_url) {
    await supabase
      .from('availability_sync')
      .insert({
        property_id: data.id,
        airbnb_ical_url: formData.airbnb_ical_url,
        booking_ical_url: formData.booking_ical_url,
        internal_ical_url: formData.internal_ical_url
      })
  }
  
  revalidatePath('/admin/properties')
  revalidatePath('/properties')
  
  return data
}

// Update property
export async function updateProperty(id: string, formData: Partial<PropertyFormData>) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('properties')
    .update({
      title: formData.title,
      slug: formData.slug,
      type: formData.type,
      description_short: formData.description_short,
      description_long: formData.description_long,
      city: formData.city,
      district: formData.district,
      address: formData.address,
      map_location: formData.map_location,
      price_per_night: formData.price_per_night,
      cleaning_fee: formData.cleaning_fee,
      service_fee: formData.service_fee,
      num_bedrooms: formData.num_bedrooms,
      num_bathrooms: formData.num_bathrooms,
      bedroom_guest_capacity: formData.bedroom_guest_capacity,
      additional_guest_capacity: formData.additional_guest_capacity,
      total_guest_capacity: formData.total_guest_capacity,
      amenities: formData.amenities,
      parking_type: formData.parking_type,
      parking_spots: formData.parking_spots,
      parking_notes: formData.parking_notes,
      seo_title: formData.seo_title,
      seo_description: formData.seo_description,
      seo_keywords: formData.seo_keywords,
      status: formData.status,
      featured: formData.featured,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating property:', error)
    throw new Error('Failed to update property')
  }
  
  // Update or create availability sync
  if (formData.airbnb_ical_url !== undefined || formData.booking_ical_url !== undefined || formData.internal_ical_url !== undefined) {
    const { data: existingSync } = await supabase
      .from('availability_sync')
      .select('id')
      .eq('property_id', id)
      .single()
    
    if (existingSync) {
      await supabase
        .from('availability_sync')
        .update({
          airbnb_ical_url: formData.airbnb_ical_url,
          booking_ical_url: formData.booking_ical_url,
          internal_ical_url: formData.internal_ical_url
        })
        .eq('property_id', id)
    } else {
      await supabase
        .from('availability_sync')
        .insert({
          property_id: id,
          airbnb_ical_url: formData.airbnb_ical_url,
          booking_ical_url: formData.booking_ical_url,
          internal_ical_url: formData.internal_ical_url
        })
    }
  }
  
  revalidatePath('/admin/properties')
  revalidatePath(`/admin/properties/${id}`)
  revalidatePath('/properties')
  revalidatePath(`/properties/${formData.slug}`)
  
  return data
}

// Delete property
export async function deleteProperty(id: string) {
  const supabase = await createClient()
  
  // Delete related records first (cascade should handle this, but being explicit)
  await supabase.from('property_images').delete().eq('property_id', id)
  await supabase.from('property_rooms').delete().eq('property_id', id)
  await supabase.from('availability_sync').delete().eq('property_id', id)
  
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting property:', error)
    throw new Error('Failed to delete property')
  }
  
  revalidatePath('/admin/properties')
  revalidatePath('/properties')
  
  return true
}

// Property Rooms CRUD
export async function addPropertyRoom(room: PropertyRoom) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('property_rooms')
    .insert(room)
    .select()
    .single()
  
  if (error) {
    console.error('Error adding room:', error)
    throw new Error('Failed to add room')
  }
  
  revalidatePath(`/admin/properties/${room.property_id}`)
  return data
}

export async function updatePropertyRoom(id: string, room: Partial<PropertyRoom>) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('property_rooms')
    .update(room)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating room:', error)
    throw new Error('Failed to update room')
  }
  
  return data
}

export async function deletePropertyRoom(id: string, propertyId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('property_rooms')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting room:', error)
    throw new Error('Failed to delete room')
  }
  
  revalidatePath(`/admin/properties/${propertyId}`)
  return true
}

// Property Images CRUD
export async function addPropertyImage(image: PropertyImage) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('property_images')
    .insert(image)
    .select()
    .single()
  
  if (error) {
    console.error('Error adding image:', error)
    throw new Error('Failed to add image')
  }
  
  revalidatePath(`/admin/properties/${image.property_id}`)
  return data
}

export async function updatePropertyImage(id: string, image: Partial<PropertyImage>) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('property_images')
    .update(image)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating image:', error)
    throw new Error('Failed to update image')
  }
  
  return data
}

export async function deletePropertyImage(id: string, propertyId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('property_images')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting image:', error)
    throw new Error('Failed to delete image')
  }
  
  revalidatePath(`/admin/properties/${propertyId}`)
  return true
}

export async function reorderPropertyImages(propertyId: string, imageIds: string[]) {
  const supabase = await createClient()
  
  // Update display_order for each image
  const updates = imageIds.map((id, index) => 
    supabase
      .from('property_images')
      .update({ display_order: index })
      .eq('id', id)
  )
  
  await Promise.all(updates)
  
  revalidatePath(`/admin/properties/${propertyId}`)
  return true
}

export async function setCoverImage(propertyId: string, imageId: string) {
  const supabase = await createClient()
  
  // Reset all images to non-cover
  await supabase
    .from('property_images')
    .update({ is_cover: false })
    .eq('property_id', propertyId)
  
  // Set the selected image as cover
  await supabase
    .from('property_images')
    .update({ is_cover: true })
    .eq('id', imageId)
  
  revalidatePath(`/admin/properties/${propertyId}`)
  return true
}

// Get published properties for public pages
export async function getPublishedProperties(filters?: {
  type?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  minGuests?: number
}) {
  const supabase = await createClient()
  
  let query = supabase
    .from('properties')
    .select(`
      *,
      property_images (
        id,
        image_url,
        alt_text,
        display_order,
        is_cover
      )
    `)
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
  
  if (filters?.type) {
    query = query.eq('type', filters.type)
  }
  if (filters?.city) {
    query = query.eq('city', filters.city)
  }
  if (filters?.minPrice) {
    query = query.gte('price_per_night', filters.minPrice)
  }
  if (filters?.maxPrice) {
    query = query.lte('price_per_night', filters.maxPrice)
  }
  if (filters?.minGuests) {
    query = query.gte('total_guest_capacity', filters.minGuests)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching published properties:', error)
    return []
  }
  
  return data
}
