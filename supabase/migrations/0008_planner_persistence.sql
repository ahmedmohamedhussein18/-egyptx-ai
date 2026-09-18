-- TASK: Create trip_plans, trip_days, and trip_places tables

CREATE TABLE IF NOT EXISTS trip_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    title text,
    governorate_id uuid REFERENCES governorates(id),
    start_date date,
    duration_days integer NOT NULL,
    budget numeric,
    travelers integer,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trip_days (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_plan_id uuid REFERENCES trip_plans(id) ON DELETE CASCADE NOT NULL,
    day_number integer NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trip_places (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_day_id uuid REFERENCES trip_days(id) ON DELETE CASCADE NOT NULL,
    attraction_id uuid REFERENCES attractions(id),
    time_slot text,
    notes text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE trip_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_places ENABLE ROW LEVEL SECURITY;

-- Policies for trip_plans
CREATE POLICY "Users can manage their own trip plans" ON trip_plans
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policies for trip_days
CREATE POLICY "Users can manage their own trip days" ON trip_days
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM trip_plans tp 
        WHERE tp.id = trip_days.trip_plan_id 
        AND tp.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM trip_plans tp 
        WHERE tp.id = trip_days.trip_plan_id 
        AND tp.user_id = auth.uid()
    ));

-- Policies for trip_places
CREATE POLICY "Users can manage their own trip places" ON trip_places
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM trip_days td
        JOIN trip_plans tp ON tp.id = td.trip_plan_id
        WHERE td.id = trip_places.trip_day_id 
        AND tp.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM trip_days td
        JOIN trip_plans tp ON tp.id = td.trip_plan_id
        WHERE td.id = trip_places.trip_day_id 
        AND tp.user_id = auth.uid()
    ));
