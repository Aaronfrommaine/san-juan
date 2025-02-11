-- Create index for faster joins if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_bookings_user_id'
  ) THEN
    CREATE INDEX idx_bookings_user_id ON bookings(user_id);
  END IF;
END $$;

-- Create or replace the seminar attendees view with security barrier
CREATE OR REPLACE VIEW seminar_attendees 
WITH (security_barrier) AS
SELECT 
  p.*,
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

-- Grant appropriate permissions
GRANT SELECT ON seminar_attendees TO authenticated;