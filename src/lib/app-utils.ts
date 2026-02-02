/**
 * Core utility functions for Astra Attendance
 */

import { supabase } from './supabase';

/**
 * Compute the attendance date for a given punch timestamp.
 * Handles overnight shifts: punches between 21:00 and 05:30 belong to the attendance day
 * starting at 21:00 on the previous calendar date.
 */
export function computeAttendanceDate(punchTime: Date): string {
  const hour = punchTime.getHours();
  const minute = punchTime.getMinutes();
  const totalMinutes = hour * 60 + minute;

  // Overnight window: 21:00 (1260 minutes) to 05:30 (330 minutes)
  // If time is between 00:00 and 05:30, use previous day
  if (totalMinutes >= 0 && totalMinutes < 330) {
    const attendanceDate = new Date(punchTime);
    attendanceDate.setDate(attendanceDate.getDate() - 1);
    return attendanceDate.toISOString().split('T')[0];
  }
  
  // If time is between 21:00 and 23:59, use current day
  // Otherwise use current day
  return punchTime.toISOString().split('T')[0];
}

/**
 * Normalize mobile number by removing spaces and non-numeric characters
 */
export function normalizeMobile(mobile: string): string {
  return mobile.replace(/\D/g, '');
}

/**
 * Validate onboarding form data
 */
export interface OnboardingFormData {
  full_name: string;
  employee_code: string;
  department_id: string;
  mobile_number: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateOnboardingForm(data: OnboardingFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.full_name || data.full_name.trim().length < 2) {
    errors.full_name = 'Full name must be at least 2 characters';
  }

  if (!data.employee_code || data.employee_code.trim().length < 1) {
    errors.employee_code = 'Employee code is required';
  }

  if (!data.department_id) {
    errors.department_id = 'Department is required';
  }

  const normalizedMobile = normalizeMobile(data.mobile_number);
  if (!normalizedMobile || normalizedMobile.length < 10) {
    errors.mobile_number = 'Mobile number must be at least 10 digits';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Interface for database client (supports real Supabase or mock for testing)
 */
export interface DBClient {
  from(table: string): {
    select(columns?: string): {
      eq(column: string, value: any): Promise<{ data: any[] | null; error: any }>;
      is(column: string, value: any): Promise<{ data: any[] | null; error: any }>;
    };
    insert(data: any): Promise<{ data: any; error: any }>;
    update(data: any): {
      eq(column: string, value: any): Promise<{ data: any; error: any }>;
      is(column: string, value: any): Promise<{ data: any; error: any }>;
    };
  };
  rpc(fn: string, params?: any): Promise<{ data: any; error: any }>;
}

export interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'fixed';
  message: string;
}

/**
 * Run all checks and optionally apply safe auto-fixes
 */
export async function runAllChecks(
  db: DBClient,
  orgId: string,
  applyFixes: boolean = false
): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // Check 1: Employees with null onboarding_completed
  const { data: employeesWithNullOnboarding } = await db
    .from('employees')
    .select('id')
    .eq('org_id', orgId)
    .is('onboarding_completed', null);

  if (employeesWithNullOnboarding && employeesWithNullOnboarding.length > 0) {
    if (applyFixes) {
      // Fix: Set onboarding_completed to false
      await db
        .from('employees')
        .update({ onboarding_completed: false })
        .eq('org_id', orgId)
        .is('onboarding_completed', null);
      results.push({
        name: 'Null onboarding flags',
        status: 'fixed',
        message: `Fixed ${employeesWithNullOnboarding.length} employees with null onboarding_completed`,
      });
    } else {
      results.push({
        name: 'Null onboarding flags',
        status: 'fail',
        message: `Found ${employeesWithNullOnboarding.length} employees with null onboarding_completed`,
      });
    }
  } else {
    results.push({
      name: 'Null onboarding flags',
      status: 'pass',
      message: 'All employees have valid onboarding_completed flag',
    });
  }

  // Check 2: Default shifts exist
  const { data: shifts } = await db
    .from('shifts')
    .select('id')
    .eq('org_id', orgId);

  if (!shifts || shifts.length === 0) {
    if (applyFixes) {
      // Fix: Seed default shifts
      await db.rpc('app_seed_default_shifts', { p_org_id: orgId });
      results.push({
        name: 'Default shifts',
        status: 'fixed',
        message: 'Created default Day and Night shifts',
      });
    } else {
      results.push({
        name: 'Default shifts',
        status: 'fail',
        message: 'No shifts found for organization',
      });
    }
  } else {
    results.push({
      name: 'Default shifts',
      status: 'pass',
      message: `Found ${shifts.length} shift(s)`,
    });
  }

  // Check 3: General department exists
  const { data: generalDept } = await db
    .from('departments')
    .select('id')
    .eq('org_id', orgId)
    .eq('name', 'General');

  if (!generalDept || generalDept.length === 0) {
    if (applyFixes) {
      // Fix: Create General department
      await db.from('departments').insert({
        org_id: orgId,
        name: 'General',
      });
      results.push({
        name: 'General department',
        status: 'fixed',
        message: 'Created General department',
      });
    } else {
      results.push({
        name: 'General department',
        status: 'fail',
        message: 'General department not found',
      });
    }
  } else {
    results.push({
      name: 'General department',
      status: 'pass',
      message: 'General department exists',
    });
  }

  return results;
}
