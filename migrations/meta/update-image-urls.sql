-- Add cover_image_url to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- Add cover_image_url to cms_articles table
ALTER TABLE cms_articles ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- Update posts with random image URLs from Picsum
UPDATE posts 
SET cover_image_url = 'https://picsum.photos/seed/' || id || '/1200/630'
WHERE cover_image_url IS NULL;

-- Update cms_articles with random image URLs from Picsum
UPDATE cms_articles 
SET cover_image_url = 'https://picsum.photos/seed/' || id || '/1200/630'
WHERE cover_image_url IS NULL;

-- Remove the old cover_image_id columns
ALTER TABLE posts DROP COLUMN IF EXISTS cover_image_id;
ALTER TABLE cms_articles DROP COLUMN IF EXISTS cover_image_id; 