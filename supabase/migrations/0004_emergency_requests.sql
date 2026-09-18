-- TASK: Create emergency_requests table
CREATE TABLE IF NOT EXISTS emergency_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    latitude decimal,
    longitude decimal,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE emergency_requests ENABLE ROW LEVEL SECURITY;

-- Policy: users can insert their own requests
CREATE POLICY "Users can insert their own emergency requests" ON emergency_requests
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: users can view their own requests
CREATE POLICY "Users can view their own emergency requests" ON emergency_requests
    FOR SELECT
    USING (auth.uid() = user_id);
