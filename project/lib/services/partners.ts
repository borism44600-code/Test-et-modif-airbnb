'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface PartnerFormData {
  name: string
  category: string
  description_short?: string
  description_long?: string
  area?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  booking_url?: string
  image_url?: string
  logo_url?: string
  rating?: number
  price_range?: string
  opening_hours?: Record<string, string>
  tags?: string[]
  featured?: boolean
  status: 'draft' | 'published' | 'archived'
}

// Get all partners
export async function getPartners() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching partners:', error)
    throw new Error('Failed to fetch partners')
  }
  
  return data
}

// Get single partner by ID
export async function getPartnerById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching partner:', error)
    throw new Error('Failed to fetch partner')
  }
  
  return data
}

// Create new partner
export async function createPartner(formData: PartnerFormData) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('partners')
    .insert({
      name: formData.name,
      category: formData.category,
      description_short: formData.description_short,
      description_long: formData.description_long,
      area: formData.area,
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      website: formData.website,
      booking_url: formData.booking_url,
      image_url: formData.image_url,
      logo_url: formData.logo_url,
      rating: formData.rating,
      price_range: formData.price_range,
      opening_hours: formData.opening_hours,
      tags: formData.tags,
      featured: formData.featured || false,
      status: formData.status
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating partner:', error)
    throw new Error('Failed to create partner')
  }
  
  revalidatePath('/admin/partners')
  revalidatePath('/partners')
  revalidatePath('/activities')
  
  return data
}

// Update partner
export async function updatePartner(id: string, formData: Partial<PartnerFormData>) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('partners')
    .update({
      ...formData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating partner:', error)
    throw new Error('Failed to update partner')
  }
  
  revalidatePath('/admin/partners')
  revalidatePath(`/admin/partners/${id}`)
  revalidatePath('/partners')
  revalidatePath('/activities')
  
  return data
}

// Delete partner
export async function deletePartner(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('partners')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting partner:', error)
    throw new Error('Failed to delete partner')
  }
  
  revalidatePath('/admin/partners')
  revalidatePath('/partners')
  revalidatePath('/activities')
  
  return true
}

// Get published partners for public pages
export async function getPublishedPartners(category?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('partners')
    .select('*')
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('name', { ascending: true })
  
  if (category) {
    query = query.eq('category', category)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching published partners:', error)
    return []
  }
  
  return data
}

// Get partners by category for activities page
export async function getPartnersByCategory() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('status', 'published')
    .order('category', { ascending: true })
    .order('featured', { ascending: false })
  
  if (error) {
    console.error('Error fetching partners by category:', error)
    return {}
  }
  
  // Group by category
  const grouped = data.reduce((acc, partner) => {
    const cat = partner.category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(partner)
    return acc
  }, {} as Record<string, typeof data>)
  
  return grouped
}
