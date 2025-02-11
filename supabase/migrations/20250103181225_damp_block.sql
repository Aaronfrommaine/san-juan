-- Create sample users in auth schema
DO $$
DECLARE
  sarah_id uuid := '8d2efb36-a726-4c75-9e4a-61a24f63e719';
  michael_id uuid := 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
BEGIN
  -- First, ensure the unique constraint exists on bookings table
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'bookings_user_id_seminar_id_key'
  ) THEN
    ALTER TABLE bookings 
    ADD CONSTRAINT bookings_user_id_seminar_id_key 
    UNIQUE (user_id, seminar_id);
  END IF;

  -- Insert sample users if they don't exist
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
    investment_focus,
    linkedin_url,
    website_url
  ) VALUES 
  (
    sarah_id,
    'Sarah',
    'Martinez',
    'market_strategist',
    'Global Investments LLC',
    'Investment Director',
    'Experienced real estate investor focused on emerging markets and sustainable development opportunities in Puerto Rico.',
    'Miami, FL',
    ARRAY['Commercial', 'Mixed-Use', 'Sustainable Projects'],
    'https://linkedin.com/in/sarahmartinez',
    'https://globalinvestments.com'
  ),
  (
    michael_id,
    'Michael',
    'Chen',
    'portfolio_powerhouse',
    'Pacific Ventures',
    'Principal',
    'Serial entrepreneur and property investor with a focus on luxury developments and hospitality projects.',
    'San Francisco, CA',
    ARRAY['Luxury Real Estate', 'Hospitality', 'Income Properties'],
    'https://linkedin.com/in/michaelchen',
    'https://pacificventures.com'
  )
  ON CONFLICT (id) DO UPDATE SET
    avatar_type = EXCLUDED.avatar_type,
    company = EXCLUDED.company,
    title = EXCLUDED.title,
    bio = EXCLUDED.bio,
    location = EXCLUDED.location,
    investment_focus = EXCLUDED.investment_focus,
    linkedin_url = EXCLUDED.linkedin_url,
    website_url = EXCLUDED.website_url;

  -- Add sample users to the first upcoming seminar
  WITH upcoming_seminar AS (
    SELECT id FROM seminars 
    WHERE status = 'upcoming' 
    ORDER BY start_date ASC 
    LIMIT 1
  )
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
    s.id,
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
  CROSS JOIN upcoming_seminar s
  WHERE u.id IN (sarah_id, michael_id)
  ON CONFLICT ON CONSTRAINT bookings_user_id_seminar_id_key DO NOTHING;

  -- Award badges
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