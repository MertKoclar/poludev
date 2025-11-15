-- Poludev Database Schema - Part 4: Row Level Security Policies
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

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

