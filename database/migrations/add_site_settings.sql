-- Migration: Add site_settings table for site contact information
-- This table stores site-wide contact information (email, phone, location)

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255),
  phone VARCHAR(50),
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = '00000000-0000-0000-0000-000000000001'::uuid)
);

-- Insert default values (singleton pattern - only one row allowed)
INSERT INTO site_settings (id, email, phone, location)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 'poludevs@gmail.com', 'şimdilik yok', 'Bursa, Türkiye')
ON CONFLICT (id) DO NOTHING;

-- Add comment for documentation
COMMENT ON TABLE site_settings IS 'Site-wide contact information (singleton table - only one row)';
COMMENT ON COLUMN site_settings.email IS 'Site contact email address';
COMMENT ON COLUMN site_settings.phone IS 'Site contact phone number';
COMMENT ON COLUMN site_settings.location IS 'Site location';

-- Create index
CREATE INDEX IF NOT EXISTS idx_site_settings_id ON site_settings(id);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Everyone can read site settings
CREATE POLICY "Site settings are viewable by everyone"
  ON site_settings FOR SELECT
  USING (true);

-- Only admins can update site settings
CREATE POLICY "Site settings are updatable by admins"
  ON site_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Only admins can insert site settings
CREATE POLICY "Site settings are insertable by admins"
  ON site_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Trigger to update updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

