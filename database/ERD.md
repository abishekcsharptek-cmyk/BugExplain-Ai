# Database Entity Relationship Diagram (ERD)

## 📊 Core Schema (Required)

```
┌──────────────────────────────────────┐
│         auth.users                   │
│  (Managed by Supabase Auth)          │
├──────────────────────────────────────┤
│ 🔑 id                  UUID (PK)     │
│    email               TEXT          │
│    encrypted_password  TEXT          │
│    email_confirmed_at  TIMESTAMP     │
│    last_sign_in_at     TIMESTAMP     │
│    created_at          TIMESTAMP     │
│    updated_at          TIMESTAMP     │
│    raw_user_meta_data  JSONB         │
└──────────┬───────────────────────────┘
           │
           │ 1:N (One user has many chats)
           │ ON DELETE CASCADE
           │
           ▼
┌──────────────────────────────────────┐
│         public.chats                 │
│  (Chat history with AI)              │
├──────────────────────────────────────┤
│ 🔑 id          UUID (PK)             │
│ 🔗 user_id     UUID (FK → users.id)  │
│    question    TEXT (NOT NULL)       │
│    response    TEXT (NOT NULL)       │
│    created_at  TIMESTAMP             │
│    updated_at  TIMESTAMP             │
├──────────────────────────────────────┤
│ 📇 Indexes:                          │
│    - idx_chats_user_id               │
│    - idx_chats_created_at            │
├──────────────────────────────────────┤
│ 🔒 RLS Policies:                     │
│    - Users can view own chats        │
│    - Users can insert own chats      │
│    - Users can update own chats      │
│    - Users can delete own chats      │
└──────────────────────────────────────┘
```

### Key Points:
- ✅ **Simple & Efficient:** Only 1 table needed (+ auth.users)
- ✅ **Secure:** RLS ensures data isolation
- ✅ **Scalable:** Indexed for fast queries
- ✅ **Clean:** Cascading deletes handle cleanup

---

## 🎨 Extended Schema (Optional Migrations)

### With User Profiles (`001_add_user_profiles.sql`)

```
┌────────────────────────┐
│     auth.users         │
│   (Supabase Auth)      │
└───────┬────────────────┘
        │
        │ 1:1 relationship
        │ ON DELETE CASCADE
        │
        │ 1:N relationship
        │ ON DELETE CASCADE
        │
        ├─────────────┐
        ▼             ▼
┌────────────────┐  ┌──────────────────┐
│ user_profiles  │  │    chats         │
├────────────────┤  ├──────────────────┤
│ 🔑 id (PK,FK)  │  │ 🔑 id (PK)       │
│    full_name   │  │ 🔗 user_id (FK)  │
│    avatar_url  │  │    question      │
│    bio         │  │    response      │
│    preferences │  │    created_at    │
│    created_at  │  │    updated_at    │
│    updated_at  │  └──────────────────┘
└────────────────┘
```

---

### With Chat Tags (`002_add_chat_tags.sql`)

```
┌────────────────┐
│   auth.users   │
└───────┬────────┘
        │
        │ 1:N
        ▼
┌────────────────────┐           ┌────────────────┐
│       chats        │           │     tags       │
├────────────────────┤           ├────────────────┤
│ 🔑 id (PK)         │           │ 🔑 id (PK)     │
│ 🔗 user_id (FK)    │           │    name        │
│    question        │           │    color       │
│    response        │           │    icon        │
│    created_at      │           │    created_at  │
│    updated_at      │           └────────┬───────┘
└─────────┬──────────┘                    │
          │                               │
          │                               │
          │         M:N (Many-to-Many)    │
          │                               │
          └────────►┌────────────┐◄───────┘
                    │ chat_tags  │
                    ├────────────┤
                    │ 🔗 chat_id │ (FK → chats.id)
                    │ 🔗 tag_id  │ (FK → tags.id)
                    │    created │
                    └────────────┘
                    Composite PK: (chat_id, tag_id)
```

**Default Tags:**
- ⚛️ React
- 🟨 JavaScript
- 🐍 Python
- 💙 TypeScript
- 🔒 CORS
- 🗄️ Database
- 🔌 API
- 🎨 CSS
- 🟢 Node.js
- 📦 Git

---

## 📈 Complete Extended Schema

```
                    ┌─────────────────────┐
                    │    auth.users       │
                    │  (Supabase Auth)    │
                    └───┬─────────────┬───┘
                        │             │
              1:1       │             │ 1:N
         ┌──────────────┘             └────────────┐
         │                                          │
         ▼                                          ▼
┌─────────────────┐                      ┌──────────────────┐
│ user_profiles   │                      │     chats        │
├─────────────────┤                      ├──────────────────┤
│ 🔑 id (PK,FK)   │                      │ 🔑 id (PK)       │
│    full_name    │                      │ 🔗 user_id (FK)  │
│    avatar_url   │                      │    question      │
│    bio          │                      │    response      │
│    preferences  │                      │    created_at    │
└─────────────────┘                      │    updated_at    │
                                         └────────┬─────────┘
                                                  │
                                                  │ M:N
                                                  │
                                         ┌────────▼─────────┐
                                         │   chat_tags      │
                                         ├──────────────────┤
                                         │ 🔗 chat_id (FK)  │  ┌─────────────┐
                                         │ 🔗 tag_id (FK)   │◄─┤    tags     │
                                         │    created_at    │  ├─────────────┤
                                         └──────────────────┘  │ 🔑 id (PK)  │
                                                                │    name     │
                                                                │    color    │
                                                                │    icon     │
                                                                └─────────────┘
```

---

## 🔐 Security Model (RLS Policies)

### auth.users
- 🔒 Managed entirely by Supabase Auth
- ✅ Automatic security policies

### chats
```sql
SELECT: auth.uid() = user_id  -- Users see only their chats
INSERT: auth.uid() = user_id  -- Users create their own chats
UPDATE: auth.uid() = user_id  -- Users edit only their chats
DELETE: auth.uid() = user_id  -- Users delete only their chats
```

### user_profiles
```sql
SELECT: true                  -- Public (for future social features)
INSERT: auth.uid() = id       -- Users create own profile
UPDATE: auth.uid() = id       -- Users edit own profile
DELETE: N/A                   -- No delete policy (cascade from auth.users)
```

### tags
```sql
SELECT: true                  -- Everyone can view tags
INSERT: N/A                   -- Only admins (via SQL)
UPDATE: N/A                   -- Only admins (via SQL)
DELETE: N/A                   -- Only admins (via SQL)
```

### chat_tags
```sql
SELECT: chat.user_id = auth.uid()  -- Via chat ownership
INSERT: chat.user_id = auth.uid()  -- Via chat ownership
DELETE: chat.user_id = auth.uid()  -- Via chat ownership
```

---

## 📊 Data Flow Example

### User Submits Error:
```
1. User types error message
2. Frontend sends to OpenAI API
3. AI responds with explanation
4. Frontend saves to database:
   
   INSERT INTO chats (user_id, question, response)
   VALUES (current_user_id, error_msg, ai_response)
   
5. RLS policy checks: auth.uid() = user_id ✅
6. Data saved successfully
7. Auto-suggest tags runs (if migration 002 installed)
8. Tags attached to chat
```

### User Views History:
```
1. Frontend queries:
   
   SELECT * FROM chats
   WHERE user_id = current_user_id
   ORDER BY created_at DESC
   
2. RLS policy filters automatically
3. Only user's own chats returned
4. Displayed in sidebar
```

---

## 🎯 Performance Considerations

### Indexes Created:
```sql
-- chats table
idx_chats_user_id       -- Fast user lookup
idx_chats_created_at    -- Fast chronological sorting

-- chat_tags table (if migration 002 installed)
idx_chat_tags_chat_id   -- Fast chat → tags lookup
idx_chat_tags_tag_id    -- Fast tag → chats lookup

-- user_profiles table (if migration 001 installed)
idx_user_profiles_id    -- Fast profile lookup
```

### Query Performance:
- ✅ Getting user's chats: **O(log n)** via `idx_chats_user_id`
- ✅ Latest chats first: **O(1)** via `idx_chats_created_at`
- ✅ Chat with tags: **O(1)** via indexes + JOIN

---

## 📐 Cardinality

```
auth.users : chats
    1      :   N     (One user has many chats)

chats : chat_tags
    1      :   N     (One chat has many tags)

tags : chat_tags
    1      :   N     (One tag used in many chats)

auth.users : user_profiles
    1      :   1     (One user has one profile)
```

---

## 🔄 Cascade Behaviors

```
DELETE user
  ↓
  ├─ Deletes all user's chats (CASCADE)
  │   ↓
  │   └─ Deletes all chat_tags for those chats (CASCADE)
  │
  └─ Deletes user_profile (CASCADE)

DELETE tag
  ↓
  └─ Deletes all chat_tags using that tag (CASCADE)
```

---

## 🧪 Sample Queries

### Get user's recent chats with tags:
```sql
SELECT 
    c.id,
    c.question,
    c.response,
    c.created_at,
    ARRAY_AGG(t.name) as tags
FROM chats c
LEFT JOIN chat_tags ct ON c.id = ct.chat_id
LEFT JOIN tags t ON ct.tag_id = t.id
WHERE c.user_id = auth.uid()
GROUP BY c.id
ORDER BY c.created_at DESC
LIMIT 20;
```

### Find chats by tag:
```sql
SELECT c.*
FROM chats c
JOIN chat_tags ct ON c.id = ct.chat_id
JOIN tags t ON ct.tag_id = t.id
WHERE t.name = 'React'
  AND c.user_id = auth.uid()
ORDER BY c.created_at DESC;
```

### Get user profile with chat count:
```sql
SELECT 
    u.email,
    p.full_name,
    p.avatar_url,
    COUNT(c.id) as total_chats
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
LEFT JOIN chats c ON u.id = c.user_id
WHERE u.id = auth.uid()
GROUP BY u.id, u.email, p.full_name, p.avatar_url;
```

---

**Legend:**
- 🔑 = Primary Key
- 🔗 = Foreign Key
- 🔒 = RLS Enabled
- 📇 = Index
