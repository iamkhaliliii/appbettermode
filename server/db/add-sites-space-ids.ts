#!/usr/bin/env tsx

/**
 * Sites Table Update: Add space_ids
 * 
 * This script adds a space_ids field to the sites table
 * to store the IDs of spaces associated with a site.
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

console.log('Starting sites table update: Adding space_ids field...');

async function addSpaceIdsToSites(db: any) {
  try {
    // Check if the space_ids column already exists
    const columnExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sites' AND column_name = 'space_ids'
      );
    `);

    if (!columnExists[0]?.exists) {
      console.log('Adding space_ids column to sites table...');
      await db.execute(sql`
        ALTER TABLE sites
        ADD COLUMN space_ids JSONB DEFAULT '[]';
      `);
      console.log('Successfully added space_ids column to sites table');
    } else {
      console.log('space_ids column already exists, skipping...');
    }

    return true;
  } catch (error) {
    console.error('Error adding space_ids to sites table:', error);
    throw error;
  }
}

async function updateSitesTable() {
  const queryClient = postgres(connectionString as string, { max: 1 });
  const db = drizzle(queryClient);
  
  try {
    await addSpaceIdsToSites(db);
    console.log('Sites table update completed successfully');
    return true;
  } catch (error) {
    console.error('Update failed:', error);
    throw error;
  } finally {
    await queryClient.end();
  }
}

// Run the update
(function() {
  updateSitesTable()
    .then(() => {
      console.log('Sites space_ids field added successfully.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
})(); 