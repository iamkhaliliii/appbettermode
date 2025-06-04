import express from 'express';
import { db } from '../db/index.js';
import { sites, memberships, spaces, cms_types } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { setApiResponseHeaders, handleCorsPreflightRequest } from '../utils/environment.js';
import { fetchBrandData } from '../utils/brandfetch.js';
import { logger } from '../utils/logger.js';
// Import with type any to avoid TypeScript errors
import slugifyPkg from 'slugify';
const slugify = slugifyPkg.default || slugifyPkg;
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
    selectedContentTypes: z.array(z.string()).optional(), // Selected content type IDs
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
        sitesWithState.forEach((site) => {
            site.state = site.status;
        });
        return res.status(200).json(sitesWithState);
    }
    catch (error) {
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
            .then((results) => results[0] || null);
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
                .then((results) => results[0] || null);
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
    }
    catch (error) {
        console.error(`Error fetching site:`, error);
        return res.status(500).json({ message: 'Error fetching site from database' });
    }
});
// Apply CORS headers and handle OPTIONS requests for all routes
router.use((req, res, next) => {
    setApiResponseHeaders(res);
    if (handleCorsPreflightRequest(req, res))
        return;
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
        let contentTypeIds = [];
        if (payload.selectedContentTypes) {
            if (Array.isArray(payload.selectedContentTypes)) {
                contentTypeIds = payload.selectedContentTypes;
            }
            else if (typeof payload.selectedContentTypes === 'string') {
                try {
                    // Try to parse if it's a JSON string array
                    const parsed = JSON.parse(payload.selectedContentTypes);
                    if (Array.isArray(parsed)) {
                        contentTypeIds = parsed;
                    }
                }
                catch (e) {
                    // If not JSON, treat as a comma-separated string
                    contentTypeIds = payload.selectedContentTypes.split(',').map((item) => item.trim());
                }
            }
        }
        console.log("Processed content type IDs:", contentTypeIds);
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
        // Fetch CMS type details for the selected IDs
        let cmsTypes = [];
        if (contentTypeIds && contentTypeIds.length > 0) {
            try {
                cmsTypes = await db.select({
                    id: cms_types.id,
                    name: cms_types.name,
                    description: cms_types.description,
                    color: cms_types.color,
                    icon_name: cms_types.icon_name,
                })
                    .from(cms_types)
                    .where(sql `${cms_types.id} IN (${sql.join(contentTypeIds, sql `, `)})`);
                console.log(`Found ${cmsTypes.length} CMS types for the selected IDs`);
            }
            catch (error) {
                console.error('Error fetching CMS types:', error);
                // Continue with site creation even if CMS types fetch fails
            }
        }
        // Skip transaction, create only the site without membership
        console.log('Creating site with data:', {
            name: payload.name,
            subdomain: payload.subdomain,
            ownerId: currentUserId,
            status: 'active',
            logoUrl,
            brandColor,
            contentTypeIds
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
            content_types: contentTypeIds.length > 0 ? contentTypeIds : undefined, // Store CMS type IDs
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
        if (contentTypeIds.length > 0 && cmsTypes.length > 0) {
            console.log(`Creating spaces for selected CMS types: ${cmsTypes.map(ct => ct.name).join(', ')}`);
            // Array to store created space IDs
            const createdSpaceIds = [];
            // Create a space for each selected content type
            for (const cmsType of cmsTypes) {
                console.log(`Processing CMS type: ${cmsType.name} (${cmsType.id})`);
                // Generate readable name for the space based on CMS type name
                let spaceName = '';
                // Use the CMS type name directly if it's available
                if (cmsType.name) {
                    spaceName = cmsType.name;
                }
                else {
                    // Otherwise, try to generate a good name from any available information
                    if (cmsType.id.toLowerCase().includes('discussion')) {
                        spaceName = 'Discussions';
                    }
                    else if (cmsType.id.toLowerCase().includes('qa')) {
                        spaceName = 'Q&A';
                    }
                    else if (cmsType.id.toLowerCase().includes('wishlist')) {
                        spaceName = 'Wishlist';
                    }
                    else if (cmsType.id.toLowerCase().includes('blog')) {
                        spaceName = 'Blog';
                    }
                    else if (cmsType.id.toLowerCase().includes('knowledge')) {
                        spaceName = 'Knowledge Base';
                    }
                    else if (cmsType.id.toLowerCase().includes('event')) {
                        spaceName = 'Events';
                    }
                    else if (cmsType.id.toLowerCase().includes('landing')) {
                        spaceName = 'Landing Pages';
                    }
                    else if (cmsType.id.toLowerCase().includes('job')) {
                        spaceName = 'Job Board';
                    }
                    else {
                        // Fall back to a generic name
                        spaceName = `Space for ${cmsType.id.substring(0, 8)}`;
                    }
                }
                console.log(`Using name "${spaceName}" for space`);
                // Generate slug from name
                const spaceSlug = slugify(spaceName, {
                    lower: true,
                    strict: true
                });
                console.log(`Generated slug for ${spaceName}: ${spaceSlug}`);
                try {
                    console.log(`Attempting to create space in database for ${cmsType.name}...`);
                    // Insert the space using the spaces table object instead of raw SQL
                    const spaceInsertResult = await db.insert(spaces)
                        .values({
                        name: spaceName,
                        slug: spaceSlug,
                        description: cmsType.description || `${spaceName} space`,
                        creator_id: currentUserId,
                        site_id: newSite.id,
                        visibility: 'public',
                        cms_type: cmsType.id, // This is now a UUID foreign key
                        hidden: false
                    })
                        .returning({
                        id: spaces.id,
                        name: spaces.name,
                        slug: spaces.slug,
                        description: spaces.description,
                        site_id: spaces.site_id,
                        visibility: spaces.visibility,
                        cms_type: spaces.cms_type,
                        hidden: spaces.hidden
                    });
                    console.log(`Space created successfully for ${cmsType.name}, result:`, JSON.stringify(spaceInsertResult));
                    console.log(`Created ${cmsType.name} space: ${spaceName}`);
                    // Extract the space ID from the result and add it to our array
                    if (spaceInsertResult && spaceInsertResult.length > 0) {
                        createdSpaceIds.push(spaceInsertResult[0].id);
                        console.log(`Added space ID ${spaceInsertResult[0].id} to created spaces list`);
                    }
                }
                catch (spaceError) {
                    console.error(`Error creating space for ${cmsType.name}:`, spaceError);
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
                // Update the site record with created space IDs
                if (createdSpaceIds.length > 0) {
                    console.log(`Updating site with space IDs: ${createdSpaceIds.join(', ')}`);
                    // Update the site record to include the space IDs
                    await db.update(sites)
                        .set({
                        space_ids: createdSpaceIds
                    })
                        .where(eq(sites.id, newSite.id));
                    console.log(`Site updated with space IDs successfully`);
                }
            }
            catch (verifyError) {
                console.error('Error verifying created spaces:', verifyError);
            }
        }
        else {
            console.log('No CMS types found or selected, skipping space creation');
        }
        return res.status(201).json(newSite);
    }
    catch (error) {
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
        const sitesColumns = await db.execute(`SELECT column_name, data_type, is_nullable 
       FROM information_schema.columns 
       WHERE table_name = 'sites'
       ORDER BY ordinal_position`);
        // Get column information for memberships table
        const membershipsColumns = await db.execute(`SELECT column_name, data_type, is_nullable 
       FROM information_schema.columns 
       WHERE table_name = 'memberships'
       ORDER BY ordinal_position`);
        return res.status(200).json({
            sites: sitesColumns,
            memberships: membershipsColumns
        });
    }
    catch (error) {
        console.error('Error fetching schema:', error);
        return res.status(500).json({ message: 'Error fetching schema information' });
    }
});
// Create a space for a site
router.post('/:siteId/spaces', async (req, res) => {
    try {
        const { siteId } = req.params;
        // Get site to verify it exists
        const site = await db.query.sites.findFirst({
            where: eq(sites.id, siteId)
        });
        if (!site) {
            return res.status(404).json({ message: 'Site not found' });
        }
        // TODO: Replace with actual authenticated user ID from req.user
        const currentUserId = "49a44198-e6e5-4b1e-b8fb-b1c50ee0639d"; // Placeholder
        // Validate request body
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        logger.info(`Creating space for site ${siteId}:`, body);
        const { name, slug, cms_type, visibility = 'public', description, hidden = false } = body;
        if (!name || !slug) {
            return res.status(400).json({ message: 'Name and slug are required fields' });
        }
        // Validate slug format and uniqueness
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            return res.status(400).json({
                message: 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.'
            });
        }
        // Check if a space with this slug already exists for this site
        const existingSpace = await db.query.spaces.findFirst({
            where: and(eq(spaces.site_id, siteId), eq(spaces.slug, slug))
        });
        if (existingSpace) {
            return res.status(409).json({ message: 'A space with this slug already exists for this site' });
        }
        // Insert the new space
        const spaceResult = await db.insert(spaces)
            .values({
            name,
            slug,
            description: description || `${name} space`,
            creator_id: currentUserId,
            site_id: siteId,
            visibility,
            cms_type,
            hidden
        })
            .returning({
            id: spaces.id,
            name: spaces.name,
            slug: spaces.slug,
            description: spaces.description,
            site_id: spaces.site_id,
            visibility: spaces.visibility,
            cms_type: spaces.cms_type,
            hidden: spaces.hidden
        });
        logger.info(`Space creation result:`, spaceResult);
        // Extract the space ID from the result
        let spaceId = null;
        if (spaceResult && spaceResult.length > 0) {
            spaceId = spaceResult[0].id;
            logger.info(`Space created with ID ${spaceId}`);
        }
        if (!spaceId) {
            logger.error("Failed to extract space ID from result:", spaceResult);
            return res.status(500).json({ message: 'Space was created but ID could not be retrieved' });
        }
        // Fetch the newly created space
        let spaceData = await db.query.spaces.findFirst({
            where: eq(spaces.id, spaceId)
        });
        logger.info(`Space created successfully:`, spaceData);
        if (!spaceData) {
            // Try again with slug if ID query fails
            const spaceBySlug = await db.query.spaces.findFirst({
                where: and(eq(spaces.site_id, siteId), eq(spaces.slug, slug))
            });
            if (!spaceBySlug) {
                return res.status(500).json({ message: 'Space was created but could not be retrieved' });
            }
            logger.info(`Space found by slug:`, spaceBySlug);
            // Use this space for the rest of the processing
            spaceData = spaceBySlug;
        }
        // Update the site's space_ids array and content_types array
        // First get the current values
        const siteData = await db.query.sites.findFirst({
            where: eq(sites.id, siteId),
            columns: { space_ids: true, content_types: true }
        });
        // Update space_ids
        const currentSpaceIds = siteData?.space_ids || [];
        const updatedSpaceIds = [...currentSpaceIds];
        if (!updatedSpaceIds.includes(spaceData.id)) {
            updatedSpaceIds.push(spaceData.id);
            logger.info(`Adding space ID ${spaceData.id} to site's space_ids array`);
        }
        // Update content_types if cms_type is provided and not already in the list
        const currentContentTypes = siteData?.content_types || [];
        const updatedContentTypes = [...currentContentTypes];
        if (cms_type && !updatedContentTypes.includes(cms_type)) {
            updatedContentTypes.push(cms_type);
            logger.info(`Adding cms_type ${cms_type} to site's content_types array`);
        }
        // Update the site with both fields
        await db.update(sites)
            .set({
            space_ids: updatedSpaceIds,
            content_types: updatedContentTypes
        })
            .where(eq(sites.id, siteId));
        logger.info(`Updated site ${siteId} with new space ID ${spaceData.id} and content type ${cms_type}`);
        return res.status(201).json(spaceData);
    }
    catch (error) {
        logger.error('Error creating space:', error);
        return res.status(500).json({
            message: 'Error creating space',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Get all spaces for a site
router.get('/:siteId/spaces', async (req, res) => {
    try {
        const { siteId } = req.params;
        console.log(`Spaces API: Fetching spaces for site ID/subdomain: ${siteId}`);
        // Check if siteId is a subdomain or UUID
        const isUUID = siteId.includes('-') && siteId.length > 30;
        // Get site to verify it exists - try by subdomain first if not UUID
        let site;
        if (!isUUID) {
            // First try to find by subdomain
            site = await db.query.sites.findFirst({
                where: eq(sites.subdomain, siteId)
            });
        }
        // If not found or was a UUID, try by ID
        if (!site) {
            site = await db.query.sites.findFirst({
                where: eq(sites.id, siteId)
            });
        }
        if (!site) {
            console.error(`Spaces API: Site not found with identifier: ${siteId}`);
            return res.status(404).json({ message: 'Site not found' });
        }
        console.log(`Spaces API: Found site: ${site.name} (${site.id})`);
        // Fetch all spaces for this site using the UUID
        const spacesList = await db.query.spaces.findMany({
            where: eq(spaces.site_id, site.id)
        });
        console.log(`Spaces API: Found ${spacesList.length} spaces for site ${site.id}`);
        if (spacesList.length > 0) {
            console.log(`Spaces API: First space: ${spacesList[0].name} (${spacesList[0].id})`);
        }
        else {
            console.log(`Spaces API: No spaces found for site ${site.id}`);
        }
        return res.status(200).json(spacesList);
    }
    catch (error) {
        console.error('Error fetching spaces:', error);
        return res.status(500).json({ message: 'Failed to fetch spaces', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});
export default router;
