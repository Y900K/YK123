# 📋 Quick Start - View Astra Attendance

## 🎯 Two Ways to See the Application

### Option 1: View UI Previews (No Setup Required) ⚡

**Fastest way to see the UI:**

1. **Navigate to the preview folder:**
   ```bash
   cd /home/runner/work/YK123/YK123/preview
   ```

2. **Open index.html in your browser:**
   - Double-click `index.html`, OR
   - Run: `open index.html` (Mac) or `xdg-open index.html` (Linux)

3. **Browse all 6 pages:**
   - Choose Login
   - Employee Login (mobile-first)
   - Admin Login (with warning banner)
   - Onboarding (4-field form)
   - Dashboard (punch button)
   - Admin Test Center (automated checks)

**What you'll see:**
- ✅ Actual design and layout
- ✅ Color scheme (slate blue + cyan)
- ✅ Responsive layouts
- ✅ Interactive elements (buttons, forms)
- ✅ Typography and spacing

**Limitations:**
- ❌ No real authentication
- ❌ No database interaction
- ❌ No routing between pages
- ❌ Forms don't submit

---

### Option 2: Run the Real Application (Full Functionality) 🚀

**Prerequisites:**
- Node.js 20+
- Supabase account (free tier)
- 5-10 minutes setup time

**Quick Setup:**

```bash
# 1. Navigate to repository
cd /home/runner/work/YK123/YK123

# 2. Run automated setup script
chmod +x demo-setup.sh
./demo-setup.sh

# 3. Configure Supabase (follow prompts)
# Edit .env with your Supabase credentials

# 4. Apply migrations in Supabase SQL Editor
# Run each file in migrations/ folder in order

# 5. Start dev server
npm run dev

# 6. Open browser
# Navigate to http://localhost:5173
```

**What you'll get:**
- ✅ Full authentication (Supabase)
- ✅ Real database integration
- ✅ Working forms and validation
- ✅ Routing between pages
- ✅ Admin Test Center with checks
- ✅ Onboarding flow
- ✅ Role-based access

---

## 📖 Detailed Instructions

For complete step-by-step instructions, see:
- **VERIFICATION_GUIDE.md** - Full testing and setup guide
- **IMPLEMENTATION.md** - Feature details
- **ARCHITECTURE.md** - System design
- **README.md** - Getting started

---

## 🎨 What to Look For

### Design Elements
- **Color Scheme**: Slate blue (#475569) + Cyan (#06b6d4)
- **Mobile-First**: Employee pages optimized for mobile
- **Warning Banners**: Yellow/gold for admin areas
- **Gradients**: Blue-cyan background on login pages

### Key Features
1. **Dual Login Experience**: Separate employee/admin logins
2. **Admin Warning**: Prominent banner on admin pages
3. **Onboarding Form**: Clean 4-field layout with validation
4. **Punch Button**: Large, prominent cyan button
5. **Test Center**: Check results with icons and status badges

### Interactions to Test (Real App Only)
- [ ] Login with credentials
- [ ] Complete onboarding flow
- [ ] Punch in/out
- [ ] Run admin checks
- [ ] Verify overnight shift logic
- [ ] Test validation errors

---

## 💡 Recommendations

**For quick design review:**
→ Use Option 1 (UI Previews)

**For full functionality testing:**
→ Use Option 2 (Real Application)

**For contributing/development:**
→ Follow VERIFICATION_GUIDE.md

---

## 🐛 Issues?

1. **Can't open preview files?**
   - Ensure you're in the `preview/` directory
   - Try: `python3 -m http.server 8000` then visit http://localhost:8000

2. **Dev server won't start?**
   - Check Node.js version: `node --version` (need 20+)
   - Clear cache: `rm -rf node_modules && npm ci`
   - Check .env file exists and has valid values

3. **Tests failing?**
   - Run: `npm test -- --clearCache`
   - Check TypeScript: `npx tsc --noEmit`

4. **Database errors?**
   - Verify migrations are applied in Supabase
   - Check RLS policies are enabled
   - Verify environment variables

---

## 📞 Need Help?

See troubleshooting section in VERIFICATION_GUIDE.md for:
- Common errors and solutions
- Database verification queries
- Test debugging
- Build issues

---

**Last Updated**: 2026-02-02  
**Status**: Production Ready ✅
