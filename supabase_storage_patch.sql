-- ACCN Supabase Storage Configuration Patch
-- Copy and run this in your Supabase SQL Editor to alter your profiles table and configure buckets

-- 1. Add avatar_url column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Create the storage bucket 'accn-assets' for avatars and utility bills
INSERT INTO storage.buckets (id, name, public) 
VALUES ('accn-assets', 'accn-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Setup public access policies on storage.objects for the 'accn-assets' bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'accn-assets');
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'accn-assets');
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'accn-assets');
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'accn-assets');
