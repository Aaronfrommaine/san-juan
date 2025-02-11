-- Drop existing message-related tables if they exist
DROP TABLE IF EXISTS thread_messages CASCADE;
DROP TABLE IF EXISTS message_threads CASCADE;

-- Create group chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seminar_id uuid REFERENCES seminars(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_chat_messages_seminar ON chat_messages(seminar_id);
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

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

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_chat_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_chat_messages_timestamp
  BEFORE UPDATE ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_messages_updated_at();