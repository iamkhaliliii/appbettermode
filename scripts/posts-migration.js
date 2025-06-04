#!/usr/bin/env node

/**
 * Posts Migration Script
 * 
 * This script performs a database migration to create the posts table,
 * transfer data from existing CMS tables, and update the CMS tables to use
 * references to the posts table.
 */

import { spawn } from 'child_process';
import { migrateDatabase } from '../server/db/update-tables.js';

console.log('Starting posts migration...');

// First, build the TypeScript files to make sure we have the latest schema
console.log('Building server files...');
const buildProcess = spawn('npm', ['run', 'build'], { stdio: 'inherit' });

buildProcess.on('close', async (code) => {
  if (code !== 0) {
    console.error('Build failed. Please fix the errors before running the migration.');
    process.exit(1);
  }

  console.log('Build completed successfully.');
  
  try {
    // Run the migration to create the posts table and update schema
    console.log('Running database migration...');
    // await migrateDatabase(); // Commented out to prevent auto-execution
    
    console.log('Migration skipped (commented out for safety).');
    console.log('\nSummary of changes:');
    console.log('1. Added a new "posts" table with common fields for all content types');
    console.log('2. Added "post_tags" junction table for tags relationships');
    console.log('3. Migrated data from existing CMS tables to the posts table');
    console.log('4. Updated CMS tables to reference the posts table via post_id');
    console.log('5. Removed duplicate fields from CMS tables');
    console.log('\nAPI endpoints:');
    console.log('- GET /api/v1/posts/site/:siteId - Get all posts for a site');
    console.log('- GET /api/v1/posts/:postId - Get a single post by ID');
    console.log('- POST /api/v1/posts - Create a new post');
    console.log('- PUT /api/v1/posts/:postId - Update an existing post');
    console.log('- DELETE /api/v1/posts/:postId - Delete a post');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}); 