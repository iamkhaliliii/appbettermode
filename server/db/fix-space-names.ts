/**
 * This script updates space names in the database to use more appropriate names
 * based on their CMS type instead of UUIDs.
 */

import { db } from './index.js';
import { spaces, cms_types } from './schema.js';
import { eq, like } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

/**
 * Fix space names to be more readable
 */
export async function fixSpaceNames() {
  try {
    console.log('Fixing space names...');

    // Get all spaces with UUID-like names
    const spacesWithUuidNames = await db.select()
      .from(spaces)
      .where(like(spaces.name, '%-%-%-%-%')); // Simple pattern to match UUID-like names
    
    console.log(`Found ${spacesWithUuidNames.length} spaces with UUID-like names`);
    
    // Get all CMS types
    const allCmsTypes = await db.select().from(cms_types);
    console.log(`Found ${allCmsTypes.length} CMS types`);
    
    // Create a map of CMS type IDs to names
    const cmsTypeMap = new Map();
    allCmsTypes.forEach(cmsType => {
      if (cmsType && cmsType.id) {
        cmsTypeMap.set(cmsType.id, cmsType.name);
      }
    });
    
    // Process each space
    for (const space of spacesWithUuidNames) {
      console.log(`Processing space: ${space.name} (${space.id})`);
      
      let newName = '';
      
      // Look up the CMS type
      if (space.cms_type && cmsTypeMap.has(space.cms_type)) {
        // Use the CMS type name
        const cmsTypeName = cmsTypeMap.get(space.cms_type);
        newName = cmsTypeName;
      } else if (space.cms_type) {
        // Generate a name from the CMS type string
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
        } else if (space.cms_type.toLowerCase().includes('landing')) {
          newName = 'Landing Pages';
        } else if (space.cms_type.toLowerCase().includes('job')) {
          newName = 'Job Board';
        } else {
          // Extract a readable name from cms_type if it's a UUID
          if (space.cms_type.includes('-')) {
            newName = space.cms_type.split('-')[0].replace(/[0-9]/g, '');
            newName = newName.charAt(0).toUpperCase() + newName.slice(1);
            
            // If the extracted name is too short, use a generic one
            if (newName.length < 2) {
              newName = `Space ${space.id.substring(0, 6)}`;
            }
          } else {
            newName = `Space ${space.id.substring(0, 6)}`;
          }
        }
      } else {
        // Fallback if no CMS type
        newName = `Space ${space.id.substring(0, 6)}`;
      }
      
      console.log(`Updating space name from "${space.name}" to "${newName}"`);
      
      // Update the space name
      await db.update(spaces)
        .set({ name: newName })
        .where(eq(spaces.id, space.id));
      
      console.log(`Updated space name successfully!`);
    }
    
    console.log('Space name fixing completed successfully!');
    
    return { success: true, message: `Updated ${spacesWithUuidNames.length} space names` };
  } catch (error) {
    console.error('Error fixing space names:', error);
    return { success: false, message: 'Error fixing space names', error };
  }
}

// If this file is called directly, run the function
if (process.argv[1].endsWith('fix-space-names.ts')) {
  (async () => {
    try {
      const result = await fixSpaceNames();
      console.log(result);
      process.exit(0);
    } catch (error) {
      console.error('Failed to fix space names:', error);
      process.exit(1);
    }
  })();
} 