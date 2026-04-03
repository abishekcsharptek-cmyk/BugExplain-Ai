# 📚 BugExplainAI - Database Documentation Index

Complete database documentation for BugExplainAI project with Supabase integration.

---

## 🚀 Quick Start

**New to this project? Start here:**

1. 📋 **[QUICK_START.md](./QUICK_START.md)** - Setup checklist (20 mins)
2. 📖 **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
3. 🗄️ **[schema.sql](./schema.sql)** - Core database schema (required)

---

## 📂 Documentation Files

### Essential (Read First)

| File | Description | When to Use |
|------|-------------|-------------|
| **[QUICK_START.md](./QUICK_START.md)** | Step-by-step setup checklist | First time setup |
| **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** | Comprehensive setup guide with troubleshooting | Detailed instructions needed |
| **[schema.sql](./schema.sql)** | Main database schema | Always (required) |

### Reference Documentation

| File | Description | When to Use |
|------|-------------|-------------|
| **[README.md](./README.md)** | Schema documentation & common queries | Understanding database structure |
| **[ERD.md](./ERD.md)** | Entity-Relationship Diagram (visual) | Visualizing relationships |

### Optional Features

| File | Description | When to Use |
|------|-------------|-------------|
| **[migrations/README.md](./migrations/README.md)** | Migration guide | Adding optional features |
| **[migrations/001_add_user_profiles.sql](./migrations/001_add_user_profiles.sql)** | User profiles feature | Need user customization |
| **[migrations/002_add_chat_tags.sql](./migrations/002_add_chat_tags.sql)** | Chat categorization | Need to organize chats |

---

## 🎯 Setup Workflow

```
┌──────────────────────┐
│  1. QUICK_START.md   │  Read checklist
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  2. Create Supabase  │  Sign up & create project
│     Project          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  3. Run schema.sql   │  Create core tables
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  4. Setup Google     │  Configure OAuth
│     OAuth            │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  5. Configure .env   │  Add API keys
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  6. Test App         │  npm run dev
└──────────────────────┘
```

---

## 📊 Database Structure Overview

### Core Tables (Required)
```
auth.users (Supabase managed)
    ↓
public.chats (your chat history)
```

### With Optional Migrations
```
auth.users
    ├── user_profiles (migration 001)
    └── chats
         └── chat_tags ←→ tags (migration 002)
```

**Learn more:** [ERD.md](./ERD.md)

---

## 🔍 Common Use Cases

### I want to...

| Task | Document to Read |
|------|------------------|
| Set up database for first time | [QUICK_START.md](./QUICK_START.md) |
| Understand schema structure | [README.md](./README.md) |
| Configure Google Sign-In | [SETUP_GUIDE.md](./SETUP_GUIDE.md) → Step 3 |
| Add user profile features | [migrations/001_add_user_profiles.sql](./migrations/001_add_user_profiles.sql) |
| Categorize chats by type | [migrations/002_add_chat_tags.sql](./migrations/002_add_chat_tags.sql) |
| See database relationships | [ERD.md](./ERD.md) |
| Troubleshoot issues | [SETUP_GUIDE.md](./SETUP_GUIDE.md) → Troubleshooting |
| Write custom queries | [README.md](./README.md) → Common Queries |

---

## 📝 File Descriptions

### `schema.sql` ⭐ REQUIRED
**The main database schema file.**

**Contains:**
- ✅ `chats` table definition
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Triggers for auto-updating timestamps
- ✅ Comments and documentation

**Run this first!**

---

### `QUICK_START.md` ⚡ START HERE
**Quick setup checklist.**

**Perfect for:**
- First time setup
- Following step-by-step instructions
- Verifying you completed all steps

**Estimated time:** 20 minutes

---

### `SETUP_GUIDE.md` 📖 DETAILED GUIDE
**Comprehensive setup instructions.**

**Includes:**
- Supabase project creation
- Google OAuth configuration (detailed)
- Environment variable setup
- Troubleshooting section
- Security best practices

**Read when:** You need detailed explanations

---

### `README.md` 📚 REFERENCE
**Database schema documentation.**

**Includes:**
- Table structures
- Column descriptions
- RLS policies explained
- Common SQL queries
- Future enhancement ideas

**Read when:** Understanding how database works

---

### `ERD.md` 🎨 VISUAL GUIDE
**Entity-Relationship Diagram in text format.**

**Includes:**
- Visual table relationships
- Cardinality explanations
- Security model overview
- Sample queries
- Performance considerations

**Read when:** Visual learner or designing features

---

### `migrations/` folder 🔧 OPTIONAL
**Optional database enhancements.**

**Contains:**
- `README.md` - Migration guide
- `001_add_user_profiles.sql` - User profiles
- `002_add_chat_tags.sql` - Chat categorization

**Run when:** You want extra features beyond core app

---

## 🎓 Learning Path

### Beginner
1. Read [QUICK_START.md](./QUICK_START.md)
2. Follow checklist to set up database
3. Test the app
4. Skim [README.md](./README.md) to understand structure

### Intermediate
1. Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) in detail
2. Review [schema.sql](./schema.sql) to understand SQL
3. Study [ERD.md](./ERD.md) for relationships
4. Try modifying some queries

### Advanced
1. Read all migration files in `migrations/`
2. Understand RLS policies deeply
3. Create custom migrations for your needs
4. Optimize queries and add custom indexes

---

## 🛠️ Maintenance

### Regular Tasks
- ✅ Backup database weekly (Supabase Dashboard → Database → Backups)
- ✅ Monitor usage (Dashboard → Reports)
- ✅ Check for auth issues (Dashboard → Authentication → Logs)
- ✅ Review error logs (Dashboard → Logs)

### Cleanup Tasks
```sql
-- Delete old chats (older than 90 days)
DELETE FROM chats 
WHERE created_at < NOW() - INTERVAL '90 days';

-- Check database size
SELECT 
    pg_size_pretty(pg_database_size('postgres')) as db_size;

-- Count records
SELECT 
    'chats' as table_name,
    COUNT(*) as records 
FROM chats;
```

---

## 🔒 Security Checklist

- [x] Row Level Security (RLS) enabled on all tables
- [x] RLS policies restrict access to own data only
- [x] Foreign keys with CASCADE delete
- [x] Environment variables not committed to Git
- [x] `anon` key used in frontend (safe)
- [x] `service_role` key kept secret (never in frontend)
- [x] Google OAuth redirect URI configured correctly
- [x] HTTPS enforced in production

---

## 📞 Support & Resources

### Internal Docs
- [QUICK_START.md](./QUICK_START.md) - Setup
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed guide
- [README.md](./README.md) - Schema docs
- [ERD.md](./ERD.md) - Visual guide

### External Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Live Help
- Supabase Dashboard → Logs (check errors)
- Browser Console (F12) → Check frontend errors
- [Supabase Discord](https://discord.supabase.com)

---

## ✅ Verification Steps

After setup, verify everything works:

- [ ] Can sign in with Google
- [ ] User appears in Supabase → Authentication → Users
- [ ] Can send error message and get AI response
- [ ] Chat saves in Supabase → Table Editor → chats
- [ ] Can view chat history in sidebar
- [ ] Can delete chats
- [ ] Only see your own chats (test with another account)

---

## 🎉 You're All Set!

If you've completed the setup:
- ✅ Database schema is created
- ✅ Google OAuth is configured
- ✅ Environment variables are set
- ✅ App is running and saving chats

**Next Steps:**
- Explore optional migrations in `migrations/` folder
- Customize the app to your needs
- Deploy to production (Vercel, Netlify, etc.)

---

## 📊 Quick Stats

| Metric | Value |
|--------|-------|
| **Core Tables** | 1 (chats) |
| **Optional Tables** | 3 (user_profiles, tags, chat_tags) |
| **Security Policies** | 4 (per table) |
| **Indexes** | 2 (chats table) |
| **Setup Time** | ~20 minutes |
| **Complexity** | Simple (beginner-friendly) |

---

**Last Updated:** April 3, 2026  
**Database Version:** 1.0  
**Supabase Version:** Latest  

---

## 📄 File Tree

```
database/
├── INDEX.md (this file)           → Start here
├── QUICK_START.md                 → Quick setup checklist
├── SETUP_GUIDE.md                 → Detailed setup guide
├── README.md                      → Schema documentation
├── ERD.md                         → Visual relationships
├── schema.sql                     → Main schema (required)
└── migrations/
    ├── README.md                  → Migration guide
    ├── 001_add_user_profiles.sql  → User profiles (optional)
    └── 002_add_chat_tags.sql      → Chat tags (optional)
```

**Happy coding! 🚀**
