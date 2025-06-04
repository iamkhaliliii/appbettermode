// Standalone serverless function for /api/v1/sites
import express from 'express';
import { db } from "../db/index.js";
import { sites } from "../db/schema.js";
import { eq, or } from "drizzle-orm";
import { spaces } from "../db/schema.js";
import { cms_types } from "../db/schema.js";
import { sql } from "drizzle-orm";

const router = express.Router();

console.log('[API_SITES] /api/v1/sites router initialized');

// Middleware for CORS and logging (optional, can be handled globally)
router.use((req, res, next) => {
  console.log(`[API_SITES] Request: ${req.method} ${req.originalUrl}`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// GET a single site by ID or subdomain
router.get('/:identifier', async (req, res) => {
  const { identifier } = req.params;
  console.log(`[API_SITES] Attempting to fetch site with identifier: ${identifier}`);
  try {
    let site;

    // Basic UUID check 
    const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(identifier);

    if (isUUID) {
      site = await db.query.sites.findFirst({
        where: or(eq(sites.id, identifier), eq(sites.subdomain, identifier))
        // Add columns or relations if needed, e.g., with: { owner: true }
      });
    } else {
      // If not a UUID, assume it's a subdomain
      site = await db.query.sites.findFirst({
        where: eq(sites.subdomain, identifier)
        // Add columns or relations if needed
      });
    }

    if (!site) {
      console.log(`[API_SITES] Site not found for identifier: ${identifier}`);
      return res.status(404).json({ message: 'Site not found' });
    }
    
    let populatedContentTypes = [];
    if (site.content_types && Array.isArray(site.content_types) && site.content_types.length > 0) {
      // Assuming site.content_types is an array of cms_type IDs (UUIDs)
      const cmsTypeIds = site.content_types.filter(id => typeof id === 'string'); // Ensure they are strings
      if (cmsTypeIds.length > 0) {
        populatedContentTypes = await db.select({
          id: cms_types.id,
          name: cms_types.name,
          label: cms_types.label,
          icon_name: cms_types.icon_name,
          color: cms_types.color,
          type: cms_types.type,
          // Add other fields from cms_types if needed by the sidebar
        }).from(cms_types).where(sql`${cms_types.id} IN ${cmsTypeIds}`);
      }
    }

    // Ensure the response structure matches frontend expectations
    const formattedSite = {
      id: site.id,
      name: site.name,
      subdomain: site.subdomain,
      ownerId: site.owner_id, 
      createdAt: site.createdAt?.toISOString(),
      updatedAt: site.updatedAt?.toISOString(),
      status: site.status,
      plan: site.plan,
      logo_url: site.logo_url,
      brand_color: site.brand_color,
      content_types: populatedContentTypes, // Now populated with details
      space_ids: site.space_ids
    };

    console.log(`[API_SITES] Site found:`, formattedSite);
    return res.status(200).json(formattedSite);
  } catch (error) {
    console.error(`[API_SITES] Error fetching site by identifier ${identifier}:`, error);
    return res.status(500).json({ message: 'Error fetching site from database', details: error.message });
  }
});

// GET spaces for a specific site
router.get('/:siteId/spaces', async (req, res) => {
  const { siteId } = req.params;
  console.log(`[API_SITES] Attempting to fetch spaces for site ID: ${siteId}`);
  try {
    // Optional: Validate siteId is a UUID
    const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(siteId);
    if (!isUUID) {
      return res.status(400).json({ message: 'Invalid site ID format' });
    }

    // Check if the site exists
    const siteExists = await db.query.sites.findFirst({
      where: eq(sites.id, siteId),
      columns: { id: true } // Only need to check existence
    });

    if (!siteExists) {
      console.log(`[API_SITES] Site not found for ID: ${siteId} when fetching spaces`);
      return res.status(404).json({ message: 'Site not found' });
    }

    const siteSpaces = await db.query.spaces.findMany({
      where: eq(spaces.site_id, siteId),
      // You might want to include CMS type details here as well, similar to your /api/v1/spaces/:siteId route
    });

    console.log(`[API_SITES] Found ${siteSpaces.length} spaces for site ID: ${siteId}`);
    return res.status(200).json(siteSpaces);

  } catch (error) {
    console.error(`[API_SITES] Error fetching spaces for site ID ${siteId}:`, error);
    return res.status(500).json({ message: 'Error fetching spaces for site', details: error.message });
  }
});

// GET all sites
router.get('/', async (req, res) => {
  try {
    console.log('[API_SITES] Fetching all sites from database');
    const allSites = await db.query.sites.findMany();
    
    const formattedSites = allSites.map(site => ({
      id: site.id,
      name: site.name,
      subdomain: site.subdomain,
      ownerId: site.owner_id,
      createdAt: site.createdAt?.toISOString(),
      updatedAt: site.updatedAt?.toISOString(),
      status: site.status,
      plan: site.plan,
      logo_url: site.logo_url,
      brand_color: site.brand_color
      // Ensure all fields expected by the list view are here
    }));
    
    console.log(`[API_SITES] Found ${formattedSites.length} sites`);
    return res.status(200).json(formattedSites);
  } catch (error) {
    console.error('[API_SITES] Error fetching all sites:', error);
    return res.status(500).json({ 
      message: 'Error fetching sites from database',
      details: error.message || 'Unknown error'
    });
  }
});

// POST - Create a new site
router.post('/', async (req, res) => {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { name, subdomain, ownerId } = body; // Expect ownerId from client
    
    console.log(`[API_SITES] Attempting to create site: ${name}, subdomain: ${subdomain}`);
    
    // Basic validation (replace with Zod for robustness)
    const errors = { fieldErrors: {} };
    if (!name || name.length < 2) {
      errors.fieldErrors.name = ['Site name must be at least 2 characters.'];
    }
    if (subdomain) {
      if (subdomain.length < 3) {
        errors.fieldErrors.subdomain = ['Subdomain must be at least 3 characters.'];
      } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(subdomain)) {
        errors.fieldErrors.subdomain = ['Invalid subdomain format.'];
      }
      const existingSite = await db.query.sites.findFirst({ where: eq(sites.subdomain, subdomain) });
      if (existingSite) {
        console.log(`[API_SITES] Conflict: Subdomain '${subdomain}' already exists.`);
        return res.status(409).json({ message: 'This subdomain is already taken.', errors: { fieldErrors: { subdomain: ['This subdomain is already taken.']}} });
      }
    }
    if (Object.keys(errors.fieldErrors).length > 0) {
      console.log(`[API_SITES] Validation errors:`, errors);
      return res.status(400).json({ message: 'Invalid site data.', errors });
    }
    
    const insertResult = await db.insert(sites)
      .values({
        name: name,
        subdomain: subdomain || null,
        owner_id: ownerId || '49a44198-e6e5-4b1e-b8fb-b1c50ee0639d',
        status: 'active',
        logo_url: body.selectedLogo || null,
        brand_color: body.selectedColor || null,
        content_types: body.selectedContentTypes || []
      })
      .returning();
    
    if (!insertResult || insertResult.length === 0) {
      throw new Error('Failed to create site in database');
    }
    
    const newDbSite = insertResult[0];
    const createdSiteId = newDbSite.id;
    let createdSpaceIds = [];

    if (body.selectedContentTypes && Array.isArray(body.selectedContentTypes) && body.selectedContentTypes.length > 0) {
      const cmsTypeDetails = await db.select({
        id: cms_types.id,
        name: cms_types.name,     // This is the slug, e.g., "ideas-wishlist"
        label: cms_types.label    // This is the display name, e.g., "Ideas & Wishlist"
      }).from(cms_types).where(sql`${cms_types.id} IN ${body.selectedContentTypes}`);

      console.log(`[API_SITES] Found ${cmsTypeDetails.length} CMS types for the selected IDs to create spaces from.`);

      for (const cmsType of cmsTypeDetails) {
        // Ensure cmsType.label and cmsType.name are correctly populated here
        console.log(`[API_SITES] Processing CMS Type for default space - ID: ${cmsType.id}, Name (for slug): ${cmsType.name}, Label (for space name): ${cmsType.label}`);
        
        const spaceName = cmsType.label; // Explicitly use label for the space name
        const spaceSlug = cmsType.name;  // Explicitly use name (slug) for the space slug

        if (!spaceName || !spaceSlug) {
            console.error(`[API_SITES] Critical error: CMS Type ${cmsType.id} is missing name or label. Skipping space creation.`);
            continue;
        }

        const spaceData = {
          name: spaceName,
          slug: spaceSlug,
          description: `${spaceName} space`, // Use the actual spaceName (which is the label)
          site_id: createdSiteId,
          creator_id: newDbSite.owner_id, 
          visibility: 'public', 
          cms_type: cmsType.id, 
          hidden: false,
        };

        console.log(`[API_SITES] Attempting to create space in database with data:`, spaceData);

        try {
          const spaceInsertResult = await db.insert(spaces).values(spaceData).returning({ id: spaces.id });
          if (spaceInsertResult && spaceInsertResult.length > 0) {
            createdSpaceIds.push(spaceInsertResult[0].id);
            console.log(`[API_SITES] Space created successfully for CMS Type ${cmsType.name}, Space ID: ${spaceInsertResult[0].id}`);
          }
        } catch (spaceCreationError) {
          console.error(`[API_SITES] Error creating default space for CMS type ${cmsType.name} (ID: ${cmsType.id}):`, spaceCreationError);
        }
      }
      
      if (createdSpaceIds.length > 0) {
        console.log(`[API_SITES] Updating site ${createdSiteId} with space IDs: ${createdSpaceIds.join(', ')}`);
        await db.update(sites).set({ space_ids: createdSpaceIds }).where(eq(sites.id, createdSiteId));
        newDbSite.space_ids = createdSpaceIds; 
      }
    }

    const newSiteResponse = {
      id: newDbSite.id,
      name: newDbSite.name,
      subdomain: newDbSite.subdomain,
      ownerId: newDbSite.owner_id,
      createdAt: newDbSite.createdAt?.toISOString(),
      updatedAt: newDbSite.updatedAt?.toISOString(),
      status: newDbSite.status,
      plan: newDbSite.plan,
      logo_url: newDbSite.logo_url,
      brand_color: newDbSite.brand_color,
      content_types: newDbSite.content_types,
      space_ids: newDbSite.space_ids || [],
    };
    
    console.log(`[API_SITES] Site created successfully:`, newSiteResponse);
    return res.status(201).json(newSiteResponse);
  } catch (error) {
    console.error(`[API_SITES] Error creating site:`, error);
    return res.status(500).json({ 
      message: 'Error creating site in database',
      details: error.message || 'Unknown error'
    });
  }
});

export default router; 