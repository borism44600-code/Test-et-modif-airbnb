-- ============================================================================
-- SCRIPT 005 — CANONICAL ADMIN_USERS TABLE
-- Single source of truth for admin roles.
-- user_id references auth.users(id) — Supabase Auth is the only identity provider.
-- Replaces any previous admin_users definition.
-- ============================================================================

-- Drop the old table (had inconsistent column names: id vs user_id)
DROP TABLE IF EXISTS public.admin_users CASCADE;

CREATE TABLE public.admin_users (
  user_id    uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text        NOT NULL UNIQUE,
  name       text,
  role       text        NOT NULL DEFAULT 'admin'
                         CHECK (role IN ('admin', 'editor')),
  is_active  boolean     NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Fast lookup during auth check
CREATE INDEX idx_admin_users_active
  ON public.admin_users (user_id) WHERE is_active = true;

-- RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admins can read their own row via anon/authenticated key
CREATE POLICY "Users can read own admin row"
  ON public.admin_users FOR SELECT
  USING (auth.uid() = user_id);

-- Service role (server actions) can manage all rows
CREATE POLICY "Service role full access"
  ON public.admin_users FOR ALL
  USING (true)
  WITH CHECK (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_admin_users_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_admin_users_updated_at();

-- ============================================================================
-- HOW TO CREATE YOUR FIRST ADMIN:
-- 1. Create the user in Supabase Dashboard → Authentication → Users
-- 2. Run:
--    INSERT INTO public.admin_users (user_id, email, name, role)
--    VALUES ('<uuid-from-step-1>', 'your@email.com', 'Your Name', 'admin');
-- 3. Login at /admin/login with those credentials.
-- ============================================================================
