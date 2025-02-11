-- Create lead tracking table
CREATE TABLE IF NOT EXISTS lead_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  signup_location text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lead_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view all lead tracking data"
  ON lead_tracking FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Users can insert their own lead data"
  ON lead_tracking FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
  );

-- Create indexes for better performance
CREATE INDEX idx_lead_tracking_user ON lead_tracking(user_id);
CREATE INDEX idx_lead_tracking_source ON lead_tracking(utm_source);
CREATE INDEX idx_lead_tracking_campaign ON lead_tracking(utm_campaign);
CREATE INDEX idx_lead_tracking_created ON lead_tracking(created_at);

-- Create analytics functions
CREATE OR REPLACE FUNCTION get_lead_analytics(
  start_date timestamptz,
  end_date timestamptz
)
RETURNS TABLE (
  total_leads bigint,
  conversion_rate numeric,
  sources jsonb,
  campaigns jsonb
) AS $$
BEGIN
  RETURN QUERY
  WITH lead_counts AS (
    SELECT
      COUNT(*) as total_leads,
      jsonb_object_agg(
        COALESCE(utm_source, 'direct'),
        COUNT(*)
      ) as sources,
      jsonb_object_agg(
        COALESCE(utm_campaign, 'none'),
        COUNT(*)
      ) as campaigns
    FROM lead_tracking
    WHERE created_at BETWEEN start_date AND end_date
  ),
  booking_counts AS (
    SELECT COUNT(*) as total_bookings
    FROM bookings
    WHERE created_at BETWEEN start_date AND end_date
  )
  SELECT
    lc.total_leads,
    CASE 
      WHEN lc.total_leads > 0 
      THEN ROUND((bc.total_bookings::numeric / lc.total_leads::numeric) * 100, 1)
      ELSE 0 
    END as conversion_rate,
    lc.sources,
    lc.campaigns
  FROM lead_counts lc
  CROSS JOIN booking_counts bc;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_lead_analytics TO authenticated;