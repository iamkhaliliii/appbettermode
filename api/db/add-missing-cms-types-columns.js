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
 * Migration script to add missing columns to cms_types table
 */
async function addMissingColumns() {
  const queryClient = postgres(connectionString, { max: 1 });
  
  try {
    const db = queryClient;
    console.log('Connected to the database');

    // Check which columns exist
    const columns = await db`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'cms_types' 
      AND table_schema = 'public'
    `;
    
    const existingColumns = columns.map(col => col.column_name);
    console.log('Existing columns:', existingColumns);

    // Add description column if it doesn't exist
    if (!existingColumns.includes('description')) {
      console.log('Adding description column...');
      await db`
        ALTER TABLE cms_types 
        ADD COLUMN description TEXT
      `;
      console.log('✅ Added description column');
    }

    // Add color column if it doesn't exist
    if (!existingColumns.includes('color')) {
      console.log('Adding color column...');
      await db`
        ALTER TABLE cms_types 
        ADD COLUMN color TEXT
      `;
      console.log('✅ Added color column');
    }

    // Add icon_name column if it doesn't exist
    if (!existingColumns.includes('icon_name')) {
      console.log('Adding icon_name column...');
      await db`
        ALTER TABLE cms_types 
        ADD COLUMN icon_name TEXT
      `;
      console.log('✅ Added icon_name column');
    }

    // Add favorite column if it doesn't exist
    if (!existingColumns.includes('favorite')) {
      console.log('Adding favorite column...');
      await db`
        ALTER TABLE cms_types 
        ADD COLUMN favorite BOOLEAN DEFAULT FALSE
      `;
      console.log('✅ Added favorite column');
    }

    // Add type column if it doesn't exist (with enum check)
    if (!existingColumns.includes('type')) {
      console.log('Checking if cms_type_category enum exists...');
      const enumExists = await db`
        SELECT 1 FROM pg_type WHERE typname = 'cms_type_category'
      `;
      
      if (enumExists.length === 0) {
        console.log('Creating cms_type_category enum...');
        await db`
          CREATE TYPE cms_type_category AS ENUM ('official', 'custom')
        `;
        console.log('✅ Created cms_type_category enum');
      }
      
      console.log('Adding type column...');
      await db`
        ALTER TABLE cms_types 
        ADD COLUMN type cms_type_category DEFAULT 'official'
      `;
      console.log('✅ Added type column');
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
addMissingColumns()
  .then(() => {
    console.log('Migration script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  }); 