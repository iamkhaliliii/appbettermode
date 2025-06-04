import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pkg from 'pg';
const { Client } = pkg;

// Get directory of current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  console.log('Starting database migration for cover image URLs...');
  
  // Remove any quotes from the connection string
  const connectionString = process.env.DATABASE_URL.replace(/["']/g, '');
  console.log(`Using connection string: ${connectionString}`);
  
  // Create a database connection using pg
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Read the SQL file
    const sqlFilePath = resolve(__dirname, '../migrations/meta/update-image-urls.sql');
    
    if (!existsSync(sqlFilePath)) {
      console.error(`Error: Migration file not found at ${sqlFilePath}`);
      process.exit(1);
    }
    
    const sqlContent = readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL file into individual statements
    const statements = sqlContent
      .split(';')
      .filter(statement => statement.trim() !== '')
      .map(statement => statement.trim() + ';');
    
    // Execute each statement in sequence
    for (const statement of statements) {
      console.log(`Executing SQL: ${statement}`);
      await client.query(statement);
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error executing migration:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('Database connection closed');
    console.log('Migration process finished.');
    process.exit(0);
  }
}

// Run the migration
// runMigration(); // Commented out to prevent auto-execution 