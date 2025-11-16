-- Migration: Add display_order field to projects table for manual sorting
-- This allows admins to manually order projects via drag & drop

-- Add display_order column
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Update existing projects with display_order based on created_at
UPDATE projects
SET display_order = (
  SELECT row_number() OVER (ORDER BY created_at DESC)
  FROM projects p2
  WHERE p2.id = projects.id
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);

-- Add comment for documentation
COMMENT ON COLUMN projects.display_order IS 'Display order for manual sorting (lower numbers appear first)';

