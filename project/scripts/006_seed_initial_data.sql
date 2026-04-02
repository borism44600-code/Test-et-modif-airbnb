-- ============================================================================
-- SCRIPT 006 — SEED INITIAL DATA
-- Insère les propriétés de démonstration tirées des mocks (lib/data.ts).
-- Idempotent : utilise INSERT … ON CONFLICT (slug) DO NOTHING.
-- Lancer UNE SEULE FOIS sur une base vide, ou quand les propriétés n'existent pas.
-- ============================================================================

-- -----------------------------------------------------------------------
-- PROPERTIES
-- -----------------------------------------------------------------------

INSERT INTO public.properties (
  slug, title, type, status, is_active, featured,
  description_short, description_long,
  location, district,
  price_per_night, cleaning_fee,
  num_bedrooms, num_bathrooms,
  bedroom_guest_capacity, additional_guest_capacity, total_guest_capacity,
  amenities,
  parking_type,
  images, cover_image,
  -- Colonnes multilingues (compatibilité adapter)
  name_en, short_description_en, description_en, category,
  bedrooms, bathrooms, max_guests
)
VALUES
-- 1. Riad Jardin Secret
(
  'riad-jardin-secret',
  'Riad Jardin Secret',
  'riad', 'published', true, true,
  'An exquisite 5-bedroom riad in the heart of the Medina with stunning mountain views.',
  'Nestled in the heart of the ancient Medina, Riad Jardin Secret is a masterpiece of traditional Moroccan architecture. This stunning property features intricate zellige tilework, hand-carved cedar wood ceilings, and a tranquil central courtyard with a refreshing plunge pool. Each of the five suites has been meticulously restored to showcase authentic craftsmanship while offering modern comforts.',
  'Marrakech', 'Medina of Marrakech',
  450, 80,
  5, 5,
  8, 2, 10,
  '["heatedPlungePool","jacuzzi","hammam","bathtub","fireplace","terrace","rooftop","wifi","airConditioning","breakfastPossible","mealsPossible","airportTransferPossible","mountainView","souks"]',
  'walk-3-min',
  '["/images/properties/riad-1-1.jpg","/images/properties/riad-1-2.jpg","/images/properties/riad-1-3.jpg"]',
  '/images/properties/riad-1-1.jpg',
  'Riad Jardin Secret',
  'An exquisite 5-bedroom riad in the heart of the Medina with stunning mountain views.',
  'Nestled in the heart of the ancient Medina, Riad Jardin Secret is a masterpiece of traditional Moroccan architecture.',
  'riad', 5, 5, 10
),
-- 2. Villa Palmeraie Oasis
(
  'villa-palmeraie-oasis',
  'Villa Palmeraie Oasis',
  'villa', 'published', true, true,
  'A magnificent 6-bedroom villa in the Palmeraie with private pool and tennis court.',
  'Experience the ultimate in luxury living at Villa Palmeraie Oasis. Set within the legendary Palmeraie palm grove, this magnificent villa spans over 2000 square meters of manicured gardens. The property features a heated infinity pool, private tennis court, and extensive outdoor entertainment areas.',
  'Marrakech', 'Palmeraie',
  1200, 150,
  6, 7,
  10, 2, 12,
  '["heatedPool","jacuzzi","hammam","bathtub","fireplace","terrace","wifi","airConditioning","mealsPossible","airportTransferPossible","privateDriverPossible","mountainView"]',
  'private',
  '["/images/properties/villa-1-1.jpg","/images/properties/villa-1-2.jpg","/images/properties/villa-1-3.jpg"]',
  '/images/properties/villa-1-1.jpg',
  'Villa Palmeraie Oasis',
  'A magnificent 6-bedroom villa in the Palmeraie with private pool and tennis court.',
  'Experience the ultimate in luxury living at Villa Palmeraie Oasis.',
  'villa', 6, 7, 12
),
-- 3. Apartment Hivernage Elite
(
  'apartment-hivernage-elite',
  'Apartment Hivernage Elite',
  'apartment', 'published', true, true,
  'A chic 2-bedroom apartment in prestigious Hivernage with designer finishes.',
  'Located in the prestigious Hivernage district, this sophisticated apartment offers the perfect blend of location and luxury. Just steps from the finest restaurants and boutiques, the property features floor-to-ceiling windows, designer furnishings, and a private balcony overlooking the gardens.',
  'Marrakech', 'Hivernage',
  180, 40,
  2, 2,
  3, 1, 4,
  '["bathtub","gasStove","washingMachine","iron","dishwasher","oven","coffeeMachine","fridge","wifi","airConditioning"]',
  'private',
  '["/images/properties/apt-1-1.jpg","/images/properties/apt-1-2.jpg","/images/properties/apt-1-3.jpg"]',
  '/images/properties/apt-1-1.jpg',
  'Apartment Hivernage Elite',
  'A chic 2-bedroom apartment in prestigious Hivernage with designer finishes.',
  'Located in the prestigious Hivernage district, this sophisticated apartment offers the perfect blend of location and luxury.',
  'apartment', 2, 2, 4
),
-- 4. Riad Ambre & Épices
(
  'riad-ambre-epices',
  'Riad Ambre & Épices',
  'riad', 'published', true, false,
  'An intimate 4-bedroom riad with aromatic gardens in Derb el Bacha.',
  'A hidden gem tucked away in the enchanting Derb el Bacha quarter, Riad Ambre & Épices captivates with its warm ochre walls and aromatic gardens filled with jasmine and rose. The four intimate suites feature antique Berber textiles, copper lanterns, and the finest Egyptian cotton linens.',
  'Marrakech', 'Kasbah Royal District',
  320, 60,
  4, 4,
  6, 2, 8,
  '["hammam","bathtub","fireplace","terrace","rooftop","wifi","airConditioning","breakfastPossible","koutboubiaView"]',
  'walk-5-min',
  '["/images/properties/riad-1-1.jpg"]',
  '/images/properties/riad-1-1.jpg',
  'Riad Ambre & Épices',
  'An intimate 4-bedroom riad with aromatic gardens in Derb el Bacha.',
  'A hidden gem tucked away in the enchanting Derb el Bacha quarter.',
  'riad', 4, 4, 8
)
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------
-- PROPERTY ROOMS — chambres pour Riad Jardin Secret
-- -----------------------------------------------------------------------

INSERT INTO public.property_rooms (property_id, room_name, room_number, bed_type, bed_count, max_guests, has_bathroom, has_shower, has_bathtub, sort_order)
SELECT p.id, r.room_name, r.room_number, r.bed_type, r.bed_count, r.max_guests, r.has_bathroom, r.has_shower, r.has_bathtub, r.sort_order
FROM public.properties p
CROSS JOIN (VALUES
  ('Bedroom 1',    1, 'king',           2, 2, true,  true,  true,  0),
  ('Bedroom 2',    2, 'single',         2, 2, true,  true,  false, 1),
  ('Bedroom 3',    3, 'queen',          1, 2, true,  false, true,  2),
  ('Bedroom 4',    4, 'double',         1, 2, true,  true,  false, 3),
  ('Bedroom 5',    5, 'single',         1, 2, true,  true,  false, 4),
  ('Living Room',  6, 'sofa-bed-double',1, 2, false, false, false, 5)
) AS r(room_name, room_number, bed_type, bed_count, max_guests, has_bathroom, has_shower, has_bathtub, sort_order)
WHERE p.slug = 'riad-jardin-secret'
  AND NOT EXISTS (
    SELECT 1 FROM public.property_rooms pr WHERE pr.property_id = p.id
  );

-- Chambres pour Villa Palmeraie Oasis
INSERT INTO public.property_rooms (property_id, room_name, room_number, bed_type, bed_count, max_guests, has_bathroom, has_shower, has_bathtub, sort_order)
SELECT p.id, r.room_name, r.room_number, r.bed_type, r.bed_count, r.max_guests, r.has_bathroom, r.has_shower, r.has_bathtub, r.sort_order
FROM public.properties p
CROSS JOIN (VALUES
  ('Master Suite', 1, 'king',           1, 2, true,  true, true,  0),
  ('Bedroom 2',    2, 'king',           1, 2, true,  true, false, 1),
  ('Bedroom 3',    3, 'queen',          1, 2, true,  true, false, 2),
  ('Bedroom 4',    4, 'queen',          1, 2, true,  false,true,  3),
  ('Bedroom 5',    5, 'single',         2, 2, true,  true, false, 4),
  ('Bedroom 6',    6, 'single',         2, 2, true,  true, false, 5),
  ('Living Room',  7, 'sofa-bed-double',1, 2, false, false,false, 6)
) AS r(room_name, room_number, bed_type, bed_count, max_guests, has_bathroom, has_shower, has_bathtub, sort_order)
WHERE p.slug = 'villa-palmeraie-oasis'
  AND NOT EXISTS (
    SELECT 1 FROM public.property_rooms pr WHERE pr.property_id = p.id
  );

-- Chambres pour Apartment Hivernage Elite
INSERT INTO public.property_rooms (property_id, room_name, room_number, bed_type, bed_count, max_guests, has_bathroom, has_shower, has_bathtub, sort_order)
SELECT p.id, r.room_name, r.room_number, r.bed_type, r.bed_count, r.max_guests, r.has_bathroom, r.has_shower, r.has_bathtub, r.sort_order
FROM public.properties p
CROSS JOIN (VALUES
  ('Master Bedroom', 1, 'queen',          1, 2, true,  true,  false, 0),
  ('Bedroom 2',      2, 'single',         1, 1, false, false, false, 1),
  ('Living Room',    3, 'sofa-bed-single',1, 1, false, false, false, 2)
) AS r(room_name, room_number, bed_type, bed_count, max_guests, has_bathroom, has_shower, has_bathtub, sort_order)
WHERE p.slug = 'apartment-hivernage-elite'
  AND NOT EXISTS (
    SELECT 1 FROM public.property_rooms pr WHERE pr.property_id = p.id
  );

-- -----------------------------------------------------------------------
-- PROPERTY IMAGES — images d'accroche pour chaque propriété
-- -----------------------------------------------------------------------

INSERT INTO public.property_images (property_id, image_url, alt_text, display_order, is_cover)
SELECT p.id, img.image_url, img.alt_text, img.display_order, img.is_cover
FROM public.properties p
CROSS JOIN (VALUES
  ('/images/properties/riad-1-1.jpg', 'Riad Jardin Secret - Cour centrale', 0, true),
  ('/images/properties/riad-1-2.jpg', 'Riad Jardin Secret - Suite', 1, false),
  ('/images/properties/riad-1-3.jpg', 'Riad Jardin Secret - Terrasse', 2, false)
) AS img(image_url, alt_text, display_order, is_cover)
WHERE p.slug = 'riad-jardin-secret'
  AND NOT EXISTS (
    SELECT 1 FROM public.property_images pi WHERE pi.property_id = p.id
  );

INSERT INTO public.property_images (property_id, image_url, alt_text, display_order, is_cover)
SELECT p.id, img.image_url, img.alt_text, img.display_order, img.is_cover
FROM public.properties p
CROSS JOIN (VALUES
  ('/images/properties/villa-1-1.jpg', 'Villa Palmeraie Oasis - Piscine', 0, true),
  ('/images/properties/villa-1-2.jpg', 'Villa Palmeraie Oasis - Salon', 1, false),
  ('/images/properties/villa-1-3.jpg', 'Villa Palmeraie Oasis - Jardin', 2, false)
) AS img(image_url, alt_text, display_order, is_cover)
WHERE p.slug = 'villa-palmeraie-oasis'
  AND NOT EXISTS (
    SELECT 1 FROM public.property_images pi WHERE pi.property_id = p.id
  );

INSERT INTO public.property_images (property_id, image_url, alt_text, display_order, is_cover)
SELECT p.id, img.image_url, img.alt_text, img.display_order, img.is_cover
FROM public.properties p
CROSS JOIN (VALUES
  ('/images/properties/apt-1-1.jpg', 'Apartment Hivernage Elite - Salon', 0, true),
  ('/images/properties/apt-1-2.jpg', 'Apartment Hivernage Elite - Chambre', 1, false)
) AS img(image_url, alt_text, display_order, is_cover)
WHERE p.slug = 'apartment-hivernage-elite'
  AND NOT EXISTS (
    SELECT 1 FROM public.property_images pi WHERE pi.property_id = p.id
  );

-- -----------------------------------------------------------------------
-- ORDRE D'EXÉCUTION RECOMMANDÉ (base vide)
-- -----------------------------------------------------------------------
-- 1. scripts/001_create_multilingual_schema.sql
-- 2. scripts/002_create_verified_reviews.sql
-- 3. scripts/003_add_missing_tables.sql
-- 4. scripts/004_harmonize_schema.sql
-- 5. scripts/005_fix_admin_auth.sql
-- 6. scripts/006_seed_initial_data.sql  ← CE FICHIER
-- -----------------------------------------------------------------------
