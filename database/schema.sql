-- Poludev Database Schema
-- This file contains all the SQL commands needed to set up the Supabase database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
-- This table stores user information including admin roles
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
-- This table stores multilingual site content
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
-- This table stores project information in both Turkish and English
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
-- This table stores biographical information for Mert and Mustafa
CREATE TABLE IF NOT EXISTS about_us (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio_tr TEXT NOT NULL,
  bio_en TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_site_content_lang_section ON site_content(lang, section);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_about_us_user_id ON about_us(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_us_updated_at BEFORE UPDATE ON about_us
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_us ENABLE ROW LEVEL SECURITY;

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

-- Create storage bucket for CV files
-- Note: This needs to be run in Supabase Dashboard or via Supabase CLI
-- INSERT INTO storage.buckets (id, name, public) VALUES ('cv-files', 'cv-files', true);

-- Storage policies for CV files
-- Note: These need to be created in Supabase Dashboard under Storage > Policies
-- Policy: "Anyone can read CV files"
--   SELECT: true
-- Policy: "Only admins can upload CV files"
--   INSERT: (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
-- Policy: "Only admins can update CV files"
--   UPDATE: (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
-- Policy: "Only admins can delete CV files"
--   DELETE: (SELECT role FROM users WHERE id = auth.uid()) = 'admin'

-- Insert initial admin users (replace with actual email addresses)
-- Note: These users need to be created via Supabase Auth first, then update the users table
-- INSERT INTO users (id, name, email, role) VALUES
--   ('<mert-user-id>', 'Mert', 'mert@example.com', 'admin'),
--   ('<mustafa-user-id>', 'Mustafa', 'mustafa@example.com', 'admin');

-- Sample data for testing (optional)
-- INSERT INTO projects (title_tr, title_en, description_tr, description_en, tags, image_url, live_url, github_url) VALUES
--   ('Örnek Proje', 'Sample Project', 'Bu bir örnek projedir', 'This is a sample project', ARRAY['React', 'TypeScript'], 'https://example.com/image.jpg', 'https://example.com', 'https://github.com/example');

