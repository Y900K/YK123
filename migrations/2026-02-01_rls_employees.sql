-- Migration: RLS policies for employees table
-- This migration is idempotent and safe to run multiple times

-- Enable RLS on employees table
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "employees_select_own" ON employees;
DROP POLICY IF EXISTS "employees_select_org_admin" ON employees;
DROP POLICY IF EXISTS "employees_insert_own" ON employees;
DROP POLICY IF EXISTS "employees_update_own" ON employees;
DROP POLICY IF EXISTS "employees_update_org_admin" ON employees;

-- Policy: Employees can view their own record
CREATE POLICY "employees_select_own" ON employees
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Org admins can view all employees in their org
CREATE POLICY "employees_select_org_admin" ON employees
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM employees AS e
      WHERE e.user_id = auth.uid()
        AND e.org_id = employees.org_id
        AND e.role = 'org_admin'
    )
  );

-- Policy: Employees can insert their own record (for onboarding)
CREATE POLICY "employees_insert_own" ON employees
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Employees can update their own record (for onboarding)
CREATE POLICY "employees_update_own" ON employees
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Org admins can update any employee in their org
CREATE POLICY "employees_update_org_admin" ON employees
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM employees AS e
      WHERE e.user_id = auth.uid()
        AND e.org_id = employees.org_id
        AND e.role = 'org_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees AS e
      WHERE e.user_id = auth.uid()
        AND e.org_id = employees.org_id
        AND e.role = 'org_admin'
    )
  );
