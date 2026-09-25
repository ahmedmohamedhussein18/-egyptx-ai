-- Alter qr_checkins table to allow ai_planner_self_report records without a hard-linked attraction_id
ALTER TABLE qr_checkins ALTER COLUMN attraction_id DROP NOT NULL;

-- Add a metadata JSONB column to store the parsed city, day, and unlinked attraction name
ALTER TABLE qr_checkins ADD COLUMN IF NOT EXISTS metadata jsonb;
