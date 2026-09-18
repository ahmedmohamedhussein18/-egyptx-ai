-- TASK: Add missing attractions for passport badges
INSERT INTO attractions (name_en, governorate_id, city, category, latitude, longitude, verified)
VALUES
('Alexandria Library', (SELECT id FROM governorates WHERE name_en = 'Alexandria'), 'Alexandria', 'culture', 31.2089, 29.9056, true),
('Saint Catherine Monastery', (SELECT id FROM governorates WHERE name_en = 'South Sinai'), 'Saint Catherine', 'religious', 28.5566, 33.9758, true),
('Citadel of Saladin', (SELECT id FROM governorates WHERE name_en = 'Cairo'), 'Cairo', 'culture', 30.0286, 31.2590, true),
('Wadi El Hitan', (SELECT id FROM governorates WHERE name_en = 'Faiyum'), 'Faiyum', 'hidden', 29.2724, 30.0413, true)
ON CONFLICT (name_en) DO NOTHING;
