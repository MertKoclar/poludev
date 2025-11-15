-- Poludev Database Schema - Part 5: Storage Bucket and Policies
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

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

