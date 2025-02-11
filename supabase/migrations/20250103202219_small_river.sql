-- First ensure the sample users exist in auth.users
DO $$
DECLARE
  sarah_id uuid := '8d2efb36-a726-4c75-9e4a-61a24f63e719';
  michael_id uuid := 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  upcoming_seminar_id uuid;
BEGIN
  -- Create sample users if they don't exist
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
  ) VALUES
  (
    sarah_id,
    'sarah@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Sarah","last_name":"Martinez"}'
  ),
  (
    michael_id,
    'michael@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Michael","last_name":"Chen"}'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create profiles for sample users
  INSERT INTO profiles (
    id,
    first_name,
    last_name,
    avatar_type,
    company,
    title,
    bio,
    location,
    investment_focus
  ) VALUES 
  (
    sarah_id,
    'Sarah',
    'Martinez',
    'market_strategist',
    'Global Investments LLC',
    'Investment Director',
    'Experienced real estate investor focused on emerging markets.',
    'Miami, FL',
    ARRAY['Commercial', 'Mixed-Use', 'Sustainable Projects']
  ),
  (
    michael_id,
    'Michael',
    'Chen',
    'portfolio_powerhouse',
    'Pacific Ventures',
    'Principal',
    'Serial entrepreneur and property investor.',
    'San Francisco, CA',
    ARRAY['Luxury Real Estate', 'Hospitality', 'Income Properties']
  )
  ON CONFLICT (id) DO UPDATE SET
    avatar_type = EXCLUDED.avatar_type,
    company = EXCLUDED.company,
    title = EXCLUDED.title,
    bio = EXCLUDED.bio,
    location = EXCLUDED.location,
    investment_focus = EXCLUDED.investment_focus;

  -- Get the next upcoming seminar
  SELECT id INTO upcoming_seminar_id
  FROM seminars
  WHERE status = 'upcoming'
  ORDER BY start_date ASC
  LIMIT 1;

  -- Add sample users to the upcoming seminar
  INSERT INTO bookings (
    seminar_id,
    user_id,
    first_name,
    last_name,
    email,
    phone,
    company,
    investment_goals,
    package_name,
    status
  )
  SELECT
    upcoming_seminar_id,
    u.id,
    p.first_name,
    p.last_name,
    u.email,
    '+1234567890',
    p.company,
    'Looking for investment opportunities in Puerto Rico',
    'Elite Package',
    'confirmed'
  FROM auth.users u
  JOIN profiles p ON u.id = p.id
  WHERE u.id IN (sarah_id, michael_id)
  ON CONFLICT (user_id, seminar_id) DO UPDATE SET
    status = 'confirmed',
    package_name = 'Elite Package';

  -- Award some initial badges
  INSERT INTO awarded_badges (user_id, badge_id, metadata)
  SELECT 
    u.id,
    b.id,
    jsonb_build_object('awarded_for', 'Initial profile creation')
  FROM auth.users u
  CROSS JOIN badges b
  WHERE u.id IN (sarah_id, michael_id)
  AND b.name IN ('Investor Avatar', 'Network Builder')
  ON CONFLICT (user_id, badge_id) DO NOTHING;
END $$;

-- Recreate the seminar_attendees view
DROP VIEW IF EXISTS seminar_attendees;

CREATE VIEW seminar_attendees AS
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.avatar_url,
  p.avatar_type,
  p.company,
  p.title,
  p.bio,
  p.location,
  p.investment_focus,
  b.email,
  b.phone,
  b.package_name,
  b.seminar_id
FROM profiles p
JOIN bookings b ON b.user_id = p.id
WHERE b.status = 'confirmed';

-- Grant select permission to authenticated users
GRANT SELECT ON seminar_attendees TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_seminar_status 
ON bookings(seminar_id, status);

CREATE INDEX IF NOT EXISTS idx_bookings_user_seminar 
ON bookings(user_id, seminar_id);