import { Client } from 'pg';
import * as dotenv from 'dotenv';
// Load environment variables
dotenv.config();
async function removeContentTagsTable() {
    // Create PostgreSQL client
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    try {
        // Connect to the database
        await client.connect();
        console.log('Connected to database');
        // Get list of tables to check if content_tags exists
        const tablesResult = await client.query(`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
    `);
        const tableNames = tablesResult.rows.map(row => row.tablename);
        console.log('Existing tables:', tableNames);
        // Remove content_tags table if it exists
        if (tableNames.includes('content_tags')) {
            await client.query(`
        DROP TABLE IF EXISTS "content_tags" CASCADE;
      `);
            console.log('✓ Removed content_tags table');
        }
        else {
            console.log('content_tags table does not exist in the database');
        }
        console.log('Migration completed successfully!');
    }
    catch (error) {
        console.error('Error during migration:', error);
    }
    finally {
        // Always close the client
        await client.end();
    }
}
// Run the migration
removeContentTagsTable();
