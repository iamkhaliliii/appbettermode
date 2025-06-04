-- Complete Database Rebuild Script for App-bettermode
-- This script will completely rebuild the database from scratch

-- ==========================================
-- STEP 1: Drop all existing schemas and data
-- ==========================================

-- Drop the entire public schema (this removes ALL tables, enums, data)
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Grant permissions to the schema
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- ==========================================
-- STEP 2: Create all required ENUMs
-- ==========================================

CREATE TYPE cms_type_category AS ENUM ('official', 'custom');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived', 'scheduled', 'pending_review');
CREATE TYPE member_role AS ENUM ('member', 'admin', 'editor');
CREATE TYPE site_plan AS ENUM ('lite', 'pro');
CREATE TYPE space_visibility AS ENUM ('public', 'private', 'paid');

-- ==========================================
-- STEP 3: Create all tables with proper structure
-- ==========================================

-- CMS Types table (must be created first as other tables reference it)
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

-- Memberships table (junction table for users and sites)
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

-- Posts table (for all CMS content)
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
-- STEP 5: Insert the 8 exact CMS types with UUIDs
-- ==========================================

INSERT INTO cms_types (id, name, label, description, color, icon_name, favorite, type, fields) VALUES
(
    'a7f3e4b2-8c9d-4e5f-a1b2-3c4d5e6f7a8b'::uuid,
    'job-board',
    'Job Board',
    'Post and manage job listings for your community',
    '#4F46E5',
    'briefcase',
    false,
    'official',
    '[
        {"id":"title","name":"title","label":"Job Title","type":"text","required":true,"placeholder":"e.g. Senior Frontend Developer"},
        {"id":"company","name":"company","label":"Company","type":"text","required":true,"placeholder":"Company name"},
        {"id":"location","name":"location","label":"Location","type":"text","required":false,"placeholder":"e.g. Remote, New York, etc."},
        {"id":"type","name":"type","label":"Job Type","type":"select","required":true,"options":["Full-time","Part-time","Contract","Freelance","Internship"]},
        {"id":"salary","name":"salary","label":"Salary Range","type":"text","required":false,"placeholder":"e.g. $80,000 - $120,000"},
        {"id":"description","name":"description","label":"Job Description","type":"richtext","required":true,"placeholder":"Describe the role, responsibilities, and requirements"},
        {"id":"requirements","name":"requirements","label":"Requirements","type":"richtext","required":false,"placeholder":"List the required skills and qualifications"},
        {"id":"benefits","name":"benefits","label":"Benefits","type":"richtext","required":false,"placeholder":"Describe the benefits and perks"},
        {"id":"apply_url","name":"apply_url","label":"Application URL","type":"url","required":false,"placeholder":"Link to application page"},
        {"id":"apply_email","name":"apply_email","label":"Application Email","type":"email","required":false,"placeholder":"email@company.com"},
        {"id":"remote","name":"remote","label":"Remote Work","type":"boolean","required":false},
        {"id":"featured","name":"featured","label":"Featured Job","type":"boolean","required":false}
    ]'::jsonb
),
(
    'b8f4e5c3-9d0e-5f6a-b2c3-4d5e6f7a8b9c'::uuid,
    'event',
    'Event',
    'Create and manage events for your community',
    '#10B981',
    'calendar',
    false,
    'official',
    '[
        {"id":"title","name":"title","label":"Event Title","type":"text","required":true,"placeholder":"e.g. Tech Meetup 2024"},
        {"id":"description","name":"description","label":"Description","type":"richtext","required":true,"placeholder":"Describe what the event is about"},
        {"id":"start_date","name":"start_date","label":"Start Date","type":"datetime","required":true},
        {"id":"end_date","name":"end_date","label":"End Date","type":"datetime","required":false},
        {"id":"location","name":"location","label":"Location","type":"text","required":false,"placeholder":"e.g. Online, Conference Center, etc."},
        {"id":"venue","name":"venue","label":"Venue Details","type":"text","required":false,"placeholder":"Specific venue information"},
        {"id":"organizer","name":"organizer","label":"Organizer","type":"text","required":false,"placeholder":"Event organizer name"},
        {"id":"max_attendees","name":"max_attendees","label":"Max Attendees","type":"number","required":false,"placeholder":"Maximum number of attendees"},
        {"id":"registration_url","name":"registration_url","label":"Registration URL","type":"url","required":false,"placeholder":"Link to registration page"},
        {"id":"price","name":"price","label":"Price","type":"text","required":false,"placeholder":"e.g. Free, $25, etc."},
        {"id":"event_type","name":"event_type","label":"Event Type","type":"select","required":false,"options":["Online","In-person","Hybrid"]},
        {"id":"featured","name":"featured","label":"Featured Event","type":"boolean","required":false}
    ]'::jsonb
),
(
    'c9f5e6d4-ae1f-6f7b-c3d4-5e6f7a8b9c0d'::uuid,
    'qa',
    'Q&A',
    'Question and answer discussions for community support',
    '#F59E0B',
    'help-circle',
    false,
    'official',
    '[
        {"id":"title","name":"title","label":"Question Title","type":"text","required":true,"placeholder":"What is your question?"},
        {"id":"question","name":"question","label":"Question Details","type":"richtext","required":true,"placeholder":"Provide more details about your question"},
        {"id":"category","name":"category","label":"Category","type":"select","required":false,"options":["General","Technical","Product","Other"]},
        {"id":"priority","name":"priority","label":"Priority","type":"select","required":false,"options":["Low","Medium","High","Urgent"]},
        {"id":"tags","name":"tags","label":"Tags","type":"tags","required":false,"placeholder":"Add relevant tags"},
        {"id":"bounty","name":"bounty","label":"Bounty/Reward","type":"text","required":false,"placeholder":"Offer a reward for the best answer"},
        {"id":"solved","name":"solved","label":"Question Solved","type":"boolean","required":false},
        {"id":"accepted_answer","name":"accepted_answer","label":"Accepted Answer ID","type":"text","required":false}
    ]'::jsonb
),
(
    'd0f6e7e5-bf2g-7f8c-d4e5-6f7a8b9c0d1e'::uuid,
    'ideas-wishlist',
    'Ideas & Wishlist',
    'Collect and prioritize feature requests and ideas',
    '#8B5CF6',
    'lightbulb',
    false,
    'official',
    '[
        {"id":"title","name":"title","label":"Idea Title","type":"text","required":true,"placeholder":"What is your idea?"},
        {"id":"description","name":"description","label":"Description","type":"richtext","required":true,"placeholder":"Describe your idea in detail"},
        {"id":"category","name":"category","label":"Category","type":"select","required":false,"options":["Feature","Improvement","Bug Fix","Other"]},
        {"id":"priority","name":"priority","label":"Priority","type":"select","required":false,"options":["Low","Medium","High"]},
        {"id":"effort","name":"effort","label":"Estimated Effort","type":"select","required":false,"options":["Small","Medium","Large","Extra Large"]},
        {"id":"impact","name":"impact","label":"Expected Impact","type":"select","required":false,"options":["Low","Medium","High"]},
        {"id":"status","name":"status","label":"Status","type":"select","required":false,"options":["Submitted","Under Review","Planned","In Progress","Completed","Rejected"]},
        {"id":"votes","name":"votes","label":"Votes Count","type":"number","required":false},
        {"id":"target_release","name":"target_release","label":"Target Release","type":"text","required":false,"placeholder":"e.g. v2.1"},
        {"id":"assignee","name":"assignee","label":"Assignee","type":"text","required":false,"placeholder":"Who is working on this?"}
    ]'::jsonb
),
(
    'e1f7e8f6-cg3h-8f9d-e5f6-7a8b9c0d1e2f'::uuid,
    'knowledge-base',
    'Knowledge Base',
    'Documentation and how-to articles for your community',
    '#059669',
    'book-open',
    false,
    'official',
    '[
        {"id":"title","name":"title","label":"Article Title","type":"text","required":true,"placeholder":"e.g. How to set up authentication"},
        {"id":"content","name":"content","label":"Content","type":"richtext","required":true,"placeholder":"Write your article content"},
        {"id":"category","name":"category","label":"Category","type":"select","required":false,"options":["Getting Started","Tutorials","API Documentation","FAQ","Troubleshooting"]},
        {"id":"difficulty","name":"difficulty","label":"Difficulty Level","type":"select","required":false,"options":["Beginner","Intermediate","Advanced"]},
        {"id":"reading_time","name":"reading_time","label":"Reading Time (minutes)","type":"number","required":false},
        {"id":"last_updated","name":"last_updated","label":"Last Updated","type":"date","required":false},
        {"id":"author","name":"author","label":"Author","type":"text","required":false},
        {"id":"tags","name":"tags","label":"Tags","type":"tags","required":false,"placeholder":"Add relevant tags"},
        {"id":"featured","name":"featured","label":"Featured Article","type":"boolean","required":false},
        {"id":"table_of_contents","name":"table_of_contents","label":"Table of Contents","type":"richtext","required":false}
    ]'::jsonb
),
(
    'f2f8e9g7-dh4i-9f0e-f6g7-8b9c0d1e2f3g'::uuid,
    'blog',
    'Blog',
    'Share news, updates, and stories with your community',
    '#DC2626',
    'edit',
    false,
    'official',
    '[
        {"id":"title","name":"title","label":"Post Title","type":"text","required":true,"placeholder":"Enter your blog post title"},
        {"id":"content","name":"content","label":"Content","type":"richtext","required":true,"placeholder":"Write your blog post content"},
        {"id":"excerpt","name":"excerpt","label":"Excerpt","type":"textarea","required":false,"placeholder":"Short summary of the post"},
        {"id":"author","name":"author","label":"Author","type":"text","required":false},
        {"id":"publish_date","name":"publish_date","label":"Publish Date","type":"date","required":false},
        {"id":"category","name":"category","label":"Category","type":"select","required":false,"options":["News","Updates","Tutorials","Stories","Announcements"]},
        {"id":"tags","name":"tags","label":"Tags","type":"tags","required":false,"placeholder":"Add relevant tags"},
        {"id":"featured_image","name":"featured_image","label":"Featured Image","type":"image","required":false},
        {"id":"seo_title","name":"seo_title","label":"SEO Title","type":"text","required":false,"placeholder":"SEO optimized title"},
        {"id":"seo_description","name":"seo_description","label":"SEO Description","type":"textarea","required":false,"placeholder":"SEO meta description"},
        {"id":"featured","name":"featured","label":"Featured Post","type":"boolean","required":false},
        {"id":"reading_time","name":"reading_time","label":"Reading Time (minutes)","type":"number","required":false}
    ]'::jsonb
),
(
    'g3g9f0h8-ei5j-0f1f-g7h8-9c0d1e2f3g4h'::uuid,
    'discussion',
    'Discussion',
    'General discussions and conversations',
    '#6366F1',
    'message-circle',
    false,
    'official',
    '[
        {"id":"title","name":"title","label":"Discussion Title","type":"text","required":true,"placeholder":"What do you want to discuss?"},
        {"id":"content","name":"content","label":"Content","type":"richtext","required":true,"placeholder":"Start the discussion..."},
        {"id":"category","name":"category","label":"Category","type":"select","required":false,"options":["General","Feedback","Ideas","Support","Random"]},
        {"id":"discussion_type","name":"discussion_type","label":"Discussion Type","type":"select","required":false,"options":["Open","Question","Poll","Announcement"]},
        {"id":"tags","name":"tags","label":"Tags","type":"tags","required":false,"placeholder":"Add relevant tags"},
        {"id":"pinned","name":"pinned","label":"Pinned Discussion","type":"boolean","required":false},
        {"id":"locked","name":"locked","label":"Lock Discussion","type":"boolean","required":false},
        {"id":"anonymous","name":"anonymous","label":"Allow Anonymous Posts","type":"boolean","required":false}
    ]'::jsonb
),
(
    'h4h0g1i9-fj6k-1g2g-h8i9-0d1e2f3g4h5i'::uuid,
    'changelog',
    'Changelog',
    'Track and announce product updates and changes',
    '#EC4899',
    'git-branch',
    false,
    'official',
    '[
        {"id":"title","name":"title","label":"Release Title","type":"text","required":true,"placeholder":"e.g. Version 2.1.0 - New Features"},
        {"id":"version","name":"version","label":"Version Number","type":"text","required":true,"placeholder":"e.g. 2.1.0"},
        {"id":"release_date","name":"release_date","label":"Release Date","type":"date","required":true},
        {"id":"description","name":"description","label":"Release Description","type":"richtext","required":true,"placeholder":"Describe what changed in this release"},
        {"id":"type","name":"type","label":"Release Type","type":"select","required":true,"options":["Major","Minor","Patch","Hotfix"]},
        {"id":"changes","name":"changes","label":"Changes","type":"richtext","required":false,"placeholder":"Detailed list of changes"},
        {"id":"new_features","name":"new_features","label":"New Features","type":"richtext","required":false,"placeholder":"List of new features"},
        {"id":"improvements","name":"improvements","label":"Improvements","type":"richtext","required":false,"placeholder":"List of improvements"},
        {"id":"bug_fixes","name":"bug_fixes","label":"Bug Fixes","type":"richtext","required":false,"placeholder":"List of bug fixes"},
        {"id":"breaking_changes","name":"breaking_changes","label":"Breaking Changes","type":"richtext","required":false,"placeholder":"List any breaking changes"},
        {"id":"migration_notes","name":"migration_notes","label":"Migration Notes","type":"richtext","required":false,"placeholder":"Instructions for migrating"},
        {"id":"featured","name":"featured","label":"Featured Release","type":"boolean","required":false}
    ]'::jsonb
);

-- ==========================================
-- STEP 6: Create update triggers
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
-- VERIFICATION QUERIES
-- ==========================================

-- Verify all tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Verify all ENUMs exist
SELECT typname FROM pg_type WHERE typname IN ('cms_type_category', 'content_status', 'member_role', 'site_plan', 'space_visibility');

-- Verify CMS types were inserted
SELECT id, name, label FROM cms_types ORDER BY name;

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
SELECT 'Database rebuild completed successfully!' as status, NOW() as completed_at; 