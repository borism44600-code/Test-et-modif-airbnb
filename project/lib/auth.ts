'use server'

/**
 * Unified auth module — Supabase Auth is the single source of truth.
 * Roles are stored in the `admin_users` table (user_id, role, is_active).
 * NextAuth has been removed entirely.
 */

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export type UserRole = 'admin' | 'editor'

export interface AdminUser {
  id: string
  email: string
  name?: string
  role: UserRole
  is_active: boolean
}

/**
 * Fetch the current admin user from Supabase session + admin_users table.
 * Returns null if not authenticated or not an admin.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null

  // Primary check: admin_users table
  const { data: adminRow } = await supabase
    .from('admin_users')
    .select('user_id, email, name, role, is_active')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  if (adminRow) {
    return {
      id: adminRow.user_id,
      email: adminRow.email,
      name: adminRow.name ?? undefined,
      role: adminRow.role as UserRole,
      is_active: adminRow.is_active,
    }
  }

  // Fallback: user_metadata.is_admin (bootstrap / first setup)
  if (user.user_metadata?.is_admin === true) {
    return {
      id: user.id,
      email: user.email ?? '',
      name: user.user_metadata?.name ?? undefined,
      role: 'admin',
      is_active: true,
    }
  }

  return null
}

/**
 * Guard: redirect to login if current user is not an active admin.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser()
  if (!admin) redirect('/admin/login')
  return admin
}

/**
 * Check if a role satisfies a minimum required role.
 */
export function hasRole(userRole: UserRole | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false
  if (requiredRole === 'editor') return userRole === 'admin' || userRole === 'editor'
  return userRole === requiredRole
}

/**
 * Admin login via Supabase Auth + admin_users verification.
 */
export async function adminLogin(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: 'Identifiants invalides' }

  // Verify admin access
  const { data: adminRow } = await supabase
    .from('admin_users')
    .select('user_id, is_active')
    .eq('user_id', data.user.id)
    .eq('is_active', true)
    .single()

  const isAdminMeta = data.user.user_metadata?.is_admin === true

  if (!adminRow && !isAdminMeta) {
    await supabase.auth.signOut()
    return { error: 'Accès admin non autorisé' }
  }

  revalidatePath('/admin')
  return { success: true }
}

/**
 * Admin logout.
 */
export async function adminLogout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/admin')
  return { success: true }
}
