-- Create Memory Collections Table
CREATE TABLE IF NOT EXISTS memory_collections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    name text NOT NULL,
    description text,
    cover_photo_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create Memory Collection Items Table
CREATE TABLE IF NOT EXISTS memory_collection_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id uuid REFERENCES memory_collections(id) ON DELETE CASCADE,
    memory_photo_id uuid REFERENCES memory_photos(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE memory_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_collection_items ENABLE ROW LEVEL SECURITY;

-- Policies for memory_collections
CREATE POLICY select_own_collections ON memory_collections
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY insert_own_collections ON memory_collections
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_own_collections ON memory_collections
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY delete_own_collections ON memory_collections
    FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for memory_collection_items
CREATE POLICY select_own_collection_items ON memory_collection_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM memory_collections 
            WHERE memory_collections.id = memory_collection_items.collection_id 
            AND memory_collections.user_id = auth.uid()
        )
    );

CREATE POLICY insert_own_collection_items ON memory_collection_items
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM memory_collections 
            WHERE memory_collections.id = memory_collection_items.collection_id 
            AND memory_collections.user_id = auth.uid()
        )
    );

CREATE POLICY delete_own_collection_items ON memory_collection_items
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM memory_collections 
            WHERE memory_collections.id = memory_collection_items.collection_id 
            AND memory_collections.user_id = auth.uid()
        )
    );
