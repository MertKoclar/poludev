-- Poludev Complete Database Schema
-- Bu dosyayı Supabase SQL Editor'da çalıştırın veya MCP araçları ile yükleyin

-- ============================================
-- Part 1: Extensions and Tables
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  cv_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site content table
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lang VARCHAR(2) NOT NULL CHECK (lang IN ('tr', 'en')),
  section VARCHAR(100) NOT NULL,
  key VARCHAR(100) NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(lang, section, key)
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_tr VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  description_tr TEXT NOT NULL,
  description_en TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  live_url TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About us table
CREATE TABLE IF NOT EXISTS about_us (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio_tr TEXT NOT NULL,
  bio_en TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Part 2: Indexes
-- ============================================

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_site_content_lang_section ON site_content(lang, section);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_about_us_user_id ON about_us(user_id);

-- ============================================
-- Part 3: Triggers
-- ============================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_about_us_updated_at ON about_us;
CREATE TRIGGER update_about_us_updated_at BEFORE UPDATE ON about_us
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Part 4: Row Level Security Policies
-- ============================================

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_us ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Anyone can read site content" ON site_content;
DROP POLICY IF EXISTS "Admins can modify site content" ON site_content;
DROP POLICY IF EXISTS "Anyone can read projects" ON projects;
DROP POLICY IF EXISTS "Admins can modify projects" ON projects;
DROP POLICY IF EXISTS "Anyone can read about_us" ON about_us;
DROP POLICY IF EXISTS "Admins can modify about_us" ON about_us;

-- RLS Policies for users table
-- Users can read their own data
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Admins can read all users
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all users
CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for site_content table
-- Everyone can read site content
CREATE POLICY "Anyone can read site content" ON site_content
  FOR SELECT USING (true);

-- Only admins can modify site content
CREATE POLICY "Admins can modify site content" ON site_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for projects table
-- Everyone can read projects
CREATE POLICY "Anyone can read projects" ON projects
  FOR SELECT USING (true);

-- Only admins can modify projects
CREATE POLICY "Admins can modify projects" ON projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for about_us table
-- Everyone can read about_us
CREATE POLICY "Anyone can read about_us" ON about_us
  FOR SELECT USING (true);

-- Only admins can modify about_us
CREATE POLICY "Admins can modify about_us" ON about_us
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- Part 5: Storage Bucket and Policies
-- ============================================

-- Create storage bucket for CV files
INSERT INTO storage.buckets (id, name, public)
VALUES ('cv-files', 'cv-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for CV files
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read CV files" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can upload CV files" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can update CV files" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can delete CV files" ON storage.objects;

-- Policy: Anyone can read CV files
CREATE POLICY "Anyone can read CV files" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'cv-files');

-- Policy: Only admins can upload CV files
CREATE POLICY "Only admins can upload CV files" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'cv-files' AND
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Only admins can update CV files
CREATE POLICY "Only admins can update CV files" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'cv-files' AND
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Only admins can delete CV files
CREATE POLICY "Only admins can delete CV files" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'cv-files' AND
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

