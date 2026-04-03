# Database Schema Documentation

## 📊 Overview

BugExplainAI uses **Supabase PostgreSQL** database with a simple, efficient schema designed for storing user chat history with AI-powered bug explanations.

---

## 🗂️ Database Tables

### 1. `auth.users` (Managed by Supabase)
This table is automatically created and managed by Supabase Authentication.

**Columns:**
- `id` (UUID) - Primary key, user identifier
- `email` (TEXT) - User's email address
- `created_at` (TIMESTAMP) - Account creation time
- `last_sign_in_at` (TIMESTAMP) - Last login time
- *Other authentication-related columns...*

---

### 2. `public.chats`
Stores all user conversations with the AI debugging assistant.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique chat identifier |
| `user_id` | UUID | NOT NULL, FK to auth.users(id) ON DELETE CASCADE | Owner of the chat |
| `question` | TEXT | NOT NULL | User's bug/error message |
| `response` | TEXT | NOT NULL | AI-generated explanation and fix |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | When chat was created |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_chats_user_id` - Fast lookups by user
- `idx_chats_created_at` - Ordered by creation time (DESC)

**Foreign Keys:**
- `user_id` → `auth.users(id)` with CASCADE DELETE

---

## 🔒 Security (Row Level Security)

All tables have **RLS enabled** with the following policies:

### Chats Table Policies:

| Policy Name | Operation | Rule |
|-------------|-----------|------|
| Users can view own chats | SELECT | `auth.uid() = user_id` |
| Users can insert own chats | INSERT | `auth.uid() = user_id` |
| Users can update own chats | UPDATE | `auth.uid() = user_id` |
| Users can delete own chats | DELETE | `auth.uid() = user_id` |

**What this means:**
- ✅ Users can only access their own chat history
- ❌ Users cannot see or modify other users' data
- ✅ Automatic data isolation at database level
- ✅ No additional authorization code needed in application

---

## ⚙️ Automatic Functions

### `handle_updated_at()`
- **Type:** Trigger function
- **Purpose:** Automatically updates `updated_at` column on row modification
- **Trigger:** Fires BEFORE UPDATE on `chats` table

```sql
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.chats
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
```

---

## 📈 Database Relationships

```
┌─────────────────────┐
│   auth.users        │
│   (Supabase Auth)   │
│                     │
│   - id (PK)         │
│   - email           │
│   - created_at      │
└──────────┬──────────┘
           │
           │ 1:N relationship
           │ (One user, many chats)
           │
           │ ON DELETE CASCADE
           │
┌──────────▼──────────┐
│   public.chats      │
│                     │
│   - id (PK)         │
│   - user_id (FK)    │
│   - question        │
│   - response        │
│   - created_at      │
│   - updated_at      │
└─────────────────────┘
```

---

## 🚀 Quick Setup

1. **Run the Schema:**
   ```bash
   # In Supabase SQL Editor, run:
   database/schema.sql
   ```

2. **Verify Tables:**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

3. **Check RLS Policies:**
   ```sql
   SELECT tablename, policyname, cmd
   FROM pg_policies 
   WHERE schemaname = 'public';
   ```

---

## 📝 Common Queries

### Get User's Chat History
```sql
SELECT id, question, response, created_at
FROM chats
WHERE user_id = 'user-uuid-here'
ORDER BY created_at DESC
LIMIT 50;
```

### Count Total Chats
```sql
SELECT COUNT(*) as total_chats
FROM chats;
```

### Get Recent Chats (All Users)
```sql
SELECT c.id, u.email, c.question, c.created_at
FROM chats c
JOIN auth.users u ON c.user_id = u.id
ORDER BY c.created_at DESC
LIMIT 20;
```

### Delete Old Chats (Older than 90 days)
```sql
DELETE FROM chats
WHERE created_at < NOW() - INTERVAL '90 days';
```

---

## 🎯 Future Enhancements

Consider adding these tables/features:

1. **`user_profiles`** - Additional user metadata
2. **`chat_tags`** - Categorize chats by error type
3. **`favorites`** - Save important chats
4. **`shared_chats`** - Share explanations with team
5. **`usage_analytics`** - Track API usage per user

---

## 🛟 Troubleshooting

### Issue: "permission denied for table chats"
**Solution:** Check RLS policies are created and user is authenticated

### Issue: "insert or update on table violates foreign key constraint"
**Solution:** Ensure user exists in `auth.users` before inserting chat

### Issue: "updated_at not updating automatically"
**Solution:** Verify trigger is created:
```sql
SELECT trigger_name 
FROM information_schema.triggers 
WHERE event_object_table = 'chats';
```

---

## 📚 References

- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/trigger-definition.html)
- [Supabase Foreign Keys](https://supabase.com/docs/guides/database/tables#foreign-keys)

---

**Last Updated:** April 3, 2026
