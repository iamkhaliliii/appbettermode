#!/usr/bin/env tsx
/**
 * Spaces Table Update Migration
 *
 * This script adds new fields to the spaces table:
 * - slug: a text field for URL-friendly identifiers
 * - hidden: a boolean field to hide spaces from listing
 * - visibility: an enum field for access control (public, private, paid)
 */
import 'dotenv/config';
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from 'drizzle-orm';
// Import with type any to avoid TypeScript errors
import slugifyPkg from 'slugify';
const slugify = slugifyPkg.default || slugifyPkg;
// Connection string from environment variables
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connectionString) {
    console.error('No database connection string found in environment variables.');
    process.exit(1);
}
console.log('Starting spaces table update migration...');
async function updateSpacesTable(db) {
    try {
        // 1. Create the space_visibility enum type if it doesn't exist
        console.log('Creating space_visibility enum type...');
        try {
            await db.execute(sql `
        CREATE TYPE space_visibility AS ENUM ('public', 'private', 'paid');
      `);
            console.log('Created space_visibility enum type');
        }
        catch (error) {
            // If the enum already exists, ignore the error
            if (error.message.includes('already exists')) {
                console.log('space_visibility enum type already exists, skipping...');
            }
            else {
                throw error;
            }
        }
        // 2. Check if the slug column already exists
        const slugColumnExists = await db.execute(sql `
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'spaces' AND column_name = 'slug'
      );
    `);
        if (!slugColumnExists[0]?.exists) {
            console.log('Adding slug column to spaces table...');
            await db.execute(sql `
        ALTER TABLE spaces
        ADD COLUMN slug TEXT;
      `);
            // Generate slugs from existing names
            console.log('Generating slugs from space names...');
            const spaces = await db.execute(sql `
        SELECT id, name FROM spaces;
      `);
            // Update each space with a generated slug
            for (const space of spaces) {
                // Generate a base slug from the name
                let baseSlug = slugify(space.name, { lower: true, strict: true });
                if (!baseSlug) {
                    baseSlug = `space-${space.id.substring(0, 8)}`;
                }
                // Check if this slug already exists
                let slugExists = true;
                let uniqueSlug = baseSlug;
                let counter = 1;
                while (slugExists) {
                    const slugCheck = await db.execute(sql `
            SELECT EXISTS (
              SELECT 1 FROM spaces 
              WHERE slug = ${uniqueSlug} AND id != ${space.id}
            );
          `);
                    slugExists = slugCheck[0]?.exists;
                    if (slugExists) {
                        uniqueSlug = `${baseSlug}-${counter}`;
                        counter++;
                    }
                }
                // Update the space with the unique slug
                await db.execute(sql `
          UPDATE spaces 
          SET slug = ${uniqueSlug}
          WHERE id = ${space.id};
        `);
            }
            // Make slug column NOT NULL after all rows have values
            console.log('Setting slug column to NOT NULL...');
            await db.execute(sql `
        ALTER TABLE spaces
        ALTER COLUMN slug SET NOT NULL;
      `);
        }
        else {
            console.log('slug column already exists, skipping...');
        }
        // 3. Check if the hidden column already exists
        const hiddenColumnExists = await db.execute(sql `
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'spaces' AND column_name = 'hidden'
      );
    `);
        if (!hiddenColumnExists[0]?.exists) {
            console.log('Adding hidden column to spaces table...');
            await db.execute(sql `
        ALTER TABLE spaces
        ADD COLUMN hidden BOOLEAN DEFAULT false;
      `);
        }
        else {
            console.log('hidden column already exists, skipping...');
        }
        // 4. Check if the visibility column already exists
        const visibilityColumnExists = await db.execute(sql `
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'spaces' AND column_name = 'visibility'
      );
    `);
        if (!visibilityColumnExists[0]?.exists) {
            console.log('Adding visibility column to spaces table...');
            // First add column allowing NULL values
            await db.execute(sql `
        ALTER TABLE spaces
        ADD COLUMN visibility space_visibility;
      `);
            // Set the default value for existing records to 'public'
            console.log('Setting visibility to public for existing records...');
            await db.execute(sql `
        UPDATE spaces
        SET visibility = 'public'::space_visibility;
      `);
            // Now make the column NOT NULL with default value
            await db.execute(sql `
        ALTER TABLE spaces
        ALTER COLUMN visibility SET NOT NULL,
        ALTER COLUMN visibility SET DEFAULT 'public'::space_visibility;
      `);
        }
        else {
            console.log('visibility column already exists, skipping...');
        }
        console.log('Successfully updated spaces table');
        return true;
    }
    catch (error) {
        console.error('Error updating spaces table:', error);
        throw error;
    }
}
async function migrateSpacesTable() {
    const queryClient = postgres(connectionString, { max: 1 });
    const db = drizzle(queryClient);
    try {
        await updateSpacesTable(db);
        console.log('Spaces table update migration completed successfully');
        return true;
    }
    catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
    finally {
        await queryClient.end();
    }
}
// Run the update
(function () {
    migrateSpacesTable()
        .then(() => {
        console.log('Spaces table migration completed successfully.');
        process.exit(0);
    })
        .catch(error => {
        console.error('Spaces table migration failed:', error);
        process.exit(1);
    });
})();
