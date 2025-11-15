-- Migration: Add CV Versions and Download Tracking
-- This migration adds support for CV versioning, download tracking, and analytics

-- Create CV Versions table
CREATE TABLE IF NOT EXISTS cv_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  file_path TEXT NOT NULL,
  file_format VARCHAR(10) NOT NULL DEFAULT 'pdf', -- pdf, docx, txt, html
  file_size BIGINT NOT NULL, -- File size in bytes
  template_name VARCHAR(100), -- Template used (if any)
  is_active BOOLEAN NOT NULL DEFAULT false,
  notes TEXT, -- Optional notes about this version
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, version)
);

-- Create CV Downloads tracking table
CREATE TABLE IF NOT EXISTS cv_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_version_id UUID NOT NULL REFERENCES cv_versions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ip_address INET, -- Optional: IP address of downloader
  user_agent TEXT, -- Optional: User agent of downloader
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cv_versions_user_id ON cv_versions(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_versions_is_active ON cv_versions(is_active);
CREATE INDEX IF NOT EXISTS idx_cv_versions_user_active ON cv_versions(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_cv_downloads_cv_version_id ON cv_downloads(cv_version_id);
CREATE INDEX IF NOT EXISTS idx_cv_downloads_user_id ON cv_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_downloads_downloaded_at ON cv_downloads(downloaded_at);

-- Create trigger for updated_at
CREATE TRIGGER update_cv_versions_updated_at
  BEFORE UPDATE ON cv_versions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for cv_versions
ALTER TABLE cv_versions ENABLE ROW LEVEL SECURITY;

-- Anyone can read CV versions
CREATE POLICY "Anyone can read CV versions" ON cv_versions
  FOR SELECT USING (true);

-- Only admins can modify CV versions
CREATE POLICY "Admins can modify CV versions" ON cv_versions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for cv_downloads
ALTER TABLE cv_downloads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert download records (for tracking)
CREATE POLICY "Anyone can track CV downloads" ON cv_downloads
  FOR INSERT WITH CHECK (true);

-- Only admins can read download tracking data
CREATE POLICY "Only admins can read CV download tracking" ON cv_downloads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Migration data: Create initial CV versions from existing cv_url
-- This will migrate existing CV URLs to the new versioning system
INSERT INTO cv_versions (user_id, version, file_path, file_format, file_size, is_active, created_at)
SELECT 
  id,
  1,
  SUBSTRING(cv_url FROM '.*/([^/]+)$') as file_path, -- Extract filename from URL
  CASE 
    WHEN cv_url LIKE '%.pdf' THEN 'pdf'
    WHEN cv_url LIKE '%.docx' THEN 'docx'
    WHEN cv_url LIKE '%.doc' THEN 'doc'
    WHEN cv_url LIKE '%.txt' THEN 'txt'
    WHEN cv_url LIKE '%.html' THEN 'html'
    ELSE 'pdf'
  END as file_format,
  0 as file_size, -- We don't know the file size from URL
  true,
  created_at
FROM users
WHERE cv_url IS NOT NULL
ON CONFLICT (user_id, version) DO NOTHING;

