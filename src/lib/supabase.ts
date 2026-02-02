import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string;
          user_id: string;
          org_id: string;
          full_name: string | null;
          employee_code: string | null;
          department_id: string | null;
          mobile_number: string | null;
          role: string;
          shift_id: string | null;
          onboarding_completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          org_id: string;
          full_name?: string | null;
          employee_code?: string | null;
          department_id?: string | null;
          mobile_number?: string | null;
          role?: string;
          shift_id?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          org_id?: string;
          full_name?: string | null;
          employee_code?: string | null;
          department_id?: string | null;
          mobile_number?: string | null;
          role?: string;
          shift_id?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
        };
      };
      shifts: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          start_time: string;
          end_time: string;
          required_minutes: number;
          grace_in_minutes: number;
          is_overnight: boolean;
          created_at: string;
        };
      };
      departments: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          created_at: string;
        };
      };
    };
  };
};
