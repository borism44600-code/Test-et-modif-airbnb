'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface ServiceFormData {
  name: string
  category: string
  description?: string
  price?: number
  price_type?: 'fixed' | 'per_person' | 'per_day' | 'per_night'
  property_id?: string // null for global services
  is_active: boolean
  display_order?: number
}

// Get all services (global and property-specific)
export async function getServices(propertyId?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('services')
    .select('*')
    .order('category', { ascending: true })
    .order('display_order', { ascending: true })
  
  if (propertyId) {
    // Get global services + property-specific
    query = query.or(`property_id.is.null,property_id.eq.${propertyId}`)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching services:', error)
    throw new Error('Failed to fetch services')
  }
  
  return data
}

// Get global services only
export async function getGlobalServices() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .is('property_id', null)
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('display_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching global services:', error)
    return []
  }
  
  return data
}

// Get single service by ID
export async function getServiceById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching service:', error)
    throw new Error('Failed to fetch service')
  }
  
  return data
}

// Create new service
export async function createService(formData: ServiceFormData) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('services')
    .insert({
      name: formData.name,
      category: formData.category,
      description: formData.description,
      price: formData.price,
      price_type: formData.price_type || 'fixed',
      property_id: formData.property_id || null,
      is_active: formData.is_active,
      display_order: formData.display_order || 0
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating service:', error)
    throw new Error('Failed to create service')
  }
  
  revalidatePath('/admin/services')
  if (formData.property_id) {
    revalidatePath(`/admin/properties/${formData.property_id}`)
  }
  
  return data
}

// Update service
export async function updateService(id: string, formData: Partial<ServiceFormData>) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('services')
    .update({
      ...formData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating service:', error)
    throw new Error('Failed to update service')
  }
  
  revalidatePath('/admin/services')
  if (formData.property_id) {
    revalidatePath(`/admin/properties/${formData.property_id}`)
  }
  
  return data
}

// Delete service
export async function deleteService(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting service:', error)
    throw new Error('Failed to delete service')
  }
  
  revalidatePath('/admin/services')
  
  return true
}

// Get services grouped by category
export async function getServicesByCategory() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .is('property_id', null)
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('display_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching services by category:', error)
    return {}
  }
  
  const grouped = data.reduce((acc, service) => {
    const cat = service.category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(service)
    return acc
  }, {} as Record<string, typeof data>)
  
  return grouped
}
