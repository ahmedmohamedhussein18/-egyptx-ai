-- Create Mobility Notifications Table
CREATE TABLE IF NOT EXISTS mobility_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL,
    service_type text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE mobility_notifications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for the notify me form
CREATE POLICY insert_mobility_notifications ON mobility_notifications
    FOR INSERT
    WITH CHECK (true);

-- Only national admins can view the notifications
CREATE POLICY select_mobility_notifications ON mobility_notifications
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'national_admin'
        )
    );
