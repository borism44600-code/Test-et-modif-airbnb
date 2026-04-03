-- ============================================================================
-- SCRIPT 004 — HARMONIZE SCHEMA
-- Adds all columns the code actually writes to.
-- Idempotent: can be re-run safely (IF NOT EXISTS everywhere).
-- ============================================================================

DO $$ BEGIN

  -- -----------------------------------------------------------------------
  -- PROPERTIES — columns written by the admin form (camelCase → snake_case)
  -- -----------------------------------------------------------------------

  -- title (code sends "title", original table had "name_en")
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='title') THEN
    ALTER TABLE public.properties ADD COLUMN title TEXT;
    UPDATE public.properties SET title = name_en WHERE title IS NULL AND name_en IS NOT NULL;
  END IF;

  -- type ('riad'|'villa'|'apartment'|'house') — table had "category"
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='type') THEN
    ALTER TABLE public.properties ADD COLUMN type TEXT DEFAULT 'riad';
    UPDATE public.properties SET type = category WHERE type IS NULL AND category IS NOT NULL;
  END IF;

  -- status ('draft'|'published'|'archived')
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='status') THEN
    ALTER TABLE public.properties ADD COLUMN status TEXT DEFAULT 'draft';
    UPDATE public.properties SET status = CASE WHEN is_active THEN 'published' ELSE 'draft' END
      WHERE status IS NULL;
  END IF;

  -- subtitle
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='subtitle') THEN
    ALTER TABLE public.properties ADD COLUMN subtitle TEXT;
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

  -- city
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='city') THEN
    ALTER TABLE public.properties ADD COLUMN city TEXT DEFAULT 'Marrakech';
  END IF;

  -- num_bedrooms
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='num_bedrooms') THEN
    ALTER TABLE public.properties ADD COLUMN num_bedrooms INTEGER DEFAULT 1;
    UPDATE public.properties SET num_bedrooms = bedrooms WHERE num_bedrooms IS NULL;
  END IF;

  -- num_bathrooms
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

  -- map_location
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='map_location') THEN
    ALTER TABLE public.properties ADD COLUMN map_location TEXT;
    UPDATE public.properties SET map_location = map_url WHERE map_location IS NULL AND map_url IS NOT NULL;
  END IF;

  -- seo_title
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

  -- nearby_info
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='nearby_info') THEN
    ALTER TABLE public.properties ADD COLUMN nearby_info TEXT;
  END IF;

  -- currency
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='currency') THEN
    ALTER TABLE public.properties ADD COLUMN currency TEXT DEFAULT 'EUR';
  END IF;

  -- price_display_note
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='price_display_note') THEN
    ALTER TABLE public.properties ADD COLUMN price_display_note TEXT;
  END IF;

  -- parking_notes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='properties' AND column_name='parking_notes') THEN
    ALTER TABLE public.properties ADD COLUMN parking_notes TEXT;
  END IF;

  -- iCal URLs on properties (also in availability_sync, but form writes both)
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

  -- -----------------------------------------------------------------------
  -- PARTNERS — status, featured, flat description columns
  -- -----------------------------------------------------------------------
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
-- RLS POLICIES — ensure admin can write
-- ============================================================================

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='properties' AND policyname='Admin write access for properties'
  ) THEN
    CREATE POLICY "Admin write access for properties" ON public.properties
      FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties(featured) WHERE featured = true;
