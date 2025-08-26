-- Supabase database schema for Jupyter Marketplace
-- This file contains the SQL schema for the extensions table

CREATE TABLE IF NOT EXISTS public.extensions (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
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

-- Sample data for testing
INSERT INTO public.extensions (
  name, description, version, author, license, category, 
  pypi_url, github_url, github_stars, github_forks, 
  github_issues, download_count_total, download_count_month,
  download_count_week, download_count_day
) VALUES 
  (
    'jupyter-widgets',
    'Interactive Widgets for the Jupyter Notebook',
    '8.0.7',
    'Jupyter Development Team',
    'BSD-3-Clause',
    'widgets',
    'https://pypi.org/project/ipywidgets/',
    'https://github.com/jupyter-widgets/ipywidgets',
    2800,
    650,
    45,
    5000000,
    180000,
    45000,
    6500
  ),
  (
    'matplotlib',
    'Python plotting package',
    '3.7.2',
    'Matplotlib Development Team',
    'PSF',
    'visualization',
    'https://pypi.org/project/matplotlib/',
    'https://github.com/matplotlib/matplotlib',
    19000,
    7200,
    1200,
    45000000,
    2100000,
    520000,
    75000
  ),
  (
    'pandas',
    'Powerful data structures for data analysis, time series, and statistics',
    '2.1.1',
    'The Pandas Development Team',
    'BSD-3-Clause',
    'data-analysis',
    'https://pypi.org/project/pandas/',
    'https://github.com/pandas-dev/pandas',
    42000,
    17500,
    3500,
    120000000,
    5200000,
    1300000,
    185000
  );
