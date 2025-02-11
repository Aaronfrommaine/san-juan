/*
  # Hotel and Room Management System

  1. New Tables
    - `hotels`: Stores hotel properties
    - `room_types`: Different room categories
    - `rooms`: Individual rooms
    - `room_assignments`: Links rooms to bookings

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
    - Add policies for user access to their assignments

  3. Initial Data
    - Add Córcega Beach Resort and LUZ properties
    - Add room types for each package level
    - Add sample rooms
*/

-- Create hotels table
CREATE TABLE hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  description text,
  amenities jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create room types table
CREATE TABLE room_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid REFERENCES hotels(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  package_level text NOT NULL CHECK (package_level IN ('standard', 'vip', 'elite')),
  amenities jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(hotel_id, name)
);

-- Create rooms table
CREATE TABLE rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid REFERENCES hotels(id) ON DELETE CASCADE,
  room_type_id uuid REFERENCES room_types(id) ON DELETE CASCADE,
  room_number text NOT NULL,
  floor text,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(hotel_id, room_number)
);

-- Create room assignments table
CREATE TABLE room_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(room_id, booking_id),
  CONSTRAINT valid_dates CHECK (check_out_date > check_in_date)
);

-- Enable RLS
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view hotels"
  ON hotels FOR SELECT
  USING (true);

CREATE POLICY "Public can view room types"
  ON room_types FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage hotels"
  ON hotels FOR ALL
  USING (auth.email() = 'aaron@abodekport.com')
  WITH CHECK (auth.email() = 'aaron@abodekport.com');

CREATE POLICY "Admin can manage room types"
  ON room_types FOR ALL
  USING (auth.email() = 'aaron@abodekport.com')
  WITH CHECK (auth.email() = 'aaron@abodekport.com');

CREATE POLICY "Admin can manage rooms"
  ON rooms FOR ALL
  USING (auth.email() = 'aaron@abodekport.com')
  WITH CHECK (auth.email() = 'aaron@abodekport.com');

CREATE POLICY "Admin can manage room assignments"
  ON room_assignments FOR ALL
  USING (auth.email() = 'aaron@abodekport.com')
  WITH CHECK (auth.email() = 'aaron@abodekport.com');

CREATE POLICY "Users can view their room assignments"
  ON room_assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = room_assignments.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Insert initial data
INSERT INTO hotels (name, location, description, amenities)
VALUES
  (
    'Córcega Beach Resort',
    'Rincón, Puerto Rico',
    'Beachfront resort with direct access to Córcega Beach',
    '{"pool": true, "beach_access": true, "restaurant": true, "spa": true, "fitness_center": true, "conference_facilities": true}'::jsonb
  ),
  (
    'LUZ Hotel',
    'Santurce, Puerto Rico',
    'Modern urban hotel in the heart of Santurce arts district',
    '{"pool": true, "rooftop_bar": true, "restaurant": true, "fitness_center": true, "art_gallery": true, "conference_facilities": true}'::jsonb
  );

-- Insert room types for Córcega Beach Resort
WITH hotel AS (SELECT id FROM hotels WHERE name = 'Córcega Beach Resort')
INSERT INTO room_types (hotel_id, name, description, package_level, amenities)
VALUES
  (
    (SELECT id FROM hotel),
    'Beach Walk-Out Elite',
    'Direct beach access with private terrace',
    'elite',
    '{"size": "800 sqft", "bed": "King", "view": "Ocean", "terrace": true, "beach_access": true, "butler_service": true}'::jsonb
  ),
  (
    (SELECT id FROM hotel),
    'Ocean View VIP',
    'Premium room with ocean views',
    'vip',
    '{"size": "600 sqft", "bed": "King", "view": "Ocean", "balcony": true}'::jsonb
  ),
  (
    (SELECT id FROM hotel),
    'Standard Garden View',
    'Comfortable room with garden views',
    'standard',
    '{"size": "400 sqft", "bed": "Queen", "view": "Garden"}'::jsonb
  );

-- Insert room types for LUZ Hotel
WITH hotel AS (SELECT id FROM hotels WHERE name = 'LUZ Hotel')
INSERT INTO room_types (hotel_id, name, description, package_level, amenities)
VALUES
  (
    (SELECT id FROM hotel),
    'Penthouse Elite Suite',
    'Top floor suite with city views',
    'elite',
    '{"size": "1000 sqft", "bed": "King", "view": "City", "terrace": true, "butler_service": true}'::jsonb
  ),
  (
    (SELECT id FROM hotel),
    'Executive VIP Suite',
    'Spacious suite with modern amenities',
    'vip',
    '{"size": "700 sqft", "bed": "King", "view": "City", "balcony": true}'::jsonb
  ),
  (
    (SELECT id FROM hotel),
    'Urban Standard Room',
    'Contemporary room with city convenience',
    'standard',
    '{"size": "450 sqft", "bed": "Queen", "view": "City"}'::jsonb
  );

-- Insert sample rooms for Córcega Beach Resort
WITH hotel AS (
  SELECT h.id as hotel_id, rt.id as elite_id, rt2.id as vip_id, rt3.id as standard_id
  FROM hotels h
  LEFT JOIN room_types rt ON h.id = rt.hotel_id AND rt.package_level = 'elite'
  LEFT JOIN room_types rt2 ON h.id = rt2.hotel_id AND rt2.package_level = 'vip'
  LEFT JOIN room_types rt3 ON h.id = rt3.hotel_id AND rt3.package_level = 'standard'
  WHERE h.name = 'Córcega Beach Resort'
)
INSERT INTO rooms (hotel_id, room_type_id, room_number, floor)
SELECT
  hotel_id,
  CASE 
    WHEN room_number <= 103 THEN elite_id
    WHEN room_number <= 106 THEN vip_id
    ELSE standard_id
  END,
  LPAD(room_number::text, 3, '0'),
  '1'
FROM hotel, generate_series(101, 110) as room_number;

-- Insert sample rooms for LUZ Hotel
WITH hotel AS (
  SELECT h.id as hotel_id, rt.id as elite_id, rt2.id as vip_id, rt3.id as standard_id
  FROM hotels h
  LEFT JOIN room_types rt ON h.id = rt.hotel_id AND rt.package_level = 'elite'
  LEFT JOIN room_types rt2 ON h.id = rt2.hotel_id AND rt2.package_level = 'vip'
  LEFT JOIN room_types rt3 ON h.id = rt3.hotel_id AND rt3.package_level = 'standard'
  WHERE h.name = 'LUZ Hotel'
)
INSERT INTO rooms (hotel_id, room_type_id, room_number, floor)
SELECT
  hotel_id,
  CASE 
    WHEN room_number <= 503 THEN elite_id
    WHEN room_number <= 506 THEN vip_id
    ELSE standard_id
  END,
  LPAD(room_number::text, 3, '0'),
  '5'
FROM hotel, generate_series(501, 510) as room_number;

-- Create indexes for better performance
CREATE INDEX idx_rooms_hotel_status ON rooms(hotel_id, status);
CREATE INDEX idx_room_assignments_dates ON room_assignments(check_in_date, check_out_date);
CREATE INDEX idx_room_assignments_booking ON room_assignments(booking_id);