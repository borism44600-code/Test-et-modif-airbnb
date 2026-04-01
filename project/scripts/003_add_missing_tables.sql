-- Add missing tables for complete admin functionality

-- Property Rooms / Bedroom Details
CREATE TABLE IF NOT EXISTS public.property_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  room_name TEXT NOT NULL,
  room_number INTEGER DEFAULT 1,
  bed_type TEXT DEFAULT 'double',
  bed_count INTEGER DEFAULT 1,
  max_guests INTEGER DEFAULT 2,
  has_bathroom BOOLEAN DEFAULT false,
  has_shower BOOLEAN DEFAULT false,
  has_bathtub BOOLEAN DEFAULT false,
  has_toilet BOOLEAN DEFAULT false,
  has_ac BOOLEAN DEFAULT false,
  has_heating BOOLEAN DEFAULT false,
  has_tv BOOLEAN DEFAULT false,
  has_safe BOOLEAN DEFAULT false,
  room_size_sqm INTEGER,
  description_en TEXT,
  description_fr TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.property_rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for property_rooms" ON public.property_rooms FOR SELECT USING (true);
CREATE POLICY "Admin full access for property_rooms" ON public.property_rooms FOR ALL USING (true);

-- Property Images (separate table for better management)
CREATE TABLE IF NOT EXISTS public.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT false,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for property_images" ON public.property_images FOR SELECT USING (true);
CREATE POLICY "Admin full access for property_images" ON public.property_images FOR ALL USING (true);

-- Availability Sync Settings
CREATE TABLE IF NOT EXISTS public.availability_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL UNIQUE REFERENCES public.properties(id) ON DELETE CASCADE,
  airbnb_ical_url TEXT,
  booking_ical_url TEXT,
  internal_ical_url TEXT,
  vrbo_ical_url TEXT,
  sync_enabled BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT DEFAULT 'pending',
  sync_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.availability_sync ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for availability_sync" ON public.availability_sync FOR SELECT USING (true);
CREATE POLICY "Admin full access for availability_sync" ON public.availability_sync FOR ALL USING (true);

-- Admin Users table (for admin authentication)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can view own record" ON public.admin_users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin full access" ON public.admin_users FOR ALL USING (true);

-- Add more fields to properties table if not exists
DO $$ 
BEGIN
  -- Add district field if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'district') THEN
    ALTER TABLE public.properties ADD COLUMN district TEXT;
  END IF;
  
  -- Add sub_district field if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'sub_district') THEN
    ALTER TABLE public.properties ADD COLUMN sub_district TEXT;
  END IF;
  
  -- Add address field if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'address') THEN
    ALTER TABLE public.properties ADD COLUMN address TEXT;
  END IF;
  
  -- Add map_url field if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'map_url') THEN
    ALTER TABLE public.properties ADD COLUMN map_url TEXT;
  END IF;
  
  -- Add parking fields if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'parking_type') THEN
    ALTER TABLE public.properties ADD COLUMN parking_type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'parking_spots') THEN
    ALTER TABLE public.properties ADD COLUMN parking_spots INTEGER DEFAULT 0;
  END IF;
  
  -- Add SEO fields if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'meta_title') THEN
    ALTER TABLE public.properties ADD COLUMN meta_title TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'meta_description') THEN
    ALTER TABLE public.properties ADD COLUMN meta_description TEXT;
  END IF;
  
  -- Add cleaning_fee if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'cleaning_fee') THEN
    ALTER TABLE public.properties ADD COLUMN cleaning_fee NUMERIC DEFAULT 0;
  END IF;
  
  -- Add security_deposit if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'security_deposit') THEN
    ALTER TABLE public.properties ADD COLUMN security_deposit NUMERIC DEFAULT 0;
  END IF;
  
  -- Add minimum_stay if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'minimum_stay') THEN
    ALTER TABLE public.properties ADD COLUMN minimum_stay INTEGER DEFAULT 1;
  END IF;
  
  -- Add bedroom_guest_capacity if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'bedroom_guest_capacity') THEN
    ALTER TABLE public.properties ADD COLUMN bedroom_guest_capacity INTEGER;
  END IF;
  
  -- Add additional_guest_capacity if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'additional_guest_capacity') THEN
    ALTER TABLE public.properties ADD COLUMN additional_guest_capacity INTEGER DEFAULT 0;
  END IF;
  
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_category ON public.properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_is_active ON public.properties(is_active);
CREATE INDEX IF NOT EXISTS idx_property_rooms_property_id ON public.property_rooms(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_partners_category ON public.partners(category);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
