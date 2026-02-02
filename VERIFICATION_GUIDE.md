# 🔍 Verification Guide - Astra Attendance

This guide provides detailed steps to verify the Astra Attendance implementation.

## 📋 Quick Verification Checklist

- [ ] Dependencies installed
- [ ] Tests passing
- [ ] Build successful
- [ ] Dev server running
- [ ] Pages accessible
- [ ] Authentication working
- [ ] Database migrations reviewed

---

## 🚀 Method 1: Run Locally (Recommended)

### Prerequisites

1. **Node.js 20+** installed
2. **Supabase account** (free tier works)
3. **Git** installed

### Step-by-Step Instructions

#### 1. Clone and Install

```bash
# Navigate to the repository
cd /path/to/YK123

# Install dependencies (takes ~30 seconds)
npm ci

# Verify installation
npm list --depth=0
```

**Expected Output**: Should show all dependencies without errors.

---

#### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Create .env file
cat > .env << 'EOF'
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here
EOF
```

**Where to get these values:**
1. Go to https://supabase.com
2. Open your project (or create new one)
3. Settings → API
4. Copy:
   - Project URL → `VITE_SUPABASE_URL`
   - anon/public key → `VITE_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_KEY` (for CLI only)

---

#### 3. Set Up Database

Apply migrations in Supabase SQL Editor in this order:

```sql
-- 1. Run migrations/2026-02-01_add_onboarding_columns.sql
-- Creates: full_name, employee_code, department_id, mobile_number, onboarding_completed

-- 2. Run migrations/2026-02-01_rls_employees.sql
-- Creates: RLS policies for employees table

-- 3. Run migrations/2026-02-01_create_employee_fn.sql
-- Creates: app_create_employee_if_missing() function

-- 4. Run migrations/2026-02-01_create_shifts.sql
-- Creates: shifts table and employees.shift_id

-- 5. Run migrations/2026-02-01_seed_shifts_fn.sql
-- Creates: app_seed_default_shifts() function

-- 6. Run migrations/2026-02-01_seed_shifts.sql
-- Seeds: Day and Night shifts for all orgs

-- 7. Run migrations/2026-02-01_rls_admin_tables.sql
-- Creates: RLS policies for admin tables
```

**Verification**: Check that tables and functions exist in Supabase Dashboard.

---

#### 4. Run Tests

```bash
# Run all tests
npm test

# Expected output:
# ✓ src/__tests__/attendance.spec.ts  (5 tests)
# ✓ src/__tests__/onboarding.spec.ts  (9 tests)
# ✓ src/__tests__/testcenter.spec.ts  (6 tests)
# Test Files  3 passed (3)
# Tests  20 passed (20)
```

**✅ Success Criteria**: All 20 tests pass.

---

#### 5. Build the Application

```bash
# Build for production
npm run build

# Expected output:
# vite v5.x.x building for production...
# ✓ built in X.XXs
```

**✅ Success Criteria**: Build completes without errors.

---

#### 6. Start Development Server

```bash
# Start dev server
npm run dev
```

**Expected Output**:
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**✅ Success Criteria**: Server starts without errors.

---

#### 7. Access the Application

Open your browser and navigate to: **http://localhost:5173/**

You should be redirected to: **http://localhost:5173/choose-login**

---

## 🎨 Page-by-Page Verification

### Page 1: Choose Login (`/choose-login`)

**URL**: http://localhost:5173/choose-login

**What to Check**:
- [ ] Page loads without errors
- [ ] Two large buttons visible: "Employee Login" and "Admin Login"
- [ ] Page title: "Astra Attendance"
- [ ] Background: Blue-cyan gradient
- [ ] Buttons respond to hover (scale effect)

**Screenshot Location**: Take screenshot and save as `screenshots/01-choose-login.png`

---

### Page 2: Employee Login (`/employee/login`)

**URL**: http://localhost:5173/employee/login

**What to Check**:
- [ ] Mobile-first design (looks good on small screens)
- [ ] Email and Password fields
- [ ] "Sign In" button (cyan color)
- [ ] Link to "Admin Login" at bottom
- [ ] Blue-cyan gradient background

**Test Input**:
- Email: test@example.com
- Password: testpassword

**Expected Behavior**:
- Without valid credentials: Shows error message
- With valid credentials: Redirects to /dashboard or /onboarding

**Screenshot Location**: `screenshots/02-employee-login.png`

---

### Page 3: Admin Login (`/admin/login`)

**URL**: http://localhost:5173/admin/login

**What to Check**:
- [ ] ⚠️ Warning banner at top: "Admin Access - Use with caution"
- [ ] Yellow/gold warning colors
- [ ] Email and Password fields
- [ ] "Sign In as Admin" button (dark slate color)
- [ ] Link to "Employee Login" at bottom

**Test Input**:
- Email: admin@example.com
- Password: adminpassword

**Expected Behavior**:
- Without valid credentials: Shows error message
- With valid credentials: Redirects to /admin

**Screenshot Location**: `screenshots/03-admin-login.png`

---

### Page 4: Onboarding (`/onboarding`)

**URL**: http://localhost:5173/onboarding (requires authentication)

**What to Check**:
- [ ] Title: "Complete Your Profile"
- [ ] Four input fields:
  - Full Name
  - Employee Code
  - Department (dropdown)
  - Mobile Number
- [ ] Client-side validation
- [ ] Error messages for invalid input
- [ ] "Complete Onboarding" button

**Test Validation**:
- Full Name: Try "A" → Should show error "must be at least 2 characters"
- Employee Code: Leave empty → Should show error "required"
- Mobile Number: Try "123" → Should show error "at least 10 digits"

**Expected Behavior**:
- Valid submission: Updates employee record and redirects to /dashboard
- Invalid input: Shows field-specific error messages in red

**Screenshot Location**: `screenshots/04-onboarding.png`

---

### Page 5: Dashboard (`/dashboard`)

**URL**: http://localhost:5173/dashboard (requires authentication + onboarding)

**What to Check**:
- [ ] Welcome message with employee name
- [ ] Employee code displayed
- [ ] Large "PUNCH IN/OUT" button (cyan)
- [ ] "Sign Out" button at bottom

**Test Punch**:
- Click "PUNCH IN/OUT"
- Should show: "Punch recorded at [time] for attendance date [date]"
- Check overnight logic:
  - If time is 00:00-05:29: attendance date is previous day
  - If time is 05:30-23:59: attendance date is current day

**Screenshot Location**: `screenshots/05-dashboard.png`

---

### Page 6: Admin Test Center (`/admin`)

**URL**: http://localhost:5173/admin (requires org_admin role)

**What to Check**:
- [ ] ⚠️ Warning banner at top
- [ ] Title: "Admin Test Center"
- [ ] "Run All Checks" button (cyan)
- [ ] Check results displayed after clicking

**Test Checks**:
1. Click "Run All Checks"
2. Wait for results (should show within 2-3 seconds)
3. Verify results display:
   - Each check has icon (✅ pass, 🔧 fixed, ❌ fail)
   - Status badge (PASS/FIXED/FAIL)
   - Descriptive message

**Checks Performed**:
- ✅ Null onboarding flags (fixes by setting to false)
- ✅ Default shifts (fixes by seeding Day/Night shifts)
- ✅ General department (fixes by creating it)

**Screenshot Location**: `screenshots/06-admin-test-center.png`

---

## 🧪 Testing Verification

### Run All Tests

```bash
npm test
```

**Expected Results**:
```
✓ src/__tests__/attendance.spec.ts (5 tests) 
  ✓ should use current date for times between 05:30 and 21:00
  ✓ should use current date for times between 21:00 and 23:59
  ✓ should use previous date for times between 00:00 and 05:29
  ✓ should handle overnight shift scenario
  ✓ should handle edge case at 05:30

✓ src/__tests__/onboarding.spec.ts (9 tests)
  ✓ should validate valid onboarding data
  ✓ should reject empty full name
  ✓ should reject full name with less than 2 characters
  ✓ should reject empty employee code
  ✓ should reject empty department
  ✓ should reject mobile number with less than 10 digits
  ✓ should normalize mobile number by removing non-digits
  ✓ should accept mobile with formatting if digits are valid
  ✓ should return multiple errors for multiple invalid fields

✓ src/__tests__/testcenter.spec.ts (6 tests)
  ✓ should pass all checks when data is valid
  ✓ should detect and fix employees with null onboarding_completed
  ✓ should detect and fix missing default shifts
  ✓ should detect and fix missing General department
  ✓ should only report issues without fixing when applyFixes is false
  ✓ should handle multiple issues and fix all of them

Test Files  3 passed (3)
Tests  20 passed (20)
```

---

## 🔍 Code Quality Verification

### TypeScript Compilation

```bash
# Check TypeScript compilation
npx tsc --noEmit
```

**✅ Expected**: No errors

---

### Build Production

```bash
npm run build
```

**✅ Expected**: 
- No errors
- Output in `dist/` folder
- Files: index.html, assets/index-*.js, assets/index-*.css

---

### Linting (if configured)

```bash
npm run lint
```

**✅ Expected**: No critical errors

---

## 🗄️ Database Verification

### Check Tables Exist

In Supabase SQL Editor:

```sql
-- Check employees table columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'employees';

-- Expected columns:
-- full_name, employee_code, department_id, mobile_number, 
-- shift_id, onboarding_completed

-- Check shifts table exists
SELECT * FROM shifts LIMIT 5;

-- Expected: Day and Night shifts for your org

-- Check functions exist
SELECT proname FROM pg_proc WHERE proname LIKE 'app_%';

-- Expected: app_create_employee_if_missing, app_seed_default_shifts
```

---

### Check RLS Policies

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('employees', 'shifts', 'departments');

-- Expected: rowsecurity = true for all

-- Check policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('employees', 'shifts', 'departments');

-- Expected: Multiple policies per table
```

---

## 🛠️ CLI Tool Verification

### Run System Checks

```bash
# Read-only checks
npm run checks

# With auto-fixes
npm run checks:fix
```

**Expected Output**:
```
🔍 Running Astra Attendance Checks...

Mode: READ-ONLY (or AUTO-FIX)

Found X organization(s)

📊 Organization: Your Org Name
────────────────────────────────────────────────────────────
✅ Null onboarding flags: All employees have valid onboarding_completed flag
✅ Default shifts: Found 2 shift(s)
✅ General department: General department exists

✨ Checks complete!
```

---

## 🎥 Visual Testing (Manual)

### Create Screenshots Directory

```bash
mkdir -p screenshots
```

### Take Screenshots

For each page, take screenshots showing:

1. **Desktop view** (1920x1080)
2. **Mobile view** (375x667)
3. **Error states** (validation errors)
4. **Success states** (after successful actions)

**Recommended Tool**: Browser DevTools (F12) → Device Toolbar

---

## ✅ Final Verification Checklist

### Pre-Launch Checklist

- [ ] All 20 tests passing
- [ ] Build successful (no errors)
- [ ] All 7 migrations applied
- [ ] Environment variables configured
- [ ] Dev server starts without errors
- [ ] All 6 pages accessible
- [ ] Authentication flow works
- [ ] Onboarding validation works
- [ ] Admin Test Center runs checks
- [ ] CLI tool works
- [ ] RLS policies active
- [ ] Documentation complete

---

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: "env.VITE_SUPABASE_URL is undefined"

**Solution**: Create `.env` file with correct values.

---

### Issue: "Table does not exist"

**Solution**: Apply all migrations in Supabase SQL Editor.

---

### Issue: "RLS policy violation"

**Solution**: 
1. Check user has correct role
2. Verify RLS policies are applied
3. Check auth.uid() matches user_id

---

### Issue: Tests failing

**Solution**:
```bash
# Clear cache and re-run
npm test -- --clearCache
npm test
```

---

## 📞 Support

If you encounter issues:

1. Check console for errors (F12 in browser)
2. Check Supabase logs (Dashboard → Logs)
3. Verify environment variables
4. Ensure migrations are applied
5. Check test output for specific failures

---

## 🎯 Success Metrics

**Application is ready when**:
- ✅ All tests pass (20/20)
- ✅ Build completes successfully
- ✅ Dev server runs without errors
- ✅ All pages load and function correctly
- ✅ Database has all required tables/functions
- ✅ RLS policies are active and working

---

**Last Updated**: 2026-02-02  
**Version**: 1.0.0
