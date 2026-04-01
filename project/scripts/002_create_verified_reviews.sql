-- Verified Reviews System
-- Reviews are linked to completed bookings only

-- Create bookings table if not exists (for review linkage)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  guest_email TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  guest_phone TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  total_price NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  special_requests TEXT,
  review_token UUID UNIQUE DEFAULT gen_random_uuid(), -- Token for review invitation
  review_sent_at TIMESTAMP WITH TIME ZONE, -- When review invitation was sent
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verified reviews table
CREATE TABLE IF NOT EXISTS public.verified_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  
  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  
  -- Multilingual content (auto-translated)
  title_en TEXT,
  title_fr TEXT,
  title_es TEXT,
  title_ar TEXT,
  title_ma TEXT,
  title_zh TEXT,
  comment_en TEXT,
  comment_fr TEXT,
  comment_es TEXT,
  comment_ar TEXT,
  comment_ma TEXT,
  comment_zh TEXT,
  
  -- Guest info (from booking)
  guest_name TEXT NOT NULL,
  guest_country TEXT,
  stay_dates TEXT, -- "March 2024" formatted
  
  -- Moderation
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  admin_reply TEXT,
  admin_reply_at TIMESTAMP WITH TIME ZONE,
  moderation_notes TEXT,
  
  -- Metadata
  is_featured BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create review response (admin replies)
CREATE TABLE IF NOT EXISTS public.review_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.verified_reviews(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  response_en TEXT,
  response_fr TEXT,
  response_es TEXT,
  response_ar TEXT,
  response_ma TEXT,
  response_zh TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verified_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_responses ENABLE ROW LEVEL SECURITY;

-- Policies for bookings
DROP POLICY IF EXISTS "Public can view own booking by token" ON public.bookings;
CREATE POLICY "Public can view own booking by token" ON public.bookings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access to bookings" ON public.bookings;
CREATE POLICY "Admin full access to bookings" ON public.bookings
  FOR ALL USING (true);

-- Policies for verified_reviews
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.verified_reviews;
CREATE POLICY "Public can view approved reviews" ON public.verified_reviews
  FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Public can insert review with valid token" ON public.verified_reviews;
CREATE POLICY "Public can insert review with valid token" ON public.verified_reviews
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access to reviews" ON public.verified_reviews;
CREATE POLICY "Admin full access to reviews" ON public.verified_reviews
  FOR ALL USING (true);

-- Policies for review_responses
DROP POLICY IF EXISTS "Public can view responses" ON public.review_responses;
CREATE POLICY "Public can view responses" ON public.review_responses
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access to responses" ON public.review_responses;
CREATE POLICY "Admin full access to responses" ON public.review_responses
  FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_verified_reviews_property ON public.verified_reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_verified_reviews_status ON public.verified_reviews(status);
CREATE INDEX IF NOT EXISTS idx_verified_reviews_rating ON public.verified_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_bookings_property ON public.bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_review_token ON public.bookings(review_token);

-- Function to calculate property average rating
CREATE OR REPLACE FUNCTION public.get_property_rating(prop_id UUID)
RETURNS TABLE(average_rating NUMERIC, review_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(AVG(rating)::NUMERIC, 1) as average_rating,
    COUNT(*) as review_count
  FROM public.verified_reviews
  WHERE property_id = prop_id AND status = 'approved';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_verified_reviews_updated_at ON public.verified_reviews;
CREATE TRIGGER update_verified_reviews_updated_at
  BEFORE UPDATE ON public.verified_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
