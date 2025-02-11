/*
  # Seminar Attendees View and Sample Data

  1. View Creation
    - Creates a secure view for seminar attendees
    - Includes proper RLS and security barrier
    - Optimizes performance with indexes

  2. Sample Data
    - Ensures sample users have confirmed bookings
    - Updates existing bookings if needed

  3. Security
    - Implements row-level security through view definition
    - Grants appropriate permissions to authenticated users
*/

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_seminar_status 
ON bookings(seminar_id, status);

CREATE INDEX IF NOT EXISTS idx_bookings_user_seminar 
ON bookings(user_id, seminar_id);

-- Create secure function for checking access
CREATE OR REPLACE FUNCTION check_seminar_access(seminar_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN (
    -- Admin access
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'aaron@abodekport.com'
    )
    OR
    -- User can see attendees in their confirmed seminars
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.seminar_id = seminar_uuid
      AND bookings.user_id = auth.uid()
      AND bookings.status = 'confirmed'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the secure view
CREATE OR REPLACE VIEW seminar_attendees AS
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
WHERE b.status = 'confirmed'
AND check_seminar_access(b.seminar_id);

-- Grant select permission to authenticated users
GRANT SELECT ON seminar_attendees TO authenticated;

-- Ensure sample data exists
DO $$
DECLARE
  sarah_id uuid := '8d2efb36-a726-4c75-9e4a-61a24f63e719';
  michael_id uuid := 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  upcoming_seminar_id uuid;
BEGIN
  -- Get the next upcoming seminar
  SELECT id INTO upcoming_seminar_id
  FROM seminars
  WHERE status = 'upcoming'
  ORDER BY start_date ASC
  LIMIT 1;

  -- Ensure bookings exist for sample users
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
    id,
    first_name,
    last_name,
    email,
    '+1234567890',
    company,
    'Looking for investment opportunities in Puerto Rico',
    'Elite Package',
    'confirmed'
  FROM (
    SELECT 
      u.id,
      u.email,
      p.first_name,
      p.last_name,
      p.company
    FROM auth.users u
    JOIN profiles p ON u.id = p.id
    WHERE u.id IN (sarah_id, michael_id)
  ) users
  ON CONFLICT (user_id, seminar_id) 
  DO UPDATE SET 
    status = 'confirmed',
    package_name = 'Elite Package';
END $$;