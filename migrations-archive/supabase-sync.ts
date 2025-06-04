import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';

// Database connection
if (!process.env.DATABASE_URL) {
  console.error('FATAL ERROR: DATABASE_URL environment variable is not set or empty.');
  throw new Error('DATABASE_URL environment variable is not set or empty.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
});

const db = drizzle(pool);

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

// Only delete after we've confirmed all data has been migrated
const MIGRATE_AND_DROP = false;

async function syncSchema() {
  try {
    console.log('Starting Supabase schema synchronization');

    // Check for existing tables
    const existingTablesResult = await db.execute(sql`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `);
    const tableNames = existingTablesResult.rows.map(row => row.tablename as string);
    console.log('Existing tables:', tableNames);

    // 1. Migrate data from old tables to new tables
    await migrateContentTables(tableNames);
    
    // 2. Ensure tag relationships exist for CMS tables
    await setupTagRelationships(tableNames);

    // 3. Drop old tables if requested and migration was successful
    if (MIGRATE_AND_DROP) {
      await dropOldTables(tableNames);
    }

    console.log('Supabase schema synchronization completed successfully!');
  } catch (error) {
    console.error('Sync failed:', error);
  } finally {
    await pool.end();
  }
}

async function migrateContentTables(tableNames: string[]) {
  console.log('Migrating content from old tables to CMS tables...');

  // For each old table, check if it exists and has a corresponding new table
  for (const oldTable of OLD_TABLES) {
    const newTable = `cms_${oldTable}`;
    
    // Skip if old table doesn't exist or new table doesn't exist
    if (!tableNames.includes(oldTable) || !tableNames.includes(newTable)) {
      console.log(`Skipping migration for ${oldTable} -> ${newTable} (tables not found)`);
      continue;
    }

    // Check if new table already has data
    const dataCheckResult = await db.execute(sql`
      SELECT COUNT(*) FROM "${newTable}"
    `);
    const recordCount = parseInt(dataCheckResult.rows[0].count as string);
    
    if (recordCount > 0) {
      console.log(`Skipping migration for ${oldTable} -> ${newTable} (new table already has ${recordCount} records)`);
      continue;
    }

    // Get columns from old table
    const oldColumnsResult = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = '${sql.raw(oldTable)}'
    `);
    const oldColumns = oldColumnsResult.rows.map(row => row.column_name as string);

    // Get columns from new table
    const newColumnsResult = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = '${sql.raw(newTable)}'
    `);
    const newColumns = newColumnsResult.rows.map(row => row.column_name as string);

    // Find common columns
    const commonColumns = oldColumns.filter(col => newColumns.includes(col));
    
    if (commonColumns.length === 0) {
      console.log(`No common columns found between ${oldTable} and ${newTable}, skipping migration`);
      continue;
    }

    console.log(`Migrating ${oldTable} -> ${newTable} (${commonColumns.length} common columns)`);

    try {
      // Generate column list for the SQL as separate identifiers
      const columnList = commonColumns.map(col => `"${col}"`).join(', ');
      
      // Insert data from old table to new table for common columns
      const query = `
        INSERT INTO "${newTable}" (${columnList})
        SELECT ${columnList} FROM "${oldTable}"
      `;
      await db.execute(sql.raw(query));
      
      console.log(`✓ Successfully migrated data from ${oldTable} to ${newTable}`);
    } catch (err) {
      console.error(`Error migrating data from ${oldTable} to ${newTable}:`, err);
    }
  }
}

async function setupTagRelationships(tableNames: string[]) {
  console.log('Setting up tag relationships for CMS tables...');

  // Make sure we have the content_tags table
  if (!tableNames.includes('cms_content_tags')) {
    console.error('cms_content_tags table not found, cannot set up tag relationships');
    return;
  }

  // For each CMS content table, ensure tags can be associated
  for (const tablePrefix of ['cms_']) {
    const contentTables = tableNames.filter(name => name.startsWith(tablePrefix) && 
                                               name !== 'cms_content_tags' &&
                                               name !== 'cms_qa_answers' && 
                                               name !== 'cms_related_articles');
    
    for (const contentTable of contentTables) {
      const contentType = contentTable.replace('cms_', '');
      
      // Check if there are relationships already set up for this content type
      const existingTagsCheck = await db.execute(sql`
        SELECT COUNT(*) FROM "cms_content_tags" 
        WHERE content_type = '${sql.raw(contentType)}'
      `);
      
      const existingTagsCount = parseInt(existingTagsCheck.rows[0].count as string);
      console.log(`${contentTable}: Found ${existingTagsCount} existing tag relationships`);
    }
  }

  // Migrate old content_tags if it exists
  if (tableNames.includes('content_tags')) {
    // Check structure of content_tags table
    const oldTagsColumnsResult = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'content_tags'
    `);
    
    const oldTagsColumns = oldTagsColumnsResult.rows.map(row => row.column_name as string);
    console.log('Old content_tags columns:', oldTagsColumns);
    
    if (oldTagsColumns.includes('content_id') && 
        oldTagsColumns.includes('tag_id') && 
        oldTagsColumns.includes('content_type')) {
      
      // Try to migrate the tags
      try {
        await db.execute(sql`
          INSERT INTO "cms_content_tags" (content_id, tag_id, content_type)
          SELECT content_id, tag_id, content_type 
          FROM "content_tags"
          ON CONFLICT DO NOTHING
        `);
        console.log('✓ Successfully migrated tags from content_tags to cms_content_tags');
      } catch (err) {
        console.error('Error migrating content tags:', err);
      }
    }
  }
}

async function dropOldTables(tableNames: string[]) {
  if (!MIGRATE_AND_DROP) {
    console.log('Skipping drop old tables (MIGRATE_AND_DROP is false)');
    return;
  }

  console.log('Dropping old tables...');
  
  for (const oldTable of OLD_TABLES) {
    if (tableNames.includes(oldTable)) {
      try {
        await db.execute(sql`DROP TABLE IF EXISTS "${sql.raw(oldTable)}" CASCADE`);
        console.log(`✓ Dropped table ${oldTable}`);
      } catch (err) {
        console.error(`Error dropping table ${oldTable}:`, err);
      }
    }
  }
}

// Run the sync
syncSchema(); 