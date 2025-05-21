-- SQL script to update spaces table schema in Supabase

-- Add invite_only, anyone_can_invite columns
ALTER TABLE spaces
ADD COLUMN IF NOT EXISTS invite_only BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS anyone_can_invite BOOLEAN DEFAULT FALSE;

-- Add permission columns
ALTER TABLE spaces
ADD COLUMN IF NOT EXISTS post_permission VARCHAR(50) DEFAULT 'all',
ADD COLUMN IF NOT EXISTS reply_permission VARCHAR(50) DEFAULT 'all',
ADD COLUMN IF NOT EXISTS react_permission VARCHAR(50) DEFAULT 'all';

-- Add SEO and image URL columns
ALTER TABLE spaces
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(200),
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS ogg_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS space_icon_URL VARCHAR(500),
ADD COLUMN IF NOT EXISTS space_banner_URL VARCHAR(500);

-- Let's also update our API endpoint for backward compatibility
-- Set the new columns to default values for existing spaces
UPDATE spaces
SET 
  invite_only = FALSE,
  anyone_can_invite = FALSE,
  post_permission = 'all',
  reply_permission = 'all',
  react_permission = 'all',
  meta_title = name,
  meta_description = CONCAT(name, ' space'); 