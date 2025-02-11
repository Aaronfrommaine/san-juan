-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view messages from their seminars" ON chat_messages;
DROP POLICY IF EXISTS "Users can send messages to their seminars" ON chat_messages;

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_chat_messages_seminar;
DROP INDEX IF EXISTS idx_chat_messages_sender;
DROP INDEX IF EXISTS idx_chat_messages_created_at;

-- Drop and recreate chat_messages table with proper relationships
DROP TABLE IF EXISTS chat_messages;
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seminar_id uuid REFERENCES seminars(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_chat_messages_seminar ON chat_messages(seminar_id);
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view messages from their seminars"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.seminar_id = chat_messages.seminar_id
      AND bookings.user_id = auth.uid()
      AND bookings.status = 'confirmed'
    )
    OR
    EXISTS (
      SELECT 1 FROM host_assignments
      WHERE host_assignments.seminar_id = chat_messages.seminar_id
      AND host_assignments.host_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their seminars"
  ON chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.seminar_id = chat_messages.seminar_id
      AND bookings.user_id = auth.uid()
      AND bookings.status = 'confirmed'
    )
    OR
    EXISTS (
      SELECT 1 FROM host_assignments
      WHERE host_assignments.seminar_id = chat_messages.seminar_id
      AND host_assignments.host_id = auth.uid()
    )
  );