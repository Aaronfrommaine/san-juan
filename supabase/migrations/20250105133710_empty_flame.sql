-- Create travel quiz responses table
CREATE TABLE travel_quiz_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  answers jsonb NOT NULL,
  total_score integer NOT NULL,
  travel_persona text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE travel_quiz_responses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own responses"
  ON travel_quiz_responses
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NULL OR
    auth.uid() = user_id
  );

CREATE POLICY "Users can view their own responses"
  ON travel_quiz_responses
  FOR SELECT
  USING (
    auth.uid() IS NULL OR
    auth.uid() = user_id
  );

-- Create index for better performance
CREATE INDEX idx_travel_quiz_responses_user ON travel_quiz_responses(user_id);