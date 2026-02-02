# Astra Attendance Implementation

This PR implements the complete Astra Attendance system with dual login experiences, onboarding flow, shift management, and admin test center.

## ✨ Features Implemented

### 1. Dual Login Experience
- **Employee Login** (`/employee/login`): Mobile-first, minimal design
- **Admin Login** (`/admin/login`): Desktop-focused with warning banner
- **Login Chooser** (`/choose-login`): Landing page to select login type
- Redirects: `/login` → `/choose-login`

### 2. Single Supabase Authentication
- Unified auth system using Supabase Auth
- Role-based routing via `ProtectedRoute` component
- Automatic routing based on user role:
  - `org_admin` → `/admin` (Test Center)
  - `employee`/`manager` → `/dashboard`

### 3. Onboarding Flow
- Required for all new users before accessing main features
- Collects: full_name, employee_code, department_id, mobile_number
- Client-side validation using `validateOnboardingForm()`
- Sets `onboarding_completed = true` on completion
- Blocks punch UI until onboarding complete

### 4. Database Schema Changes
- **employees table additions**:
  - `full_name` (TEXT)
  - `employee_code` (TEXT, unique per org)
  - `department_id` (UUID, FK to departments)
  - `mobile_number` (TEXT)
  - `shift_id` (UUID, FK to shifts)
  - `onboarding_completed` (BOOLEAN, default false)
  - Unique constraint: `(org_id, employee_code)`

- **shifts table** (new):
  - `name`, `start_time`, `end_time`
  - `required_minutes` (default 510 = 8.5 hours)
  - `grace_in_minutes` (default 15)
  - `is_overnight` (BOOLEAN)

### 5. Row Level Security (RLS)
- **employees**: Users can view/update own record; admins can manage all in org
- **shifts**: Org members can view; admins can manage
- **departments**: Org members can view; admins can manage
- **org_settings**: Admin-only access

### 6. Shift Logic & Overnight Handling
- `computeAttendanceDate()` utility handles overnight shifts
- Punches between 21:00 and 05:30 map to previous day's attendance
- Example: Punch at 02:00 on Feb 2 → Attendance date Feb 1

### 7. Admin Test Center
- Admin-only page with automated checks and safe auto-fixes
- **Checks performed**:
  1. Null onboarding flags (fixes by setting to false)
  2. Missing default shifts (fixes by seeding Day/Night shifts)
  3. Missing General department (fixes by creating it)
- Runs checks twice: once with fixes, once to verify
- All fixes are idempotent and scoped to current org

### 8. Database Functions (RPCs)
- `app_create_employee_if_missing(user_id, org_id, role)`: Creates employee record if missing
- `app_seed_default_shifts(org_id)`: Seeds Day Shift (09:00-18:00) and Night Shift (21:00-06:00)

### 9. Testing
- **20 unit tests** covering:
  - Attendance date computation (5 tests)
  - Onboarding validation (9 tests)
  - Test Center checks with MockDB (6 tests)
- All tests passing ✅
- Tests use in-memory MockDB for predictable, fast execution

### 10. CLI Tool
- `npm run checks`: Read-only system checks
- `npm run checks:fix`: Apply safe auto-fixes
- Works across all organizations in database

### 11. CI/CD
- GitHub Actions workflow runs on push/PR
- Executes: `npm ci → npm test → npm run build`
- Ensures code quality before merge

## 📁 Files Added

### Core Application
- `src/lib/supabase.ts` - Supabase client & types
- `src/lib/app-utils.ts` - Core utilities
- `src/routes/ProtectedRoute.tsx` - Auth guard component
- `src/main.tsx` - App routing configuration
- `src/index.css` - Global styles

### Pages
- `src/pages/EmployeeLogin.tsx`
- `src/pages/AdminLogin.tsx`
- `src/pages/ChooseLogin.tsx`
- `src/pages/Onboarding.tsx`
- `src/pages/Dashboard.tsx`
- `src/pages/AdminTestCenter.tsx`

### Components
- `src/components/PunchButton.tsx`
- `src/components/AdminBanner.tsx`

### Database Migrations (7 files)
- `migrations/2026-02-01_add_onboarding_columns.sql`
- `migrations/2026-02-01_rls_employees.sql`
- `migrations/2026-02-01_create_employee_fn.sql`
- `migrations/2026-02-01_create_shifts.sql`
- `migrations/2026-02-01_seed_shifts_fn.sql`
- `migrations/2026-02-01_seed_shifts.sql`
- `migrations/2026-02-01_rls_admin_tables.sql`

### Tests
- `src/__tests__/attendance.spec.ts`
- `src/__tests__/onboarding.spec.ts`
- `src/__tests__/testcenter.spec.ts`

### Configuration
- `package.json`
- `tsconfig.json`
- `tsconfig.node.json`
- `vite.config.ts`
- `vitest.config.ts`
- `index.html`
- `.gitignore`

### Scripts & CI
- `scripts/run_checks.ts`
- `.github/workflows/ci.yml`

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm ci
```

### 2. Set Environment Variables
Create `.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key  # For CLI tool only
```

### 3. Run Migrations
Apply migrations in order (see README.md for detailed commands)

### 4. Start Development Server
```bash
npm run dev
```

### 5. Run Tests
```bash
npm test
```

## 🔒 Security Considerations

1. **RLS Enabled**: All tables have Row Level Security enabled
2. **Role-Based Access**: Admins can only manage their org
3. **Safe Auto-Fixes**: All fixes are idempotent and non-destructive
4. **Service Key**: Only used in CLI tool, not exposed to client
5. **Input Validation**: Client-side validation on all user inputs

## 🧪 Testing Strategy

- **Unit Tests**: Core business logic (utilities, validation)
- **MockDB**: Tests don't require real database connection
- **Coverage**: 20 tests across 3 test files
- **CI Integration**: Automated testing on every push

## 📊 Acceptance Criteria Met

✅ Two login entry points with clear navigation  
✅ Single Supabase Auth with role-based routing  
✅ Onboarding flow with validation  
✅ DB migrations are idempotent  
✅ RLS policies protect sensitive data  
✅ Overnight shift logic correctly maps attendance dates  
✅ Test Center performs checks and applies safe fixes  
✅ Comprehensive unit tests with MockDB  
✅ CLI script for running checks  
✅ GitHub Actions CI workflow  

## 🎨 Design & UX

- **Color Scheme**: Slate blue (#475569) + Cyan (#06b6d4)
- **Mobile-First**: Employee login optimized for mobile
- **Clear Warnings**: Admin login has prominent warning banner
- **Minimal UI**: Clean, focused interfaces
- **Responsive**: Works across device sizes

## 📝 Next Steps

1. Apply migrations to Supabase (review SQL first)
2. Test with real Supabase instance
3. Create test users (employee & admin)
4. Verify onboarding flow
5. Test Admin Test Center functionality
6. Run CLI checks script

## 🤝 Contributing

All code follows TypeScript strict mode and includes comprehensive tests. Run `npm test` and `npm run build` before submitting changes.

## 📄 License

MIT
