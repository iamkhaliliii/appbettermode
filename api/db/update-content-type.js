#!/usr/bin/env tsx
/**
 * Posts Migration Step 5: Update Content Field Type
 *
 * This script updates the content field in the posts table from text to jsonb
 * to support rich text content. It also adds a content_format field.
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
console.log('Starting posts migration - Step 5: Updating content field type...');
async function updateContentField(db) {
    try {
        // 1. Check if the content_format column already exists
        const formatColumnExists = await db.execute(sql `
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'posts' AND column_name = 'content_format'
      );
    `);
        if (!formatColumnExists[0]?.exists) {
            console.log('Adding content_format column to posts table...');
            await db.execute(sql `
        ALTER TABLE posts
        ADD COLUMN content_format TEXT NOT NULL DEFAULT 'richtext';
      `);
        }
        else {
            console.log('content_format column already exists, skipping...');
        }
        // 2. First create a temporary column of jsonb type
        console.log('Creating temporary jsonb column...');
        await db.execute(sql `
      ALTER TABLE posts
      ADD COLUMN content_jsonb JSONB;
    `);
        // 3. Convert existing text content to jsonb format (wrap in JSON object with "content" key)
        console.log('Converting existing text content to jsonb format...');
        await db.execute(sql `
      UPDATE posts
      SET content_jsonb = jsonb_build_object('content', content);
    `);
        // 4. Drop the original content column
        console.log('Dropping original content column...');
        await db.execute(sql `
      ALTER TABLE posts
      DROP COLUMN content;
    `);
        // 5. Rename the jsonb column to 'content'
        console.log('Renaming jsonb column to content...');
        await db.execute(sql `
      ALTER TABLE posts
      RENAME COLUMN content_jsonb TO content;
    `);
        // 6. Make the content column not null
        console.log('Setting content column to NOT NULL...');
        await db.execute(sql `
      ALTER TABLE posts
      ALTER COLUMN content SET NOT NULL;
    `);
        console.log('Successfully updated posts table content to jsonb type');
        return true;
    }
    catch (error) {
        console.error('Error updating content field:', error);
        throw error;
    }
}
async function updateSchema() {
    const queryClient = postgres(connectionString, { max: 1 });
    const db = drizzle(queryClient);
    try {
        await updateContentField(db);
        console.log('Content field update completed successfully');
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
// (function () { // Commented out to prevent auto-execution
//     updateSchema()
//         .then(() => {
//         console.log('Migration Step 5 completed successfully.');
//         process.exit(0);
//     })
//         .catch(error => {
//         console.error('Migration Step 5 failed:', error);
//         process.exit(1);
//     });
// })();
