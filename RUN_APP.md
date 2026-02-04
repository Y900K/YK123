# 🚀 Running Astra Attendance Web App

## Quick Start - Run from Command Line

### Prerequisites
- Node.js 20+ installed
- Terminal/Command line access

### Step-by-Step Instructions

#### 1. Navigate to Project Directory
```bash
cd /home/runner/work/YK123/YK123
```

#### 2. Install Dependencies (First Time Only)
```bash
npm ci
```
This installs all required packages (~278 packages, takes ~5 seconds)

#### 3. Configure Environment Variables
Create a `.env` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here
```

**Note:** A placeholder `.env` file has been created. Replace the values with your actual Supabase credentials from: https://supabase.com → Your Project → Settings → API

#### 4. Start Development Server
```bash
npm run dev
```

**Expected Output:**
```
VITE v5.4.21  ready in 179 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

#### 5. Access the Application
Open your browser and navigate to: **http://localhost:5173/**

The app will automatically redirect to `/choose-login`

---

## Available Commands

### Development
```bash
npm run dev          # Start development server (hot reload enabled)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Testing
```bash
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

### System Checks
```bash
npm run checks       # Run read-only system checks
npm run checks:fix   # Run checks with auto-fixes
```

---

## Server Details

- **Port:** 5173 (default Vite port)
- **Hot Reload:** Enabled (changes reflect immediately)
- **Protocol:** HTTP
- **Host:** localhost

---

## Stopping the Server

Press `Ctrl + C` in the terminal where the server is running.

---

## Troubleshooting

### Port Already in Use
If port 5173 is already in use:
```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9

# Or start on a different port
npm run dev -- --port 3000
```

### Dependencies Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Loading
- Ensure `.env` file is in the project root
- Variable names must start with `VITE_` to be accessible in the browser
- Restart the dev server after changing `.env`

---

## Application Features

### Pages Available
1. **Choose Login** (`/choose-login`) - Landing page with login options
2. **Employee Login** (`/employee/login`) - Mobile-first employee login
3. **Admin Login** (`/admin/login`) - Admin login with warning banner
4. **Onboarding** (`/onboarding`) - New user profile setup
5. **Dashboard** (`/dashboard`) - Employee dashboard with punch button
6. **Admin Test Center** (`/admin`) - Admin system checks and tools

### Tech Stack
- **Frontend:** React 18.2 + TypeScript
- **Build Tool:** Vite 5.0
- **Router:** React Router 6.21
- **Backend:** Supabase (PostgreSQL + Auth)
- **Testing:** Vitest
- **Styling:** Inline CSS with design tokens

---

## Next Steps

1. **Configure Supabase:**
   - Create a Supabase project
   - Update `.env` with real credentials
   - Apply database migrations from `migrations/` folder

2. **Review Documentation:**
   - `README.md` - General overview
   - `VERIFICATION_GUIDE.md` - Testing guide
   - `ARCHITECTURE.md` - System design

3. **Development:**
   - Make changes to files in `src/`
   - Changes will hot-reload automatically
   - Run tests with `npm test`

---

**Status:** ✅ Server running successfully on http://localhost:5173/
