-- TASK: Create kids_profiles and kids_badges tables
CREATE TABLE IF NOT EXISTS kids_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
    nickname text NOT NULL,
    points integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kids_badges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    kids_profile_id uuid REFERENCES kids_profiles(id) ON DELETE CASCADE NOT NULL,
    badge_key text NOT NULL,
    earned_at timestamptz DEFAULT now(),
    UNIQUE(kids_profile_id, badge_key)
);

-- Enable RLS
ALTER TABLE kids_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kids_badges ENABLE ROW LEVEL SECURITY;

-- Policies for kids_profiles
CREATE POLICY "Users can insert their own kids profile" ON kids_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own kids profile" ON kids_profiles
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own kids profile" ON kids_profiles
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policies for kids_badges
CREATE POLICY "Users can view their kids badges" ON kids_badges
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM kids_profiles kp 
        WHERE kp.id = kids_badges.kids_profile_id 
        AND kp.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their kids badges" ON kids_badges
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM kids_profiles kp 
        WHERE kp.id = kids_badges.kids_profile_id 
        AND kp.user_id = auth.uid()
    ));
