-- ============================================================================
-- SCRIPT 004 — HARMONISATION SCHEMA
-- Aligne les colonnes Supabase avec ce que le code envoie réellement.
-- Idempotent : peut être rejoué sans risque (IF NOT EXISTS partout).
-- ============================================================================

DO $$ BEGIN

  -- -------------------------------------------------------------------------
  -- PROPERTIES — colonnes attendues par actions.ts / new/page.tsx
  -- -------------------------------------------------------------------------

  -- title (le code envoie "title", la table avait "name_en")
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='title') THEN
    ALTER TABLE public.properties ADD COLUMN title TEXT;
    -- Backfill depuis name_en si la colonne existe déjà
    UPDATE public.properties SET title = name_en WHERE title IS NULL AND name_en IS NOT NULL;
  END IF;

  -- type ('riad'|'villa'|'apartment'|'house') — la table avait "category"
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='type') THEN
    ALTER TABLE public.properties ADD COLUMN type TEXT DEFAULT 'riad';
    UPDATE public.properties SET type = category WHERE type IS NULL AND category IS NOT NULL;
  END IF;

  -- status ('draft'|'published'|'archived')
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='status') THEN
    ALTER TABLE public.properties ADD COLUMN status TEXT DEFAULT 'draft';
    -- Backfill depuis is_active
    UPDATE public.properties SET status = CASE WHEN is_active THEN 'published' ELSE 'draft' END
      WHERE status IS NULL;
  END IF;

  -- description_short
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='description_short') THEN
    ALTER TABLE public.properties ADD COLUMN description_short TEXT;
    UPDATE public.properties SET description_short = short_description_en
      WHERE description_short IS NULL AND short_description_en IS NOT NULL;
  END IF;

  -- description_long
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='description_long') THEN
    ALTER TABLE public.properties ADD COLUMN description_long TEXT;
    UPDATE public.properties SET description_long = description_en
      WHERE description_long IS NULL AND description_en IS NOT NULL;
  END IF;

  -- num_bedrooms (le code envoie "num_bedrooms", la table avait "bedrooms")
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='num_bedrooms') THEN
    ALTER TABLE public.properties ADD COLUMN num_bedrooms INTEGER DEFAULT 1;
    UPDATE public.properties SET num_bedrooms = bedrooms WHERE num_bedrooms IS NULL;
  END IF;

  -- num_bathrooms (le code envoie "num_bathrooms", la table avait "bathrooms")
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='num_bathrooms') THEN
    ALTER TABLE public.properties ADD COLUMN num_bathrooms INTEGER DEFAULT 1;
    UPDATE public.properties SET num_bathrooms = bathrooms WHERE num_bathrooms IS NULL;
  END IF;

  -- total_guest_capacity
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='total_guest_capacity') THEN
    ALTER TABLE public.properties ADD COLUMN total_guest_capacity INTEGER DEFAULT 2;
    UPDATE public.properties SET total_guest_capacity = max_guests WHERE total_guest_capacity IS NULL;
  END IF;

  -- service_fee
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='service_fee') THEN
    ALTER TABLE public.properties ADD COLUMN service_fee NUMERIC DEFAULT 0;
  END IF;

  -- map_location (le code envoie "map_location", script 003 avait créé "map_url")
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='map_location') THEN
    ALTER TABLE public.properties ADD COLUMN map_location TEXT;
    UPDATE public.properties SET map_location = map_url WHERE map_location IS NULL AND map_url IS NOT NULL;
  END IF;

  -- seo_title (le code envoie "seo_title", script 003 avait créé "meta_title")
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='seo_title') THEN
    ALTER TABLE public.properties ADD COLUMN seo_title TEXT;
    UPDATE public.properties SET seo_title = meta_title WHERE seo_title IS NULL AND meta_title IS NOT NULL;
  END IF;

  -- seo_description
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='seo_description') THEN
    ALTER TABLE public.properties ADD COLUMN seo_description TEXT;
    UPDATE public.properties SET seo_description = meta_description
      WHERE seo_description IS NULL AND meta_description IS NOT NULL;
  END IF;

  -- seo_keywords (array)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='seo_keywords') THEN
    ALTER TABLE public.properties ADD COLUMN seo_keywords TEXT[] DEFAULT '{}';
  END IF;

  -- airbnb_ical_url / booking_ical_url / internal_ical_url sur properties
  -- (ces URLs sont aussi dans availability_sync, mais le form les envoie direct)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='airbnb_ical_url') THEN
    ALTER TABLE public.properties ADD COLUMN airbnb_ical_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='booking_ical_url') THEN
    ALTER TABLE public.properties ADD COLUMN booking_ical_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='internal_ical_url') THEN
    ALTER TABLE public.properties ADD COLUMN internal_ical_url TEXT;
  END IF;

  -- -------------------------------------------------------------------------
  -- PARTNERS — status manquait (code envoie status, table n'avait que is_active)
  -- -------------------------------------------------------------------------
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='partners' AND column_name='status') THEN
    ALTER TABLE public.partners ADD COLUMN status TEXT DEFAULT 'draft';
    UPDATE public.partners SET status = CASE WHEN is_active THEN 'published' ELSE 'draft' END;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='partners' AND column_name='featured') THEN
    ALTER TABLE public.partners ADD COLUMN featured BOOLEAN DEFAULT FALSE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='partners' AND column_name='description_short') THEN
    ALTER TABLE public.partners ADD COLUMN description_short TEXT;
    UPDATE public.partners SET description_short = description_en
      WHERE description_short IS NULL AND description_en IS NOT NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='partners' AND column_name='description_long') THEN
    ALTER TABLE public.partners ADD COLUMN description_long TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='partners' AND column_name='area') THEN
    ALTER TABLE public.partners ADD COLUMN area TEXT;
    UPDATE public.partners SET area = location WHERE area IS NULL AND location IS NOT NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='partners' AND column_name='booking_url') THEN
    ALTER TABLE public.partners ADD COLUMN booking_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='partners' AND column_name='image_url') THEN
    ALTER TABLE public.partners ADD COLUMN image_url TEXT;
    UPDATE public.partners SET image_url = image WHERE image_url IS NULL AND image IS NOT NULL;
  END IF;

END $$;

-- ============================================================================
-- RLS POLICIES — s'assurer que l'admin peut tout écrire
-- ============================================================================

-- Properties : lecture publique + écriture admin
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='properties' AND policyname='Admin write access for properties'
  ) THEN
    CREATE POLICY "Admin write access for properties" ON public.properties
      FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Bookings : lecture + écriture sans restriction (géré par cookie admin en app)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='bookings' AND policyname='Admin full access for bookings'
  ) THEN
    CREATE POLICY "Admin full access for bookings" ON public.bookings
      FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================================
-- COMMENTAIRE DE RÉFÉRENCE : colonnes actives attendues par le code
-- ============================================================================
-- properties : id, slug, title, type, status, featured, description_short,
--   description_long, city, district, sub_district, address, map_location,
--   price_per_night, cleaning_fee, service_fee, security_deposit,
--   num_bedrooms, num_bathrooms, bedroom_guest_capacity,
--   additional_guest_capacity, total_guest_capacity,
--   amenities (JSONB), features (JSONB), images (JSONB), cover_image,
--   parking_type, parking_spots, parking_notes,
--   airbnb_ical_url, booking_ical_url, internal_ical_url,
--   seo_title, seo_description, seo_keywords,
--   instant_booking, minimum_stay, created_at, updated_at
