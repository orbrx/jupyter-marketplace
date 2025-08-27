-- Supabase database schema for Jupyter Marketplace
-- This file contains the SQL schema for the extensions table

CREATE TABLE IF NOT EXISTS public.extensions (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  description TEXT,
  version VARCHAR NOT NULL,
  author VARCHAR,
  license VARCHAR,
  category VARCHAR,
  pypi_url VARCHAR NOT NULL,
  github_url VARCHAR,
  github_stars INTEGER DEFAULT 0,
  github_forks INTEGER DEFAULT 0,
  github_issues INTEGER DEFAULT 0,
  download_count_total INTEGER DEFAULT 0,
  download_count_month INTEGER DEFAULT 0,
  download_count_week INTEGER DEFAULT 0,
  download_count_day INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.extensions ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read extensions data
CREATE POLICY "Anyone can read extensions" ON public.extensions
  FOR SELECT USING (true);

-- Function to automatically update the last_updated timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$;

-- Trigger to automatically update last_updated when a row is modified
DROP TRIGGER IF EXISTS update_extensions_updated_at ON public.extensions;
CREATE TRIGGER update_extensions_updated_at
    BEFORE UPDATE ON public.extensions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();