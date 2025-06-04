-- Complete Database Initialization Script for App-bettermode
-- This script rebuilds the entire database and creates the default user
-- Run this in Supabase SQL Editor

-- ==========================================
-- STEP 1: Drop everything and start fresh
-- ==========================================
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- ==========================================
-- STEP 2: Create ENUMs
-- ==========================================
CREATE TYPE cms_type_category AS ENUM ('official', 'custom');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived', 'scheduled', 'pending_review');
CREATE TYPE member_role AS ENUM ('member', 'admin', 'editor');
CREATE TYPE site_plan AS ENUM ('lite', 'pro');
CREATE TYPE space_visibility AS ENUM ('public', 'private', 'paid');

-- ==========================================
-- STEP 3: Create Tables
-- ==========================================

-- CMS Types table
CREATE TABLE cms_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    label TEXT NOT NULL,
    description TEXT,
    color TEXT,
    icon_name TEXT,
    favorite BOOLEAN DEFAULT false,
    type cms_type_category DEFAULT 'official',
    fields JSONB DEFAULT '[]' NOT NULL
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT,
    full_name TEXT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sites table
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subdomain TEXT,
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'active',
    plan site_plan DEFAULT 'lite',
    logo_url TEXT,
    brand_color TEXT,
    content_types JSONB DEFAULT '[]',
    space_ids JSONB DEFAULT '[]'
);

-- Memberships table
CREATE TABLE memberships (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    role member_role NOT NULL DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (user_id, site_id)
);

-- Spaces table
CREATE TABLE spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES users(id),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    hidden BOOLEAN DEFAULT false,
    visibility space_visibility DEFAULT 'public' NOT NULL,
    cms_type UUID REFERENCES cms_types(id)
);

-- Tags table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    icon TEXT,
    content_id UUID,
    content_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content JSONB NOT NULL,
    content_format TEXT DEFAULT 'richtext' NOT NULL,
    status content_status DEFAULT 'draft',
    author_id UUID REFERENCES users(id),
    space_id UUID REFERENCES spaces(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    cms_type TEXT NOT NULL,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    locked BOOLEAN DEFAULT false,
    hidden BOOLEAN DEFAULT false,
    cover_image_url TEXT,
    pinned BOOLEAN DEFAULT false,
    other_properties JSONB DEFAULT '{}'
);

-- Post tags junction table
CREATE TABLE post_tags (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- ==========================================
-- STEP 4: Create indexes for performance
-- ==========================================
CREATE UNIQUE INDEX tags_name_site_id_idx ON tags(name, site_id);
CREATE INDEX idx_sites_subdomain ON sites(subdomain);
CREATE INDEX idx_spaces_site_id ON spaces(site_id);
CREATE INDEX idx_posts_site_id ON posts(site_id);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_space_id ON posts(space_id);
CREATE INDEX idx_posts_status ON posts(status);

-- ==========================================
-- STEP 5: Insert CMS Types with complete specifications
-- ==========================================
INSERT INTO cms_types (id, name, label, description, color, icon_name, favorite, type, fields) VALUES
-- Job Board
('1a863971-a9ac-4d40-bfda-5e60da82fa1c'::uuid, 'job-board', 'Job Board', 'Post and find job opportunities within the community.', 'teal', 'briefcase', true, 'official', 
'[{"key": "job_title", "type": "text", "label": "Job Title"}, {"key": "job_description", "type": "richtext", "label": "Description"}, {"key": "job_location", "type": "text", "label": "Location"}, {"key": "apply_url", "type": "url", "label": "Apply URL"}]'::jsonb),

-- Events
('2e0115ef-79e3-44b5-b453-a88d498286b3'::uuid, 'event', 'Events', 'Discover and RSVP to upcoming community events.', 'emerald', 'calendar', true, 'official',
'[{"key": "event_title", "type": "text", "label": "Event Title"}, {"key": "event_date", "type": "datetime", "label": "Date & Time"}, {"key": "event_location", "type": "text", "label": "Location"}, {"key": "event_description", "type": "richtext", "label": "Description"}]'::jsonb),

-- Q&A
('611c1ccd-1ec6-499a-8872-0590645439aa'::uuid, 'qa', 'Q&A', 'Ask questions and get answers from the community.', 'violet', 'help-circle', true, 'official',
'[{"key": "question_title", "type": "text", "label": "Question Title", "placeholder": "What is your question?"}, {"key": "question_details", "type": "richtext", "label": "Details", "placeholder": "Provide more details..."}]'::jsonb),

-- Ideas & Wishlist
('8302af6f-ef4e-4a68-812a-a772ba0389b8'::uuid, 'ideas-wishlist', 'Ideas & Wishlist', 'Share ideas and vote on features for the community or product.', 'amber', 'star', true, 'official',
'[{"key": "idea_title", "type": "text", "label": "Idea/Wish"}, {"key": "idea_description", "type": "richtext", "label": "Description"}]'::jsonb),

-- Knowledge Base
('a74c6cc2-ad92-4e0b-ac55-8db5bb11b9a6'::uuid, 'knowledge-base', 'Knowledge Base', 'Find helpful articles and documentation.', 'sky', 'book-open', true, 'official',
'[{"key": "kb_title", "type": "text", "label": "Article Title"}, {"key": "kb_content", "type": "richtext", "label": "Content"}]'::jsonb),

-- Blog
('c966cb14-ab62-4cda-9879-cda8ba91d879'::uuid, 'blog', 'Blog', 'Read and publish articles and blog posts.', 'purple', 'file-text', true, 'official',
'[{"key": "article_title", "type": "text", "label": "Title"}, {"key": "article_body", "type": "richtext", "label": "Content"}, {"key": "cover_image_url", "type": "url", "label": "Cover Image URL"}]'::jsonb),

-- Discussions
('d634f9bc-5632-4297-ac37-2d46af70730e'::uuid, 'discussion', 'Discussions', 'Start or join conversations on various topics.', 'blue', 'message-square', true, 'official',
'[{"key": "discussion_title", "type": "text", "label": "Title", "placeholder": "Discussion Title"}, {"key": "discussion_body", "type": "richtext", "label": "Body", "placeholder": "Start the discussion..."}]'::jsonb),

-- Changelog
('eaba91bf-0921-4582-9e36-7131c6bb713c'::uuid, 'changelog', 'Changelog', 'Track updates and changes to the product or community.', 'indigo', 'layout', true, 'official',
'[{"key": "update_title", "type": "text", "label": "Update Title"}, {"key": "update_description", "type": "richtext", "label": "Description"}, {"key": "update_date", "type": "date", "label": "Date"}]'::jsonb);

-- ==========================================
-- STEP 6: Insert Default User (Hard-coded from project)
-- ==========================================
INSERT INTO users (id, email, full_name, username, password, bio) VALUES 
(
    '49a44198-e6e5-4b1e-b8fb-b1c50ee0639d'::uuid,
    'admin@test.com',
    'Test Admin',
    'admin',
    'password123',
    'Default admin user for development - hard-coded in project routes'
);

-- ==========================================
-- STEP 7: Create update triggers
-- ==========================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spaces_updated_at BEFORE UPDATE ON spaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- STEP 8: VERIFICATION QUERIES
-- ==========================================

-- Verify all tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Verify all ENUMs exist
SELECT typname FROM pg_type WHERE typname IN ('cms_type_category', 'content_status', 'member_role', 'site_plan', 'space_visibility');

-- Verify CMS types were inserted
SELECT id, name, label, color, icon_name, favorite FROM cms_types ORDER BY name;

-- Verify user was created
SELECT id, email, username, full_name, created_at FROM users WHERE id = '49a44198-e6e5-4b1e-b8fb-b1c50ee0639d';

-- Show table counts
SELECT 
    'cms_types' as table_name, COUNT(*) as row_count FROM cms_types
UNION ALL SELECT 'users', COUNT(*) FROM users
UNION ALL SELECT 'sites', COUNT(*) FROM sites
UNION ALL SELECT 'memberships', COUNT(*) FROM memberships
UNION ALL SELECT 'spaces', COUNT(*) FROM spaces
UNION ALL SELECT 'tags', COUNT(*) FROM tags
UNION ALL SELECT 'posts', COUNT(*) FROM posts
UNION ALL SELECT 'post_tags', COUNT(*) FROM post_tags;

-- Show successful completion
SELECT 'Database initialization completed successfully!' as status, 
       'Tables: 8, CMS Types: 8, Users: 1' as summary,
       NOW() as completed_at; 