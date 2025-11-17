-- Migration: Add blog_posts table for blog system
-- This migration creates a blog posts table with multilingual support and download links

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_tr VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  slug_tr VARCHAR(255) NOT NULL,
  slug_en VARCHAR(255) NOT NULL,
  excerpt_tr TEXT,
  excerpt_en TEXT,
  content_tr TEXT NOT NULL,
  content_en TEXT NOT NULL,
  featured_image_url TEXT,
  download_url TEXT,
  download_label_tr VARCHAR(255),
  download_label_en VARCHAR(255),
  category VARCHAR(50) DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(slug_tr),
  UNIQUE(slug_en)
);

-- Add comments for documentation
COMMENT ON TABLE blog_posts IS 'Blog posts with multilingual support';
COMMENT ON COLUMN blog_posts.slug_tr IS 'URL-friendly slug for Turkish version';
COMMENT ON COLUMN blog_posts.slug_en IS 'URL-friendly slug for English version';
COMMENT ON COLUMN blog_posts.excerpt_tr IS 'Short excerpt for Turkish version (used in listings)';
COMMENT ON COLUMN blog_posts.excerpt_en IS 'Short excerpt for English version (used in listings)';
COMMENT ON COLUMN blog_posts.content_tr IS 'Full blog post content in Turkish (HTML or Markdown)';
COMMENT ON COLUMN blog_posts.content_en IS 'Full blog post content in English (HTML or Markdown)';
COMMENT ON COLUMN blog_posts.download_url IS 'Download link URL (for files, resources, etc.)';
COMMENT ON COLUMN blog_posts.download_label_tr IS 'Download button label in Turkish';
COMMENT ON COLUMN blog_posts.download_label_en IS 'Download button label in English';
COMMENT ON COLUMN blog_posts.category IS 'Blog post category';
COMMENT ON COLUMN blog_posts.published IS 'Whether the post is published';
COMMENT ON COLUMN blog_posts.published_at IS 'Publication date and time';
COMMENT ON COLUMN blog_posts.view_count IS 'Number of views';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug_tr ON blog_posts(slug_tr);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug_en ON blog_posts(slug_en);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts table
-- Everyone can read published blog posts
CREATE POLICY "Anyone can read published blog posts" ON blog_posts
  FOR SELECT USING (published = true);

-- Only admins can read unpublished blog posts
CREATE POLICY "Admins can read all blog posts" ON blog_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can modify blog posts
CREATE POLICY "Admins can modify blog posts" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

