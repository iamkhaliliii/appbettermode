#!/usr/bin/env tsx
/**
 * Posts Migration Step 3: Remove Redundant Columns
 *
 * This script removes redundant columns from CMS tables that are now stored in the posts table.
 * Run this AFTER successfully migrating data with migrate-data-to-posts.ts
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
console.log('Starting posts migration - Step 3: Removing redundant columns from CMS tables...');
// Table configuration with columns to remove
const tableUpdates = [
    {
        table: 'cms_discussions',
        columns: ['title', 'body', 'site_id', 'author_id', 'space_id', 'status', 'created_at', 'updated_at', 'category_id']
    },
    {
        table: 'cms_qa_questions',
        columns: ['question', 'details', 'site_id', 'author_id', 'space_id', 'status', 'created_at', 'updated_at', 'category_id']
    },
    {
        table: 'cms_knowledge_base_articles',
        columns: ['title', 'body', 'site_id', 'author_id', 'space_id', 'status', 'created_at', 'updated_at', 'category_id']
    },
    {
        table: 'cms_ideas',
        columns: ['idea_title', 'description', 'site_id', 'submitter_id', 'space_id', 'created_at', 'updated_at', 'status', 'category_id']
    },
    {
        table: 'cms_changelogs',
        columns: ['update_title', 'description', 'site_id', 'author_id', 'space_id', 'created_at', 'updated_at', 'status', 'category_id']
    },
    {
        table: 'cms_product_updates',
        columns: ['title', 'description', 'site_id', 'author_id', 'space_id', 'created_at', 'updated_at', 'status', 'category_id']
    },
    {
        table: 'cms_roadmap_items',
        columns: ['feature', 'description', 'site_id', 'owner_id', 'space_id', 'created_at', 'updated_at', 'status', 'category_id']
    },
    {
        table: 'cms_announcements',
        columns: ['title', 'message', 'site_id', 'space_id', 'created_at', 'updated_at', 'status', 'category_id']
    },
    {
        table: 'cms_wiki_pages',
        columns: ['page_title', 'content', 'site_id', 'space_id', 'created_at', 'updated_at', 'status', 'category_id']
    },
    {
        table: 'cms_events',
        columns: ['event_title', 'description', 'site_id', 'space_id', 'created_at', 'updated_at', 'status', 'category_id']
    },
    {
        table: 'cms_courses',
        columns: ['course_title', 'description', 'site_id', 'space_id', 'created_at', 'updated_at', 'status', 'category_id']
    },
    {
        table: 'cms_jobs',
        columns: ['job_title', 'description', 'site_id', 'space_id', 'created_at', 'updated_at', 'status', 'category_id']
    },
    {
        table: 'cms_speakers',
        columns: ['bio', 'site_id', 'space_id', 'created_at', 'updated_at', 'status', 'category_id']
    },
    {
        table: 'cms_articles',
        columns: ['title', 'body', 'site_id', 'author_id', 'space_id', 'status', 'created_at', 'updated_at', 'category_id']
    },
    {
        table: 'cms_polls',
        columns: ['question', 'site_id', 'space_id', 'created_at', 'updated_at', 'status', 'category_id']
    },
    {
        table: 'cms_gallery_items',
        columns: ['title', 'caption', 'site_id', 'author_id', 'space_id', 'created_at', 'updated_at', 'status', 'category_id']
    },
    {
        table: 'cms_file_library',
        columns: ['description', 'site_id', 'space_id', 'created_at', 'updated_at', 'status', 'category_id']
    }
];
async function updateTable(db, tableConfig) {
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
            return;
        }
        // Check that all records have post_id values
        const missingPostIds = await db.execute(sql `
      SELECT COUNT(*) FROM ${sql.raw(table)} 
      WHERE post_id IS NULL
    `);
        const missingCount = parseInt(missingPostIds[0]?.count || '0');
        if (missingCount > 0) {
            console.log(`Warning: ${table} has ${missingCount} records with missing post_id references. 
        Run migrate-data-to-posts.ts first to ensure all records are migrated.`);
            return;
        }
        console.log(`Updating table structure for ${table}...`);
        // For each column to remove, check if it exists first
        for (const column of columns) {
            const columnExists = await db.execute(sql `
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = ${table} AND column_name = ${column}
        );
      `);
            if (columnExists[0]?.exists) {
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
async function updateTables() {
    const queryClient = postgres(connectionString, { max: 1 });
    const db = drizzle(queryClient);
    try {
        for (const tableConfig of tableUpdates) {
            await updateTable(db, tableConfig);
        }
        console.log('All tables updated successfully');
        return true;
    }
    catch (error) {
        console.error('Table updates failed:', error);
        throw error;
    }
    finally {
        await queryClient.end();
    }
}
// Run the update
(function () {
    updateTables()
        .then(() => {
        console.log('Migration Step 3 completed successfully.');
        process.exit(0);
    })
        .catch(error => {
        console.error('Migration Step 3 failed:', error);
        process.exit(1);
    });
})();
