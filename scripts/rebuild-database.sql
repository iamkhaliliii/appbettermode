
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
-- STEP 4: Create indexes
-- ==========================================
CREATE UNIQUE INDEX tags_name_site_id_idx ON tags(name, site_id);
CREATE INDEX idx_sites_subdomain ON sites(subdomain);
CREATE INDEX idx_spaces_site_id ON spaces(site_id);
CREATE INDEX idx_posts_site_id ON posts(site_id);

-- ==========================================
-- STEP 5: Insert CMS Types
-- ==========================================
INSERT INTO cms_types (id, name, label, description, color, icon_name, favorite, type, fields) VALUES
-- Job Board
('a7f3e4b2-8c9d-4e5f-a1b2-3c4d5e6f7a8b'::uuid, 'job-board', 'Job Board', 'Post and manage job listings', '#4F46E5', 'briefcase', false, 'official', 
'[{"id":"title","name":"title","label":"Job Title","type":"text","required":true}]'::jsonb),

-- Event
('b8f4e5c3-9d0e-5f6a-b2c3-4d5e6f7a8b9c'::uuid, 'event', 'Event', 'Create and manage events', '#10B981', 'calendar', false, 'official',
'[{"id":"title","name":"title","label":"Event Title","type":"text","required":true}]'::jsonb),

-- Q&A
('c9f5e6d4-ae1f-6f7b-c3d4-5e6f7a8b9c0d'::uuid, 'qa', 'Q&A', 'Question and answer discussions', '#F59E0B', 'help-circle', false, 'official',
'[{"id":"title","name":"title","label":"Question Title","type":"text","required":true}]'::jsonb),

-- Ideas & Wishlist
('d0f6e7e5-bf2a-7f8c-d4e5-6f7a8b9c0d1e'::uuid, 'ideas-wishlist', 'Ideas & Wishlist', 'Collect feature requests', '#8B5CF6', 'lightbulb', false, 'official',
'[{"id":"title","name":"title","label":"Idea Title","type":"text","required":true}]'::jsonb),

-- Knowledge Base
('e1f7e8f6-ca3h-8f9d-e5f6-7a8b9c0d1e2f'::uuid, 'knowledge-base', 'Knowledge Base', 'Documentation and articles', '#059669', 'book-open', false, 'official',
'[{"id":"title","name":"title","label":"Article Title","type":"text","required":true}]'::jsonb),

-- Blog
('f2f8e9g7-db4i-9f0e-f6g7-8b9c0d1e2f3g'::uuid, 'blog', 'Blog', 'Share news and stories', '#DC2626', 'edit', false, 'official',
'[{"id":"title","name":"title","label":"Post Title","type":"text","required":true}]'::jsonb),

-- Discussion
('g3g9f0h8-ec5j-0f1f-g7h8-9c0d1e2f3g4h'::uuid, 'discussion', 'Discussion', 'General discussions', '#6366F1', 'message-circle', false, 'official',
'[{"id":"title","name":"title","label":"Discussion Title","type":"text","required":true}]'::jsonb),

-- Changelog
('h4h0g1i9-fd6k-1g2g-h8i9-0d1e2f3g4h5i'::uuid, 'changelog', 'Changelog', 'Track product updates', '#EC4899', 'git-branch', false, 'official',
'[{"id":"title","name":"title","label":"Release Title","type":"text","required":true}]'::jsonb);

-- ==========================================
-- VERIFICATION
-- ==========================================
SELECT 'Database rebuild completed!' as status, COUNT(*) as cms_types_count FROM cms_types;
