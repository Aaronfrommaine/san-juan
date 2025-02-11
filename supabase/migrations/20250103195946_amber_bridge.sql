-- Get the sample user IDs
DO $$
DECLARE
  sarah_id uuid := '8d2efb36-a726-4c75-9e4a-61a24f63e719';
  michael_id uuid := 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  upcoming_seminar_id uuid;
BEGIN
  -- Get the ID of the next upcoming seminar
  SELECT id INTO upcoming_seminar_id
  FROM seminars
  WHERE status = 'upcoming'
  ORDER BY start_date ASC
  LIMIT 1;

  -- Delete any existing bookings for these users
  DELETE FROM bookings
  WHERE user_id IN (sarah_id, michael_id);

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
END $$;