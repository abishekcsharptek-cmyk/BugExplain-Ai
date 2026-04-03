# 🚀 Quick Setup Checklist

Follow these steps in order to get your BugExplainAI app running with Supabase & Google OAuth.

---

## ✅ Step 1: Supabase Project Setup (5 mins)

- [ ] Create account at [supabase.com](https://supabase.com)
- [ ] Create new project named "BugExplainAI"
- [ ] Wait for project initialization (2-3 mins)
- [ ] Copy **Project URL** from Settings > API
- [ ] Copy **anon/public key** from Settings > API

---

## ✅ Step 2: Run Database Schema (2 mins)

- [ ] Open Supabase Dashboard > SQL Editor
- [ ] Click "New Query"
- [ ] Copy entire `database/schema.sql` content
- [ ] Paste and click "Run"
- [ ] Verify: "Success. No rows returned"

---

## ✅ Step 3: Google OAuth Setup (10 mins)

### Google Cloud Console:
- [ ] Go to [console.cloud.google.com](https://console.cloud.google.com)
- [ ] Create/select project
- [ ] Enable **Google+ API** (APIs & Services > Library)
- [ ] Go to Credentials > Create > OAuth 2.0 Client ID
- [ ] Application type: **Web application**
- [ ] Add Authorized JavaScript origins:
  - `http://localhost:5173`
  - `https://your-domain.com` (production)
- [ ] Add Authorized redirect URIs:
  - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
  - (Replace YOUR_PROJECT_REF from Supabase Settings > API > URL)
- [ ] Click "Create"
- [ ] Copy **Client ID**
- [ ] Copy **Client Secret**

### Supabase Dashboard:
- [ ] Go to Authentication > Providers
- [ ] Find **Google** provider
- [ ] Toggle "Enable"
- [ ] Paste **Client ID**
- [ ] Paste **Client Secret**
- [ ] Click "Save"

---

## ✅ Step 4: Environment Variables (2 mins)

- [ ] Copy `.env.example` to `.env`
  ```bash
  cp .env.example .env
  ```
- [ ] Fill in your credentials:
  ```env
  VITE_SUPABASE_URL=https://xxxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGc...
  VITE_OPENAI_API_KEY=sk-...
  ```
- [ ] Save the file
- [ ] Verify `.env` is in `.gitignore`

---

## ✅ Step 5: Install & Run (2 mins)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

- [ ] Open `http://localhost:5173`
- [ ] Click "Sign in with Google"
- [ ] Test authentication
- [ ] Submit a test error message
- [ ] Verify chat saves in Supabase (Table Editor > chats)

---

## 🎯 Verification Checklist

### Database:
- [ ] Table `chats` exists
- [ ] RLS policies created (4 policies)
- [ ] Indexes created on `user_id` and `created_at`
- [ ] Trigger `set_updated_at` exists

### Authentication:
- [ ] Google provider enabled in Supabase
- [ ] OAuth redirect URL configured correctly
- [ ] Can sign in with Google
- [ ] User appears in Authentication > Users

### Application:
- [ ] Environment variables loaded
- [ ] No console errors
- [ ] Google sign-in button works
- [ ] Can send messages and get AI response
- [ ] Chat history saves to database
- [ ] Can view and delete past chats

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid API key" | Check `.env` file exists and has correct keys |
| Google sign-in fails | Verify redirect URI matches exactly |
| Chats not saving | Check RLS policies are created |
| "Module not found" | Run `npm install` |

---

## 📞 Need Help?

1. Check `database/SETUP_GUIDE.md` for detailed instructions
2. Review `database/README.md` for schema documentation
3. Check Supabase logs: Dashboard > Logs
4. Check browser console for errors (F12)

---

## 🎉 Success!

When everything works, you should see:
- ✅ Google sign-in working
- ✅ AI responding to error messages
- ✅ Chat history appearing in sidebar
- ✅ Data saved in Supabase database

**Total Setup Time:** ~20 minutes

---

**Pro Tips:**
- Use different Supabase projects for dev/prod
- Enable email auth too (optional fallback)
- Set up error monitoring (Sentry, etc.)
- Monitor Supabase usage in Dashboard
