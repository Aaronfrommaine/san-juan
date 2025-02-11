-- Drop existing objects to avoid conflicts
DROP POLICY IF EXISTS "Users can send messages to seminar attendees" ON direct_messages;
DROP POLICY IF EXISTS "Users can view their messages" ON direct_messages;
DROP POLICY IF EXISTS "Users can send messages" ON direct_messages;
DROP POLICY IF EXISTS "Admins and hosts can create announcements" ON group_announcements;
DROP POLICY IF EXISTS "Seminar attendees can view announcements" ON group_announcements;
DROP TRIGGER IF EXISTS validate_message_send_trigger ON direct_messages;
DROP FUNCTION IF EXISTS validate_message_send CASCADE;
DROP FUNCTION IF EXISTS check_message_permission CASCADE;
DROP FUNCTION IF EXISTS get_unread_message_count CASCADE;
DROP FUNCTION IF EXISTS mark_messages_read CASCADE;

-- Create direct messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS direct_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now(),
  seminar_id uuid REFERENCES seminars(id) ON DELETE CASCADE
);

-- Create group announcements table if it doesn't exist
CREATE TABLE IF NOT EXISTS group_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seminar_id uuid REFERENCES seminars(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_announcements ENABLE ROW LEVEL SECURITY;

-- Create function to validate message permissions
CREATE OR REPLACE FUNCTION validate_message_permissions(
  msg_sender_id uuid,
  msg_recipient_id uuid,
  msg_seminar_id uuid
)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM bookings b1
    JOIN bookings b2 ON b1.seminar_id = b2.seminar_id
    WHERE b1.user_id = msg_sender_id
    AND b2.user_id = msg_recipient_id
    AND b1.seminar_id = msg_seminar_id
    AND b1.status = 'confirmed'
    AND b2.status = 'confirmed'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policies for direct messages
CREATE POLICY "DM Send Policy"
  ON direct_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    validate_message_permissions(sender_id, recipient_id, seminar_id)
  );

CREATE POLICY "DM View Policy"
  ON direct_messages FOR SELECT
  USING (auth.uid() IN (sender_id, recipient_id));

-- Create policies for group announcements
CREATE POLICY "Announcement Create Policy"
  ON group_announcements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'host')
    )
  );

CREATE POLICY "Announcement View Policy"
  ON group_announcements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.user_id = auth.uid()
      AND b.seminar_id = group_announcements.seminar_id
      AND b.status = 'confirmed'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_direct_messages_sender ON direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_recipient ON direct_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_seminar ON direct_messages(seminar_id);
CREATE INDEX IF NOT EXISTS idx_group_announcements_seminar ON group_announcements(seminar_id);

-- Create function to get unread message count
CREATE OR REPLACE FUNCTION get_unread_messages(user_uuid uuid)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM direct_messages
    WHERE recipient_id = user_uuid
    AND read_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(
  other_user_uuid uuid,
  before_timestamp timestamptz DEFAULT now()
)
RETURNS void AS $$
BEGIN
  UPDATE direct_messages
  SET read_at = now()
  WHERE recipient_id = auth.uid()
  AND sender_id = other_user_uuid
  AND created_at <= before_timestamp
  AND read_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION validate_message_permissions TO authenticated;
GRANT EXECUTE ON FUNCTION get_unread_messages TO authenticated;
GRANT EXECUTE ON FUNCTION mark_messages_as_read TO authenticated;