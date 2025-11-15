-- Migration: Add extended fields to projects table
-- This migration adds support for categories, status, statistics, and featured flag

-- Add new columns to projects table
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS category VARCHAR(50) CHECK (category IN ('web', 'mobile', 'desktop', 'api', 'other')),
  ADD COLUMN IF NOT EXISTS status VARCHAR(50) CHECK (status IN ('active', 'completed', 'in-development', 'on-hold')),
  ADD COLUMN IF NOT EXISTS star_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS fork_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN projects.category IS 'Project category: web, mobile, desktop, api, or other';
COMMENT ON COLUMN projects.status IS 'Project status: active, completed, in-development, or on-hold';
COMMENT ON COLUMN projects.star_count IS 'Number of stars (for GitHub projects)';
COMMENT ON COLUMN projects.fork_count IS 'Number of forks (for GitHub projects)';
COMMENT ON COLUMN projects.view_count IS 'Number of views';
COMMENT ON COLUMN projects.featured IS 'Whether this project is featured';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_star_count ON projects(star_count DESC);
CREATE INDEX IF NOT EXISTS idx_projects_created_at_status ON projects(created_at DESC, status);

