import express from 'express';
import { db } from '../db/index.js';
import { spaces, sites, cms_types } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { setApiResponseHeaders, handleCorsPreflightRequest } from '../utils/environment.js';
import { logger } from '../utils/logger.js';
import { sql } from 'drizzle-orm';
// Import with type any to avoid TypeScript errors
import slugifyPkg from 'slugify';
const slugify = (slugifyPkg as any).default || slugifyPkg;

const router = express.Router();

// UUID validation regex
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Define Zod schema for space creation
const createSpaceSchema = z.object({
  name: z.string().min(1, { message: 'Space name is required' }),
  slug: z.string().min(1, { message: 'Space slug is required' }).optional(),
  description: z.string().optional(),
  cms_type: z.string().refine(val => uuidRegex.test(val), {
    message: 'CMS type must be a valid UUID referencing a cms_type',
  }),
  visibility: z.enum(['public', 'private', 'paid']).default('public'),
  hidden: z.boolean().default(false),
});

// Apply CORS headers and handle OPTIONS requests for all routes
router.use((req, res, next) => {
  setApiResponseHeaders(res);
  if (handleCorsPreflightRequest(req, res)) return;
  next();
});

// Create a new space
router.post('/:siteId', async (req, res) => {
  try {
    const { siteId } = req.params;
    
    // Validate the site exists
    const site = await db.query.sites.findFirst({
      where: eq(sites.id, siteId)
    });
    
    if (!site) {
      return res.status(404).json({ message: 'Site not found' });
    }
    
    // TODO: Replace with actual authenticated user ID from req.user
    const currentUserId = "49a44198-e6e5-4b1e-b8fb-b1c50ee0639d"; // Placeholder
    
    // Parse and validate the request body
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    logger.info(`Creating space for site ${siteId}:`, body);
    
    const validationResult = createSpaceSchema.safeParse(body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Invalid space data',
        errors: validationResult.error.format(),
      });
    }
    
    const { name, description, cms_type, visibility, hidden } = validationResult.data;
    
    // Verify that the provided cms_type exists
    const cmsTypeExists = await db.query.cms_types.findFirst({
      where: eq(cms_types.id, cms_type)
    });
    
    if (!cmsTypeExists) {
      return res.status(400).json({ 
        message: 'Invalid CMS type', 
        details: 'The provided CMS type ID does not exist' 
      });
    }
    
    // Generate slug if not provided
    let slug = validationResult.data.slug;
    if (!slug) {
      slug = slugify(name, {
        lower: true,
        strict: true
      });
    }
    
    logger.info(`Generated slug for space: ${slug}`);
    
    // Check if a space with this slug already exists for this site
    const existingSpace = slug ? await db.query.spaces.findFirst({
      where: and(
        eq(spaces.site_id, siteId),
        eq(spaces.slug, slug)
      )
    }) : null;
    
    if (existingSpace) {
      return res.status(409).json({ message: 'A space with this slug already exists for this site' });
    }
    
    // Get the cms type name for better naming if needed
    let spaceName = name;
    
    // If the space name is a UUID or matches the cms_type UUID, use the CMS type name
    if (name === cms_type || (name.includes('-') && name.length > 30)) {
      spaceName = cmsTypeExists.name;
      logger.info(`Using CMS type name "${spaceName}" for space instead of "${name}"`);
    }
    
    // Create the space with type-safe values
    const spaceData: any = {
      name: spaceName,
      slug: slug as string, // We know slug is defined at this point
      description: description || `${spaceName} space`,
      site_id: siteId,
      creator_id: currentUserId,
      visibility,
      cms_type,
      hidden,
    };
    
    // Create the space
    const spaceInsertResult = await db.insert(spaces).values(spaceData).returning();
    
    if (!spaceInsertResult.length) {
      return res.status(500).json({ message: 'Failed to create space' });
    }
    
    const newSpace = spaceInsertResult[0];
    logger.info(`Successfully created space: ${newSpace.name} (${newSpace.id})`);
    
    // Update the site's space_ids array to include this new space
    try {
      const currentSite = await db.query.sites.findFirst({
        where: eq(sites.id, siteId),
        columns: { space_ids: true }
      });
      
      if (currentSite) {
        const currentSpaceIds = currentSite.space_ids as string[] || [];
        const updatedSpaceIds = [...currentSpaceIds, newSpace.id];
        
        await db.update(sites)
          .set({ space_ids: updatedSpaceIds })
          .where(eq(sites.id, siteId));
          
        logger.info(`Updated site ${siteId} with new space ID ${newSpace.id}`);
      }
    } catch (error) {
      logger.error(`Error updating site's space_ids:`, error);
      // Continue since the space was created successfully
    }
    
    // Return the newly created space
    return res.status(201).json(newSpace);
  } catch (error) {
    logger.error('Error creating space:', error);
    return res.status(500).json({ 
      message: 'Error creating space',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get a list of spaces for a site
router.get('/:siteId', async (req, res) => {
  try {
    const { siteId } = req.params;
    
    // Validate the site exists
    const site = await db.query.sites.findFirst({
      where: eq(sites.id, siteId)
    });
    
    if (!site) {
      return res.status(404).json({ message: 'Site not found' });
    }
    
    logger.info(`Fetching spaces for site ${siteId}`);
    
    // Find all spaces for this site
    const spacesList = await db.query.spaces.findMany({
      where: eq(spaces.site_id, siteId)
    });
    
    logger.info(`Found ${spacesList.length} spaces for site ${siteId}`);
    
    // If we have spaces, fetch their corresponding CMS type names
    if (spacesList.length > 0) {
      // Get space IDs and cms_type IDs
      const spaceIds = spacesList.map(space => space.id);
      const cmsTypeIds = spacesList.map(space => space.cms_type).filter(Boolean);
      
      // If there are any cms_type IDs, fetch their details
      if (cmsTypeIds.length > 0) {
        const cmsTypeDetails = await db.query.cms_types.findMany({
          where: sql`id = ANY(${cmsTypeIds})`
        });
        
        // Create a map of CMS type IDs to their details
        const cmsTypeMap = new Map();
        cmsTypeDetails.forEach(type => {
          cmsTypeMap.set(type.id, type);
        });
        
        // Enhance spaces with CMS type information
        const spacesWithCmsInfo = spacesList.map(space => {
          // Return the original space if it has no CMS type
          if (!space.cms_type) return space;
          
          // Get the CMS type details
          const cmsType = cmsTypeMap.get(space.cms_type);
          if (!cmsType) return space;
          
          // Return enhanced space
          return {
            ...space,
            cms_type_name: cmsType.name,
            cms_type_color: cmsType.color,
            cms_type_icon: cmsType.icon_name
          };
        });
        
        // Return the enhanced list
        return res.status(200).json(spacesWithCmsInfo);
      }
    }
    
    // Return the original list if we didn't enhance it
    return res.status(200).json(spacesList);
  } catch (error) {
    logger.error('Error fetching spaces:', error);
    return res.status(500).json({ 
      message: 'Error fetching spaces',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Rename spaces that have UUID-like names
router.post('/fix-names', async (req, res) => {
  try {
    // Find spaces with UUID-like names
    const spacesWithUuidNames = await db.select()
      .from(spaces)
      .where(sql`name LIKE '%-%-%-%-%'`);
    
    logger.info(`Found ${spacesWithUuidNames.length} spaces with UUID-like names`);
    
    // Get all CMS types for lookup
    const allCmsTypes = await db.select().from(cms_types);
    const cmsTypeMap = new Map();
    allCmsTypes.forEach(cmsType => {
      if (cmsType && cmsType.id) {
        cmsTypeMap.set(cmsType.id, cmsType.name);
      }
    });
    
    // Track updates
    const updates = [];
    
    // Update each space with a better name
    for (const space of spacesWithUuidNames) {
      let newName = '';
      
      // Use CMS type name if available
      if (space.cms_type && cmsTypeMap.has(space.cms_type)) {
        newName = cmsTypeMap.get(space.cms_type);
      } else {
        // Fallback if no CMS type
        newName = `Space ${space.id.substring(0, 6)}`;
      }
      
      logger.info(`Updating space name from "${space.name}" to "${newName}" (ID: ${space.id})`);
      
      try {
        // Update the space name
        await db.update(spaces)
          .set({ name: newName })
          .where(eq(spaces.id, space.id));
        
        updates.push({
          id: space.id,
          oldName: space.name,
          newName
        });
      } catch (error) {
        logger.error(`Error updating space name for ${space.id}:`, error);
      }
    }
    
    return res.status(200).json({ 
      message: `Updated ${updates.length} space names`,
      updates
    });
  } catch (error) {
    logger.error('Error fixing space names:', error);
    return res.status(500).json({ 
      message: 'Error fixing space names',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 