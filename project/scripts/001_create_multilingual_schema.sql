-- Multilingual Content Schema for Marrakech Riads Rent
-- This schema stores all translatable content with support for 6 languages

-- Table for site-wide content (headers, footers, static pages)
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  section TEXT NOT NULL,
  content_en TEXT,
  content_fr TEXT,
  content_es TEXT,
  content_ar TEXT,
  content_ma TEXT,
  content_zh TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for properties with multilingual support
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT,
  name_fr TEXT,
  name_es TEXT,
  name_ar TEXT,
  name_ma TEXT,
  name_zh TEXT,
  description_en TEXT,
  description_fr TEXT,
  description_es TEXT,
  description_ar TEXT,
  description_ma TEXT,
  description_zh TEXT,
  short_description_en TEXT,
  short_description_fr TEXT,
  short_description_es TEXT,
  short_description_ar TEXT,
  short_description_ma TEXT,
  short_description_zh TEXT,
  location TEXT,
  category TEXT NOT NULL DEFAULT 'riad',
  price_per_night DECIMAL(10,2),
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  max_guests INTEGER DEFAULT 2,
  size_sqm INTEGER,
  features JSONB DEFAULT '[]',
  amenities JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  cover_image TEXT,
  featured BOOLEAN DEFAULT FALSE,
  instant_booking BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for services with multilingual support
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  name_en TEXT,
  name_fr TEXT,
  name_es TEXT,
  name_ar TEXT,
  name_ma TEXT,
  name_zh TEXT,
  description_en TEXT,
  description_fr TEXT,
  description_es TEXT,
  description_ar TEXT,
  description_ma TEXT,
  description_zh TEXT,
  price DECIMAL(10,2),
  price_unit TEXT DEFAULT 'per_person',
  image TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for partners with multilingual support
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description_en TEXT,
  description_fr TEXT,
  description_es TEXT,
  description_ar TEXT,
  description_ma TEXT,
  description_zh TEXT,
  location TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  discount TEXT,
  image TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for excursions with multilingual support
CREATE TABLE IF NOT EXISTS excursions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT,
  name_fr TEXT,
  name_es TEXT,
  name_ar TEXT,
  name_ma TEXT,
  name_zh TEXT,
  description_en TEXT,
  description_fr TEXT,
  description_es TEXT,
  description_ar TEXT,
  description_ma TEXT,
  description_zh TEXT,
  duration TEXT,
  price DECIMAL(10,2),
  price_unit TEXT DEFAULT 'per_person',
  includes JSONB DEFAULT '[]',
  image TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for FAQ with multilingual support
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL DEFAULT 'general',
  question_en TEXT,
  question_fr TEXT,
  question_es TEXT,
  question_ar TEXT,
  question_ma TEXT,
  question_zh TEXT,
  answer_en TEXT,
  answer_fr TEXT,
  answer_es TEXT,
  answer_ar TEXT,
  answer_ma TEXT,
  answer_zh TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for testimonials with multilingual support
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name TEXT NOT NULL,
  guest_country TEXT,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  rating INTEGER DEFAULT 5,
  content_en TEXT,
  content_fr TEXT,
  content_es TEXT,
  content_ar TEXT,
  content_ma TEXT,
  content_zh TEXT,
  date DATE DEFAULT CURRENT_DATE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE excursions ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public read access for all content tables (visitors can read)
CREATE POLICY "Public read access" ON site_content FOR SELECT USING (true);
CREATE POLICY "Public read access" ON properties FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON partners FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON excursions FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON testimonials FOR SELECT USING (is_active = true);

-- Admin full access (using service role or authenticated admin)
CREATE POLICY "Admin full access" ON site_content FOR ALL USING (true);
CREATE POLICY "Admin full access" ON properties FOR ALL USING (true);
CREATE POLICY "Admin full access" ON services FOR ALL USING (true);
CREATE POLICY "Admin full access" ON partners FOR ALL USING (true);
CREATE POLICY "Admin full access" ON excursions FOR ALL USING (true);
CREATE POLICY "Admin full access" ON faqs FOR ALL USING (true);
CREATE POLICY "Admin full access" ON testimonials FOR ALL USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_excursions_updated_at BEFORE UPDATE ON excursions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
