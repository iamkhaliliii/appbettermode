/**
 * Command-line script to fix space names in the database.
 * This script finds spaces with UUID-like names and updates them to more readable names.
 * 
 * Usage: 
 * NODE_ENV=development DATABASE_URL=your_db_url npx tsx server/db/fix-space-names-script.ts
 */

import dotenv from 'dotenv';
import { db } from './index.js';
import { spaces, cms_types } from './schema.js';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

// Load environment variables
dotenv.config();

async function fixSpaceNames() {
  console.log('Starting space name fixing process...');
  
  try {
    // Find spaces with UUID-like names (matching a pattern with 4+ hyphens)
    const spacesWithUuidNames = await db.select()
      .from(spaces)
      .where(sql`name LIKE '%-%-%-%-%'`);
    
    console.log(`Found ${spacesWithUuidNames.length} spaces with UUID-like names`);
    
    if (spacesWithUuidNames.length === 0) {
      console.log('No spaces need to be fixed. Exiting...');
      process.exit(0);
    }
    
    // Get all CMS types for lookup
    const allCmsTypes = await db.select().from(cms_types);
    console.log(`Found ${allCmsTypes.length} CMS types for reference`);
    
    // Create a map of CMS type IDs to names
    const cmsTypeMap = new Map();
    allCmsTypes.forEach(cmsType => {
      if (cmsType && cmsType.id) {
        cmsTypeMap.set(cmsType.id, cmsType.name);
      }
    });
    
    // Process each space with a UUID-like name
    for (const space of spacesWithUuidNames) {
      console.log(`Processing space: "${space.name}" (${space.id})`);
      
      let newName = '';
      
      // Derive new name from CMS type information
      if (space.cms_type && cmsTypeMap.has(space.cms_type)) {
        // Use the CMS type name
        newName = cmsTypeMap.get(space.cms_type);
        console.log(`Using CMS type name: ${newName}`);
      } else if (space.cms_type) {
        // Try to extract meaning from the CMS type string
        if (space.cms_type.toLowerCase().includes('discussion')) {
          newName = 'Discussions';
        } else if (space.cms_type.toLowerCase().includes('qa')) {
          newName = 'Q&A';
        } else if (space.cms_type.toLowerCase().includes('wishlist')) {
          newName = 'Wishlist';
        } else if (space.cms_type.toLowerCase().includes('blog')) {
          newName = 'Blog';
        } else if (space.cms_type.toLowerCase().includes('knowledge')) {
          newName = 'Knowledge Base';
        } else if (space.cms_type.toLowerCase().includes('event')) {
          newName = 'Events';
        } else {
          // Extract meaning from UUID if possible
          if (space.cms_type.includes('-')) {
            const prefix = space.cms_type.split('-')[0].replace(/[0-9]/g, '');
            if (prefix.length >= 2) {
              newName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
            } else {
              newName = `Space ${space.id.substring(0, 6)}`;
            }
          } else {
            newName = `Space ${space.id.substring(0, 6)}`;
          }
        }
      } else {
        // Use a generic name with a unique identifier
        newName = `Space ${space.id.substring(0, 6)}`;
      }
      
      console.log(`Updating space name from "${space.name}" to "${newName}"`);
      
      // Update the space name in the database
      await db.update(spaces)
        .set({ name: newName })
        .where(eq(spaces.id, space.id));
      
      console.log(`Updated successfully!`);
    }
    
    console.log(`Space name fixing process completed - ${spacesWithUuidNames.length} spaces updated`);
    process.exit(0);
  } catch (error) {
    console.error('Error fixing space names:', error);
    process.exit(1);
  }
}

// Run the fix function
fixSpaceNames(); 