#!/usr/bin/env tsx
/**
 * Migration Check Script
 *
 * This utility script checks the current state of CMS tables and the posts table
 * to help verify whether the migration was successful.
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
console.log('Checking migration status...');
async function checkTable(db, tableName) {
    try {
        // Check if table exists
        const tableExists = await db.execute(sql `
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = ${tableName}
      );
    `);
        if (!tableExists[0]?.exists) {
            console.log(`Table ${tableName} does not exist.`);
            return;
        }
        // Get columns for the table
        const columnsResult = await db.execute(sql `
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = ${tableName}
      ORDER BY ordinal_position;
    `);
        console.log(`\n=== Table: ${tableName} ===`);
        console.log('Columns:');
        columnsResult.forEach((col) => {
            console.log(`  - ${col.column_name} (${col.data_type})`);
        });
        // Get record count
        const countResult = await db.execute(sql `
      SELECT COUNT(*) FROM ${sql.raw(tableName)};
    `);
        console.log(`Record count: ${countResult[0].count}`);
        // If this is a CMS table, check for post_id references
        if (tableName.startsWith('cms_')) {
            const postIdResult = await db.execute(sql `
        SELECT COUNT(*) FROM ${sql.raw(tableName)} WHERE post_id IS NOT NULL;
      `);
            console.log(`Records with post_id: ${postIdResult[0].count}`);
            // Check if any redundant columns exist
            const commonColumns = ['title', 'body', 'content', 'description', 'site_id', 'author_id', 'space_id', 'created_at', 'updated_at', 'status', 'category_id'];
            const existingRedundantColumns = columnsResult
                .filter((col) => commonColumns.includes(col.column_name))
                .map((col) => col.column_name);
            if (existingRedundantColumns.length > 0) {
                console.log(`Warning: Found redundant columns that should be in posts table: ${existingRedundantColumns.join(', ')}`);
            }
            else {
                console.log('✓ No redundant columns found');
            }
        }
        // If this is the posts table, show distribution by cms_type
        if (tableName === 'posts') {
            const typeDistribution = await db.execute(sql `
        SELECT cms_type, COUNT(*) 
        FROM posts 
        GROUP BY cms_type 
        ORDER BY COUNT(*) DESC;
      `);
            console.log('Content type distribution:');
            typeDistribution.forEach((type) => {
                console.log(`  - ${type.cms_type}: ${type.count} records`);
            });
        }
    }
    catch (error) {
        console.error(`Error checking table ${tableName}:`, error);
    }
}
async function checkMigration() {
    const queryClient = postgres(connectionString, { max: 1 });
    const db = drizzle(queryClient);
    try {
        // Check posts table status
        await checkTable(db, 'posts');
        await checkTable(db, 'post_tags');
        // Check spaces table
        await checkTable(db, 'spaces');
        // Check a few CMS tables
        await checkTable(db, 'cms_discussions');
        await checkTable(db, 'cms_articles');
        await checkTable(db, 'cms_ideas');
        console.log('\nMigration check completed.');
        return true;
    }
    catch (error) {
        console.error('Migration check failed:', error);
        throw error;
    }
    finally {
        await queryClient.end();
    }
}
// Run the check
// checkMigration() // Commented out to prevent auto-execution
//   .then(() => {
//     process.exit(0);
//   })
//   .catch(error => {
//     console.error('Check failed:', error);
//     process.exit(1);
//   }); 
