# Database Migrations

This folder contains optional database migrations to extend the functionality of BugExplainAI.

## 📁 Migration Files

### Required (Already in `schema.sql`)
- ✅ **Base Schema** - `chats` table with RLS policies
- ✅ **Authentication** - Handled by Supabase Auth

### Optional Migrations

#### `001_add_user_profiles.sql`
**Status:** Optional  
**Purpose:** Add user profile features

**Adds:**
- `user_profiles` table for storing display name, avatar, bio
- Automatic profile creation on signup
- User preferences (stored as JSON)

**When to use:**
- You want users to customize their profile
- Need to display user names/avatars in UI
- Want to store user preferences (theme, language, etc.)

**How to run:**
```sql
-- In Supabase SQL Editor
\i database/migrations/001_add_user_profiles.sql
```

---

#### `002_add_chat_tags.sql`
**Status:** Optional  
**Purpose:** Categorize chats by error type

**Adds:**
- `tags` table with predefined tags (React, Python, CORS, etc.)
- `chat_tags` junction table for many-to-many relationships
- Auto-suggest function to tag chats by keywords
- 10 default tags with icons

**When to use:**
- You want to filter chats by technology/error type
- Need to organize large chat histories
- Want search/filter by category features

**How to run:**
```sql
-- In Supabase SQL Editor
\i database/migrations/002_add_chat_tags.sql
```

**Frontend integration example:**
```javascript
// Suggest tags when user submits a chat
const { data } = await supabase.rpc('suggest_tags_for_chat', {
  chat_question: userQuestion
});

// Add tag to chat
await supabase.from('chat_tags').insert({
  chat_id: chatId,
  tag_id: selectedTagId
});
```

---

## 🔄 Migration Order

If using multiple migrations, run them in order:

1. `schema.sql` (required - base tables)
2. `001_add_user_profiles.sql` (optional)
3. `002_add_chat_tags.sql` (optional)

---

## 🎯 Future Migration Ideas

Consider creating these migrations if you need them:

### `003_add_favorites.sql`
- Ability to "star" important chats
- Quick access to saved solutions

### `004_add_shared_chats.sql`
- Share chat explanations via public links
- Team collaboration features

### `005_add_usage_analytics.sql`
- Track API usage per user
- Monitor most common error types
- Usage limits and quotas

### `006_add_collections.sql`
- Group related chats into collections
- Organize by project or topic

---

## 📝 Creating Your Own Migration

Use this template:

```sql
-- Migration: [Name]
-- Description: [What it does]
-- Date: [Date]
-- Status: OPTIONAL/REQUIRED

-- ============================================
-- CREATE TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS public.your_table (
    -- columns here
);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE public.your_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "policy_name"
    ON public.your_table
    FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================
-- GRANTS
-- ============================================

GRANT ALL ON public.your_table TO authenticated;

-- ============================================
-- ROLLBACK
-- ============================================

-- DROP TABLE IF EXISTS public.your_table CASCADE;
```

---

## ⚠️ Migration Best Practices

1. **Test First:** Always test migrations in development before production
2. **Backup:** Take database snapshot before running migrations
3. **Idempotent:** Use `IF NOT EXISTS` and `IF EXISTS` to make migrations rerunnable
4. **Rollback:** Include rollback commands in comments
5. **RLS:** Always enable Row Level Security for new tables
6. **Indexes:** Add indexes for frequently queried columns
7. **Comments:** Document table and column purposes

---

## 🛟 Rollback Instructions

Each migration file includes rollback commands in comments at the bottom.

**To rollback a migration:**

1. Scroll to bottom of migration file
2. Uncomment the DROP statements
3. Run them in Supabase SQL Editor

**Example:**
```sql
-- Uncomment and run to rollback:
DROP TABLE IF EXISTS public.user_profiles CASCADE;
```

---

## 🔍 Verify Migrations

**Check tables exist:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Check RLS policies:**
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

**Check triggers:**
```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

---

## 📚 Resources

- [Supabase Migrations Guide](https://supabase.com/docs/guides/database/migrations)
- [PostgreSQL ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
- [Database Schema Design Best Practices](https://www.postgresql.org/docs/current/ddl.html)

---

**Note:** Only run migrations you actually need. The base `schema.sql` is sufficient for the current app functionality.
