-- Create qr_checkins table
CREATE TABLE qr_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attraction_id uuid REFERENCES attractions(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  governorate_id uuid REFERENCES governorates(id),
  checked_in_at timestamptz DEFAULT now(),
  verification_method text DEFAULT 'qr_scan',
  session_id text,
  created_at timestamptz DEFAULT now()
);

-- Indexes for qr_checkins
CREATE INDEX idx_qr_checkins_user_id ON qr_checkins(user_id);
CREATE INDEX idx_qr_checkins_attraction_id ON qr_checkins(attraction_id);
CREATE INDEX idx_qr_checkins_checked_in_at ON qr_checkins(checked_in_at);
CREATE INDEX idx_qr_checkins_created_at ON qr_checkins(created_at);

-- Enable RLS for qr_checkins
ALTER TABLE qr_checkins ENABLE ROW LEVEL SECURITY;

-- Policies for qr_checkins
CREATE POLICY "Users can insert their own check-ins" ON qr_checkins
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own check-ins" ON qr_checkins
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create analytics_events table
CREATE TABLE analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  session_id text,
  attraction_id uuid REFERENCES attractions(id),
  governorate_id uuid REFERENCES governorates(id),
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes for analytics_events
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- Enable RLS for analytics_events
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Policies for analytics_events
CREATE POLICY "Anyone can insert analytics events" ON analytics_events
  FOR INSERT
  WITH CHECK (true);

-- Only service_role can view analytics events (done implicitly by not creating a SELECT policy for anon/authenticated)
