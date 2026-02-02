#!/usr/bin/env node
/**
 * CLI script to run read-only checks against Supabase
 * Usage:
 *   npm run checks         # Read-only checks
 *   npm run checks:fix     # Apply safe auto-fixes
 */

import { createClient } from '@supabase/supabase-js';
import { runAllChecks } from '../src/lib/app-utils';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing required environment variables');
  console.error('Required: VITE_SUPABASE_URL, SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const args = process.argv.slice(2);
  const applyFixes = args.includes('--fix');

  console.log('🔍 Running Astra Attendance Checks...\n');
  console.log(`Mode: ${applyFixes ? 'AUTO-FIX' : 'READ-ONLY'}\n`);

  try {
    // Get all organizations
    const { data: orgs, error: orgsError } = await supabase
      .from('organizations')
      .select('id, name');

    if (orgsError) {
      console.error('Error fetching organizations:', orgsError.message);
      process.exit(1);
    }

    if (!orgs || orgs.length === 0) {
      console.log('No organizations found.');
      process.exit(0);
    }

    console.log(`Found ${orgs.length} organization(s)\n`);

    for (const org of orgs) {
      console.log(`\n📊 Organization: ${org.name || org.id}`);
      console.log('─'.repeat(60));

      const results = await runAllChecks(supabase, org.id, applyFixes);

      for (const result of results) {
        const icon =
          result.status === 'pass' ? '✅' :
          result.status === 'fixed' ? '🔧' :
          '❌';
        
        console.log(`${icon} ${result.name}: ${result.message}`);
      }
    }

    console.log('\n✨ Checks complete!\n');
  } catch (error: any) {
    console.error('\n❌ Error running checks:', error.message);
    process.exit(1);
  }
}

main();
