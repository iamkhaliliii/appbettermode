#!/usr/bin/env tsx

/**
 * Spaces Table Update: Add CMS Type
 * 
 * This script adds a cms_type field to the spaces table
 * to allow spaces to be associated with specific CMS types.
 */

import 'dotenv/config';
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from 'drizzle-orm';

// Connection string from environment variables
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('No database connection string found in environment variables.');
  process.exit(1);
}

console.log('Starting spaces table update: Adding cms_type field...');

async function addCmsTypeToSpaces(db: any) {
  try {
    // Check if the cms_type column already exists
    const columnExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'spaces' AND column_name = 'cms_type'
      );
    `);

    if (!columnExists[0]?.exists) {
      console.log('Adding cms_type column to spaces table...');
      await db.execute(sql`
        ALTER TABLE spaces
        ADD COLUMN cms_type TEXT;
      `);
      console.log('Successfully added cms_type column to spaces table');
    } else {
      console.log('cms_type column already exists, skipping...');
    }

    return true;
  } catch (error) {
    console.error('Error adding cms_type to spaces table:', error);
    throw error;
  }
}

async function updateSpacesTable() {
  const queryClient = postgres(connectionString as string, { max: 1 });
  const db = drizzle(queryClient);
  
  try {
    await addCmsTypeToSpaces(db);
    console.log('Spaces table update completed successfully');
    return true;
  } catch (error) {
    console.error('Update failed:', error);
    throw error;
  } finally {
    await queryClient.end();
  }
}

// Run the update
// (function() { // Commented out to prevent auto-execution
//   updateSpacesTable()
//     .then(() => {
//       console.log('Space cms_type field added successfully.');
//       process.exit(0);
//     })
//     .catch(error => {
//       console.error('Migration failed:', error);
//       process.exit(1);
//     });
// })(); 