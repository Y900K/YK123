-- Migration: Create RPC function to seed default shifts
-- This migration is idempotent and safe to run multiple times

CREATE OR REPLACE FUNCTION app_seed_default_shifts(p_org_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only seed if no shifts exist for this org
  IF NOT EXISTS (SELECT 1 FROM shifts WHERE org_id = p_org_id) THEN
    -- Insert Day Shift (09:00 - 18:00)
    INSERT INTO shifts (
      org_id, 
      name, 
      start_time, 
      end_time, 
      required_minutes, 
      grace_in_minutes, 
      is_overnight
    )
    VALUES (
      p_org_id,
      'Day Shift',
      '09:00:00',
      '18:00:00',
      510, -- 8.5 hours
      15,
      FALSE
    );

    -- Insert Night Shift (21:00 - 06:00 next day)
    INSERT INTO shifts (
      org_id, 
      name, 
      start_time, 
      end_time, 
      required_minutes, 
      grace_in_minutes, 
      is_overnight
    )
    VALUES (
      p_org_id,
      'Night Shift',
      '21:00:00',
      '06:00:00',
      510, -- 8.5 hours
      15,
      TRUE
    );
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION app_seed_default_shifts TO authenticated;
