'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// ============================================================================
// PROPERTY ACTIONS
// ============================================================================

export async function createPropertyAction(data: {
  title: string
  slug: string
  type: 'riad' | 'villa' | 'apartment' | 'house'
  description_short?: string
  description_long?: string
  city?: string
  district?: string
  address?: string
  map_location?: string
  price_per_night: number
  cleaning_fee?: number
  service_fee?: number
  num_bedrooms?: number
  num_bathrooms?: number
  bedroom_guest_capacity?: number
  additional_guest_capacity?: number
  total_guest_capacity?: number
  amenities?: string[]
  parking_type?: string
  parking_spots?: number
  parking_notes?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string[]
  status?: string
  featured?: boolean
  airbnb_ical_url?: string
  booking_ical_url?: string
  internal_ical_url?: string
}) {
  const supabase = await createClient()
  
  const status = data.status || 'draft'
  const { data: property, error } = await supabase
    .from('properties')
    .insert({
      ...data,
      status,
      is_active: status === 'published',
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating property:', error)
    return { error: error.message }
  }
  
  revalidatePath('/admin/properties')
  revalidatePath('/properties')
  
  return { data: property }
}

export async function updatePropertyAction(id: string, data: Record<string, unknown>) {
  const supabase = await createClient()
  
  const updatePayload: Record<string, unknown> = { ...data, updated_at: new Date().toISOString() }
  if (data.status !== undefined) {
    updatePayload.is_active = data.status === 'published'
  }

  const { data: property, error } = await supabase
    .from('properties')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating property:', error)
    return { error: error.message }
  }
  
  revalidatePath('/admin/properties')
  revalidatePath(`/admin/properties/${id}`)
  revalidatePath('/properties')
  revalidatePath(`/properties/${id}`)
  
  return { data: property }
}

export async function deletePropertyAction(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting property:', error)
    return { error: error.message }
  }
  
  revalidatePath('/admin/properties')
  revalidatePath('/properties')
  
  return { success: true }
}

// ============================================================================
// PARTNER ACTIONS
// ============================================================================

export async function createPartnerAction(data: {
  name: string
  category: string
  description_short?: string
  description_long?: string
  area?: string
  website?: string
  booking_url?: string
  phone?: string
  email?: string
  image_url?: string
  status?: string
  featured?: boolean
}) {
  const supabase = await createClient()
  
  const { data: partner, error } = await supabase
    .from('partners')
    .insert({
      ...data,
      status: data.status || 'draft'
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating partner:', error)
    return { error: error.message }
  }
  
  revalidatePath('/admin/partners')
  revalidatePath('/partners')
  
  return { data: partner }
}

export async function updatePartnerAction(id: string, data: Record<string, unknown>) {
  const supabase = await createClient()
  
  const { data: partner, error } = await supabase
    .from('partners')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating partner:', error)
    return { error: error.message }
  }
  
  revalidatePath('/admin/partners')
  revalidatePath('/partners')
  
  return { data: partner }
}

export async function deletePartnerAction(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('partners')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting partner:', error)
    return { error: error.message }
  }
  
  revalidatePath('/admin/partners')
  revalidatePath('/partners')
  
  return { success: true }
}

// ============================================================================
// AUTH ACTIONS
// ============================================================================

export async function adminLoginAction(email: string, password: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return { error: 'Identifiants invalides' }
    }

    // Vérifier que l'utilisateur est bien dans admin_users
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id, role, is_active')
      .eq('user_id', data.user.id)
      .eq('is_active', true)
      .single()

    // Fallback : accepter si is_admin est dans les métadonnées Supabase
    const isAdminMeta = data.user.user_metadata?.is_admin === true

    if (!adminUser && !isAdminMeta) {
      await supabase.auth.signOut()
      return { error: 'Accès admin non autorisé' }
    }

    return { success: true }
  } catch {
    return { error: 'Identifiants invalides' }
  }
}

export async function adminLogoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return { success: true }
}

// ============================================================================
// IMAGE ACTIONS
// ============================================================================

export async function addPropertyImageAction(propertyId: string, imageData: {
  image_url: string
  alt_text?: string
  display_order?: number
  is_cover?: boolean
}) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('property_images')
    .insert({
      property_id: propertyId,
      ...imageData
    })
    .select()
    .single()
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath(`/admin/properties/${propertyId}`)
  revalidatePath(`/properties/${propertyId}`)
  
  return { data }
}

export async function deletePropertyImageAction(imageId: string, propertyId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('property_images')
    .delete()
    .eq('id', imageId)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath(`/admin/properties/${propertyId}`)
  revalidatePath(`/properties/${propertyId}`)
  
  return { success: true }
}

export async function setCoverImageAction(imageId: string, propertyId: string) {
  const supabase = await createClient()
  
  // Remove cover from all other images
  await supabase
    .from('property_images')
    .update({ is_cover: false })
    .eq('property_id', propertyId)
  
  // Set this image as cover
  const { error } = await supabase
    .from('property_images')
    .update({ is_cover: true })
    .eq('id', imageId)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath(`/admin/properties/${propertyId}`)
  revalidatePath(`/properties/${propertyId}`)
  
  return { success: true }
}
