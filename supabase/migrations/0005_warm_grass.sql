/*
  # Add chat system tables and policies

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `seminar_id` (uuid, references seminars)
      - `user_id` (uuid, references auth.users)
      - `content` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on messages table
    - Add policies for:
      - Users can read messages from their booked seminars
      - Users can create messages in their booked seminars
*/

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seminar_id uuid REFERENCES seminars(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policy for reading messages
CREATE POLICY "Users can read messages from their booked seminars"
  ON messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.seminar_id = messages.seminar_id
      AND bookings.user_id = auth.uid()
      AND bookings.status = 'confirmed'
    )
  );

-- Create policy for creating messages
CREATE POLICY "Users can create messages in their booked seminars"
  ON messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.seminar_id = messages.seminar_id
      AND bookings.user_id = auth.uid()
      AND bookings.status = 'confirmed'
    )
  );

-- Create index for faster message retrieval
CREATE INDEX messages_seminar_id_created_at_idx ON messages(seminar_id, created_at);