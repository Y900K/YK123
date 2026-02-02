-- Migration: RLS policies for admin-only tables
-- This migration is idempotent and safe to run multiple times

-- Assuming org_settings table exists
-- Enable RLS on org_settings if table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'org_settings'
  ) THEN
    EXECUTE 'ALTER TABLE org_settings ENABLE ROW LEVEL SECURITY';
    
    -- Drop existing policies if they exist
    EXECUTE 'DROP POLICY IF EXISTS "org_settings_select_org_admin" ON org_settings';
    EXECUTE 'DROP POLICY IF EXISTS "org_settings_manage_org_admin" ON org_settings';
    
    -- Policy: Only org admins can view org_settings
    EXECUTE 'CREATE POLICY "org_settings_select_org_admin" ON org_settings
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM employees AS e
          WHERE e.user_id = auth.uid()
            AND e.org_id = org_settings.org_id
            AND e.role = ''org_admin''
        )
      )';
    
    -- Policy: Only org admins can manage org_settings
    EXECUTE 'CREATE POLICY "org_settings_manage_org_admin" ON org_settings
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM employees AS e
          WHERE e.user_id = auth.uid()
            AND e.org_id = org_settings.org_id
            AND e.role = ''org_admin''
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM employees AS e
          WHERE e.user_id = auth.uid()
            AND e.org_id = org_settings.org_id
            AND e.role = ''org_admin''
        )
      )';
  END IF;
END $$;

-- Apply similar RLS to departments table
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "departments_select_org" ON departments;
DROP POLICY IF EXISTS "departments_manage_org_admin" ON departments;

-- Policy: Employees can view departments in their org
CREATE POLICY "departments_select_org" ON departments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM employees AS e
      WHERE e.user_id = auth.uid()
        AND e.org_id = departments.org_id
    )
  );

-- Policy: Only org admins can manage departments
CREATE POLICY "departments_manage_org_admin" ON departments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM employees AS e
      WHERE e.user_id = auth.uid()
        AND e.org_id = departments.org_id
        AND e.role = 'org_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees AS e
      WHERE e.user_id = auth.uid()
        AND e.org_id = departments.org_id
        AND e.role = 'org_admin'
    )
  );
