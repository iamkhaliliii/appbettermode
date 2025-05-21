import { sql } from 'drizzle-orm';
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get database connection string from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

/**
 * Migration script to:
 * 1. Add other_properties column to posts table
 * 2. Move data from CMS_ tables to other_properties column
 * 3. Drop all tables that start with CMS_
 */
async function migrateDatabase() {
  // Ensure connectionString is defined
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
  }
  
  const queryClient = postgres(connectionString, { max: 1 });
  
  try {
    // Create db instance
    const db = queryClient;
    console.log('Connected to the database');

    // Step 1: Add other_properties column to posts table
    console.log('Adding other_properties column to posts table...');
    await db`
      ALTER TABLE posts
      ADD COLUMN IF NOT EXISTS other_properties JSONB DEFAULT '{}'::jsonb;
    `;
    console.log('✅ Added other_properties column to posts table');

    // Step 2: Get all tables that start with cms_
    console.log('Identifying all CMS_ tables...');
    const cmsTablesResult = await db`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'cms_%';
    `;
    
    const cmsTables = cmsTablesResult.map(row => row.table_name);
    console.log(`Found ${cmsTables.length} CMS_ tables: ${cmsTables.join(', ')}`);

    // Step 3: For each CMS table, migrate its data to the other_properties column
    for (const table of cmsTables) {
      console.log(`Processing table: ${table}...`);
      
      try {
        // Check if the table has a post_id column
        const hasPostIdResult = await db`
          SELECT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = ${table} 
            AND column_name = 'post_id'
          );
        `;
        
        const hasPostId = hasPostIdResult[0]?.exists;
        
        if (hasPostId) {
          console.log(`Migrating data from ${table} to posts.other_properties...`);
          
          // Get column info for the current table
          const columnsResult = await db`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = ${table} 
            AND column_name != 'post_id' 
            AND column_name != 'id';
          `;
          
          const columns = columnsResult.map(row => row.column_name);
          
          if (columns.length > 0) {
            // For each post, migrate data from CMS table to posts.other_properties
            // We need to use raw SQL due to dynamic column selection
            for (const col of columns) {
              await db`
                UPDATE posts p
                SET other_properties = jsonb_set(
                  COALESCE(p.other_properties, '{}'::jsonb),
                  ARRAY[${col}],
                  to_jsonb(c.${db(col)}),
                  true
                )
                FROM ${db(table)} c
                WHERE c.post_id = p.id;
              `;
            }
            
            console.log(`✅ Migrated data from ${table} to posts.other_properties`);
          } else {
            console.log(`No columns to migrate from ${table} (other than id and post_id)`);
          }
        } else {
          console.log(`Table ${table} does not have a post_id column, skipping data migration`);
        }
      } catch (err) {
        console.error(`Error migrating data from ${table}:`, err);
      }
    }

    // Step 4: Drop all CMS_ tables
    console.log('Dropping all CMS_ tables...');
    
    // First drop tables with foreign key constraints
    for (const table of cmsTables) {
      try {
        // Need to use raw SQL for table names
        await db.unsafe(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
        console.log(`✅ Dropped table ${table}`);
      } catch (err) {
        console.error(`Error dropping table ${table}:`, err);
      }
    }

    console.log('Migration completed successfully');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await queryClient.end();
  }
}

// Execute the migration
migrateDatabase()
  .then(() => {
    console.log('Migration script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  }); 