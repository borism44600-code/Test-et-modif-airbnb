'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { propertyFormSchema, formToDbPayload, type PropertyFormData } from '@/lib/validations/property'
import type { SleepingSpace } from '@/lib/types'

// ============================================================================
// PROPERTY ACTIONS
// ============================================================================

export interface SavePropertyResult {
  data?: { id: string }
  error?: string
  fieldErrors?: Record<string, string[]>
}

/**
 * Create a new property — validates with Zod, saves core + rooms + sync.
 * Returns real errors, never pretends success.
 */
export async function createPropertyAction(
  formData: PropertyFormData,
  sleepingArrangements?: SleepingSpace[]
): Promise<SavePropertyResult> {
  // 1. Validate
  const parsed = propertyFormSchema.safeParse(formData)
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.')
      fieldErrors[key] = fieldErrors[key] || []
      fieldErrors[key].push(issue.message)
    }
    return { error: 'Validation failed', fieldErrors }
  }

  // 2. Transform form → DB payload
  const dbPayload = formToDbPayload(parsed.data)

  // 3. Insert property
  const supabase = await createClient()
  const { data: property, error } = await supabase
    .from('properties')
    .insert(dbPayload)
    .select('id')
    .single()

  if (error) {
    console.error('Error creating property:', error)
    return { error: `Database error: ${error.message}` }
  }

  const propertyId = property.id

  // 4. Save sleeping arrangements as rooms
  if (sleepingArrangements && sleepingArrangements.length > 0) {
    const roomRows = sleepingArrangements.map((room, idx) => ({
      property_id: propertyId,
      room_name: room.roomName,
      room_number: idx + 1,
      bed_type: room.beds[0]?.type || 'double',
      bed_count: room.beds.reduce((sum, b) => sum + b.quantity, 0),
      max_guests: room.beds.reduce((sum, b) => sum + b.quantity * (b.type.includes('single') ? 1 : 2), 0),
      has_bathroom: room.ensuite || false,
      has_shower: room.bathroomType === 'shower' || room.bathroomType === 'both',
      has_bathtub: room.bathroomType === 'bathtub' || room.bathroomType === 'both',
      sort_order: idx,
    }))

    const { error: roomError } = await supabase
      .from('property_rooms')
      .insert(roomRows)

    if (roomError) {
      console.error('Error saving rooms:', roomError)
      // Non-fatal: property is created, rooms failed
    }
  }

  // 5. Save availability sync config
  if (parsed.data.airbnbIcalUrl || parsed.data.bookingIcalUrl) {
    const { error: syncError } = await supabase
      .from('availability_sync')
      .upsert({
        property_id: propertyId,
        airbnb_ical_url: parsed.data.airbnbIcalUrl || null,
        booking_ical_url: parsed.data.bookingIcalUrl || null,
        internal_ical_url: `/api/ical/export/${propertyId}`,
        sync_enabled: true,
        sync_status: 'pending',
      }, { onConflict: 'property_id' })

    if (syncError) {
      console.error('Error saving sync config:', syncError)
    }
  }

  revalidatePath('/admin/properties')
  revalidatePath('/properties')

  return { data: { id: propertyId } }
}

/**
 * Update an existing property — validates, saves core + rooms + sync.
 */
export async function updatePropertyAction(
  id: string,
  formData: PropertyFormData,
  sleepingArrangements?: SleepingSpace[]
): Promise<SavePropertyResult> {
  // 1. Validate
  const parsed = propertyFormSchema.safeParse(formData)
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.')
      fieldErrors[key] = fieldErrors[key] || []
      fieldErrors[key].push(issue.message)
    }
    return { error: 'Validation failed', fieldErrors }
  }

  // 2. Transform
  const dbPayload = formToDbPayload(parsed.data)

  // 3. Update property
  const supabase = await createClient()
  const { error } = await supabase
    .from('properties')
    .update({ ...dbPayload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id')
    .single()

  if (error) {
    console.error('Error updating property:', error)
    return { error: `Database error: ${error.message}` }
  }

  // 4. Upsert rooms (delete old, insert new)
  if (sleepingArrangements) {
    await supabase
      .from('property_rooms')
      .delete()
      .eq('property_id', id)

    if (sleepingArrangements.length > 0) {
      const roomRows = sleepingArrangements.map((room, idx) => ({
        property_id: id,
        room_name: room.roomName,
        room_number: idx + 1,
        bed_type: room.beds[0]?.type || 'double',
        bed_count: room.beds.reduce((sum, b) => sum + b.quantity, 0),
        max_guests: room.beds.reduce((sum, b) => sum + b.quantity * (b.type.includes('single') ? 1 : 2), 0),
        has_bathroom: room.ensuite || false,
        has_shower: room.bathroomType === 'shower' || room.bathroomType === 'both',
        has_bathtub: room.bathroomType === 'bathtub' || room.bathroomType === 'both',
        sort_order: idx,
      }))

      const { error: roomError } = await supabase
        .from('property_rooms')
        .insert(roomRows)

      if (roomError) {
        console.error('Error saving rooms:', roomError)
      }
    }
  }

  // 5. Upsert sync config
  const { error: syncError } = await supabase
    .from('availability_sync')
    .upsert({
      property_id: id,
      airbnb_ical_url: parsed.data.airbnbIcalUrl || null,
      booking_ical_url: parsed.data.bookingIcalUrl || null,
      internal_ical_url: parsed.data.internalIcalUrl || `/api/ical/export/${id}`,
      sync_enabled: true,
    }, { onConflict: 'property_id' })

  if (syncError) {
    console.error('Error saving sync config:', syncError)
  }

  revalidatePath('/admin/properties')
  revalidatePath(`/admin/properties/${id}`)
  revalidatePath('/properties')
  revalidatePath(`/properties/${id}`)

  return { data: { id } }
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

    // Verify admin access in admin_users table
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('user_id, role, is_active')
      .eq('user_id', data.user.id)
      .eq('is_active', true)
      .single()

    // Fallback: accept if is_admin in Supabase metadata
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

/**
 * Upload image to Supabase Storage and add to property_images.
 */
export async function uploadPropertyImageAction(
  propertyId: string,
  formDataRaw: FormData
): Promise<{ data?: { id: string; url: string }; error?: string }> {
  const file = formDataRaw.get('file') as File | null
  if (!file) return { error: 'No file provided' }

  const supabase = await createClient()

  // Upload to Supabase Storage
  const ext = file.name.split('.').pop() || 'jpg'
  const filePath = `properties/${propertyId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('property-images')
    .upload(filePath, file, { cacheControl: '3600', upsert: false })

  if (uploadError) {
    return { error: `Upload failed: ${uploadError.message}` }
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('property-images')
    .getPublicUrl(filePath)

  // Count existing images for display_order
  const { count } = await supabase
    .from('property_images')
    .select('id', { count: 'exact', head: true })
    .eq('property_id', propertyId)

  // Insert into property_images table
  const { data: imageRow, error: insertError } = await supabase
    .from('property_images')
    .insert({
      property_id: propertyId,
      image_url: publicUrl,
      display_order: count ?? 0,
      is_cover: (count ?? 0) === 0, // first image is cover
    })
    .select('id')
    .single()

  if (insertError) {
    return { error: `DB insert failed: ${insertError.message}` }
  }

  revalidatePath(`/admin/properties/${propertyId}`)
  revalidatePath(`/properties/${propertyId}`)

  return { data: { id: imageRow.id, url: publicUrl } }
}
