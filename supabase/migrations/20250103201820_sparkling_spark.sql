-- Drop and recreate the view with proper permissions
DROP VIEW IF EXISTS seminar_attendees;

-- Create the view with security barrier
CREATE OR REPLACE VIEW seminar_attendees 
WITH (security_barrier) AS
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
AND (
  -- Admin access
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email = 'aaron@abodekport.com'
  )
  OR
  -- User can see attendees in their confirmed seminars
  EXISTS (
    SELECT 1 FROM bookings user_booking
    WHERE user_booking.seminar_id = b.seminar_id
    AND user_booking.user_id = auth.uid()
    AND user_booking.status = 'confirmed'
  )
);

-- Grant select permission to authenticated users
GRANT SELECT ON seminar_attendees TO authenticated;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_bookings_seminar_status 
ON bookings(seminar_id, status);