-- TASK: Create ai_memories table
CREATE TABLE IF NOT EXISTS ai_memories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    attraction_id uuid REFERENCES attractions(id),
    title text,
    note text,
    photo_url text,
    visited_at date,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ai_memories ENABLE ROW LEVEL SECURITY;

-- Policy: users can insert their own memories
CREATE POLICY "Users can insert their own memories" ON ai_memories
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: users can view their own memories
CREATE POLICY "Users can view their own memories" ON ai_memories
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: users can update their own memories
CREATE POLICY "Users can update their own memories" ON ai_memories
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: users can delete their own memories
CREATE POLICY "Users can delete their own memories" ON ai_memories
    FOR DELETE
    USING (auth.uid() = user_id);
