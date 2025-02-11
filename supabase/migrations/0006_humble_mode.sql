/*
  # Add Itinerary Items

  1. New Tables
    - `itinerary_items`
      - `id` (uuid, primary key)
      - `seminar_id` (uuid, foreign key to seminars)
      - `title` (text)
      - `description` (text)
      - `start_time` (time)
      - `end_time` (time)
      - `day_number` (integer)
      - `location` (text)
      - `speaker_name` (text, nullable)
      - `speaker_bio` (text, nullable)
      - `activity_type` (text) - e.g., 'presentation', 'workshop', 'meal', 'tour'
      - `meal_details` (jsonb, nullable) - for meal-type activities
      - `tour_details` (jsonb, nullable) - for tour-type activities
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `itinerary_items` table
    - Add policies for admin management and public reading
*/

-- Create itinerary_items table
CREATE TABLE itinerary_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seminar_id uuid REFERENCES seminars(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  day_number integer NOT NULL CHECK (day_number > 0),
  location text NOT NULL,
  speaker_name text,
  speaker_bio text,
  activity_type text NOT NULL CHECK (activity_type IN ('presentation', 'workshop', 'meal', 'tour', 'networking')),
  meal_details jsonb,
  tour_details jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Add constraint to ensure end_time is after start_time
  CONSTRAINT valid_time_range CHECK (end_time > start_time),
  
  -- Add constraint to ensure meal_details is only set for meal activities
  CONSTRAINT valid_meal_details CHECK (
    (activity_type = 'meal' AND meal_details IS NOT NULL) OR
    (activity_type != 'meal' AND meal_details IS NULL)
  ),
  
  -- Add constraint to ensure tour_details is only set for tour activities
  CONSTRAINT valid_tour_details CHECK (
    (activity_type = 'tour' AND tour_details IS NOT NULL) OR
    (activity_type != 'tour' AND tour_details IS NULL)
  )
);

-- Enable RLS
ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX itinerary_items_seminar_day_idx ON itinerary_items(seminar_id, day_number, start_time);

-- Create policy for admin management
CREATE POLICY "Admins can manage all itinerary items"
  ON itinerary_items
  FOR ALL
  TO authenticated
  USING (auth.email() IN ('aaron@abodekport.com'))
  WITH CHECK (auth.email() IN ('aaron@abodekport.com'));

-- Create policy for public reading of upcoming seminars' itineraries
CREATE POLICY "Anyone can view itinerary items for upcoming seminars"
  ON itinerary_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM seminars
      WHERE seminars.id = itinerary_items.seminar_id
      AND seminars.status = 'upcoming'
    )
  );

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_itinerary_items_updated_at
  BEFORE UPDATE ON itinerary_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add example itinerary items
INSERT INTO itinerary_items (
  seminar_id,
  title,
  description,
  start_time,
  end_time,
  day_number,
  location,
  speaker_name,
  speaker_bio,
  activity_type,
  meal_details
) VALUES (
  -- Use the ID of an existing seminar
  (SELECT id FROM seminars WHERE status = 'upcoming' LIMIT 1),
  'Welcome Breakfast',
  'Start your day with a networking breakfast featuring local Puerto Rican cuisine',
  '08:00',
  '09:30',
  1,
  'Hotel Restaurant',
  NULL,
  NULL,
  'meal',
  '{"menu": ["Local fruits and pastries", "Coffee and fresh juices", "Traditional breakfast items"], "dietary_options": ["Vegetarian", "Gluten-free"]}'::jsonb
);