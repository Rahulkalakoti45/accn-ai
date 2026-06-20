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

/**
 * Upload a file to a Supabase storage bucket and return its public URL
 */
export const uploadFile = async (bucket: string, path: string, file: File): Promise<string | null> => {
  try {
    // Slugify path to replace any non-ASCII characters (e.g. Hindi name chars) with underscores
    const safePath = path.replace(/[^\x00-\x7F]/g, "_");

    const { data, error } = await supabase.storage.from(bucket).upload(safePath, file, {
      cacheControl: '3600',
      upsert: true
    });
    if (error) throw error;
    
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return urlData.publicUrl;
  } catch (err) {
    console.error('Supabase storage upload error:', err);
    return null;
  }
};
