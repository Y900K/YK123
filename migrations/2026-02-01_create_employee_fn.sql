-- Migration: Create RPC function to create employee record if missing
-- This migration is idempotent and safe to run multiple times

CREATE OR REPLACE FUNCTION app_create_employee_if_missing(
  p_user_id UUID,
  p_org_id UUID,
  p_role TEXT DEFAULT 'employee'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_employee_id UUID;
BEGIN
  -- Check if employee already exists
  SELECT id INTO v_employee_id
  FROM employees
  WHERE user_id = p_user_id AND org_id = p_org_id;

  -- If not exists, create it
  IF v_employee_id IS NULL THEN
    INSERT INTO employees (user_id, org_id, role, onboarding_completed)
    VALUES (p_user_id, p_org_id, p_role, FALSE)
    RETURNING id INTO v_employee_id;
  END IF;

  RETURN v_employee_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION app_create_employee_if_missing TO authenticated;
