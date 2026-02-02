-- Migration: Create shifts table
-- This migration is idempotent and safe to run multiple times

-- Create shifts table if it doesn't exist
CREATE TABLE IF NOT EXISTS shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  required_minutes INTEGER NOT NULL DEFAULT 510, -- 8.5 hours
  grace_in_minutes INTEGER NOT NULL DEFAULT 15,
  is_overnight BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_shifts_org_id ON shifts(org_id);

-- Enable RLS
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "shifts_select_org" ON shifts;
DROP POLICY IF EXISTS "shifts_manage_org_admin" ON shifts;

-- Policy: Employees can view shifts in their org
CREATE POLICY "shifts_select_org" ON shifts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM employees AS e
      WHERE e.user_id = auth.uid()
        AND e.org_id = shifts.org_id
    )
  );

-- Policy: Org admins can manage shifts in their org
CREATE POLICY "shifts_manage_org_admin" ON shifts
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM employees AS e
      WHERE e.user_id = auth.uid()
        AND e.org_id = shifts.org_id
        AND e.role = 'org_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees AS e
      WHERE e.user_id = auth.uid()
        AND e.org_id = shifts.org_id
        AND e.role = 'org_admin'
    )
  );

-- Add shift_id column to employees table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'employees' AND column_name = 'shift_id'
  ) THEN
    ALTER TABLE employees ADD COLUMN shift_id UUID REFERENCES shifts(id);
  END IF;
END $$;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_employees_shift_id ON employees(shift_id);
