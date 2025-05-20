import express from 'express';
import { db } from '../db/index.js';
import { sites, memberships, spaces } from '../db/schema.js';
import { eq, and, or } from 'drizzle-orm';
import { z } from 'zod';
import { setApiResponseHeaders, handleCorsPreflightRequest } from '../utils/environment.js';
import { fetchBrandData } from '../utils/brandfetch.js';
import slugify from 'slugify';
import { sql } from 'drizzle-orm';

const router = express.Router();

// Brandfetch API key
const BRANDFETCH_API_KEY = 'rPJ4fYfXffPHxhNAIo8lU7mDRQXHsrYqKXQ678ySJsc=';

// Zod schema for site creation
const createSiteSchema = z.object({
  name: z.string().min(2, { message: 'Site name must be at least 2 characters.' }),
  subdomain: z.string()
    .min(3, { message: 'Subdomain must be at least 3 characters.' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Subdomain can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.',
    })
    .optional(),
  domain: z.string().optional(), // Optional domain for brand fetching
  selectedLogo: z.string().optional(), // User selected logo URL
  selectedColor: z.string().optional(), // User selected brand color
  selectedContentTypes: z.array(z.string()).optional(), // Selected content types
});

// Get all sites for the current user
router.get('/', async (req, res) => {
  try {
    // TODO: Replace with actual authenticated user ID from req.user
    const currentUserId = "49a44198-e6e5-4b1e-b8fb-b1c50ee0639d"; // Placeholder
    
    if (!currentUserId) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    const userSites = await db
      .select({
        id: sites.id,
        name: sites.name,
        subdomain: sites.subdomain,
        ownerId: sites.owner_id,
        role: memberships.role,
        createdAt: sites.createdAt,
        updatedAt: sites.updatedAt,
        status: sites.status,
        logo_url: sites.logo_url,
        brand_color: sites.brand_color,
        content_types: sites.content_types,
        plan: sites.plan,
      })
      .from(sites)
      .innerJoin(memberships, eq(memberships.siteId, sites.id))
      .where(eq(memberships.userId, currentUserId));

    // Create a deep copy and add state with proper typing
    const sitesWithState = JSON.parse(JSON.stringify(userSites));
    sitesWithState.forEach((site: any) => {
      site.state = site.status;
    });

    return res.status(200).json(sitesWithState);
  } catch (error) {
    console.error('Error fetching sites:', error);
    return res.status(500).json({ message: 'Error fetching sites from database' });
  }
});

// Get a site by ID or subdomain
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;

    if (!identifier) {
      return res.status(400).json({ message: 'Site identifier is required.' });
    }

    console.log(`Looking for site with identifier: ${identifier}`);
    
    // Try to find site by subdomain first
    let site = await db
      .select({
        id: sites.id,
        name: sites.name,
        subdomain: sites.subdomain,
        ownerId: sites.owner_id,
        createdAt: sites.createdAt,
        updatedAt: sites.updatedAt,
        status: sites.status,
        logo_url: sites.logo_url,
        brand_color: sites.brand_color,
        content_types: sites.content_types,
        plan: sites.plan,
      })
      .from(sites)
      .where(eq(sites.subdomain, identifier))
      .limit(1)
      .then((results: any) => results[0] || null);
    
    // If not found by subdomain, try UUID (if it looks like a UUID)
    if (!site && identifier.includes('-') && identifier.length > 30) {
      console.log(`Not found by subdomain, trying UUID: ${identifier}`);
      site = await db
        .select({
          id: sites.id,
          name: sites.name,
          subdomain: sites.subdomain,
          ownerId: sites.owner_id,
          createdAt: sites.createdAt,
          updatedAt: sites.updatedAt,
          status: sites.status,
          logo_url: sites.logo_url,
          brand_color: sites.brand_color,
          content_types: sites.content_types,
          plan: sites.plan,
        })
        .from(sites)
        .where(eq(sites.id, identifier))
        .limit(1)
        .then((results: any) => results[0] || null);
    }

    if (!site) {
      console.log(`Site not found with identifier: ${identifier}`);
      return res.status(404).json({ message: 'Site not found.' });
    }

    // Add state field for backward compatibility
    const siteWithState = JSON.parse(JSON.stringify(site));
    siteWithState.state = siteWithState.status;

    console.log(`Found site:`, siteWithState);
    return res.status(200).json(siteWithState);
  } catch (error) {
    console.error(`Error fetching site:`, error);
    return res.status(500).json({ message: 'Error fetching site from database' });
  }
});

// Apply CORS headers and handle OPTIONS requests for all routes
router.use((req, res, next) => {
  setApiResponseHeaders(res);
  if (handleCorsPreflightRequest(req, res)) return;
  next();
});

// Create a new site
router.post('/', async (req, res) => {
  try {
    console.log("=== Site Creation Request ===");
    console.log("Raw request body:", typeof req.body === 'string' ? req.body : JSON.stringify(req.body, null, 2));
    
    // Handle both string and object body formats (for Vercel compatibility)
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    console.log("Parsed body:", JSON.stringify(body, null, 2));
    
    const validationResult = createSiteSchema.safeParse(body);
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error.flatten());
      return res.status(400).json({
        message: 'Invalid site data.',
        errors: { fieldErrors: validationResult.error.flatten().fieldErrors },
      });
    }
    const payload = validationResult.data;
    console.log("Validated payload:", JSON.stringify(payload, null, 2));
    console.log("Content types from payload:", payload.selectedContentTypes);
    console.log(`Content types type: ${typeof payload.selectedContentTypes}, isArray: ${Array.isArray(payload.selectedContentTypes)}, length: ${payload.selectedContentTypes?.length || 0}`);

    // TODO: Replace with actual authenticated user ID from req.user
    const currentUserId = "49a44198-e6e5-4b1e-b8fb-b1c50ee0639d"; // Placeholder
    
    if (!currentUserId) {
      return res.status(401).json({ message: 'User not authenticated for creating a site.' });
    }

    // Check for subdomain uniqueness
    if (payload.subdomain) {
      const existingSiteWithSubdomain = await db.query.sites.findFirst({
        where: eq(sites.subdomain, payload.subdomain),
      });
      if (existingSiteWithSubdomain) {
        return res.status(409).json({ message: 'Subdomain is already taken.' });
      }
    }

    // Determine which brand data to use
    let logoUrl = null;
    let brandColor = null;
    
    // Ensure content types is always an array
    let contentTypes: string[] = [];
    if (payload.selectedContentTypes) {
      if (Array.isArray(payload.selectedContentTypes)) {
        contentTypes = payload.selectedContentTypes;
      } else if (typeof payload.selectedContentTypes === 'string') {
        try {
          // Try to parse if it's a JSON string array
          const parsed = JSON.parse(payload.selectedContentTypes);
          if (Array.isArray(parsed)) {
            contentTypes = parsed;
          }
        } catch (e) {
          // If not JSON, treat as a comma-separated string
          contentTypes = (payload.selectedContentTypes as string).split(',').map((item: string) => item.trim());
        }
      }
    }
    
    console.log("Processed content types:", contentTypes);
    
    // If user provided selected brand assets, use those
    if (payload.selectedLogo || payload.selectedColor) {
      console.log('Using user-selected brand assets');
      logoUrl = payload.selectedLogo || null;
      brandColor = payload.selectedColor || null;
    } 
    // Otherwise fetch from Brandfetch if domain is provided
    else if (payload.domain) {
      console.log(`Fetching brand data for domain: ${payload.domain}`);
      const brandData = await fetchBrandData(payload.domain, BRANDFETCH_API_KEY);
      logoUrl = brandData.logoUrl;
      brandColor = brandData.brandColor;
    }

    // Skip transaction, create only the site without membership
    console.log('Creating site with data:', {
      name: payload.name,
      subdomain: payload.subdomain,
      ownerId: currentUserId,
      status: 'active',
      logoUrl,
      brandColor,
      contentTypes
    });
    
    const siteInsertResult = await db
      .insert(sites)
      .values({
        name: payload.name,
        subdomain: payload.subdomain,
        owner_id: currentUserId,
        status: 'active', // Default status for new sites
        logo_url: logoUrl,
        brand_color: brandColor,
        content_types: contentTypes.length > 0 ? contentTypes : undefined,
        plan: 'lite', // Default plan is lite
      })
      .returning({
        id: sites.id,
        name: sites.name,
        subdomain: sites.subdomain,
        ownerId: sites.owner_id,
        createdAt: sites.createdAt,
        updatedAt: sites.updatedAt,
        status: sites.status,
        logo_url: sites.logo_url,
        brand_color: sites.brand_color,
        content_types: sites.content_types,
        plan: sites.plan,
      });
    
    if (!siteInsertResult || siteInsertResult.length === 0) {
      throw new Error('Failed to create the site record in the database.');
    }
    
    // Add state field to the response
    const newSiteRaw = siteInsertResult[0];
    const newSite = JSON.parse(JSON.stringify(newSiteRaw));
    newSite.state = newSite.status;
    console.log('Site created successfully:', newSite);
    
    // Automatically add the creator as an admin member of the new site
    await db.insert(memberships).values({
      userId: currentUserId,
      siteId: newSite.id,
      role: 'admin', // Assigning 'admin' role to the creator
    });
    console.log(`User ${currentUserId} added as admin to site ${newSite.id}`);

    // Create spaces for selected content types
    if (contentTypes.length > 0) {
      console.log(`Creating spaces for selected content types: ${contentTypes.join(', ')}`);
      console.log(`Content types value type: ${typeof contentTypes}, isArray: ${Array.isArray(contentTypes)}`);
      
      // Map of content type IDs to readable names and space configurations
      const contentTypeConfig = {
        'discussion': {
          name: 'Discussions',
          description: 'Community discussions and conversations',
          visibility: 'public',
        },
        'qa': {
          name: 'Q&A',
          description: 'Questions and answers from the community',
          visibility: 'public',
        },
        'wishlist': {
          name: 'Ideas & Wishlist',
          description: 'Feature requests and suggestions',
          visibility: 'public',
        },
        'knowledge': {
          name: 'Knowledge Base',
          description: 'Helpful articles and resources',
          visibility: 'public',
        },
        'event': {
          name: 'Events',
          description: 'Upcoming and past events',
          visibility: 'public',
        },
        'blog': {
          name: 'Blog',
          description: 'News and updates',
          visibility: 'public',
        },
        'jobs': {
          name: 'Job Board',
          description: 'Career opportunities',
          visibility: 'public',
        },
        'landing': {
          name: 'Landing Pages',
          description: 'Marketing and information pages',
          visibility: 'public',
        }
      };
      
      // Create a space for each selected content type
      for (const contentType of contentTypes) {
        console.log(`Processing content type: ${contentType}`);
        
        // Get config for this content type or use defaults
        const config = contentTypeConfig[contentType as keyof typeof contentTypeConfig] || {
          name: contentType.charAt(0).toUpperCase() + contentType.slice(1),
          description: `${contentType} content`,
          visibility: 'public'
        };
        
        console.log(`Using config for ${contentType}:`, config);
        
        // Generate slug from name
        const spaceSlug = slugify(config.name, {
          lower: true,
          strict: true
        });
        
        console.log(`Generated slug for ${config.name}: ${spaceSlug}`);
        
        try {
          console.log(`Attempting to create space in database for ${contentType}...`);
          
          // Use SQL template literal with drizzle's sql tag
          const query = sql`
            INSERT INTO spaces 
            (name, slug, description, creator_id, site_id, visibility, cms_type, hidden)
            VALUES 
            (${config.name}, ${spaceSlug}, ${config.description}, 
             ${currentUserId}, ${newSite.id}, ${config.visibility}, 
             ${contentType}, ${false})
            RETURNING id;
          `;
          
          try {
            const result = await db.execute(query);
            console.log(`Space created successfully for ${contentType}, SQL result:`, JSON.stringify(result));
            console.log(`Created ${contentType} space: ${config.name}`);
          } catch (sqlError: any) {
            console.error(`SQL error creating space for ${contentType}:`, sqlError.message);
            // Check if there's a more detailed error structure
            if (sqlError.code) {
              console.error(`SQL error code: ${sqlError.code}, position: ${sqlError.position}`);
            }
            // Re-throw to ensure the outer catch block handles it
            throw sqlError;
          }
        } catch (spaceError: any) {
          console.error(`Error creating space for ${contentType}:`, spaceError);
          console.error(`Error details: ${spaceError.message}, code: ${spaceError.code}`);
          // Continue with other spaces even if one fails
        }
      }

      // Verify spaces were created
      try {
        const createdSpaces = await db.select({
          id: spaces.id,
          name: spaces.name,
          cms_type: spaces.cms_type
        })
        .from(spaces)
        .where(eq(spaces.site_id, newSite.id));

        console.log(`Verification - Spaces created for site ${newSite.id}:`, createdSpaces);
      } catch (verifyError) {
        console.error('Error verifying created spaces:', verifyError);
      }
    } else {
      console.log('No content types selected, skipping space creation');
    }

    return res.status(201).json(newSite);
  } catch (error: any) {
    console.error('Error creating site:', error);
    return res.status(500).json({ 
      message: 'Error creating site in database',
      details: error.message || 'Unknown error',
      code: error.code,
      position: error.position
    });
  }
});

// Debug endpoint to check table structure
router.get('/debug/schema', async (req, res) => {
  try {
    // Get column information for sites table
    const sitesColumns = await db.execute(
      `SELECT column_name, data_type, is_nullable 
       FROM information_schema.columns 
       WHERE table_name = 'sites'
       ORDER BY ordinal_position`
    );
    
    // Get column information for memberships table
    const membershipsColumns = await db.execute(
      `SELECT column_name, data_type, is_nullable 
       FROM information_schema.columns 
       WHERE table_name = 'memberships'
       ORDER BY ordinal_position`
    );
    
    return res.status(200).json({
      sites: sitesColumns,
      memberships: membershipsColumns
    });
  } catch (error) {
    console.error('Error fetching schema:', error);
    return res.status(500).json({ message: 'Error fetching schema information' });
  }
});

export default router; 