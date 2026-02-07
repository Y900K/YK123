# 🚀 QUICK START GUIDE

## How to Run the Application

The application is a React + Vite web app that runs locally on your machine.

---

## ⚡ Quick Start (3 Steps)

```bash
# 1. Install dependencies
npm ci

# 2. Start the server
npm run dev

# 3. Open browser
# Navigate to: http://localhost:5173/
```

**That's it!** The application should now be accessible in your browser.

---

## 📋 Prerequisites

- **Node.js** version 20 or higher
- **npm** (comes with Node.js)
- Web browser (Chrome, Firefox, Safari, etc.)

Check your versions:
```bash
node --version  # Should show v20.x or higher
npm --version   # Should show 10.x or higher
```

---

## 🔧 First Time Setup

### Step 1: Clone the Repository (if not already done)

```bash
git clone https://github.com/Y900K/YK123.git
cd YK123
```

### Step 2: Install Dependencies

```bash
npm ci
```

**What this does:**
- Installs 278 npm packages required for the application
- Takes approximately 5-10 seconds
- Creates `node_modules` folder

### Step 3: Create Environment File (Optional - Auto-created)

The `.env` file is created automatically with demo credentials. If you want to customize:

```bash
cat > .env << 'EOF'
VITE_SUPABASE_URL=https://demo-project.supabase.co
VITE_SUPABASE_ANON_KEY=demo-anon-key-placeholder
SUPABASE_SERVICE_KEY=demo-service-key-placeholder
EOF
```

### Step 4: Start the Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.4.21  ready in 179 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Open in Browser

Open your web browser and navigate to:
```
http://localhost:5173/
```

The page will automatically redirect to `/choose-login`.

---

## ✅ Verification

When the application is working correctly, you should see:

- **Page Title:** "Astra Attendance"
- **Two Login Buttons:**
  - Employee Login (cyan/turquoise button)
  - Admin Login (dark navy button)
- **Beautiful gradient background** (slate blue → cyan)

![Working Application](https://github.com/user-attachments/assets/aa840b0d-1911-4749-80bc-a72335386a21)

---

## 🎯 Available Pages

Once running, you can access:

| Page | URL | Description |
|------|-----|-------------|
| Choose Login | http://localhost:5173/choose-login | Landing page with login options |
| Employee Login | http://localhost:5173/employee/login | Employee login form |
| Admin Login | http://localhost:5173/admin/login | Admin login with warning banner |
| Onboarding | http://localhost:5173/onboarding | Profile setup (requires auth) |
| Dashboard | http://localhost:5173/dashboard | Employee dashboard (requires auth) |
| Admin Center | http://localhost:5173/admin | Admin test center (requires admin auth) |

---

## 🛑 Stopping the Server

To stop the development server:

1. Go to the terminal where the server is running
2. Press `Ctrl + C`
3. Confirm with `Y` if prompted

---

## 🔄 Restarting After Changes

If you've made code changes:

```bash
# The server auto-reloads! Just save your files.
# Changes appear immediately in the browser.
```

If you need to restart the server manually:

```bash
# Stop with Ctrl+C, then:
npm run dev
```

---

## 🧪 Running Tests

Run the automated test suite:

```bash
npm test
```

**Expected:** 20 tests passing
- 5 attendance computation tests
- 9 onboarding validation tests
- 6 admin test center tests

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to localhost:5173"

**Solution:**
```bash
# Check if server is running
ps aux | grep vite

# If not running, start it
npm run dev
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm ci
```

### Issue: "Port 5173 already in use"

**Solution:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Then restart
npm run dev
```

### Issue: "ENOENT: no such file or directory"

**Solution:**
```bash
# Make sure you're in the project directory
cd /path/to/YK123
pwd  # Should show the project path

# Then try again
npm ci
npm run dev
```

**For more help:** See `TROUBLESHOOTING.md`

---

## 📚 Additional Commands

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run system checks
npm run checks

# Run checks with auto-fix
npm run checks:fix
```

---

## 🌐 For Production Deployment

To use with a real Supabase backend:

1. Create a Supabase project at https://supabase.com
2. Get your credentials from Settings → API
3. Update `.env` with real values:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key
   SUPABASE_SERVICE_KEY=your-actual-service-key
   ```
4. Apply database migrations from `migrations/` folder
5. Restart the dev server

See `TESTING_GUIDE.md` for complete setup instructions.

---

## 📖 More Documentation

- **README.md** - General project overview
- **TESTING_GUIDE.md** - Complete testing procedures
- **TROUBLESHOOTING.md** - Detailed problem-solving guide
- **IMPLEMENTATION.md** - Feature documentation
- **ARCHITECTURE.md** - System design

---

## ✨ Summary

**Start Command:** `npm run dev`  
**URL:** http://localhost:5173/  
**Stop:** Press `Ctrl+C`

**Need help?** Check `TROUBLESHOOTING.md` or open an issue on GitHub.

---

**Last Updated:** 2026-02-07  
**Version:** 0.0.0  
**Status:** ✅ Working
