import { createClient } from '@supabase/supabase-js';
import config from '../config/config.js';

// Public Supabase client (used for public auth/storage requests)
export const supabasePublic = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// Admin Supabase client (bypasses RLS server-side using service_role key)
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export default supabaseAdmin;
