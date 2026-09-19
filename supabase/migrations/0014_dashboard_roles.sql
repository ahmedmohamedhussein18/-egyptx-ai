-- Allow governorate admins/analysts to view analytics for their governorate
CREATE POLICY "Gov admins view their governorate analytics" ON analytics_events
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('governorate_admin', 'governorate_analyst')
            AND profiles.governorate_id = analytics_events.governorate_id
        )
    );

-- Allow national admins to view all analytics
CREATE POLICY "National admins view all analytics" ON analytics_events
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'national_admin'
        )
    );

-- Allow admins to view qr_checkins for their governorate
CREATE POLICY "Gov admins view their governorate checkins" ON qr_checkins
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('governorate_admin', 'governorate_analyst')
            AND profiles.governorate_id = qr_checkins.governorate_id
        )
    );

-- Allow national admins to view all qr_checkins
CREATE POLICY "National admins view all checkins" ON qr_checkins
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'national_admin'
        )
    );

-- Allow admins to view profiles
CREATE POLICY "Gov admins view profiles" ON profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles AS admin 
            WHERE admin.id = auth.uid() 
            AND admin.role IN ('governorate_admin', 'governorate_analyst')
            AND admin.governorate_id = profiles.governorate_id
        )
    );
