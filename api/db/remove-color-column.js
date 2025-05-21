import { Client } from 'pg';
import * as dotenv from 'dotenv';
// Load environment variables
dotenv.config();
async function removeColorColumn() {
    // Create PostgreSQL client
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    try {
        // Connect to the database
        await client.connect();
        console.log('Connected to database');
        // Check if the column exists
        const columnsResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'tags' AND column_name = 'color'
    `);
        // If the column exists, drop it
        if (columnsResult.rows.length > 0) {
            await client.query(`
        ALTER TABLE "tags" DROP COLUMN "color";
      `);
            console.log('✓ Removed color column from tags table');
        }
        else {
            console.log('Color column does not exist in tags table');
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
removeColorColumn();
