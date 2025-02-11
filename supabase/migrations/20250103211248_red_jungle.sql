-- Assign rooms to test users and host
DO $$
DECLARE
  sarah_id uuid := '8d2efb36-a726-4c75-9e4a-61a24f63e719';
  michael_id uuid := 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
  upcoming_seminar_id uuid;
  sarah_booking_id uuid;
  michael_booking_id uuid;
  host_booking_id uuid;
  elite_room_id uuid;
  vip_room_id uuid;
  standard_room_id uuid;
BEGIN
  -- Get upcoming seminar
  SELECT id INTO upcoming_seminar_id
  FROM seminars
  WHERE status = 'upcoming'
  ORDER BY start_date ASC
  LIMIT 1;

  -- Get booking IDs
  SELECT id INTO sarah_booking_id
  FROM bookings
  WHERE user_id = sarah_id AND seminar_id = upcoming_seminar_id;

  SELECT id INTO michael_booking_id
  FROM bookings
  WHERE user_id = michael_id AND seminar_id = upcoming_seminar_id;

  SELECT id INTO host_booking_id
  FROM bookings
  WHERE seminar_id = upcoming_seminar_id
  AND user_id IN (SELECT id FROM auth.users WHERE email = 'aaron@abodekport.com');

  -- Get room IDs from Córcega Beach Resort
  WITH hotel AS (SELECT id FROM hotels WHERE name = 'Córcega Beach Resort')
  SELECT 
    r.id INTO elite_room_id
  FROM rooms r
  JOIN room_types rt ON r.room_type_id = rt.id
  WHERE rt.package_level = 'elite'
  AND r.hotel_id = (SELECT id FROM hotel)
  AND r.status = 'available'
  LIMIT 1;

  WITH hotel AS (SELECT id FROM hotels WHERE name = 'Córcega Beach Resort')
  SELECT 
    r.id INTO vip_room_id
  FROM rooms r
  JOIN room_types rt ON r.room_type_id = rt.id
  WHERE rt.package_level = 'vip'
  AND r.hotel_id = (SELECT id FROM hotel)
  AND r.status = 'available'
  LIMIT 1;

  WITH hotel AS (SELECT id FROM hotels WHERE name = 'Córcega Beach Resort')
  SELECT 
    r.id INTO standard_room_id
  FROM rooms r
  JOIN room_types rt ON r.room_type_id = rt.id
  WHERE rt.package_level = 'standard'
  AND r.hotel_id = (SELECT id FROM hotel)
  AND r.status = 'available'
  LIMIT 1;

  -- Create room assignments
  INSERT INTO room_assignments (
    room_id,
    booking_id,
    check_in_date,
    check_out_date,
    status
  )
  VALUES
    (
      elite_room_id,
      host_booking_id,
      (SELECT start_date FROM seminars WHERE id = upcoming_seminar_id),
      (SELECT end_date FROM seminars WHERE id = upcoming_seminar_id),
      'confirmed'
    ),
    (
      vip_room_id,
      sarah_booking_id,
      (SELECT start_date FROM seminars WHERE id = upcoming_seminar_id),
      (SELECT end_date FROM seminars WHERE id = upcoming_seminar_id),
      'confirmed'
    ),
    (
      standard_room_id,
      michael_booking_id,
      (SELECT start_date FROM seminars WHERE id = upcoming_seminar_id),
      (SELECT end_date FROM seminars WHERE id = upcoming_seminar_id),
      'confirmed'
    )
  ON CONFLICT (room_id, booking_id) DO NOTHING;

  -- Update room status
  UPDATE rooms
  SET status = 'occupied'
  WHERE id IN (elite_room_id, vip_room_id, standard_room_id);
END $$;