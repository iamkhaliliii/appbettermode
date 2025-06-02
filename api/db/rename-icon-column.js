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
 * Migration script to rename Icon_name column to icon_name
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

    // Check if Icon_name column exists
    const checkColumnResult = await db`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'cms_types' 
      AND column_name = 'Icon_name';
    `;

    if (checkColumnResult.length > 0) {
      console.log('Found Icon_name column, renaming to icon_name...');
      
      // Rename Icon_name to icon_name
      await db`
        ALTER TABLE cms_types
        RENAME COLUMN "Icon_name" TO "icon_name";
      `;
      console.log('✅ Successfully renamed Icon_name to icon_name');
    } else {
      // Check if icon_name already exists
      const checkNewColumnResult = await db`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'cms_types' 
        AND column_name = 'icon_name';
      `;
      
      if (checkNewColumnResult.length > 0) {
        console.log('icon_name column already exists, no changes needed');
      } else {
        console.log('Neither Icon_name nor icon_name columns exist, creating icon_name...');
        
        // Create icon_name column
        await db`
          ALTER TABLE cms_types
          ADD COLUMN icon_name TEXT;
        `;
        console.log('✅ Created icon_name column');
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