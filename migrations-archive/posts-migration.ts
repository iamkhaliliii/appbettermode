#!/usr/bin/env tsx

/**
 * Posts Migration Script
 * 
 * This script performs a database migration to create the posts table,
 * transfer data from existing CMS tables, and update the CMS tables to use
 * references to the posts table.
 */

import 'dotenv/config';
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from 'drizzle-orm';

// Connection string from environment variables
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('No database connection string found in environment variables.');
  process.exit(1);
}

console.log('Starting posts migration process...');

async function migrateDatabase() {
  console.log('Starting database migration process...');
  
  const queryClient = postgres(connectionString as string, { max: 1 });
  const db = drizzle(queryClient);

  try {
    console.log('1. Creating posts table and updating enum...');
    
    // First, update the content_status enum to include new statuses
    await db.execute(sql`
      ALTER TYPE content_status ADD VALUE IF NOT EXISTS 'scheduled';
      ALTER TYPE content_status ADD VALUE IF NOT EXISTS 'pending_review';
    `);
    
    // Create the posts table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        status content_status DEFAULT 'draft',
        author_id UUID REFERENCES users(id),
        space_id UUID REFERENCES spaces(id),
        published_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        cms_type TEXT NOT NULL,
        site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
        locked BOOLEAN DEFAULT false,
        hidden BOOLEAN DEFAULT false
      )
    `);

    // Create the post_tags junction table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS post_tags (
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, tag_id)
      )
    `);

    // Add post_id columns to all existing CMS tables first
    console.log('2. Adding post_id columns to existing tables...');

    // Add post_id to cms_discussions
    await db.execute(sql`
      ALTER TABLE cms_discussions
      ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES posts(id)
    `);

    // Add post_id to cms_qa_questions
    await db.execute(sql`
      ALTER TABLE cms_qa_questions
      ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES posts(id)
    `);

    // Add post_id to cms_knowledge_base_articles
    await db.execute(sql`
      ALTER TABLE cms_knowledge_base_articles
      ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES posts(id)
    `);

    // Add post_id to cms_ideas
    await db.execute(sql`
      ALTER TABLE cms_ideas
      ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES posts(id)
    `);

    // Add post_id to cms_changelogs
    await db.execute(sql`
      ALTER TABLE cms_changelogs
      ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES posts(id)
    `);

    // Add post_id to cms_product_updates
    await db.execute(sql`
      ALTER TABLE cms_product_updates
      ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES posts(id)
    `);

    // Add post_id to cms_roadmap_items
    await db.execute(sql`
      ALTER TABLE cms_roadmap_items
      ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES posts(id)
    `);

    // Add post_id to cms_announcements
    await db.execute(sql`
      ALTER TABLE cms_announcements
      ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES posts(id)
    `);

    // Add post_id to cms_wiki_pages
    await db.execute(sql`
      ALTER TABLE cms_wiki_pages
      ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES posts(id)
    `);

    // Add post_id to cms_events
    await db.execute(sql`
      ALTER TABLE cms_events
      ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES posts(id)
    `);

    // Add post_id to cms_courses
    await db.execute(sql`
      ALTER TABLE cms_courses
      ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES posts(id)
    `);

    // Add post_id to cms_jobs
    await db.execute(sql`
      ALTER TABLE cms_jobs
      ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES posts(id)
    `);

    // Add post_id to cms_speakers
    await db.execute(sql`
      ALTER TABLE cms_speakers
      ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES posts(id)
    `);

    // Add post_id to cms_articles
    await db.execute(sql`
      ALTER TABLE cms_articles
      ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES posts(id)
    `);

    // Add post_id to cms_polls
    await db.execute(sql`
      ALTER TABLE cms_polls
      ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES posts(id)
    `);

    // Add post_id to cms_gallery_items
    await db.execute(sql`
      ALTER TABLE cms_gallery_items
      ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES posts(id)
    `);

    // Add post_id to cms_file_library
    await db.execute(sql`
      ALTER TABLE cms_file_library
      ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES posts(id)
    `);

    console.log('3. Migrating data from CMS tables to posts table...');

    // Migrate Discussion data to posts
    await db.execute(sql`
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, status, author_id, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          title, body, status, author_id, space_id, created_at, 
          updated_at, 'discussion', site_id
        FROM cms_discussions
        RETURNING id, title
      )
      UPDATE cms_discussions d
      SET post_id = p.id
      FROM inserted_posts p
      WHERE d.title = p.title
    `);

    // Migrate QA Questions data to posts
    await db.execute(sql`
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, status, author_id, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          question, details, status, author_id, space_id, created_at, 
          updated_at, 'qa_question', site_id
        FROM cms_qa_questions
        RETURNING id, question
      )
      UPDATE cms_qa_questions q
      SET post_id = p.id
      FROM inserted_posts p
      WHERE q.question = p.title
    `);

    // Migrate Knowledge Base Articles data to posts
    await db.execute(sql`
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, status, author_id, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          title, body, status, author_id, space_id, created_at, 
          updated_at, 'kb_article', site_id
        FROM cms_knowledge_base_articles
        RETURNING id, title
      )
      UPDATE cms_knowledge_base_articles a
      SET post_id = p.id
      FROM inserted_posts p
      WHERE a.title = p.title
    `);

    // Migrate Ideas data to posts
    await db.execute(sql`
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, author_id, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          idea_title, description, submitter_id, space_id, created_at, 
          updated_at, 'idea', site_id
        FROM cms_ideas
        RETURNING id, title
      )
      UPDATE cms_ideas i
      SET post_id = p.id
      FROM inserted_posts p
      WHERE i.idea_title = p.title
    `);

    // Migrate Changelogs data to posts
    await db.execute(sql`
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, author_id, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          update_title, description, author_id, space_id, created_at, 
          updated_at, 'changelog', site_id
        FROM cms_changelogs
        RETURNING id, title
      )
      UPDATE cms_changelogs c
      SET post_id = p.id
      FROM inserted_posts p
      WHERE c.update_title = p.title
    `);

    // Migrate Product Updates data to posts
    await db.execute(sql`
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, author_id, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          title, description, author_id, space_id, created_at, 
          updated_at, 'product_update', site_id
        FROM cms_product_updates
        RETURNING id, title
      )
      UPDATE cms_product_updates pu
      SET post_id = p.id
      FROM inserted_posts p
      WHERE pu.title = p.title
    `);

    // Migrate Roadmap Items data to posts
    await db.execute(sql`
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, author_id, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          feature, description, owner_id, space_id, created_at, 
          updated_at, 'roadmap_item', site_id
        FROM cms_roadmap_items
        RETURNING id, title
      )
      UPDATE cms_roadmap_items ri
      SET post_id = p.id
      FROM inserted_posts p
      WHERE ri.feature = p.title
    `);

    // Migrate Announcements data to posts
    await db.execute(sql`
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          title, message, space_id, created_at, 
          updated_at, 'announcement', site_id
        FROM cms_announcements
        RETURNING id, title
      )
      UPDATE cms_announcements a
      SET post_id = p.id
      FROM inserted_posts p
      WHERE a.title = p.title
    `);

    // Migrate Wiki Pages data to posts
    await db.execute(sql`
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, author_id, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          page_title, content, editor_id, space_id, created_at, 
          updated_at, 'wiki_page', site_id
        FROM cms_wiki_pages
        RETURNING id, title
      )
      UPDATE cms_wiki_pages wp
      SET post_id = p.id
      FROM inserted_posts p
      WHERE wp.page_title = p.title
    `);

    // Migrate Events data to posts
    await db.execute(sql`
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          event_title, description, space_id, created_at, 
          updated_at, 'event', site_id
        FROM cms_events
        RETURNING id, title
      )
      UPDATE cms_events e
      SET post_id = p.id
      FROM inserted_posts p
      WHERE e.event_title = p.title
    `);

    // Migrate Courses data to posts
    await db.execute(sql`
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          course_title, description, space_id, created_at, 
          updated_at, 'course', site_id
        FROM cms_courses
        RETURNING id, title
      )
      UPDATE cms_courses c
      SET post_id = p.id
      FROM inserted_posts p
      WHERE c.course_title = p.title
    `);

    // Migrate Jobs data to posts
    await db.execute(sql`
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          job_title, description, space_id, created_at, 
          updated_at, 'job', site_id
        FROM cms_jobs
        RETURNING id, title
      )
      UPDATE cms_jobs j
      SET post_id = p.id
      FROM inserted_posts p
      WHERE j.job_title = p.title
    `);

    // Migrate Speakers data to posts
    await db.execute(sql`
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          name, bio, space_id, created_at, 
          updated_at, 'speaker', site_id
        FROM cms_speakers
        RETURNING id, title
      )
      UPDATE cms_speakers s
      SET post_id = p.id
      FROM inserted_posts p
      WHERE s.name = p.title
    `);

    // Migrate Articles data to posts
    await db.execute(sql`
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, author_id, space_id, created_at, 
          updated_at, cms_type, site_id, status
        )
        SELECT 
          title, body, author_id, space_id, created_at, 
          updated_at, 'article', site_id, status
        FROM cms_articles
        RETURNING id, title
      )
      UPDATE cms_articles a
      SET post_id = p.id
      FROM inserted_posts p
      WHERE a.title = p.title
    `);

    // Migrate Polls data to posts (using question as title)
    await db.execute(sql`
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          question, question, space_id, created_at, 
          updated_at, 'poll', site_id
        FROM cms_polls
        RETURNING id, title
      )
      UPDATE cms_polls p
      SET post_id = p.id
      FROM inserted_posts p
      WHERE p.question = p.title
    `);

    // Migrate Gallery Items data to posts
    await db.execute(sql`
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, author_id, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          title, COALESCE(caption, title), author_id, space_id, created_at, 
          updated_at, 'gallery_item', site_id
        FROM cms_gallery_items
        RETURNING id, title
      )
      UPDATE cms_gallery_items gi
      SET post_id = p.id
      FROM inserted_posts p
      WHERE gi.title = p.title
    `);

    // Migrate File Library data to posts
    await db.execute(sql`
      WITH inserted_posts AS (
        INSERT INTO posts (
          title, content, space_id, created_at, 
          updated_at, cms_type, site_id
        )
        SELECT 
          file_name, COALESCE(description, file_name), space_id, created_at, 
          updated_at, 'file_library', site_id
        FROM cms_file_library
        RETURNING id, title
      )
      UPDATE cms_file_library fl
      SET post_id = p.id
      FROM inserted_posts p
      WHERE fl.file_name = p.title
    `);

    // Migrate tags to post_tags
    await db.execute(sql`
      INSERT INTO post_tags (post_id, tag_id)
      SELECT p.id, t.id
      FROM posts p
      JOIN tags t ON t.content_id = p.id AND t.content_type = p.cms_type
      WHERE t.content_id IS NOT NULL AND t.content_type IS NOT NULL
    `);

    console.log('4. Updating CMS table schemas to use post references...');

    // Now alter the CMS tables to remove the duplicate fields and add post_id foreign key
    await db.execute(sql`
      ALTER TABLE cms_discussions 
      DROP COLUMN IF EXISTS title,
      DROP COLUMN IF EXISTS body,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS author_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS status,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);

    await db.execute(sql`
      ALTER TABLE cms_qa_questions
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS author_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS status,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);

    await db.execute(sql`
      ALTER TABLE cms_knowledge_base_articles
      DROP COLUMN IF EXISTS title,
      DROP COLUMN IF EXISTS body,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS author_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS status,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);

    await db.execute(sql`
      ALTER TABLE cms_ideas
      DROP COLUMN IF EXISTS idea_title,
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS submitter_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);

    await db.execute(sql`
      ALTER TABLE cms_changelogs
      DROP COLUMN IF EXISTS update_title,
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS author_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);

    await db.execute(sql`
      ALTER TABLE cms_product_updates
      DROP COLUMN IF EXISTS title,
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS author_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);

    await db.execute(sql`
      ALTER TABLE cms_roadmap_items
      DROP COLUMN IF EXISTS feature,
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS owner_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);

    await db.execute(sql`
      ALTER TABLE cms_announcements
      DROP COLUMN IF EXISTS title,
      DROP COLUMN IF EXISTS message,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);

    await db.execute(sql`
      ALTER TABLE cms_wiki_pages
      DROP COLUMN IF EXISTS page_title,
      DROP COLUMN IF EXISTS content,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);

    await db.execute(sql`
      ALTER TABLE cms_events
      DROP COLUMN IF EXISTS event_title,
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);

    await db.execute(sql`
      ALTER TABLE cms_courses
      DROP COLUMN IF EXISTS course_title,
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);

    await db.execute(sql`
      ALTER TABLE cms_jobs
      DROP COLUMN IF EXISTS job_title,
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);

    await db.execute(sql`
      ALTER TABLE cms_speakers
      DROP COLUMN IF EXISTS bio,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);

    await db.execute(sql`
      ALTER TABLE cms_articles
      DROP COLUMN IF EXISTS title,
      DROP COLUMN IF EXISTS body,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS author_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS status,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);

    await db.execute(sql`
      ALTER TABLE cms_polls
      DROP COLUMN IF EXISTS question,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);

    await db.execute(sql`
      ALTER TABLE cms_gallery_items
      DROP COLUMN IF EXISTS title,
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS author_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);

    await db.execute(sql`
      ALTER TABLE cms_file_library
      DROP COLUMN IF EXISTS site_id,
      DROP COLUMN IF EXISTS space_id,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at
    `);

    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Database migration failed:', error);
    throw error;
  } finally {
    await queryClient.end();
  }
}

// Run the migration
try {
  await migrateDatabase();
  console.log('Migration completed successfully.');
  console.log('\nSummary of changes:');
  console.log('1. Added a new "posts" table with common fields for all content types');
  console.log('2. Added "post_tags" junction table for tags relationships');
  console.log('3. Migrated data from existing CMS tables to the posts table');
  console.log('4. Updated CMS tables to reference the posts table via post_id');
  console.log('5. Removed duplicate fields from CMS tables');
  console.log('\nAPI endpoints:');
  console.log('- GET /api/v1/posts/site/:siteId - Get all posts for a site');
  console.log('- GET /api/v1/posts/:postId - Get a single post by ID');
  console.log('- POST /api/v1/posts - Create a new post');
  console.log('- PUT /api/v1/posts/:postId - Update an existing post');
  console.log('- DELETE /api/v1/posts/:postId - Delete a post');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
} 