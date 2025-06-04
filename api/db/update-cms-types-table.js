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
 * Migration script to add more fields to cms_types table
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

    // Add new fields to cms_types table
    console.log('Adding new fields to cms_types table...');
    
    // Add description field (text, nullable)
    await db`
      ALTER TABLE cms_types
      ADD COLUMN IF NOT EXISTS description TEXT;
    `;
    console.log('✅ Added description field');
    
    // Add color field (text, nullable)
    await db`
      ALTER TABLE cms_types
      ADD COLUMN IF NOT EXISTS color TEXT;
    `;
    console.log('✅ Added color field');
    
    // Add icon_name field (text, nullable)
    await db`
      ALTER TABLE cms_types
      ADD COLUMN IF NOT EXISTS icon_name TEXT;
    `;
    console.log('✅ Added icon_name field');
    
    // Add favorite field (boolean, default false)
    await db`
      ALTER TABLE cms_types
      ADD COLUMN IF NOT EXISTS favorite BOOLEAN DEFAULT false;
    `;
    console.log('✅ Added favorite field');
    
    // Create type enum if it doesn't exist
    await db`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cms_type_category') THEN
          CREATE TYPE cms_type_category AS ENUM ('official', 'custom');
        END IF;
      END$$;
    `;
    
    // Add type field (enum, default 'official')
    await db`
      ALTER TABLE cms_types
      ADD COLUMN IF NOT EXISTS type cms_type_category DEFAULT 'official';
    `;
    console.log('✅ Added type field with enum values');

    // Update existing content types with default values for new fields
    await db`
      UPDATE cms_types
      SET description = CONCAT('Default content type for ', name, ' content'),
          color = CASE 
            WHEN name = 'discussion' THEN '#3b82f6'
            WHEN name = 'event' THEN '#f97316'
            WHEN name = 'knowledge' THEN '#14b8a6'
            WHEN name = 'kb_article' THEN '#0ea5e9'
            WHEN name = 'wishlist' THEN '#8b5cf6'
            WHEN name = 'idea' THEN '#8b5cf6'
            WHEN name = 'changelog' THEN '#ef4444'
            WHEN name = 'roadmap' THEN '#22c55e'
            WHEN name = 'announcement' THEN '#f59e0b'
            WHEN name = 'job' THEN '#6366f1'
            WHEN name = 'jobs' THEN '#6366f1'
            WHEN name = 'article' THEN '#0ea5e9'
            WHEN name = 'poll' THEN '#ec4899'
            WHEN name = 'qa' THEN '#6366f1'
            WHEN name = 'qa_question' THEN '#6366f1'
            WHEN name = 'blog' THEN '#0ea5e9'
            ELSE '#64748b'
          END,
          icon_name = CASE
            WHEN name = 'discussion' THEN 'message-circle'
            WHEN name = 'event' THEN 'calendar'
            WHEN name = 'knowledge' THEN 'book-open'
            WHEN name = 'kb_article' THEN 'file-text'
            WHEN name = 'wishlist' THEN 'lightbulb'
            WHEN name = 'idea' THEN 'lightbulb'
            WHEN name = 'changelog' THEN 'git-branch'
            WHEN name = 'roadmap' THEN 'map'
            WHEN name = 'announcement' THEN 'megaphone'
            WHEN name = 'job' THEN 'briefcase'
            WHEN name = 'jobs' THEN 'briefcase'
            WHEN name = 'article' THEN 'file-text'
            WHEN name = 'poll' THEN 'bar-chart-2'
            WHEN name = 'qa' THEN 'help-circle'
            WHEN name = 'qa_question' THEN 'help-circle'
            WHEN name = 'blog' THEN 'feather'
            ELSE 'file'
          END,
          favorite = CASE
            WHEN name IN ('discussion', 'blog', 'announcement', 'event') THEN true
            ELSE false
          END
      WHERE type IS NULL;
    `;
    console.log('✅ Updated existing content types with default values for new fields');

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
// migrateDatabase() // Commented out to prevent auto-execution
//   .then(() => {
//     console.log('Migration script completed successfully');
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error('Migration script failed:', error);
//     process.exit(1);
//   }); 