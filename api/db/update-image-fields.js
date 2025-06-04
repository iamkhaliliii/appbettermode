#!/usr/bin/env tsx
/**
 * Posts Migration Step 4: Update Image Fields
 *
 * This script moves image related fields to the posts table and removes them from CMS tables.
 * 1. Add cover_image_id and pinned to posts table
 * 2. Remove image fields from CMS tables
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
console.log('Starting posts migration - Step 4: Updating image fields...');
// Step 1: Add columns to posts table
async function updatePostsTable(db) {
    try {
        // Check if cover_image_id column exists in posts table
        const coverImageExists = await db.execute(sql `
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'posts' AND column_name = 'cover_image_id'
      );
    `);
        if (!coverImageExists[0]?.exists) {
            console.log('Adding cover_image_id to posts table...');
            await db.execute(sql `
        ALTER TABLE posts
        ADD COLUMN cover_image_id UUID
      `);
        }
        else {
            console.log('cover_image_id already exists in posts table, skipping...');
        }
        // Check if pinned column exists in posts table
        const pinnedExists = await db.execute(sql `
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'posts' AND column_name = 'pinned'
      );
    `);
        if (!pinnedExists[0]?.exists) {
            console.log('Adding pinned to posts table...');
            await db.execute(sql `
        ALTER TABLE posts
        ADD COLUMN pinned BOOLEAN DEFAULT false
      `);
        }
        else {
            console.log('pinned already exists in posts table, skipping...');
        }
        console.log('Successfully updated posts table schema');
    }
    catch (error) {
        console.error('Error updating posts table schema:', error);
        throw error;
    }
}
// Step 2: Remove image fields from CMS tables
async function removeImageFields(db) {
    // Define the fields to remove from each table
    const tablesToUpdate = [
        {
            table: 'cms_discussions',
            columns: ['featured_image_id', 'pinned']
        },
        {
            table: 'cms_articles',
            columns: ['cover_image_id']
        },
        {
            table: 'cms_changelogs',
            columns: ['media_id', 'featured_image_id']
        },
        {
            table: 'cms_product_updates',
            columns: ['media_id', 'featured_image_id']
        },
        {
            table: 'cms_announcements',
            columns: ['banner_image_id', 'featured_image_id']
        },
        {
            table: 'cms_events',
            columns: ['banner_image_id', 'featured_image_id']
        },
        {
            table: 'cms_speakers',
            columns: ['image_id']
        },
        {
            table: 'cms_gallery_items',
            columns: ['image_id']
        },
        {
            table: 'cms_roadmap_items',
            columns: ['featured_image_id']
        },
        {
            table: 'cms_wiki_pages',
            columns: ['featured_image_id']
        },
        {
            table: 'cms_knowledge_base_articles',
            columns: ['featured_image_id']
        },
        {
            table: 'cms_ideas',
            columns: ['featured_image_id']
        },
        {
            table: 'cms_courses',
            columns: ['featured_image_id', 'banner_image_id']
        },
        {
            table: 'cms_jobs',
            columns: ['featured_image_id', 'banner_image_id']
        },
        {
            table: 'cms_polls',
            columns: ['featured_image_id']
        },
        {
            table: 'cms_file_library',
            columns: ['media_id']
        }
    ];
    for (const tableConfig of tablesToUpdate) {
        const { table, columns } = tableConfig;
        try {
            // Check if table exists
            const tableExists = await db.execute(sql `
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = ${table}
        );
      `);
            if (!tableExists[0]?.exists) {
                console.log(`Table ${table} does not exist, skipping...`);
                continue;
            }
            console.log(`Updating table structure for ${table}...`);
            // Check which columns exist in this table
            const columnInfo = await db.execute(sql `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = ${table}
      `);
            const existingColumns = columnInfo.map((col) => col.column_name);
            // Move image fields to posts table before deleting (only if they exist)
            if (existingColumns.includes('featured_image_id')) {
                await db.execute(sql `
          UPDATE posts p
          SET cover_image_id = c.featured_image_id
          FROM ${sql.raw(table)} c
          WHERE p.id = c.post_id AND c.featured_image_id IS NOT NULL
        `);
            }
            if (existingColumns.includes('cover_image_id')) {
                await db.execute(sql `
          UPDATE posts p
          SET cover_image_id = c.cover_image_id
          FROM ${sql.raw(table)} c
          WHERE p.id = c.post_id AND c.cover_image_id IS NOT NULL
        `);
            }
            if (existingColumns.includes('banner_image_id')) {
                await db.execute(sql `
          UPDATE posts p
          SET cover_image_id = c.banner_image_id
          FROM ${sql.raw(table)} c
          WHERE p.id = c.post_id AND c.banner_image_id IS NOT NULL
        `);
            }
            if (existingColumns.includes('image_id')) {
                await db.execute(sql `
          UPDATE posts p
          SET cover_image_id = c.image_id
          FROM ${sql.raw(table)} c
          WHERE p.id = c.post_id AND c.image_id IS NOT NULL
        `);
            }
            // Move pinned status to posts table
            if (existingColumns.includes('pinned')) {
                await db.execute(sql `
          UPDATE posts p
          SET pinned = c.pinned
          FROM ${sql.raw(table)} c
          WHERE p.id = c.post_id AND c.pinned = true
        `);
            }
            // For each column to remove, check if it exists first
            for (const column of columns) {
                if (existingColumns.includes(column)) {
                    console.log(`Removing ${column} from ${table}...`);
                    await db.execute(sql `
            ALTER TABLE ${sql.raw(table)}
            DROP COLUMN IF EXISTS ${sql.raw(column)}
          `);
                }
            }
            console.log(`Successfully updated ${table}`);
        }
        catch (error) {
            console.error(`Error updating table ${table}:`, error);
        }
    }
}
async function updateDatabase() {
    const queryClient = postgres(connectionString, { max: 1 });
    const db = drizzle(queryClient);
    try {
        // Step 1: Update posts table schema
        await updatePostsTable(db);
        // Step 2: Remove image fields from CMS tables
        await removeImageFields(db);
        console.log('All tables updated successfully');
        return true;
    }
    catch (error) {
        console.error('Update failed:', error);
        throw error;
    }
    finally {
        await queryClient.end();
    }
}
// Run the update
// (function() { // Commented out to prevent auto-execution
//   updateDatabase()
//     .then(() => {
//       console.log('Migration Step 4 completed successfully.');
//       process.exit(0);
//     })
//     .catch(error => {
//       console.error('Migration Step 4 failed:', error);
//       process.exit(1);
//     });
// })(); 
