/*
  # Messaging System Setup

  1. New Tables
    - `message_threads`: Stores conversation threads between users
    - `thread_messages`: Stores individual messages within threads

  2. Security
    - Enable RLS on both tables
    - Add policies for thread and message access
    - Ensure users can only access their own conversations

  3. Features
    - Automatic thread timestamp updates
    - Indexes for performance
    - Message read status tracking
*/

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS message_threads_participants_idx;
DROP INDEX IF EXISTS thread_messages_thread_id_idx;
DROP INDEX IF EXISTS thread_messages_sender_id_idx;
DROP INDEX IF EXISTS thread_messages_created_at_idx;

-- Create message threads table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'message_threads') THEN
    CREATE TABLE message_threads (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      participants uuid[] NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      CONSTRAINT participants_not_empty CHECK (array_length(participants, 1) > 0)
    );
  END IF;
END $$;

-- Create thread messages table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'thread_messages') THEN
    CREATE TABLE thread_messages (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      thread_id uuid NOT NULL,
      sender_id uuid NOT NULL,
      content text NOT NULL,
      created_at timestamptz DEFAULT now(),
      read_at timestamptz,
      CONSTRAINT fk_thread FOREIGN KEY (thread_id) REFERENCES message_threads(id) ON DELETE CASCADE,
      CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE
    );
  END IF;
END $$;

-- Create new indexes
CREATE INDEX IF NOT EXISTS message_threads_participants_idx_new ON message_threads USING gin(participants);
CREATE INDEX IF NOT EXISTS thread_messages_thread_id_idx_new ON thread_messages(thread_id);
CREATE INDEX IF NOT EXISTS thread_messages_sender_id_idx_new ON thread_messages(sender_id);
CREATE INDEX IF NOT EXISTS thread_messages_created_at_idx_new ON thread_messages(created_at);

-- Enable RLS
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE thread_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their threads" ON message_threads;
DROP POLICY IF EXISTS "Users can create threads with themselves as participant" ON message_threads;
DROP POLICY IF EXISTS "Users can view messages in their threads" ON thread_messages;
DROP POLICY IF EXISTS "Users can send messages to their threads" ON thread_messages;

-- Create policies for message threads
CREATE POLICY "Users can view their threads"
  ON message_threads FOR SELECT
  USING (auth.uid() = ANY(participants));

CREATE POLICY "Users can create threads with themselves as participant"
  ON message_threads FOR INSERT
  WITH CHECK (auth.uid() = ANY(participants));

-- Create policies for messages
CREATE POLICY "Users can view messages in their threads"
  ON thread_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM message_threads
      WHERE message_threads.id = thread_id
      AND auth.uid() = ANY(message_threads.participants)
    )
  );

CREATE POLICY "Users can send messages to their threads"
  ON thread_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM message_threads
      WHERE message_threads.id = thread_id
      AND auth.uid() = ANY(message_threads.participants)
    )
  );

-- Create or replace function to update thread updated_at
CREATE OR REPLACE FUNCTION update_thread_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE message_threads
  SET updated_at = now()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_thread_timestamp ON thread_messages;

-- Create trigger
CREATE TRIGGER update_thread_timestamp
  AFTER INSERT ON thread_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_thread_updated_at();