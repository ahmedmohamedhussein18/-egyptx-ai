-- Create Trip Expenses Table
CREATE TABLE IF NOT EXISTS trip_expenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    trip_id uuid REFERENCES trip_plans(id) ON DELETE CASCADE,
    amount decimal NOT NULL,
    currency text DEFAULT 'EGP',
    category text NOT NULL,
    description text,
    expense_date timestamptz NOT NULL,
    attraction_id uuid REFERENCES attractions(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE trip_expenses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own expenses
CREATE POLICY select_own_expenses ON trip_expenses
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own expenses
CREATE POLICY insert_own_expenses ON trip_expenses
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own expenses
CREATE POLICY update_own_expenses ON trip_expenses
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own expenses
CREATE POLICY delete_own_expenses ON trip_expenses
    FOR DELETE
    USING (auth.uid() = user_id);
