import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Copy .env.example to .env and set ' +
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart the dev server.',
  );
}

/**
 * Shared Supabase client for the browser.
 *
 * Import this singleton everywhere rather than calling `createClient` again —
 * multiple clients each open their own auth/realtime connection and can end up
 * fighting over the same session in localStorage.
 *
 * This uses the anon key, which ships to the browser and is public by design.
 * Every relation it touches must be protected by row level security.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
