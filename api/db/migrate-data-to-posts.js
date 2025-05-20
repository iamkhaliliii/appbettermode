#!/usr/bin/env tsx
/**
 * Posts Migration Step 2: Migrate Data to Posts Table
 *
 * This script migrates content data from individual CMS tables to the centralized posts table
 * and updates references in the original tables.
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
console.log('Starting posts migration - Step 2: Migrating data to posts table...');
// CMS tables to process with their content type identifiers
const cmsTablesConfig = [
    { table: 'cms_discussions', type: 'discussion' },
    { table: 'cms_qa_questions', type: 'qa_question' },
    { table: 'cms_knowledge_base_articles', type: 'kb_article' },
    { table: 'cms_ideas', type: 'idea' },
    { table: 'cms_changelogs', type: 'changelog' },
    { table: 'cms_product_updates', type: 'product_update' },
    { table: 'cms_roadmap_items', type: 'roadmap' },
    { table: 'cms_announcements', type: 'announcement' },
    { table: 'cms_wiki_pages', type: 'wiki' },
    { table: 'cms_events', type: 'event' },
    { table: 'cms_courses', type: 'course' },
    { table: 'cms_jobs', type: 'job' },
    { table: 'cms_speakers', type: 'speaker' },
    { table: 'cms_articles', type: 'article' },
    { table: 'cms_polls', type: 'poll' },
    { table: 'cms_gallery_items', type: 'gallery' },
    { table: 'cms_file_library', type: 'file' }
];
async function migrateTable(db, tableConfig) {
    const { table, type } = tableConfig;
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
            return 0;
        }
        // Check if the table has records that need migration
        const hasRecordsQuery = await db.execute(sql `
      SELECT COUNT(*) FROM ${sql.raw(table)} 
      WHERE post_id IS NULL
    `);
        const recordCount = parseInt(hasRecordsQuery[0]?.count || '0');
        if (recordCount === 0) {
            console.log(`No records to migrate in ${table}, skipping...`);
            return 0;
        }
        console.log(`Migrating ${recordCount} records from ${table}...`);
        // Check what columns are available in the table
        const columnInfo = await db.execute(sql `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = ${table}
    `);
        const columns = columnInfo.map((col) => col.column_name);
        // Determine which fields to migrate based on what's available
        let hasTitle = columns.includes('title');
        let hasContent = columns.includes('content');
        let hasStatus = columns.includes('status');
        let hasAuthorId = columns.includes('author_id');
        let hasSpaceId = columns.includes('space_id');
        let hasSiteId = columns.includes('site_id');
        // Get data to migrate
        const records = await db.execute(sql `
      SELECT * FROM ${sql.raw(table)} 
      WHERE post_id IS NULL
    `);
        let migratedCount = 0;
        // Process each record
        for (const record of records) {
            // For tables without title, use default based on type
            let title = hasTitle ? record.title : `${type.charAt(0).toUpperCase() + type.slice(1)} #${record.id}`;
            // For tables without content, use empty or description if available
            let content = '';
            if (hasContent) {
                content = record.content;
            }
            else if (columns.includes('description')) {
                content = record.description || '';
            }
            else if (columns.includes('body')) {
                content = record.body || '';
            }
            else if (columns.includes('details')) {
                content = record.details || '';
            }
            else if (type === 'qa_question' && record.question) {
                content = record.question;
            }
            // Handle status field - use record.status if available, otherwise use default "published"
            const status = hasStatus ? record.status : 'published';
            // Handle author_id, default to null if not available
            const authorId = hasAuthorId ? record.author_id : null;
            // Handle space_id, default to null if not available
            const spaceId = hasSpaceId ? record.space_id : null;
            // Get site_id - this is critical. If not available in the record, we need to derive it
            let siteId = null;
            if (hasSiteId) {
                siteId = record.site_id;
            }
            else if (spaceId) {
                // Look up the site_id from the space if available
                const spaceRecord = await db.execute(sql `
          SELECT site_id FROM spaces WHERE id = ${spaceId}
        `);
                if (spaceRecord.length > 0) {
                    siteId = spaceRecord[0].site_id;
                }
            }
            // Skip if we can't determine a site_id
            if (!siteId) {
                console.log(`Skipping record ${record.id} in ${table} - cannot determine site_id`);
                continue;
            }
            // Create the post record
            const newPost = await db.execute(sql `
        INSERT INTO posts (
          title, 
          content, 
          status, 
          author_id, 
          space_id, 
          published_at,
          cms_type, 
          site_id,
          created_at,
          updated_at
        ) 
        VALUES (
          ${title}, 
          ${content}, 
          ${status}::content_status, 
          ${authorId}, 
          ${spaceId}, 
          ${record.published_at || record.created_at || new Date()}, 
          ${type}, 
          ${siteId},
          ${record.created_at || new Date()},
          ${record.updated_at || new Date()}
        )
        RETURNING id
      `);
            if (newPost.length > 0) {
                const postId = newPost[0].id;
                // Update the original record with the new post_id
                await db.execute(sql `
          UPDATE ${sql.raw(table)} 
          SET post_id = ${postId} 
          WHERE id = ${record.id}
        `);
                // Migrate tags if they exist
                if (columns.includes('tags') && record.tags) {
                    try {
                        const tagIds = Array.isArray(record.tags) ? record.tags : JSON.parse(record.tags);
                        for (const tagId of tagIds) {
                            await db.execute(sql `
                INSERT INTO post_tags (post_id, tag_id)
                VALUES (${postId}, ${tagId})
                ON CONFLICT DO NOTHING
              `);
                        }
                    }
                    catch (e) {
                        console.log(`Error migrating tags for ${table} record ${record.id}:`, e);
                    }
                }
                migratedCount++;
            }
        }
        console.log(`Successfully migrated ${migratedCount} records from ${table}`);
        return migratedCount;
    }
    catch (error) {
        console.error(`Error migrating data for ${table}:`, error);
        return 0;
    }
}
async function migrateDatabase() {
    const queryClient = postgres(connectionString, { max: 1 });
    const db = drizzle(queryClient);
    try {
        console.log('Starting data migration to posts table...');
        let totalMigrated = 0;
        for (const tableConfig of cmsTablesConfig) {
            const count = await migrateTable(db, tableConfig);
            totalMigrated += count;
        }
        console.log(`Migration completed: ${totalMigrated} records migrated to posts table`);
        return true;
    }
    catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
    finally {
        await queryClient.end();
    }
}
// Run the migration
(function () {
    migrateDatabase()
        .then(() => {
        console.log('Migration Step 2 completed successfully.');
        process.exit(0);
    })
        .catch(error => {
        console.error('Migration Step 2 failed:', error);
        process.exit(1);
    });
})();
