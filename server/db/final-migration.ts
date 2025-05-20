import { Client } from 'pg';
import 'dotenv/config';

// Connect directly using the Client for better error handling
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
});

async function finalMigration() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Check existing tables
    const tablesResult = await client.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
    );
    const tableNames = tablesResult.rows.map(row => row.tablename);
    console.log('Existing tables:', tableNames);

    // 1. Remove all foreign key constraints referencing the media table
    if (tableNames.includes('media')) {
      // Find all dependencies on the media table
      const checkDeps = await client.query(`
        SELECT
          tc.table_schema, 
          tc.table_name, 
          kcu.column_name, 
          tc.constraint_name,
          ccu.table_schema AS foreign_table_schema,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name 
        FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu 
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' 
          AND ccu.table_name = 'media';
      `);
      
      console.log(`Found ${checkDeps.rows.length} dependencies on the media table`);
      
      // Remove each foreign key constraint
      for (const row of checkDeps.rows) {
        try {
          await client.query(`
            ALTER TABLE "${row.table_name}" DROP CONSTRAINT "${row.constraint_name}";
          `);
          console.log(`✓ Removed constraint: ${row.constraint_name} from ${row.table_name}`);
        } catch (err) {
          console.error(`Error removing constraint ${row.constraint_name}:`, err);
        }
      }
      
      // Drop the media table
      try {
        await client.query('DROP TABLE IF EXISTS "media" CASCADE');
        console.log('✓ Removed media table');
      } catch (err) {
        console.error('Error removing media table:', err);
      }
    } else {
      console.log('Media table not found, skipping removal');
    }

    // 2. Add color and icon columns to the tags table
    if (tableNames.includes('tags')) {
      try {
        // Check for existing columns
        const columnsResult = await client.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'tags'
        `);
        const existingColumns = columnsResult.rows.map(row => row.column_name);
        
        // Add color column if it doesn't exist
        if (!existingColumns.includes('color')) {
          await client.query(`
            ALTER TABLE "tags" ADD COLUMN "color" text;
          `);
          console.log('✓ Added color column to tags table');
        } else {
          console.log('Color column already exists in tags table');
        }
        
        // Add icon column if it doesn't exist
        if (!existingColumns.includes('icon')) {
          await client.query(`
            ALTER TABLE "tags" ADD COLUMN "icon" text;
          `);
          console.log('✓ Added icon column to tags table');
        } else {
          console.log('Icon column already exists in tags table');
        }
      } catch (err) {
        console.error('Error updating tags table:', err);
      }
    } else {
      console.log('Tags table not found, cannot update structure');
    }

    // 3. Handle the content_tags table naming
    // First check if cms_content_tags exists and if content_tags already exists
    const hasCmsContentTags = tableNames.includes('cms_content_tags');
    const hasContentTags = tableNames.includes('content_tags');
    
    if (hasCmsContentTags) {
      if (hasContentTags) {
        // Both tables exist, we need to merge them
        console.log('Both cms_content_tags and content_tags exist - merging data');
        
        // Create a temporary structure to hold merged data
        await client.query(`
          CREATE TABLE "content_tags_temp" (
            content_id uuid NOT NULL,
            tag_id uuid NOT NULL,
            content_type text NOT NULL,
            PRIMARY KEY (content_id, tag_id, content_type)
          );
          
          -- Copy data from cms_content_tags
          INSERT INTO "content_tags_temp" (content_id, tag_id, content_type)
          SELECT content_id, tag_id, content_type FROM "cms_content_tags"
          ON CONFLICT DO NOTHING;
          
          -- Copy data from content_tags
          INSERT INTO "content_tags_temp" (content_id, tag_id, content_type)
          SELECT content_id, tag_id, content_type FROM "content_tags"
          ON CONFLICT DO NOTHING;
        `);
        
        // Drop both existing tables
        await client.query(`
          DROP TABLE IF EXISTS "cms_content_tags" CASCADE;
          DROP TABLE IF EXISTS "content_tags" CASCADE;
        `);
        
        // Rename the temp table to content_tags
        await client.query(`
          ALTER TABLE "content_tags_temp" RENAME TO "content_tags";
        `);
        
        // Add foreign key constraint for tag_id
        await client.query(`
          ALTER TABLE "content_tags" 
          ADD CONSTRAINT "content_tags_tag_id_fkey" 
          FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE;
        `);
        
        console.log('✓ Successfully merged and created content_tags table');
      } else {
        // Only cms_content_tags exists, we can just rename it
        await client.query(`
          ALTER TABLE "cms_content_tags" RENAME TO "content_tags";
        `);
        console.log('✓ Renamed cms_content_tags to content_tags');
      }
    } else if (!hasContentTags) {
      // Neither table exists, we need to create the content_tags table
      await client.query(`
        CREATE TABLE "content_tags" (
          content_id uuid NOT NULL,
          tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
          content_type text NOT NULL,
          PRIMARY KEY (content_id, tag_id, content_type)
        );
      `);
      console.log('✓ Created new content_tags table');
    } else {
      console.log('Content_tags table already exists, no renaming needed');
    }

    console.log('Final migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.end();
  }
}

// Run the migration
finalMigration().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
}); 