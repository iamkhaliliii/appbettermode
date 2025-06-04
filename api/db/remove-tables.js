import { Client } from 'pg';
import 'dotenv/config';
// Connect directly using the Client for better error handling
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    }
});
async function removeTables() {
    try {
        await client.connect();
        console.log('Connected to database');
        // Check existing tables
        const tablesResult = await client.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
        const tableNames = tablesResult.rows.map(row => row.tablename);
        console.log('Existing tables:', tableNames);
        // 1. First, modify the tags table to store content info
        if (tableNames.includes('tags')) {
            try {
                // Check if content_id and content_type columns already exist in tags
                const columnsResult = await client.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'tags'
        `);
                const existingColumns = columnsResult.rows.map(row => row.column_name);
                // Add content_id column if it doesn't exist
                if (!existingColumns.includes('content_id')) {
                    await client.query(`
            ALTER TABLE "tags" ADD COLUMN "content_id" uuid;
          `);
                    console.log('✓ Added content_id column to tags table');
                }
                else {
                    console.log('content_id column already exists in tags table');
                }
                // Add content_type column if it doesn't exist
                if (!existingColumns.includes('content_type')) {
                    await client.query(`
            ALTER TABLE "tags" ADD COLUMN "content_type" text;
          `);
                    console.log('✓ Added content_type column to tags table');
                }
                else {
                    console.log('content_type column already exists in tags table');
                }
            }
            catch (err) {
                console.error('Error updating tags table:', err);
            }
        }
        else {
            console.log('Tags table not found, cannot update structure');
        }
        // 2. Migrate data from content_tags to tags if needed
        if (tableNames.includes('content_tags')) {
            try {
                // Get data from content_tags
                const contentTagsResult = await client.query(`
          SELECT content_id, tag_id, content_type FROM content_tags
        `);
                console.log(`Found ${contentTagsResult.rows.length} records in content_tags to migrate`);
                // For each content tag, update the corresponding tag with content info
                for (const row of contentTagsResult.rows) {
                    try {
                        // First check if this tag already exists with the same content association
                        const existingTag = await client.query(`
              SELECT id FROM tags 
              WHERE id = $1 AND (content_id = $2 OR content_id IS NULL)
            `, [row.tag_id, row.content_id]);
                        if (existingTag.rows.length > 0) {
                            // Update the existing tag
                            await client.query(`
                UPDATE tags
                SET content_id = $1, content_type = $2
                WHERE id = $3
              `, [row.content_id, row.content_type, row.tag_id]);
                        }
                        else {
                            // Clone the tag with the content association
                            const tagResult = await client.query(`
                SELECT * FROM tags WHERE id = $1
              `, [row.tag_id]);
                            if (tagResult.rows.length > 0) {
                                const tag = tagResult.rows[0];
                                await client.query(`
                  INSERT INTO tags (name, site_id, color, icon, content_id, content_type, created_at, updated_at)
                  VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
                `, [
                                    tag.name,
                                    tag.site_id,
                                    tag.color,
                                    tag.icon,
                                    row.content_id,
                                    row.content_type
                                ]);
                            }
                        }
                    }
                    catch (err) {
                        console.error(`Error migrating content tag (${row.content_id}, ${row.tag_id}):`, err);
                    }
                }
                console.log('✓ Migrated content_tags data to tags table');
            }
            catch (err) {
                console.error('Error migrating content_tags data:', err);
            }
        }
        // 3. Handle constraints and dependencies for categories table
        if (tableNames.includes('categories')) {
            // Find all foreign key constraints referencing the categories table
            const categoryDepsResult = await client.query(`
        SELECT
          tc.table_schema, 
          tc.table_name, 
          kcu.column_name, 
          tc.constraint_name
        FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu 
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' 
          AND ccu.table_name = 'categories';
      `);
            console.log(`Found ${categoryDepsResult.rows.length} dependencies on the categories table`);
            // Remove each foreign key constraint
            for (const row of categoryDepsResult.rows) {
                try {
                    await client.query(`
            ALTER TABLE "${row.table_name}" DROP CONSTRAINT "${row.constraint_name}";
          `);
                    console.log(`✓ Removed constraint: ${row.constraint_name} from ${row.table_name}`);
                }
                catch (err) {
                    console.error(`Error removing constraint ${row.constraint_name}:`, err);
                }
            }
        }
        // 4. Drop the tables
        // First drop content_tags
        if (tableNames.includes('content_tags')) {
            try {
                await client.query('DROP TABLE IF EXISTS "content_tags" CASCADE');
                console.log('✓ Removed content_tags table');
            }
            catch (err) {
                console.error('Error removing content_tags table:', err);
            }
        }
        else {
            console.log('content_tags table not found, skipping removal');
        }
        // Then drop categories
        if (tableNames.includes('categories')) {
            try {
                await client.query('DROP TABLE IF EXISTS "categories" CASCADE');
                console.log('✓ Removed categories table');
            }
            catch (err) {
                console.error('Error removing categories table:', err);
            }
        }
        else {
            console.log('categories table not found, skipping removal');
        }
        console.log('Table removal completed successfully!');
    }
    catch (error) {
        console.error('Migration failed:', error);
    }
    finally {
        await client.end();
    }
}
// Run the migration
// removeTables().catch(err => { // Commented out to prevent auto-execution
//   console.error('Fatal error:', err);
//   process.exit(1);
// }); 
