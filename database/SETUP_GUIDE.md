# Supabase Database Setup Guide

## 📋 Prerequisites
- Supabase account ([supabase.com](https://supabase.com))
- Google Cloud Console account for OAuth

---

## 🚀 Step-by-Step Setup

### 1️⃣ Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: BugExplainAI
   - **Database Password**: (choose a strong password)
   - **Region**: Choose closest to your users
4. Click **"Create new project"**
5. Wait for project to initialize (2-3 minutes)

---

### 2️⃣ Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the entire content from `schema.sql` file
4. Paste into the SQL editor
5. Click **"Run"** button
6. You should see: "Success. No rows returned"

---

### 3️⃣ Configure Google OAuth Authentication

#### A. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable **Google+ API**:
   - Go to **APIs & Services** > **Library**
   - Search "Google+ API"
   - Click **Enable**

4. Create OAuth 2.0 Credentials:
   - Go to **APIs & Services** > **Credentials**
   - Click **"Create Credentials"** > **"OAuth 2.0 Client IDs"**
   - Select **"Web application"**
   - Add these URLs:

   **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   https://your-domain.com
   ```

   **Authorized redirect URIs:**
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
   
   > Replace `YOUR_PROJECT_REF` with your Supabase project reference (found in Project Settings > API)

5. Click **"Create"**
6. Copy the **Client ID** and **Client Secret**

#### B. Configure Supabase Authentication

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Find **Google** provider
3. Enable it and fill in:
   - **Client ID**: (from Google Console)
   - **Client Secret**: (from Google Console)
4. Click **"Save"**

#### C. Update Auth Settings (Optional)

1. Go to **Authentication** > **Settings**
2. Configure:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: Add your production URLs
   - Email confirmations: Configure as needed

---

### 4️⃣ Get Supabase API Keys

1. Go to **Project Settings** > **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (under "Project API keys")

---

### 5️⃣ Update Environment Variables

1. Create `.env` file in project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

2. Replace placeholders with actual values
3. **IMPORTANT**: Add `.env` to `.gitignore`

---

### 6️⃣ Update AuthContext for Google Sign-In

Update your `src/context/AuthContext.jsx` to add Google sign-in:

```javascript
const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    }
  })
  if (error) throw error
  return data
}

// Add to value object
const value = {
  user,
  loading,
  signUp,
  signIn,
  signOut,
  signInWithGoogle, // Add this
}
```

---

### 7️⃣ Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test Google Sign-In:
   - Go to login page
   - Click "Sign in with Google" button
   - Should redirect to Google OAuth
   - After authentication, should redirect to dashboard

3. Test Chat Feature:
   - Submit a bug/error message
   - Should get AI response
   - Check Supabase Dashboard > **Table Editor** > `chats`
   - You should see the saved chat

---

## 🔍 Verify Database Setup

### Check Tables
```sql
-- In SQL Editor, run:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```
You should see: `chats`

### Check RLS Policies
```sql
-- In SQL Editor, run:
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```
You should see 4 policies for `chats` table

### Check Indexes
```sql
-- In SQL Editor, run:
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public';
```

---

## 🛡️ Security Best Practices

✅ **Row Level Security (RLS)** is enabled
- Users can only access their own chats
- Prevents unauthorized data access

✅ **Environment Variables**
- Never commit `.env` to Git
- Use different keys for dev/production

✅ **API Keys**
- Use `anon` key for client-side (it's safe)
- Never expose `service_role` key in frontend

---

## 📊 Database Structure

```
┌─────────────┐
│ auth.users  │ (Managed by Supabase Auth)
│   - id      │
│   - email   │
└──────┬──────┘
       │
       │ (Foreign Key)
       │
┌──────▼──────────┐
│   chats         │
│   - id          │
│   - user_id     │ FK -> auth.users(id)
│   - question    │
│   - response    │
│   - created_at  │
│   - updated_at  │
└─────────────────┘
```

---

## 🐛 Troubleshooting

### Google Sign-In Not Working
- Check redirect URIs match exactly
- Ensure Google+ API is enabled
- Verify Client ID/Secret in Supabase

### "Invalid API Key" Error
- Verify `.env` file exists
- Check environment variable names match exactly
- Restart dev server after changing `.env`

### Chats Not Saving
- Check RLS policies are created
- Verify user is authenticated
- Check browser console for errors

### Database Connection Issues
- Verify Supabase URL is correct
- Check anon key is copied correctly
- Ensure project is not paused (free tier auto-pauses after 1 week inactive)

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

---

## 🎉 You're All Set!

Your BugExplainAI database is now configured with:
- ✅ Secure authentication with Google Sign-In
- ✅ Chat history storage
- ✅ Row Level Security for data protection
- ✅ Automatic timestamps
- ✅ Indexed queries for performance

Happy coding! 🚀
