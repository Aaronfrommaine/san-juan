-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own travel details" ON travel_details;
DROP POLICY IF EXISTS "Users can manage their own travel details" ON travel_details;

-- Create travel details table if it doesn't exist
CREATE TABLE IF NOT EXISTS travel_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  airline text NOT NULL,
  flight_number text NOT NULL,
  arrival_time timestamptz NOT NULL,
  departure_time timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE travel_details ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policy for all operations
CREATE POLICY "Users can manage their own travel details"
  ON travel_details
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create or replace the view
DROP VIEW IF EXISTS user_travel_details;
CREATE VIEW user_travel_details AS
SELECT *
FROM travel_details
WHERE user_id = auth.uid();

-- Grant permissions
GRANT SELECT ON user_travel_details TO authenticated;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_travel_details_user_id ON travel_details(user_id);