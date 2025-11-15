-- Poludev Database Schema - Part 2: Indexes
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_site_content_lang_section ON site_content(lang, section);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_about_us_user_id ON about_us(user_id);

