-- ACCN - AI Carbon Credit Network
-- Database Schema Initialization Script
-- Copy and paste this into the Supabase SQL Editor (https://supabase.com)

-- 1. Create Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  trust_score INTEGER DEFAULT 96,
  kyc_verified BOOLEAN DEFAULT TRUE,
  location TEXT DEFAULT 'Hyderabad, India',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS (Row Level Security) on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can edit their own profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profiles" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Create Wallets Table
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  address TEXT NOT NULL UNIQUE,
  balance NUMERIC DEFAULT 2450.0,
  credits NUMERIC DEFAULT 25.5,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Wallets are viewable by owners" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Wallets can be updated by owners" ON public.wallets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own wallets" ON public.wallets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Create Transactions Ledger Table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('mint', 'sell', 'buy', 'trust', 'device')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  link_text TEXT,
  link_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Create Connected Devices Table
CREATE TABLE IF NOT EXISTS public.devices (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive')),
  last_sync TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own devices" ON public.devices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own devices" ON public.devices FOR ALL USING (auth.uid() = user_id);

-- 5. Create Marketplace Listings Table
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  seller TEXT NOT NULL,
  location TEXT NOT NULL,
  trust_score INTEGER NOT NULL,
  credits NUMERIC NOT NULL,
  energy_type TEXT NOT NULL,
  price_per_credit NUMERIC NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Marketplace listings are public" ON public.marketplace_listings FOR SELECT USING (true);
CREATE POLICY "Anyone can create listing" ON public.marketplace_listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete listings" ON public.marketplace_listings FOR DELETE USING (true);

-- Insert Default Marketplace Items
INSERT INTO public.marketplace_listings (seller, location, trust_score, credits, energy_type, price_per_credit, verified) VALUES
('Rahul K.', 'Hyderabad', 98, 5, 'Solar', 120, true),
('Priya M.', 'Chennai', 95, 12, 'Wind', 115, true),
('Arun S.', 'Delhi', 92, 3, 'Home Solar', 110, false),
('Kishore J.', 'Mumbai', 97, 50, 'Solar', 118, true),
('Nisha G.', 'Pune', 94, 8, 'Wind', 116, false),
('Global Green Corp', 'Bangalore', 99, 150, 'Hydro', 125, true);
