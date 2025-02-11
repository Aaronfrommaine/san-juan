/*
  # Add Host to Seminar

  1. Changes
    - Ensures admin user is added as a host
    - Creates host assignment for upcoming seminar
    - Awards host badge

  2. Security
    - Uses existing RLS policies
    - Maintains data integrity
*/

DO $$
DECLARE
  admin_id uuid;
  upcoming_seminar_id uuid;
BEGIN
  -- Get admin user ID
  SELECT id INTO admin_id
  FROM auth.users
  WHERE email = 'aaron@abodekport.com';

  -- Get upcoming seminar
  SELECT id INTO upcoming_seminar_id
  FROM seminars
  WHERE status = 'upcoming'
  ORDER BY start_date ASC
  LIMIT 1;

  -- Ensure admin is marked as host
  UPDATE profiles 
  SET is_host = true 
  WHERE id = admin_id;

  -- Create host assignment
  INSERT INTO host_assignments (
    seminar_id,
    host_id
  )
  VALUES (
    upcoming_seminar_id,
    admin_id
  )
  ON CONFLICT (seminar_id, host_id) DO NOTHING;

  -- Create booking for admin
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
    COALESCE(p.first_name, 'Aaron'),
    COALESCE(p.last_name, 'Admin'),
    u.email,
    '+1234567890',
    'Abodek Port',
    'Hosting and managing investment seminars',
    'Elite Package',
    'confirmed'
  FROM auth.users u
  LEFT JOIN profiles p ON u.id = p.id
  WHERE u.email = 'aaron@abodekport.com'
  ON CONFLICT (user_id, seminar_id) 
  DO UPDATE SET 
    status = 'confirmed',
    package_name = 'Elite Package';
END $$;