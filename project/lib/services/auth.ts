'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'editor'
  name?: string
}

// Check if current user is authenticated and is an admin
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  // Check if user is in admin_users table
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()
  
  if (adminError || !adminUser) {
    // Check user metadata for admin role as fallback
    const isAdmin = user.user_metadata?.is_admin === true
    if (isAdmin) {
      return {
        id: user.id,
        email: user.email || '',
        role: 'admin',
        name: user.user_metadata?.name
      }
    }
    return null
  }
  
  return {
    id: user.id,
    email: adminUser.email,
    role: adminUser.role,
    name: adminUser.name
  }
}

// Require admin authentication - redirects if not authenticated
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser()
  
  if (!admin) {
    redirect('/admin/login')
  }
  
  return admin
}

// Admin login
export async function adminLogin(email: string, password: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) {
    return { error: error.message }
  }
  
  // Verify this user is an admin
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', data.user.id)
    .eq('is_active', true)
    .single()
  
  if (!adminUser) {
    // Check user metadata
    const isAdmin = data.user.user_metadata?.is_admin === true
    if (!isAdmin) {
      await supabase.auth.signOut()
      return { error: 'You do not have admin access' }
    }
  }
  
  revalidatePath('/admin')
  return { success: true }
}

// Admin logout
export async function adminLogout() {
  const supabase = await createClient()
  
  await supabase.auth.signOut()
  
  revalidatePath('/admin')
  redirect('/admin/login')
}

// Create admin user (for initial setup or inviting new admins)
export async function createAdminUser(
  email: string,
  password: string,
  name: string,
  role: 'admin' | 'editor' = 'editor'
) {
  const supabase = await createClient()
  
  // First check if current user is an admin
  const currentAdmin = await getAdminUser()
  if (!currentAdmin || currentAdmin.role !== 'admin') {
    return { error: 'Only admins can create new admin users' }
  }
  
  // Create the auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      is_admin: true
    }
  })
  
  if (authError) {
    return { error: authError.message }
  }
  
  // Create admin_users record
  const { error: adminError } = await supabase
    .from('admin_users')
    .insert({
      user_id: authData.user.id,
      email,
      name,
      role,
      is_active: true
    })
  
  if (adminError) {
    return { error: adminError.message }
  }
  
  return { success: true, user: authData.user }
}

// Update admin password
export async function updatePassword(newPassword: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })
  
  if (error) {
    return { error: error.message }
  }
  
  return { success: true }
}

// Get session
export async function getSession() {
  const supabase = await createClient()
  
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    return null
  }
  
  return session
}
