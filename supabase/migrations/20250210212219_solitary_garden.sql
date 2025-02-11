-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('profile_pictures', 'profile_pictures', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create base tables
CREATE TABLE IF NOT EXISTS seminars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date date NOT NULL,
  end_date date NOT NULL,
  location text NOT NULL,
  total_spots integer NOT NULL,
  spots_remaining integer NOT NULL,
  status text NOT NULL CHECK (status IN ('upcoming', 'in-progress', 'completed')) DEFAULT 'upcoming',
  created_at timestamptz DEFAULT now(),
  seminar_code text UNIQUE,
  attendee_count integer DEFAULT 0,
  CONSTRAINT valid_dates CHECK (end_date >= start_date),
  CONSTRAINT valid_spots CHECK (spots_remaining >= 0 AND spots_remaining <= total_spots)
);

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  avatar_url text,
  avatar_type text CHECK (avatar_type IN ('portfolio_powerhouse', 'heritage_builder', 'changemaker', 'market_strategist', 'paradise_planner')),
  company text,
  title text,
  bio text,
  location text,
  investment_focus text[],
  linkedin_url text,
  website_url text,
  is_host boolean DEFAULT false,
  avatar_result jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seminar_id uuid REFERENCES seminars(id),
  user_id uuid REFERENCES auth.users(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company text,
  investment_goals text NOT NULL,
  package_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  price integer,
  include_spouse boolean DEFAULT false,
  spouse_first_name text,
  spouse_last_name text,
  spouse_email text,
  spouse_price integer,
  attendee_code text UNIQUE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, seminar_id)
);

CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  icon_url text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS awarded_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at timestamptz DEFAULT now(),
  metadata jsonb,
  UNIQUE(user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'host', 'attendee', 'interested', 'vendor', 'service_provider')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

CREATE TABLE IF NOT EXISTS host_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seminar_id uuid REFERENCES seminars(id) ON DELETE CASCADE,
  host_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(seminar_id, host_id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seminar_id uuid REFERENCES seminars(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS direct_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now(),
  seminar_id uuid REFERENCES seminars(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS group_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seminar_id uuid REFERENCES seminars(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  description text,
  amenities jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS room_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid REFERENCES hotels(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  package_level text NOT NULL CHECK (package_level IN ('standard', 'vip', 'elite')),
  amenities jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(hotel_id, name)
);

CREATE TABLE IF NOT EXISTS rooms (
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

CREATE TABLE IF NOT EXISTS room_assignments (
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

CREATE TABLE IF NOT EXISTS itinerary_items (
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
  package_type text NOT NULL DEFAULT 'standard' CHECK (package_type IN ('standard', 'vip', 'elite')),
  meal_details jsonb,
  tour_details jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

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

CREATE TABLE IF NOT EXISTS lead_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  signup_location text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS professionals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  type text NOT NULL CHECK (type IN ('attorney', 'accountant', 'bookkeeper', 'developer', 'realtor', 'contractor')),
  description text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  website text,
  image text NOT NULL,
  specialties text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_seminar ON bookings(seminar_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_seminars_status ON seminars(status);
CREATE INDEX IF NOT EXISTS idx_seminars_dates ON seminars(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_chat_messages_seminar ON chat_messages(seminar_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_users ON direct_messages(sender_id, recipient_id);
CREATE INDEX IF NOT EXISTS idx_room_assignments_dates ON room_assignments(check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_seminar ON itinerary_items(seminar_id);
CREATE INDEX IF NOT EXISTS idx_lead_tracking_user ON lead_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_professionals_type ON professionals(type);

-- Enable Row Level Security
ALTER TABLE seminars ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE awarded_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE host_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Note: You'll need to implement specific policies based on your security requirements
-- Here's an example for profiles:

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Insert initial badges
INSERT INTO badges (name, description, icon_url, category) VALUES
  ('Investor Avatar', 'Completed the investor questionnaire', '/badges/avatar.svg', 'onboarding'),
  ('Seminar Graduate', 'Completed the on-island investment seminar', '/badges/graduate.svg', 'education'),
  ('First Investment', 'Made first property investment in Puerto Rico', '/badges/investment.svg', 'achievement'),
  ('Network Builder', 'Connected with 10+ fellow investors', '/badges/network.svg', 'community'),
  ('Local Expert', 'Contributed valuable insights to the community', '/badges/expert.svg', 'contribution'),
  ('Travel Ready', 'Completed all travel preparation checklist items', '/badges/travel.svg', 'preparation'),
  ('Seminar Host', 'Official seminar host and local expert', '/badges/host.svg', 'role')
ON CONFLICT (name) DO NOTHING;

-- Create admin user role
DO $$
BEGIN
  INSERT INTO user_roles (user_id, role)
  SELECT id, 'admin'
  FROM auth.users
  WHERE email = 'aaron@abodekport.com'
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;