-- ACCN RLS Policies Patch
-- Run this in your Supabase SQL Editor to enable user profile and wallet creation on sign-up

CREATE POLICY "Users can insert their own profiles" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert their own wallets" ON public.wallets FOR INSERT WITH CHECK (auth.uid() = user_id);
