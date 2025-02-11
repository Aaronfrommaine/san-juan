/*
  # Add seminars management

  1. New Tables
    - `seminars`
      - `id` (uuid, primary key)
      - `start_date` (date, when the seminar starts)
      - `end_date` (date, when the seminar ends)
      - `location` (text, where the seminar is held)
      - `total_spots` (integer, total available spots)
      - `spots_remaining` (integer, remaining spots)
      - `status` (enum: upcoming, in-progress, completed)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `seminars` table
    - Add policies for:
      - Public read access to upcoming seminars
      - Admin-only write access
*/

-- Create seminars table
CREATE TABLE IF NOT EXISTS seminars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date date NOT NULL,
  end_date date NOT NULL,
  location text NOT NULL,
  total_spots integer NOT NULL,
  spots_remaining integer NOT NULL,
  status text NOT NULL CHECK (status IN ('upcoming', 'in-progress', 'completed')) DEFAULT 'upcoming',
  created_at timestamptz DEFAULT now(),
  
  -- Add constraints
  CONSTRAINT valid_dates CHECK (end_date >= start_date),
  CONSTRAINT valid_spots CHECK (spots_remaining >= 0 AND spots_remaining <= total_spots)
);

-- Enable RLS
ALTER TABLE seminars ENABLE ROW LEVEL SECURITY;

-- Allow public read access to upcoming seminars
CREATE POLICY "Anyone can view upcoming seminars"
  ON seminars
  FOR SELECT
  USING (status = 'upcoming');

-- Add some initial seminar dates
INSERT INTO seminars (start_date, end_date, location, total_spots, spots_remaining)
VALUES 
  ('2024-05-01', '2024-05-04', 'Rincón, Puerto Rico', 20, 20),
  ('2024-06-01', '2024-06-04', 'Santurce, Puerto Rico', 20, 20),
  ('2024-07-01', '2024-07-04', 'Rincón, Puerto Rico', 20, 20);

-- Update bookings table to reference seminars
ALTER TABLE bookings 
  DROP COLUMN preferred_date,
  ADD COLUMN seminar_id uuid REFERENCES seminars(id) NOT NULL;