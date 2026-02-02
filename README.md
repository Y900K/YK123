# Astra Attendance

A comprehensive attendance management system built with React, TypeScript, Vite, and Supabase.

## Features

- **Dual Login Experience**: Separate login pages for employees and administrators
- **Single Supabase Auth**: Unified authentication system with role-based routing
- **Onboarding Flow**: Complete profile setup for new employees
- **Shift Management**: Support for day and overnight shifts
- **Admin Test Center**: Automated checks and safe auto-fixes
- **Test Coverage**: Comprehensive unit tests with Vitest

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Y900K/YK123.git
cd YK123
```

2. Install dependencies:
```bash
npm ci
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

### Database Setup

Run the migrations in order:

```bash
# 1. Add onboarding columns
psql -f migrations/2026-02-01_add_onboarding_columns.sql

# 2. Set up RLS for employees
psql -f migrations/2026-02-01_rls_employees.sql

# 3. Create employee function
psql -f migrations/2026-02-01_create_employee_fn.sql

# 4. Create shifts table
psql -f migrations/2026-02-01_create_shifts.sql

# 5. Create seed shifts function
psql -f migrations/2026-02-01_seed_shifts_fn.sql

# 6. Seed default shifts
psql -f migrations/2026-02-01_seed_shifts.sql

# 7. Set up RLS for admin tables
psql -f migrations/2026-02-01_rls_admin_tables.sql
```

### Development

Start the development server:
```bash
npm run dev
```

### Testing

Run unit tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Running System Checks

Run read-only checks:
```bash
npm run checks
```

Run checks with auto-fixes:
```bash
npm run checks:fix
```

## Architecture

### Routes

- `/` - Redirects to login chooser
- `/choose-login` - Login type selection
- `/employee/login` - Employee login (mobile-first)
- `/admin/login` - Administrator login with warning banner
- `/onboarding` - New employee profile setup
- `/dashboard` - Employee dashboard with punch functionality
- `/admin` - Admin Test Center

### Authentication Flow

1. User chooses login type
2. Authenticates via Supabase Auth
3. Protected routes check role and onboarding status
4. Routes users to appropriate dashboard:
   - `org_admin` → `/admin`
   - `employee`/`manager` → `/dashboard`
5. Incomplete onboarding redirects to `/onboarding`

### Key Utilities

- `computeAttendanceDate()`: Handles overnight shift attendance date mapping
- `validateOnboardingForm()`: Client-side validation for onboarding
- `normalizeMobile()`: Standardizes phone number format
- `runAllChecks()`: Executes Test Center checks with optional auto-fixes

### Database Schema

#### Employees Table
- `full_name`: Employee full name
- `employee_code`: Unique code per org
- `department_id`: Foreign key to departments
- `mobile_number`: Contact number
- `shift_id`: Assigned shift
- `onboarding_completed`: Boolean flag
- `role`: `employee`, `manager`, or `org_admin`

#### Shifts Table
- `name`: Shift name
- `start_time`: Shift start time
- `end_time`: Shift end time
- `required_minutes`: Required work duration (default 510 = 8.5 hours)
- `grace_in_minutes`: Grace period (default 15 minutes)
- `is_overnight`: Boolean for overnight shifts

## Security

- Row Level Security (RLS) enabled on all tables
- Employees can only view/update their own records
- Org admins can manage all employees in their organization
- Admin-only tables restricted to org_admin role

## CI/CD

GitHub Actions workflow runs on:
- Push to main, develop, or copilot/** branches
- Pull requests to main or develop

Tests and build are automatically executed.

## License

MIT