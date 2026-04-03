-- Migration: Add Chat Tags & Categories
-- Description: Allows categorizing chats by error type (React, Python, CORS, etc.)
-- Date: April 3, 2026
-- Status: OPTIONAL - Run only if you want chat categorization

-- ============================================
-- CREATE TAGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#6366f1',
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE public.tags IS 'Predefined tags for categorizing chats (e.g., React, Python, CORS)';

-- ============================================
-- CREATE CHAT_TAGS JUNCTION TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.chat_tags (
    chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (chat_id, tag_id)
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_chat_tags_chat_id ON public.chat_tags(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_tags_tag_id ON public.chat_tags(tag_id);

-- Add comment
COMMENT ON TABLE public.chat_tags IS 'Many-to-many relationship between chats and tags';

-- ============================================
-- INSERT DEFAULT TAGS
-- ============================================

INSERT INTO public.tags (name, color, icon) VALUES
('React', '#61dafb', '⚛️'),
('JavaScript', '#f7df1e', '🟨'),
('Python', '#3776ab', '🐍'),
('TypeScript', '#3178c6', '💙'),
('CORS', '#ff6b6b', '🔒'),
('Database', '#4db33d', '🗄️'),
('API', '#ff9f43', '🔌'),
('CSS', '#264de4', '🎨'),
('Node.js', '#68a063', '🟢'),
('Git', '#f05032', '📦')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_tags ENABLE ROW LEVEL SECURITY;

-- Everyone can view tags
CREATE POLICY "Tags are viewable by everyone"
    ON public.tags
    FOR SELECT
    USING (true);

-- Users can view their own chat tags
CREATE POLICY "Users can view own chat tags"
    ON public.chat_tags
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE chats.id = chat_tags.chat_id
            AND chats.user_id = auth.uid()
        )
    );

-- Users can add tags to their own chats
CREATE POLICY "Users can add tags to own chats"
    ON public.chat_tags
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE chats.id = chat_tags.chat_id
            AND chats.user_id = auth.uid()
        )
    );

-- Users can remove tags from their own chats
CREATE POLICY "Users can delete tags from own chats"
    ON public.chat_tags
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.chats
            WHERE chats.id = chat_tags.chat_id
            AND chats.user_id = auth.uid()
        )
    );

-- ============================================
-- HELPER FUNCTION: AUTO-TAG CHAT BY KEYWORDS
-- ============================================
-- Automatically suggests tags based on error message content

CREATE OR REPLACE FUNCTION public.suggest_tags_for_chat(chat_question TEXT)
RETURNS TABLE(tag_id UUID, tag_name TEXT, confidence DECIMAL) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.name,
        CASE 
            WHEN LOWER(chat_question) LIKE '%' || LOWER(t.name) || '%' THEN 1.0
            WHEN LOWER(t.name) = 'react' AND LOWER(chat_question) LIKE '%component%' THEN 0.8
            WHEN LOWER(t.name) = 'react' AND LOWER(chat_question) LIKE '%hook%' THEN 0.8
            WHEN LOWER(t.name) = 'cors' AND LOWER(chat_question) LIKE '%access-control%' THEN 1.0
            WHEN LOWER(t.name) = 'database' AND LOWER(chat_question) LIKE '%sql%' THEN 0.9
            WHEN LOWER(t.name) = 'api' AND LOWER(chat_question) LIKE '%fetch%' THEN 0.7
            WHEN LOWER(t.name) = 'api' AND LOWER(chat_question) LIKE '%axios%' THEN 0.7
            ELSE 0.0
        END::DECIMAL as confidence
    FROM public.tags t
    WHERE LOWER(chat_question) LIKE '%' || LOWER(t.name) || '%'
    OR (LOWER(t.name) = 'react' AND (LOWER(chat_question) LIKE '%component%' OR LOWER(chat_question) LIKE '%hook%'))
    OR (LOWER(t.name) = 'cors' AND LOWER(chat_question) LIKE '%access-control%')
    OR (LOWER(t.name) = 'database' AND LOWER(chat_question) LIKE '%sql%')
    OR (LOWER(t.name) = 'api' AND (LOWER(chat_question) LIKE '%fetch%' OR LOWER(chat_question) LIKE '%axios%'))
    ORDER BY confidence DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- GRANTS
-- ============================================

GRANT ALL ON public.tags TO authenticated;
GRANT ALL ON public.chat_tags TO authenticated;

-- ============================================
-- USAGE EXAMPLE
-- ============================================

-- Get suggested tags for a chat:
-- SELECT * FROM suggest_tags_for_chat('TypeError: Cannot read property map of undefined in React component');

-- Add tag to a chat:
-- INSERT INTO chat_tags (chat_id, tag_id) VALUES ('chat-uuid', 'tag-uuid');

-- Get all chats with a specific tag:
-- SELECT c.* 
-- FROM chats c
-- JOIN chat_tags ct ON c.id = ct.chat_id
-- JOIN tags t ON ct.tag_id = t.id
-- WHERE t.name = 'React' AND c.user_id = auth.uid();

-- ============================================
-- ROLLBACK
-- ============================================

-- DROP FUNCTION IF EXISTS public.suggest_tags_for_chat(TEXT);
-- DROP TABLE IF EXISTS public.chat_tags CASCADE;
-- DROP TABLE IF EXISTS public.tags CASCADE;
