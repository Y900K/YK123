# Astra Attendance - System Architecture

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  React + TypeScript + Vite                                       │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Employee    │  │    Admin     │  │   Choose     │          │
│  │   Login      │  │    Login     │  │   Login      │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         └──────────────────┴──────────────────┘                   │
│                            │                                       │
│                   ┌────────▼────────┐                            │
│                   │  ProtectedRoute │                            │
│                   │  (Auth Guard)   │                            │
│                   └────────┬────────┘                            │
│                            │                                       │
│         ┌──────────────────┼──────────────────┐                  │
│         │                  │                  │                   │
│    ┌────▼────┐      ┌─────▼─────┐     ┌─────▼─────┐            │
│    │Onboarding│      │ Dashboard │     │   Admin   │            │
│    │          │      │ (Employee)│     │Test Center│            │
│    └──────────┘      └───────────┘     └───────────┘            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            │
                   ┌────────▼────────┐
                   │  Supabase Auth  │
                   │  (Single Auth)  │
                   └────────┬────────┘
                            │
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL + Supabase                                           │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  employees   │  │    shifts    │  │ departments  │          │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤          │
│  │ user_id      │  │ name         │  │ org_id       │          │
│  │ org_id       │  │ start_time   │  │ name         │          │
│  │ full_name    │  │ end_time     │  └──────────────┘          │
│  │ employee_code│  │ is_overnight │                             │
│  │ department_id│  │ grace_minutes│                             │
│  │ mobile_number│  └──────────────┘                             │
│  │ shift_id     │                                                │
│  │ onboarding.. │                                                │
│  └──────────────┘                                                │
│                                                                   │
│  ┌──────────────────────────────────────────────────┐           │
│  │              Row Level Security (RLS)             │           │
│  ├──────────────────────────────────────────────────┤           │
│  │ • Employees can view/update own records          │           │
│  │ • Org admins can manage all in organization      │           │
│  │ • Admin tables restricted to org_admin role      │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                   │
│  ┌──────────────────────────────────────────────────┐           │
│  │              Stored Procedures (RPCs)             │           │
│  ├──────────────────────────────────────────────────┤           │
│  │ • app_create_employee_if_missing()               │           │
│  │ • app_seed_default_shifts()                      │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Authentication Flow

```
User → Choose Login
         │
         ├─→ Employee Login ──┐
         │                    │
         └─→ Admin Login ─────┤
                              │
                    Supabase Auth
                              │
                    ProtectedRoute (Check)
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
      onboarding_completed?   │                 │
            │                 │                 │
         NO │            YES  │                 │
            │                 │                 │
    ┌───────▼──────┐    Role Check         Role Check
    │  Onboarding  │          │                 │
    └──────────────┘    employee/manager    org_admin
                              │                 │
                        ┌─────▼────┐      ┌────▼────┐
                        │Dashboard │      │  Admin  │
                        └──────────┘      │Test Ctr │
                                          └─────────┘
```

## 🔐 Security Model

### Row Level Security (RLS) Policies

```
┌───────────────────────────────────────────────────────────┐
│                    EMPLOYEES TABLE                         │
├───────────────────────────────────────────────────────────┤
│                                                            │
│  SELECT:                                                   │
│  ├─ Own record: WHERE user_id = auth.uid()               │
│  └─ Org admin: WHERE org_id IN (admin's org)             │
│                                                            │
│  INSERT:                                                   │
│  └─ Own record: WHERE user_id = auth.uid()               │
│                                                            │
│  UPDATE:                                                   │
│  ├─ Own record: WHERE user_id = auth.uid()               │
│  └─ Org admin: WHERE org_id IN (admin's org)             │
│                                                            │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│                   SHIFTS & DEPARTMENTS                     │
├───────────────────────────────────────────────────────────┤
│                                                            │
│  SELECT:                                                   │
│  └─ All in org: WHERE org_id IN (user's org)             │
│                                                            │
│  INSERT/UPDATE/DELETE:                                     │
│  └─ Org admin only: WHERE role = 'org_admin'             │
│                                                            │
└───────────────────────────────────────────────────────────┘
```

## ⏰ Shift Logic

### Overnight Shift Attendance Date Mapping

```
Timeline:  21:00 ──────── 00:00 ──────── 05:30 ──────── 21:00
           │                                    │
           └──── Attendance Date = Feb 1 ──────┘
           (Night Shift)
           
           Day 1 (Feb 1)              Day 2 (Feb 2)
           └──────────────────────────┘

Example:
  Punch at 21:30 on Feb 1  → Attendance Date: Feb 1
  Punch at 02:00 on Feb 2  → Attendance Date: Feb 1  (overnight)
  Punch at 05:00 on Feb 2  → Attendance Date: Feb 1  (overnight)
  Punch at 06:00 on Feb 2  → Attendance Date: Feb 2
```

## 🧪 Testing Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    TEST LAYER                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Vitest + MockDB                                         │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │  Unit Tests      │  │   Integration    │            │
│  ├──────────────────┤  ├──────────────────┤            │
│  │ • attendance     │  │ • MockDB Client  │            │
│  │ • onboarding     │  │ • Query chains   │            │
│  │ • testcenter     │  │ • RPC simulation │            │
│  └──────────────────┘  └──────────────────┘            │
│                                                          │
│  Test Strategy:                                          │
│  • Pure functions tested with unit tests                │
│  • DB interactions tested with MockDB                   │
│  • No real database required for tests                  │
│  • Fast, deterministic, parallel execution              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🛠️ Admin Test Center

### Check & Fix Flow

```
┌──────────────────────────────────────────────────────────┐
│              Admin Test Center Workflow                   │
└──────────────────────────────────────────────────────────┘
                           │
                    Run All Checks
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐      ┌─────▼─────┐    ┌────▼────┐
    │  Check  │      │   Check   │    │  Check  │
    │Onboard  │      │  Shifts   │    │  Dept   │
    │  Flags  │      │           │    │         │
    └────┬────┘      └─────┬─────┘    └────┬────┘
         │                 │                 │
    Issue Found?      Issue Found?     Issue Found?
         │                 │                 │
      ┌──┴──┐           ┌──┴──┐          ┌──┴──┐
      │ YES │           │ YES │          │ YES │
      └──┬──┘           └──┬──┘          └──┬──┘
         │                 │                 │
    Apply Fix         Apply Fix         Apply Fix
         │                 │                 │
    Set to false     Seed shifts      Create dept
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
                    Verify (2nd Run)
                           │
                    Show Results
```

## 📦 Data Flow

### Onboarding Flow

```
User completes form
       │
       ├─ full_name
       ├─ employee_code
       ├─ department_id
       └─ mobile_number
       │
Client-side validation
       │
   validateOnboardingForm()
       │
    [errors?] ───YES──> Show errors
       │
      NO
       │
Normalize mobile_number
       │
UPDATE employees SET
  full_name = ?,
  employee_code = ?,
  department_id = ?,
  mobile_number = ?,
  onboarding_completed = true
WHERE user_id = auth.uid()
       │
Redirect to Dashboard
```

## 🚀 Deployment Pipeline

```
Developer Push
      │
      ▼
GitHub Actions CI
      │
   ┌──┴──┐
   │ npm ci │
   └──┬──┘
      │
   ┌──┴──┐
   │ npm test │ ───FAIL──> ❌ Block merge
   └──┬──┘
      │
    PASS
      │
   ┌──┴──┐
   │ npm build │ ───FAIL──> ❌ Block merge
   └──┬──┘
      │
    PASS
      │
   ✅ Ready to merge
```

## 📊 Component Hierarchy

```
App (main.tsx)
  │
  ├─ BrowserRouter
  │   │
  │   ├─ /employee/login
  │   │   └─ EmployeeLogin
  │   │
  │   ├─ /admin/login
  │   │   ├─ AdminBanner
  │   │   └─ AdminLogin
  │   │
  │   ├─ /choose-login
  │   │   └─ ChooseLogin
  │   │
  │   ├─ /onboarding (Protected)
  │   │   └─ ProtectedRoute
  │   │       └─ Onboarding
  │   │
  │   ├─ /dashboard (Protected)
  │   │   └─ ProtectedRoute
  │   │       └─ Dashboard
  │   │           └─ PunchButton
  │   │
  │   └─ /admin (Protected + Admin Only)
  │       └─ ProtectedRoute (requireRole="org_admin")
  │           ├─ AdminBanner
  │           └─ AdminTestCenter
```

## 🎯 Key Design Decisions

### 1. Single Auth System
- **Why**: Simplifies user management
- **How**: Supabase Auth with role-based routing

### 2. Mock Database for Tests
- **Why**: Fast, reliable, no external dependencies
- **How**: MockDB implements DBClient interface

### 3. Idempotent Migrations
- **Why**: Safe to run multiple times
- **How**: IF NOT EXISTS checks in SQL

### 4. Client-side Validation
- **Why**: Immediate feedback, better UX
- **How**: validateOnboardingForm() utility

### 5. Overnight Shift Logic
- **Why**: Support 24/7 operations
- **How**: computeAttendanceDate() maps to correct day

---

**This architecture provides**:
- ✅ Scalability
- ✅ Security
- ✅ Testability
- ✅ Maintainability
- ✅ Developer Experience
