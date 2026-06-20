import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Fallback configuration if env variables are empty
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Check if the Supabase connection is successfully configured
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error && error.code === 'PGRST116') {
      // Table doesn't exist but connection was reached
      return true;
    }
    return !error;
  } catch {
    return false;
  }
};
