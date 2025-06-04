#!/usr/bin/env tsx
/**
 * Posts Migration Step 1: Create posts table
 *
 * This script creates the posts table and adds post_id columns to existing tables
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
console.log('Starting posts migration - Step 1: Create tables...');
async function migrateDatabase() {
    const queryClient = postgres(connectionString, { max: 1 });
    const db = drizzle(queryClient);
    try {
        console.log('1. Creating posts table and updating enum...');
        // First, update the content_status enum to include new statuses
        await db.execute(sql `
      ALTER TYPE content_status ADD VALUE IF NOT EXISTS 'scheduled';
      ALTER TYPE content_status ADD VALUE IF NOT EXISTS 'pending_review';
    `);
        // Create the posts table
        await db.execute(sql `
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
        await db.execute(sql `
      CREATE TABLE IF NOT EXISTS post_tags (
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, tag_id)
      )
    `);
        // Add post_id columns to all existing CMS tables
        console.log('2. Adding post_id columns to existing tables...');
        // Add post_id to tables if they exist
        const tables = [
            'cms_discussions',
            'cms_qa_questions',
            'cms_knowledge_base_articles',
            'cms_ideas',
            'cms_changelogs',
            'cms_product_updates',
            'cms_roadmap_items',
            'cms_announcements',
            'cms_wiki_pages',
            'cms_events',
            'cms_courses',
            'cms_jobs',
            'cms_speakers',
            'cms_articles',
            'cms_polls',
            'cms_gallery_items',
            'cms_file_library'
        ];
        for (const table of tables) {
            try {
                // Check if table exists
                const tableExists = await db.execute(sql `
          SELECT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = ${table}
          );
        `);
                const exists = tableExists[0]?.exists;
                if (exists) {
                    console.log(`Adding post_id column to ${table}...`);
                    // Use a raw SQL query with proper escaping for table name
                    await db.execute(sql `
            ALTER TABLE ${sql.raw(table)}
            ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES posts(id)
          `);
                }
                else {
                    console.log(`Table ${table} does not exist, skipping...`);
                }
            }
            catch (err) {
                console.error(`Error processing table ${table}:`, err);
            }
        }
        console.log('Step 1 completed successfully');
        return true;
    }
    catch (error) {
        console.error('Migration Step 1 failed:', error);
        throw error;
    }
    finally {
        await queryClient.end();
    }
}
// Run the migration properly without top-level await
// (function() { // Commented out to prevent auto-execution
//   migrateDatabase()
//     .then(() => {
//       console.log('Migration Step 1 completed successfully.');
//       process.exit(0);
//     })
//     .catch(error => {
//       console.error('Migration Step 1 failed:', error);
//       process.exit(1);
//     });
// })(); 
