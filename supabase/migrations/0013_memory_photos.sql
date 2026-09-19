-- Create Memory Photos Table
CREATE TABLE IF NOT EXISTS memory_photos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    attraction_id uuid REFERENCES attractions(id) ON DELETE SET NULL,
    photo_url text NOT NULL,
    caption text,
    memory_date timestamptz NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE memory_photos ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own photos
CREATE POLICY select_own_photos ON memory_photos
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own photos
CREATE POLICY insert_own_photos ON memory_photos
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own photos
CREATE POLICY update_own_photos ON memory_photos
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own photos
CREATE POLICY delete_own_photos ON memory_photos
    FOR DELETE
    USING (auth.uid() = user_id);
