import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Helper to check if URL is valid and not a placeholder
const isValidUrl = (url) => {
  try {
    return url && url.startsWith('https://') && !url.includes('your_supabase_url')
  } catch (e) {
    return false
  }
}

const url = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co'
const key = supabaseAnonKey && !supabaseAnonKey.includes('your_supabase_anon') ? supabaseAnonKey : 'placeholder-key'

if (!isValidUrl(supabaseUrl) || !supabaseAnonKey || supabaseAnonKey.includes('your_supabase_anon')) {
  console.warn('Supabase credentials missing or invalid! Please update your .env file with real credentials.')
}

export const supabase = createClient(url, key)
