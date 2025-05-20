# Posts Table Migration Guide

This guide explains the database migration process for centralizing common content fields into a new `posts` table.

## Overview

The migration is split into three steps to ensure data integrity:

1. **Structure Migration** - Creates the posts table and adds necessary columns to existing tables
2. **Data Migration** - Moves data from individual CMS tables to the centralized posts table
3. **Column Cleanup** - Removes redundant columns from CMS tables that are now in the posts table

## Prerequisites

- Node.js 16+ installed
- Access to the database with write permissions
- Environment variables configured (DATABASE_URL or POSTGRES_URL)

## Step 1: Structure Migration

The first script creates the `posts` table and adds `post_id` reference columns to all existing CMS tables.

To run the first migration:

```bash
cd /path/to/App-bettermode
./server/db/create-posts-migration.ts
```

## Step 2: Data Migration

After the structure is in place, the second script moves the data from individual CMS tables to the posts table.

To run the data migration:

```bash
cd /path/to/App-bettermode
./server/db/migrate-data-to-posts.ts
```

## Step 3: Column Cleanup

The final step removes the redundant columns from CMS tables after confirming data has been successfully migrated.

To run the column cleanup:

```bash
cd /path/to/App-bettermode
./server/db/remove-columns.ts
```

## Complete Migration

For convenience, you can run the migration as a single step using the npm script:

```bash
npm run db:migrate:posts
```

## Verification

After running all migration steps, you can verify the successful migration by:

1. Checking that `posts` table contains records from various CMS tables
2. Confirming that CMS tables have updated `post_id` values linking to the posts table
3. Verifying that redundant columns have been removed from CMS tables
4. Testing the application to ensure content is correctly displayed

## Troubleshooting

If you encounter issues during migration:

- Check database logs for errors
- Verify that all required tables exist before migration
- Ensure post_id columns were added successfully in Step 1
- For data-specific issues, you may need to manually fix individual records
- If column removal fails, check that data migration was successful first

## Rolling Back

The migration doesn't include automatic rollback support. If needed, manual database restoration from a backup is recommended.

## Schema Changes

This migration centralizes these common fields from CMS tables to the posts table:
- title
- content
- status
- author_id
- space_id
- published_at
- created_at
- updated_at
- site_id
- locked
- hidden

Each CMS table now contains a `post_id` reference to the central posts table and has its redundant columns removed. 