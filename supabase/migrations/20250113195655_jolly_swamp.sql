-- Create function to handle attendee creation from admin panel
CREATE OR REPLACE FUNCTION create_attendee(
  p_first_name text,
  p_last_name text,
  p_email text,
  p_phone text,
  p_company text,
  p_seminar_id uuid,
  p_package_name text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_spots_remaining integer;
BEGIN
  -- Check admin access
  IF NOT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email = 'aaron@abodekport.com'
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Check spots availability
  SELECT spots_remaining INTO v_spots_remaining
  FROM seminars
  WHERE id = p_seminar_id
  FOR UPDATE;

  IF v_spots_remaining <= 0 THEN
    RAISE EXCEPTION 'No spots remaining for this seminar';
  END IF;

  -- Create booking
  INSERT INTO bookings (
    user_id,
    seminar_id,
    first_name,
    last_name,
    email,
    phone,
    company,
    package_name,
    investment_goals,
    status
  ) VALUES (
    auth.uid(),
    p_seminar_id,
    p_first_name,
    p_last_name,
    p_email,
    p_phone,
    p_company,
    p_package_name,
    'Added by admin',
    'confirmed'
  )
  RETURNING user_id INTO v_user_id;

  -- Add attendee role
  INSERT INTO user_roles (user_id, role)
  VALUES (v_user_id, 'attendee')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Update spots count
  UPDATE seminars
  SET spots_remaining = spots_remaining - 1
  WHERE id = p_seminar_id;

  RETURN v_user_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_attendee TO authenticated;