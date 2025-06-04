/**
 * Migration script to update the spaces table's cms_type column from TEXT to UUID
 * with a proper foreign key reference to cms_types table.
 *
 * Run with:
 * NODE_ENV=development DATABASE_URL=your_db_url npx tsx server/db/migrate-space-cms-type.ts
 */
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';
import * as schema from './schema.js';
// Load environment variables
dotenv.config();
// Database connection
if (!process.env.DATABASE_URL) {
    console.error('FATAL ERROR: DATABASE_URL environment variable is not set or empty.');
    process.exit(1);
}
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
// Create db instance with schema
const db = drizzle(pool, { schema });
async function migrateCmsTypeColumn() {
    console.log('Starting migration of spaces.cms_type column from TEXT to UUID...');
    try {
        // 1. Create a temporary column to store the new UUID values
        console.log('1. Creating temporary column cms_type_uuid...');
        await db.execute(sql `
      ALTER TABLE spaces 
      ADD COLUMN IF NOT EXISTS cms_type_uuid UUID REFERENCES cms_types(id)
    `);
        // 2. Get all spaces with their current cms_type values
        console.log('2. Fetching all spaces...');
        const allSpaces = await db.select().from(schema.spaces);
        console.log(`Found ${allSpaces.length} spaces to process`);
        // 3. Get all cms_types for lookup
        console.log('3. Fetching all cms_types for reference...');
        const allCmsTypes = await db.select().from(schema.cms_types);
        if (allCmsTypes.length === 0) {
            console.error('No CMS types found! Make sure the cms_types table is populated.');
            process.exit(1);
        }
        console.log(`Found ${allCmsTypes.length} CMS types`);
        // Create lookup maps for CMS types by ID and by name
        const cmsTypeById = new Map();
        const cmsTypeByName = new Map();
        allCmsTypes.forEach((cmsType) => {
            cmsTypeById.set(cmsType.id, cmsType);
            cmsTypeByName.set(cmsType.name.toLowerCase(), cmsType);
        });
        // 4. Update each space's cms_type_uuid based on the text value
        console.log('4. Updating spaces with the correct cms_type_uuid values...');
        let updatedCount = 0;
        let notFoundCount = 0;
        for (const space of allSpaces) {
            const currentCmsType = space.cms_type;
            if (!currentCmsType) {
                console.log(`Space ${space.id} (${space.name}) has no cms_type, skipping`);
                continue;
            }
            console.log(`Processing space ${space.id} (${space.name}) with cms_type: ${currentCmsType}`);
            let targetCmsTypeId = null;
            // Check if the current cms_type is already a valid UUID in the cms_types table
            if (cmsTypeById.has(currentCmsType)) {
                targetCmsTypeId = currentCmsType;
                console.log(`  Found direct match by ID: ${targetCmsTypeId}`);
            }
            // Check if it matches a cms_type name (case insensitive)
            else if (cmsTypeByName.has(currentCmsType.toLowerCase())) {
                const matchedType = cmsTypeByName.get(currentCmsType.toLowerCase());
                targetCmsTypeId = matchedType ? matchedType.id : null;
                console.log(`  Found match by name: ${targetCmsTypeId}`);
            }
            // Try to derive a match from name similarity
            else {
                // Find cms_type that most closely matches the current value
                const normalizedCmsType = currentCmsType.toLowerCase();
                // Convert the map to an array for iteration
                const entries = Array.from(cmsTypeByName.entries());
                for (const [name, cmsType] of entries) {
                    if (normalizedCmsType.includes(name) || name.includes(normalizedCmsType)) {
                        targetCmsTypeId = cmsType.id;
                        console.log(`  Found fuzzy match: "${normalizedCmsType}" ~ "${name}" -> ${targetCmsTypeId}`);
                        break;
                    }
                }
                // If still no match, use the first CMS type as fallback
                if (!targetCmsTypeId && allCmsTypes.length > 0) {
                    targetCmsTypeId = allCmsTypes[0].id;
                    console.log(`  No match found, using default: ${targetCmsTypeId}`);
                    notFoundCount++;
                }
            }
            if (targetCmsTypeId) {
                // Update the space with the new cms_type_uuid using raw SQL to avoid schema issues
                await db.execute(sql `
          UPDATE spaces 
          SET cms_type_uuid = ${targetCmsTypeId}
          WHERE id = ${space.id}
        `);
                updatedCount++;
            }
        }
        console.log(`Updated ${updatedCount} spaces, ${notFoundCount} spaces had no matching cms_type`);
        // 5. Rename columns and ensure constraints
        console.log('5. Applying schema changes: dropping old column and renaming new column...');
        // Drop the old column and rename the new one
        await db.execute(sql `
      ALTER TABLE spaces DROP COLUMN cms_type;
      ALTER TABLE spaces RENAME COLUMN cms_type_uuid TO cms_type;
    `);
        console.log('Migration completed successfully!');
    }
    catch (error) {
        console.error('Migration failed:', error);
    }
    finally {
        await pool.end();
    }
}
// Run the migration
// migrateCmsTypeColumn(); // Commented out to prevent auto-execution
