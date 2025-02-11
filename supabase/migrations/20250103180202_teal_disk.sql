/*
  # Messaging System Schema

  1. New Tables
    - `message_threads`
      - `id` (uuid, primary key)
      - `participants` (uuid array)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `thread_messages`
      - `id` (uuid, primary key)
      - `thread_id` (uuid, references message_threads)
      - `sender_id` (uuid, references auth.users)
      - `content` (text)
      - `created_at` (timestamptz)
      - `read_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for thread and message access
    - Add policies for message creation

  3. Indexes
    - Add indexes for efficient querying
*/

-- Create message threads table
CREATE TABLE IF NOT EXISTS message_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participants uuid[] NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT participants_not_empty CHECK (array_length(participants, 1) > 0)
);

-- Create thread messages table
CREATE TABLE IF NOT EXISTS thread_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz,
  CONSTRAINT fk_thread FOREIGN KEY (thread_id) REFERENCES message_threads(id) ON DELETE CASCADE,
  CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX message_threads_participants_idx ON message_threads USING gin(participants);
CREATE INDEX thread_messages_thread_id_idx ON thread_messages(thread_id);
CREATE INDEX thread_messages_sender_id_idx ON thread_messages(sender_id);
CREATE INDEX thread_messages_created_at_idx ON thread_messages(created_at);

-- Enable RLS
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE thread_messages ENABLE ROW LEVEL SECURITY;

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
      WHERE message_threads.id = thread_messages.thread_id
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

-- Create function to update thread updated_at
CREATE OR REPLACE FUNCTION update_thread_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE message_threads
  SET updated_at = now()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_thread_timestamp
  AFTER INSERT ON thread_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_thread_updated_at();