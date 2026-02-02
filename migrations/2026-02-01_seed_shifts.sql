-- Migration: Seed default shifts for each organization
-- This is a template - run for each org_id in your system

-- Example: Run this for each organization
-- SELECT app_seed_default_shifts('your-org-id-here');

-- Or run for all organizations:
DO $$
DECLARE
  org_record RECORD;
BEGIN
  FOR org_record IN SELECT id FROM organizations
  LOOP
    PERFORM app_seed_default_shifts(org_record.id);
  END LOOP;
END $$;
