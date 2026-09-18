-- TASK: Create vr_experiences table
CREATE TABLE IF NOT EXISTS vr_experiences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    attraction_id uuid REFERENCES attractions(id) NOT NULL,
    asset_url text,
    asset_type text,
    source text,
    license text,
    creator text,
    capture_date date,
    verified boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE vr_experiences ENABLE ROW LEVEL SECURITY;

-- Policy: anyone can view verified VR experiences
CREATE POLICY "Public can view verified vr experiences" ON vr_experiences
    FOR SELECT
    USING (verified = true);

-- Policy: admins can view all VR experiences (verified and unverified)
CREATE POLICY "Admins can view all vr experiences" ON vr_experiences
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('national_admin', 'governorate_admin', 'site_manager')
        )
    );

-- Policy: admins can insert VR experiences
CREATE POLICY "Admins can insert vr experiences" ON vr_experiences
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('national_admin', 'governorate_admin', 'site_manager')
        )
    );

-- Policy: admins can update VR experiences
CREATE POLICY "Admins can update vr experiences" ON vr_experiences
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('national_admin', 'governorate_admin', 'site_manager')
        )
    );

-- Policy: admins can delete VR experiences
CREATE POLICY "Admins can delete vr experiences" ON vr_experiences
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('national_admin', 'governorate_admin', 'site_manager')
        )
    );
