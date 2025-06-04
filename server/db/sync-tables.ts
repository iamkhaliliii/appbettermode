import { Client } from 'pg';
import 'dotenv/config';

// Connect directly using the Client for better error handling
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
});

const OLD_TABLES = [
  'discussions',
  'qa_answers',
  'qa_questions',
  'knowledge_base_articles',
  'related_articles',
  'content_tags',
  'ideas',
  'changelogs',
  'product_updates',
  'roadmap_items',
  'announcements',
  'wiki_pages',
  'events',
  'courses',
  'jobs',
  'speakers',
  'articles',
  'polls',
  'file_library',
  'gallery_items'
];

// Set to true now that we've confirmed migration was successful
const DROP_OLD_TABLES = true;

async function migrateData() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Get list of existing tables
    const tablesResult = await client.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
    );
    const tableNames = tablesResult.rows.map(row => row.tablename);
    console.log('Existing tables:', tableNames);

    // 1. Migrate data between tables
    for (const oldTable of OLD_TABLES) {
      const newTable = `cms_${oldTable}`;
      
      // Skip if tables don't exist
      if (!tableNames.includes(oldTable) || !tableNames.includes(newTable)) {
        console.log(`Skipping migration for ${oldTable} -> ${newTable} (missing tables)`);
        continue;
      }

      // Check if target table already has data
      const dataCheck = await client.query(`SELECT COUNT(*) FROM "${newTable}"`);
      if (parseInt(dataCheck.rows[0].count) > 0) {
        console.log(`Skipping migration for ${oldTable} -> ${newTable} (${dataCheck.rows[0].count} records already exist)`);
        continue;
      }

      try {
        // Get columns from both tables
        const oldColumnsResult = await client.query(
          `SELECT column_name FROM information_schema.columns WHERE table_name = $1`,
          [oldTable]
        );
        const oldColumns = oldColumnsResult.rows.map(row => row.column_name);
        
        const newColumnsResult = await client.query(
          `SELECT column_name FROM information_schema.columns WHERE table_name = $1`,
          [newTable]
        );
        const newColumns = newColumnsResult.rows.map(row => row.column_name);
        
        // Find common columns
        const commonColumns = oldColumns.filter(col => newColumns.includes(col));
        
        if (commonColumns.length === 0) {
          console.log(`No common columns found between ${oldTable} and ${newTable}, skipping migration`);
          continue;
        }
        
        console.log(`Migrating ${oldTable} -> ${newTable} (${commonColumns.length} common columns)`);
        
        // Build and execute the INSERT query
        const columnListStr = commonColumns.map(col => `"${col}"`).join(', ');
        const migrateQuery = `
          INSERT INTO "${newTable}" (${columnListStr})
          SELECT ${columnListStr} FROM "${oldTable}"
        `;
        await client.query(migrateQuery);
        console.log(`✓ Successfully migrated data from ${oldTable} to ${newTable}`);
      } catch (error) {
        console.error(`Error migrating ${oldTable} -> ${newTable}:`, error);
      }
    }

    // 2. Migrate tags from content_tags to cms_content_tags
    if (tableNames.includes('content_tags') && tableNames.includes('cms_content_tags')) {
      try {
        console.log('Migrating content tags...');
        
        // Check if target table already has data
        const tagDataCheck = await client.query(`SELECT COUNT(*) FROM "cms_content_tags"`);
        if (parseInt(tagDataCheck.rows[0].count) > 0) {
          console.log(`Skipping tag migration (${tagDataCheck.rows[0].count} records already exist)`);
        } else {
          await client.query(`
            INSERT INTO "cms_content_tags" (content_id, tag_id, content_type)
            SELECT content_id, tag_id, content_type FROM "content_tags"
          `);
          console.log('✓ Successfully migrated content tags');
        }
      } catch (error) {
        console.error('Error migrating content tags:', error);
      }
    }

    // 3. Drop old tables now that migration is complete and verified
    if (DROP_OLD_TABLES) {
      console.log('\nDropping old tables now that data has been migrated:');
      for (const oldTable of OLD_TABLES) {
        if (tableNames.includes(oldTable)) {
          try {
            await client.query(`DROP TABLE IF EXISTS "${oldTable}" CASCADE`);
            console.log(`✓ Dropped table ${oldTable}`);
          } catch (error) {
            console.error(`Error dropping table ${oldTable}:`, error);
          }
        }
      }
    } else {
      console.log('Skipping table drops (DROP_OLD_TABLES is false)');
    }

    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.end();
  }
}

// Run the migration
// migrateData().catch(err => { // Commented out to prevent auto-execution
//   console.error('Fatal error:', err);
//   process.exit(1);
// }); 