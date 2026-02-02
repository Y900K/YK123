-- Migration: Add onboarding columns to employees table
-- This migration is idempotent and safe to run multiple times

-- Add columns if they don't exist
DO $$ 
BEGIN
  -- Add full_name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'employees' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE employees ADD COLUMN full_name TEXT;
  END IF;

  -- Add employee_code column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'employees' AND column_name = 'employee_code'
  ) THEN
    ALTER TABLE employees ADD COLUMN employee_code TEXT;
  END IF;

  -- Add department_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'employees' AND column_name = 'department_id'
  ) THEN
    ALTER TABLE employees ADD COLUMN department_id UUID REFERENCES departments(id);
  END IF;

  -- Add mobile_number column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'employees' AND column_name = 'mobile_number'
  ) THEN
    ALTER TABLE employees ADD COLUMN mobile_number TEXT;
  END IF;

  -- Add onboarding_completed column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'employees' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE employees ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE NOT NULL;
  END IF;
END $$;

-- Create unique constraint on (org_id, employee_code)
-- Drop first if exists to make it idempotent
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'employees_org_id_employee_code_key'
  ) THEN
    ALTER TABLE employees DROP CONSTRAINT employees_org_id_employee_code_key;
  END IF;
  
  ALTER TABLE employees ADD CONSTRAINT employees_org_id_employee_code_key 
    UNIQUE (org_id, employee_code);
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Constraint already exists
END $$;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_employees_onboarding 
  ON employees(org_id, onboarding_completed);
