'use client'

/**
 * AuthProvider — lightweight wrapper around Supabase auth state.
 * Replaces the old NextAuth SessionProvider.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AdminSession {
  user: User | null
  role: string | null
  name: string | null
  isLoading: boolean
}

const AuthContext = createContext<AdminSession>({
  user: null,
  role: null,
  name: null,
  isLoading: true,
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession>({
    user: null,
    role: null,
    name: null,
    isLoading: true,
  })

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Fetch admin role
        const { data: adminRow } = await supabase
          .from('admin_users')
          .select('role, name')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single()

        setSession({
          user,
          role: adminRow?.role ?? (user.user_metadata?.is_admin ? 'admin' : null),
          name: adminRow?.name ?? user.user_metadata?.name ?? null,
          isLoading: false,
        })
      } else {
        setSession({ user: null, role: null, name: null, isLoading: false })
      }
    }

    init()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, supaSession) => {
      if (event === 'SIGNED_OUT' || !supaSession?.user) {
        setSession({ user: null, role: null, name: null, isLoading: false })
        return
      }

      const u = supaSession.user
      const { data: adminRow } = await supabase
        .from('admin_users')
        .select('role, name')
        .eq('user_id', u.id)
        .eq('is_active', true)
        .single()

      setSession({
        user: u,
        role: adminRow?.role ?? (u.user_metadata?.is_admin ? 'admin' : null),
        name: adminRow?.name ?? u.user_metadata?.name ?? null,
        isLoading: false,
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={session}>
      {children}
    </AuthContext.Provider>
  )
}
