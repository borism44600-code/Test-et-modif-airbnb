'use server'

/**
 * Extended auth operations (user management, password updates).
 * Core auth functions (getAdminUser, requireAdmin, etc.) are in @/lib/auth.
 */

import { createClient } from '@/lib/supabase/server'

/**
 * Create a new admin user (admin-only operation).
 */
export async function createAdminUser(
  email: string,
  password: string,
  name: string,
  role: 'admin' | 'editor' = 'editor'
) {
  const { getAdminUser } = await import('@/lib/auth')
  const currentAdmin = await getAdminUser()
  if (!currentAdmin || currentAdmin.role !== 'admin') {
    return { error: 'Only admins can create new admin users' }
  }

  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, is_admin: true },
  })

  if (authError) return { error: authError.message }

  const { error: insertError } = await supabase
    .from('admin_users')
    .insert({
      user_id: authData.user.id,
      email,
      name,
      role,
      is_active: true,
    })

  if (insertError) return { error: insertError.message }

  return { success: true, user: authData.user }
}

/**
 * Update password for the current user.
 */
export async function updatePassword(newPassword: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { error: error.message }
  return { success: true }
}

/**
 * Get current Supabase session.
 */
export async function getSession() {
  const supabase = await createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) return null
  return session
}
