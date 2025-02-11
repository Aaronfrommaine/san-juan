-- Create travel details table
CREATE TABLE travel_details (
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

-- Create policies
CREATE POLICY "Users can view their own travel details"
  ON travel_details FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own travel details"
  ON travel_details FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER set_travel_details_timestamp
  BEFORE UPDATE ON travel_details
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();