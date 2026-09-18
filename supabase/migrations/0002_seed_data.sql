-- TASK 2: Add columns to governorates and seed 27 governorates
ALTER TABLE governorates ADD COLUMN IF NOT EXISTS name_ar text;
ALTER TABLE governorates ADD COLUMN IF NOT EXISTS capital_en text;
ALTER TABLE governorates ADD COLUMN IF NOT EXISTS capital_ar text;
ALTER TABLE governorates ADD COLUMN IF NOT EXISTS latitude decimal;
ALTER TABLE governorates ADD COLUMN IF NOT EXISTS longitude decimal;

-- Insert 27 Governorates
INSERT INTO governorates (id, name_en, name_ar, capital_en, capital_ar, latitude, longitude) VALUES
(gen_random_uuid(), 'Cairo', 'القاهرة', 'Cairo', 'القاهرة', 30.0444, 31.2357),
(gen_random_uuid(), 'Alexandria', 'الإسكندرية', 'Alexandria', 'الإسكندرية', 31.2001, 29.9187),
(gen_random_uuid(), 'Giza', 'الجيزة', 'Giza', 'الجيزة', 30.0131, 31.2089),
(gen_random_uuid(), 'Qalyubia', 'القليوبية', 'Banha', 'بنها', 30.4591, 31.1786),
(gen_random_uuid(), 'Dakahlia', 'الدقهلية', 'Mansoura', 'المنصورة', 31.0364, 31.3807),
(gen_random_uuid(), 'Sharqia', 'الشرقية', 'Zagazig', 'الزقازيق', 30.5877, 31.5167),
(gen_random_uuid(), 'Gharbia', 'الغربية', 'Tanta', 'طنطا', 30.7865, 31.0004),
(gen_random_uuid(), 'Kafr El Sheikh', 'كفر الشيخ', 'Kafr El Sheikh', 'كفر الشيخ', 31.1107, 30.9388),
(gen_random_uuid(), 'Monufia', 'المنوفية', 'Shibin El Kom', 'شبين الكوم', 30.5972, 31.0125),
(gen_random_uuid(), 'Beheira', 'البحيرة', 'Damanhur', 'دمنهور', 31.0369, 30.4698),
(gen_random_uuid(), 'Ismailia', 'الإسماعيلية', 'Ismailia', 'الإسماعيلية', 30.5965, 32.2715),
(gen_random_uuid(), 'Port Said', 'بورسعيد', 'Port Said', 'بورسعيد', 31.2653, 32.3019),
(gen_random_uuid(), 'Suez', 'السويس', 'Suez', 'السويس', 29.9668, 32.5498),
(gen_random_uuid(), 'Damietta', 'دمياط', 'Damietta', 'دمياط', 31.4165, 31.8133),
(gen_random_uuid(), 'North Sinai', 'شمال سيناء', 'Arish', 'العريش', 31.1316, 33.7984),
(gen_random_uuid(), 'South Sinai', 'جنوب سيناء', 'El Tor', 'الطور', 28.2364, 33.6254),
(gen_random_uuid(), 'Matrouh', 'مطروح', 'Marsa Matrouh', 'مرسى مطروح', 31.3543, 27.2373),
(gen_random_uuid(), 'New Valley', 'الوادي الجديد', 'Kharga', 'الخارجة', 25.4390, 30.5586),
(gen_random_uuid(), 'Aswan', 'أسوان', 'Aswan', 'أسوان', 24.0889, 32.8998),
(gen_random_uuid(), 'Luxor', 'الأقصر', 'Luxor', 'الأقصر', 25.6872, 32.6396),
(gen_random_uuid(), 'Qena', 'قنا', 'Qena', 'قنا', 26.1615, 32.7181),
(gen_random_uuid(), 'Sohag', 'سوهاج', 'Sohag', 'سوهاج', 26.5570, 31.6948),
(gen_random_uuid(), 'Asyut', 'أسيوط', 'Asyut', 'أسيوط', 27.1810, 31.1837),
(gen_random_uuid(), 'Minya', 'المنيا', 'Minya', 'المنيا', 28.0871, 30.7618),
(gen_random_uuid(), 'Beni Suef', 'بني سويف', 'Beni Suef', 'بني سويف', 29.0661, 31.0994),
(gen_random_uuid(), 'Faiyum', 'الفيوم', 'Faiyum', 'الفيوم', 29.3084, 30.8428),
(gen_random_uuid(), 'Red Sea', 'البحر الأحمر', 'Hurghada', 'الغردقة', 27.2579, 33.8116)
ON CONFLICT DO NOTHING; -- Assuming the table might have conflicts if IDs or unique constraints exist, though we generate random UUIDs here.
-- Wait, the prompt said "Use INSERT ... ON CONFLICT DO NOTHING". To make it work, I need a unique constraint.
-- The prompt states: "Use INSERT ... ON CONFLICT DO NOTHING to avoid duplicate errors." 
-- If 'name_en' is UNIQUE, we can use ON CONFLICT (name_en) DO NOTHING. I'll add a unique constraint just in case, but standard ON CONFLICT requires a target if not a primary key. I'll leave out the target if possible or target name_en.
-- Let's update the syntax below.

ALTER TABLE governorates ADD CONSTRAINT IF NOT EXISTS gov_name_en_unique UNIQUE (name_en);

INSERT INTO governorates (id, name_en, name_ar, capital_en, capital_ar, latitude, longitude) VALUES
(gen_random_uuid(), 'Cairo', 'القاهرة', 'Cairo', 'القاهرة', 30.0444, 31.2357),
(gen_random_uuid(), 'Alexandria', 'الإسكندرية', 'Alexandria', 'الإسكندرية', 31.2001, 29.9187),
(gen_random_uuid(), 'Giza', 'الجيزة', 'Giza', 'الجيزة', 30.0131, 31.2089),
(gen_random_uuid(), 'Qalyubia', 'القليوبية', 'Banha', 'بنها', 30.4591, 31.1786),
(gen_random_uuid(), 'Dakahlia', 'الدقهلية', 'Mansoura', 'المنصورة', 31.0364, 31.3807),
(gen_random_uuid(), 'Sharqia', 'الشرقية', 'Zagazig', 'الزقازيق', 30.5877, 31.5167),
(gen_random_uuid(), 'Gharbia', 'الغربية', 'Tanta', 'طنطا', 30.7865, 31.0004),
(gen_random_uuid(), 'Kafr El Sheikh', 'كفر الشيخ', 'Kafr El Sheikh', 'كفر الشيخ', 31.1107, 30.9388),
(gen_random_uuid(), 'Monufia', 'المنوفية', 'Shibin El Kom', 'شبين الكوم', 30.5972, 31.0125),
(gen_random_uuid(), 'Beheira', 'البحيرة', 'Damanhur', 'دمنهور', 31.0369, 30.4698),
(gen_random_uuid(), 'Ismailia', 'الإسماعيلية', 'Ismailia', 'الإسماعيلية', 30.5965, 32.2715),
(gen_random_uuid(), 'Port Said', 'بورسعيد', 'Port Said', 'بورسعيد', 31.2653, 32.3019),
(gen_random_uuid(), 'Suez', 'السويس', 'Suez', 'السويس', 29.9668, 32.5498),
(gen_random_uuid(), 'Damietta', 'دمياط', 'Damietta', 'دمياط', 31.4165, 31.8133),
(gen_random_uuid(), 'North Sinai', 'شمال سيناء', 'Arish', 'العريش', 31.1316, 33.7984),
(gen_random_uuid(), 'South Sinai', 'جنوب سيناء', 'El Tor', 'الطور', 28.2364, 33.6254),
(gen_random_uuid(), 'Matrouh', 'مطروح', 'Marsa Matrouh', 'مرسى مطروح', 31.3543, 27.2373),
(gen_random_uuid(), 'New Valley', 'الوادي الجديد', 'Kharga', 'الخارجة', 25.4390, 30.5586),
(gen_random_uuid(), 'Aswan', 'أسوان', 'Aswan', 'أسوان', 24.0889, 32.8998),
(gen_random_uuid(), 'Luxor', 'الأقصر', 'Luxor', 'الأقصر', 25.6872, 32.6396),
(gen_random_uuid(), 'Qena', 'قنا', 'Qena', 'قنا', 26.1615, 32.7181),
(gen_random_uuid(), 'Sohag', 'سوهاج', 'Sohag', 'سوهاج', 26.5570, 31.6948),
(gen_random_uuid(), 'Asyut', 'أسيوط', 'Asyut', 'أسيوط', 27.1810, 31.1837),
(gen_random_uuid(), 'Minya', 'المنيا', 'Minya', 'المنيا', 28.0871, 30.7618),
(gen_random_uuid(), 'Beni Suef', 'بني سويف', 'Beni Suef', 'بني سويف', 29.0661, 31.0994),
(gen_random_uuid(), 'Faiyum', 'الفيوم', 'Faiyum', 'الفيوم', 29.3084, 30.8428),
(gen_random_uuid(), 'Red Sea', 'البحر الأحمر', 'Hurghada', 'الغردقة', 27.2579, 33.8116)
ON CONFLICT (name_en) DO NOTHING;


-- TASK 3: Create attractions table
CREATE TABLE IF NOT EXISTS attractions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en text NOT NULL UNIQUE,
    name_ar text,
    governorate_id uuid REFERENCES governorates(id),
    city text,
    latitude decimal,
    longitude decimal,
    category text,
    description_en text,
    description_ar text,
    official_source text,
    external_place_id text,
    unesco_reference text,
    opening_hours_source text,
    verified boolean DEFAULT false,
    last_verified_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE attractions ENABLE ROW LEVEL SECURITY;

-- Policy: anyone can SELECT verified attractions
CREATE POLICY select_verified_attractions ON attractions
    FOR SELECT
    USING (verified = true);

-- Policy: only service_role can INSERT/UPDATE/DELETE
-- Note: 'service_role' connects directly, bypassing RLS if it wants, but we can explicitly allow it.
CREATE POLICY allow_all_service_role ON attractions
    USING ( (auth.role() = 'service_role') )
    WITH CHECK ( (auth.role() = 'service_role') );


-- TASK 4: Seed core attractions
INSERT INTO attractions (name_en, governorate_id, city, category, latitude, longitude, verified)
VALUES
('Great Pyramid of Giza', (SELECT id FROM governorates WHERE name_en = 'Giza'), 'Giza', 'ancient', 29.9792, 31.1342, true),
('Egyptian Museum Cairo', (SELECT id FROM governorates WHERE name_en = 'Cairo'), 'Cairo', 'museum', 30.0478, 31.2336, true),
('Karnak Temple', (SELECT id FROM governorates WHERE name_en = 'Luxor'), 'Luxor', 'ancient', 25.7188, 32.6573, true),
('Luxor Temple', (SELECT id FROM governorates WHERE name_en = 'Luxor'), 'Luxor', 'ancient', 25.6995, 32.6391, true),
('Valley of the Kings', (SELECT id FROM governorates WHERE name_en = 'Luxor'), 'Luxor', 'ancient', 25.7402, 32.6014, true),
('Abu Simbel Temples', (SELECT id FROM governorates WHERE name_en = 'Aswan'), 'Aswan', 'ancient', 22.3372, 31.6258, true),
('Philae Temple', (SELECT id FROM governorates WHERE name_en = 'Aswan'), 'Aswan', 'ancient', 24.0253, 32.8847, true),
('Siwa Oasis', (SELECT id FROM governorates WHERE name_en = 'Matrouh'), 'Matrouh', 'hidden', 29.2031, 25.5195, true),
('White Desert', (SELECT id FROM governorates WHERE name_en = 'New Valley'), 'New Valley', 'nature', 27.3833, 28.3167, true),
('Grand Egyptian Museum', (SELECT id FROM governorates WHERE name_en = 'Giza'), 'Giza', 'museum', 29.9875, 31.1124, true),
('Saqqara Step Pyramid', (SELECT id FROM governorates WHERE name_en = 'Giza'), 'Giza', 'ancient', 29.8712, 31.2165, true),
('Fayoum Oasis', (SELECT id FROM governorates WHERE name_en = 'Faiyum'), 'Faiyum', 'nature', 29.3084, 30.8428, true),
('Red Sea Coast Hurghada', (SELECT id FROM governorates WHERE name_en = 'Red Sea'), 'Hurghada', 'beach', 27.2579, 33.8116, true),
('Sharm El Sheikh', (SELECT id FROM governorates WHERE name_en = 'South Sinai'), 'Sharm El Sheikh', 'beach', 27.9158, 34.3299, true),
('Ras Mohammed', (SELECT id FROM governorates WHERE name_en = 'South Sinai'), 'South Sinai', 'nature', 27.7310, 34.2490, true)
ON CONFLICT (name_en) DO NOTHING;
