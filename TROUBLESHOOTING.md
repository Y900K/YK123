# 🔧 Troubleshooting Guide - Localhost Errors

## Common Error: "Cannot open http://localhost:5173/"

This guide helps you fix the most common issues when trying to access the Astra Attendance application.

---

## ❌ Problem: localhost:5173 not accessible

### Symptoms:
- Browser shows "This site can't be reached"
- "Connection refused" error
- "ERR_CONNECTION_REFUSED" in Chrome
- Page doesn't load

---

## ✅ Solution Steps

### Step 1: Check if dependencies are installed

```bash
cd /home/runner/work/YK123/YK123
ls -la node_modules
```

**If you see:** `cannot access 'node_modules'`

**Fix:** Install dependencies
```bash
npm ci
```

**Expected:** ~278 packages installed in ~5 seconds

---

### Step 2: Check if .env file exists

```bash
ls -la .env
```

**If you see:** `cannot access '.env'`

**Fix:** Create .env file
```bash
cat > .env << 'EOF'
# Astra Attendance - Environment Configuration
VITE_SUPABASE_URL=https://demo-project.supabase.co
VITE_SUPABASE_ANON_KEY=demo-anon-key-placeholder
SUPABASE_SERVICE_KEY=demo-service-key-placeholder
EOF
```

---

### Step 3: Check if server is running

```bash
ps aux | grep vite | grep -v grep
```

**If no output (server not running):**

**Fix:** Start the development server
```bash
npm run dev
```

**Expected output:**
```
  VITE v5.4.21  ready in 207 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Step 4: Verify server is accessible

```bash
curl -I http://localhost:5173/
```

**Expected:** `HTTP/1.1 200 OK`

**If fails:** Check if port 5173 is blocked or in use

---

## 🐛 Other Common Issues

### Issue: Port 5173 already in use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5173
```

**Fix:**
```bash
# Find and kill process using port 5173
lsof -ti:5173 | xargs kill -9

# Then restart
npm run dev
```

---

### Issue: ENOENT error - file not found

**Symptoms:**
```
Error: ENOENT: no such file or directory
```

**Fix:**
```bash
# Make sure you're in the correct directory
cd /home/runner/work/YK123/YK123
pwd  # Should show /home/runner/work/YK123/YK123

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: Module not found errors

**Symptoms:**
```
Error: Cannot find module '@supabase/supabase-js'
```

**Fix:**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm ci
```

---

### Issue: TypeScript errors

**Symptoms:**
```
TS2307: Cannot find module 'react' or its corresponding type declarations
```

**Fix:**
```bash
# Reinstall with TypeScript types
npm ci
npm run build  # This will show any compilation errors
```

---

### Issue: Vite client connection errors

**Symptoms:**
- Browser console shows: `[vite] failed to connect to websocket`
- Hot reload not working

**Fix:**
```bash
# Restart the dev server
# Press Ctrl+C to stop
npm run dev

# If still fails, clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

---

## 🔍 Quick Diagnostic Checklist

Run these commands to check your setup:

```bash
# 1. Check Node.js version (should be 20+)
node --version

# 2. Check npm version
npm --version

# 3. Check if in correct directory
pwd

# 4. Check if package.json exists
ls -la package.json

# 5. Check if dependencies installed
ls -la node_modules | head -5

# 6. Check if .env exists
ls -la .env

# 7. Check if server is running
ps aux | grep vite | grep -v grep

# 8. Test server connection
curl -I http://localhost:5173/
```

---

## ✅ Complete Fresh Setup

If nothing works, do a complete fresh setup:

```bash
# 1. Navigate to project
cd /home/runner/work/YK123/YK123

# 2. Clean everything
rm -rf node_modules package-lock.json .vite

# 3. Install dependencies
npm ci

# 4. Create .env file
cat > .env << 'EOF'
VITE_SUPABASE_URL=https://demo-project.supabase.co
VITE_SUPABASE_ANON_KEY=demo-anon-key-placeholder
SUPABASE_SERVICE_KEY=demo-service-key-placeholder
EOF

# 5. Start server
npm run dev

# 6. Wait for server to start (5-10 seconds)
# You should see: "Local: http://localhost:5173/"

# 7. Open in browser
# Navigate to: http://localhost:5173/
```

---

## 📞 Still Having Issues?

### Check the logs

**Server logs:**
```bash
# If running in background, check log file
cat /tmp/copilot-detached-*.log
```

**Browser console:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages

**Network issues:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for failed requests (red)

---

## 🎯 Expected Behavior

When everything is working correctly:

1. **Server starts:** You see "VITE v5.4.21 ready in X ms"
2. **Port shows:** "Local: http://localhost:5173/"
3. **Browser opens:** Page loads successfully
4. **Auto-redirect:** Goes from / to /choose-login
5. **Page displays:** "Astra Attendance" with login options

**Screenshot of working app:**

![Working Application](https://github.com/user-attachments/assets/649f508f-53dd-4ae5-80d9-a574c6c56478)

---

## 📚 Additional Resources

- **RUN_APP.md** - Detailed running instructions
- **TESTING_GUIDE.md** - Complete testing guide
- **README.md** - General overview
- **AUTO_RUN_STATUS.txt** - Quick status reference

---

## 💡 Prevention Tips

To avoid these issues in the future:

1. **Always run `npm ci`** before starting the server (first time or after git pull)
2. **Check .env file exists** before running
3. **Verify server is running** before opening browser
4. **Keep terminal open** to see server logs
5. **Don't close terminal** where server is running

---

## ⚡ Quick Fix Command

One command to fix most issues:

```bash
cd /home/runner/work/YK123/YK123 && \
npm ci && \
[ ! -f .env ] && echo "VITE_SUPABASE_URL=https://demo-project.supabase.co
VITE_SUPABASE_ANON_KEY=demo-anon-key-placeholder
SUPABASE_SERVICE_KEY=demo-service-key-placeholder" > .env ; \
npm run dev
```

This command:
1. ✅ Goes to project directory
2. ✅ Installs dependencies
3. ✅ Creates .env if missing
4. ✅ Starts server

---

**Last Updated:** 2026-02-07  
**Status:** ✅ Resolved - Application running successfully
