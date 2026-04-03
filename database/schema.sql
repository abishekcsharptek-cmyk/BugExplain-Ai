-- BugExplainAI Database Schema for Supabase
-- Author: Generated for BugExplainAI Project
-- Date: April 3, 2026

-- ============================================
-- Enable Row Level Security (RLS)
-- ============================================

-- Users table is automatically created by Supabase Auth
-- It includes: id, email, created_at, etc.

-- ============================================
-- CHATS TABLE
-- ============================================
-- Stores all user conversations with AI
-- Each chat contains a question (error/bug) and AI response

CREATE TABLE IF NOT EXISTS public.chats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON public.chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON public.chats(created_at DESC);

-- Add comment to table
COMMENT ON TABLE public.chats IS 'Stores user chat history with AI bug explanations';
COMMENT ON COLUMN public.chats.question IS 'The error message or bug description submitted by user';
COMMENT ON COLUMN public.chats.response IS 'AI-generated explanation and fix';

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on chats table
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own chats
CREATE POLICY "Users can view own chats"
    ON public.chats
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own chats
CREATE POLICY "Users can insert own chats"
    ON public.chats
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own chats
CREATE POLICY "Users can update own chats"
    ON public.chats
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own chats
CREATE POLICY "Users can delete own chats"
    ON public.chats
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on chats table
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.chats
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- OPTIONAL: USER PROFILES TABLE (Future Enhancement)
-- ============================================
-- Uncomment if you want to store additional user data

-- CREATE TABLE IF NOT EXISTS public.user_profiles (
--     id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
--     full_name TEXT,
--     avatar_url TEXT,
--     bio TEXT,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Users can view own profile"
--     ON public.user_profiles
--     FOR SELECT
--     USING (auth.uid() = id);

-- CREATE POLICY "Users can update own profile"
--     ON public.user_profiles
--     FOR UPDATE
--     USING (auth.uid() = id)
--     WITH CHECK (auth.uid() = id);

-- ============================================
-- GRANTS
-- ============================================
-- Grant permissions to authenticated users

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.chats TO authenticated;
-- GRANT ALL ON public.user_profiles TO authenticated; -- Uncomment if using profiles

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment below to insert sample data
-- Note: Replace 'YOUR_USER_ID' with actual user ID from auth.users

-- INSERT INTO public.chats (user_id, question, response) VALUES
-- ('YOUR_USER_ID', 'TypeError: Cannot read property "map" of undefined', 
--  '## 🔍 Explanation\nThis error occurs when you try to call the .map() method on a variable that is undefined...');
