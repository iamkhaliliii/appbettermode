import { Client } from 'pg';
import 'dotenv/config';

// Connect directly using the Client for better error handling
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
});

async function updateTables() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Check existing tables
    const tablesResult = await client.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
    );
    const tableNames = tablesResult.rows.map(row => row.tablename);
    console.log('Existing tables:', tableNames);

    // 1. Check and drop the media table
    if (tableNames.includes('media')) {
      // First, check for any dependencies on the media table
      const checkDeps = await client.query(`
        SELECT
          tc.table_schema, 
          tc.table_name, 
          kcu.column_name, 
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

      if (checkDeps.rows.length > 0) {
        console.log('The following tables have dependencies on the media table:');
        checkDeps.rows.forEach(row => {
          console.log(`- ${row.table_name}.${row.column_name} → media.${row.foreign_column_name}`);
        });
        
        // Remove these foreign key constraints
        for (const row of checkDeps.rows) {
          try {
            // Get the constraint name
            const constraintResult = await client.query(`
              SELECT constraint_name 
              FROM information_schema.table_constraints
              WHERE table_schema = $1 AND table_name = $2 AND constraint_type = 'FOREIGN KEY'
              AND constraint_name IN (
                SELECT constraint_name 
                FROM information_schema.constraint_column_usage 
                WHERE table_name = 'media'
              )
            `, [row.table_schema, row.table_name]);
            
            if (constraintResult.rows.length > 0) {
              const constraintName = constraintResult.rows[0].constraint_name;
              await client.query(`
                ALTER TABLE "${row.table_name}" DROP CONSTRAINT "${constraintName}";
              `);
              console.log(`✓ Removed dependency: ${row.table_name}.${row.column_name} → media.${row.foreign_column_name}`);
            }
          } catch (err) {
            console.error(`Error removing dependency for ${row.table_name}:`, err);
          }
        }
      }

      // Now drop the media table
      try {
        await client.query('DROP TABLE IF EXISTS "media" CASCADE');
        console.log('✓ Removed media table');
      } catch (err) {
        console.error('Error removing media table:', err);
      }
    } else {
      console.log('Media table not found, skipping removal');
    }

    // 2. Update content_tags table structure
    // Get the structure of the existing tags table
    if (tableNames.includes('tags')) {
      try {
        const tagsColumnsResult = await client.query(`
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_name = 'tags'
          ORDER BY ordinal_position
        `);
        
        console.log('Current tags table structure:');
        tagsColumnsResult.rows.forEach(row => {
          console.log(`- ${row.column_name} (${row.data_type}, ${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });

        // Check if any changes are needed
        const missingColumns = [];
        
        // Check for color column
        const hasColorColumn = tagsColumnsResult.rows.some(row => row.column_name === 'color');
        if (!hasColorColumn) {
          missingColumns.push({
            name: 'color',
            type: 'text',
            default: null
          });
        }
        
        // Check for icon column
        const hasIconColumn = tagsColumnsResult.rows.some(row => row.column_name === 'icon');
        if (!hasIconColumn) {
          missingColumns.push({
            name: 'icon',
            type: 'text',
            default: null
          });
        }
        
        // Add any missing columns
        for (const column of missingColumns) {
          try {
            await client.query(`
              ALTER TABLE "tags" 
              ADD COLUMN "${column.name}" ${column.type} ${column.default ? `DEFAULT '${column.default}'` : ''};
            `);
            console.log(`✓ Added ${column.name} column to tags table`);
          } catch (err) {
            console.error(`Error adding ${column.name} column to tags table:`, err);
          }
        }

        // Rename cms_content_tags to content_tags if it exists
        if (tableNames.includes('cms_content_tags')) {
          // Check if regular content_tags already exists
          if (tableNames.includes('content_tags')) {
            console.log('Both cms_content_tags and content_tags exist. Merging data...');
            
            // Generate a temporary table name
            const tempTableName = 'content_tags_new';
            
            // Create temp table with the same structure as cms_content_tags
            await client.query(`
              CREATE TABLE "${tempTableName}" (
                content_id uuid NOT NULL,
                tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
                content_type text NOT NULL,
                PRIMARY KEY (content_id, tag_id, content_type)
              );
            `);
            
            // Copy data from cms_content_tags to new table
            await client.query(`
              INSERT INTO "${tempTableName}" (content_id, tag_id, content_type)
              SELECT content_id, tag_id, content_type FROM "cms_content_tags"
              ON CONFLICT DO NOTHING;
            `);
            
            // Drop the old tables
            await client.query('DROP TABLE IF EXISTS "content_tags" CASCADE');
            await client.query('DROP TABLE IF EXISTS "cms_content_tags" CASCADE');
            
            // Rename temp table to content_tags
            await client.query(`
              ALTER TABLE "${tempTableName}" RENAME TO "content_tags";
            `);
            
            console.log('✓ Successfully merged and renamed cms_content_tags to content_tags');
          } else {
            // Just rename the table
            await client.query('ALTER TABLE "cms_content_tags" RENAME TO "content_tags"');
            console.log('✓ Renamed cms_content_tags to content_tags');
          }
        }
      } catch (err) {
        console.error('Error updating tags table:', err);
      }
    } else {
      console.log('Tags table not found, cannot update structure');
    }

    console.log('Update completed!');
  } catch (error) {
    console.error('Update failed:', error);
  } finally {
    await client.end();
  }
}

// Run the updates
updateTables().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
}); 