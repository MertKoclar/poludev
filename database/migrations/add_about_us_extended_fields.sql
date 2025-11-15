-- Migration: Add extended fields to about_us table
-- This migration adds support for profile images, social links, education, experience, certifications, testimonials, and contact info

-- Add new columns to about_us table
ALTER TABLE about_us
  ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
  ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS experience JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS testimonials JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS location VARCHAR(255);

-- Add comment for documentation
COMMENT ON COLUMN about_us.profile_image_url IS 'URL to the user profile image (stored in Supabase Storage)';
COMMENT ON COLUMN about_us.social_links IS 'Array of social media links: [{"platform": "github", "url": "https://..."}]';
COMMENT ON COLUMN about_us.education IS 'Array of education entries: [{"institution": "...", "degree": "...", "field": "...", "start_date": "...", "end_date": "..."}]';
COMMENT ON COLUMN about_us.experience IS 'Array of experience entries: [{"company": "...", "position": "...", "start_date": "...", "end_date": "...", "description_tr": "...", "description_en": "..."}]';
COMMENT ON COLUMN about_us.certifications IS 'Array of certifications: [{"name": "...", "issuer": "...", "issue_date": "...", "expiry_date": "...", "credential_id": "..."}]';
COMMENT ON COLUMN about_us.testimonials IS 'Array of testimonials: [{"name": "...", "role": "...", "company": "...", "content_tr": "...", "content_en": "...", "rating": 5}]';
COMMENT ON COLUMN about_us.contact_email IS 'Contact email address';
COMMENT ON COLUMN about_us.contact_phone IS 'Contact phone number';
COMMENT ON COLUMN about_us.location IS 'Location/City';

-- Create indexes for JSONB columns for better query performance
CREATE INDEX IF NOT EXISTS idx_about_us_social_links ON about_us USING GIN (social_links);
CREATE INDEX IF NOT EXISTS idx_about_us_education ON about_us USING GIN (education);
CREATE INDEX IF NOT EXISTS idx_about_us_experience ON about_us USING GIN (experience);
CREATE INDEX IF NOT EXISTS idx_about_us_certifications ON about_us USING GIN (certifications);
CREATE INDEX IF NOT EXISTS idx_about_us_testimonials ON about_us USING GIN (testimonials);

-- Example data structure for JSONB columns:
-- 
-- social_links: [
--   {"platform": "github", "url": "https://github.com/user"},
--   {"platform": "linkedin", "url": "https://linkedin.com/in/user"},
--   {"platform": "twitter", "url": "https://twitter.com/user"}
-- ]
--
-- education: [
--   {
--     "id": "uuid",
--     "institution": "University Name",
--     "degree": "Bachelor's Degree",
--     "field": "Computer Science",
--     "start_date": "2015-09-01",
--     "end_date": "2019-06-30",
--     "description_tr": "...",
--     "description_en": "...",
--     "location": "Istanbul, Turkey"
--   }
-- ]
--
-- experience: [
--   {
--     "id": "uuid",
--     "company": "Company Name",
--     "position": "Senior Developer",
--     "start_date": "2020-01-01",
--     "end_date": null,
--     "description_tr": "...",
--     "description_en": "...",
--     "location": "Istanbul, Turkey",
--     "current": true
--   }
-- ]
--
-- certifications: [
--   {
--     "id": "uuid",
--     "name": "AWS Certified Solutions Architect",
--     "issuer": "Amazon Web Services",
--     "issue_date": "2022-01-15",
--     "expiry_date": "2025-01-15",
--     "credential_id": "ABC123XYZ",
--     "credential_url": "https://..."
--   }
-- ]
--
-- testimonials: [
--   {
--     "id": "uuid",
--     "name": "John Doe",
--     "role": "CEO",
--     "company": "Tech Company",
--     "content_tr": "...",
--     "content_en": "...",
--     "avatar_url": "https://...",
--     "rating": 5
--   }
-- ]

