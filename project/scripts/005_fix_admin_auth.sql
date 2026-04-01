-- ============================================================================
-- SCRIPT 005 — FIX ADMIN AUTH
-- Aligne la table admin_users avec ce que le code attend.
-- Le script 003 crée admin_users avec "id" comme PK.
-- Le code (lib/services/auth.ts, app/admin/actions.ts) cherche "user_id".
-- Solution : ajouter la colonne user_id, populer depuis id, indexer.
-- Idempotent — peut être rejoué sans risque.
-- ============================================================================

DO $$ BEGIN

  -- Ajouter user_id si absent (les nouvelles lignes utilisent user_id)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.admin_users
      ADD COLUMN user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;
    -- Backfill : pour les lignes existantes, user_id = id (même UUID)
    UPDATE public.admin_users SET user_id = id WHERE user_id IS NULL;
    ALTER TABLE public.admin_users ALTER COLUMN user_id SET NOT NULL;
  END IF;

  -- Ajouter name si absent
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'name'
  ) THEN
    ALTER TABLE public.admin_users ADD COLUMN name TEXT;
  END IF;

  -- S'assurer que role a la contrainte check
  -- (pas de ALTER CONSTRAINT simple en Postgres, on ajoute seulement si la colonne role est déjà là)

END $$;

-- Index sur user_id pour les lookups rapides
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);

-- ============================================================================
-- COMMENT DE RÉFÉRENCE : structure cible de admin_users
-- ============================================================================
-- admin_users :
--   id          UUID PK REFERENCES auth.users(id)  -- colonne d'origine (script 003)
--   user_id     UUID UNIQUE REFERENCES auth.users(id) -- colonne attendue par le code
--   email       TEXT NOT NULL UNIQUE
--   name        TEXT
--   role        TEXT DEFAULT 'admin' (admin | editor)
--   is_active   BOOLEAN DEFAULT true
--   created_at  TIMESTAMPTZ
--   updated_at  TIMESTAMPTZ
--
-- Pour créer un admin depuis Supabase Dashboard :
--   1. Créer l'utilisateur dans Authentication → Users
--   2. Insérer dans admin_users :
--      INSERT INTO public.admin_users (id, user_id, email, name, role)
--      VALUES (<uuid>, <uuid>, 'email@example.com', 'Nom', 'admin');
--      (id et user_id reçoivent le même UUID = celui de auth.users)
