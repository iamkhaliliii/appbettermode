import express from 'express';
import { db } from '../db/index.js';
import { sites, memberships, spaces, cms_types } from '../db/schema.js';
import { eq, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import { setApiResponseHeaders, handleCorsPreflightRequest } from '../utils/environment.js';
import { logger } from '../utils/logger.js';
import slugifyPkg from 'slugify';
const slugify = slugifyPkg.default || slugifyPkg;
const router = express.Router();
// Brandfetch API key
// Get Brandfetch API key from environment variables
const BRANDFETCH_API_KEY = process.env.BRANDFETCH_API_KEY;
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Zod schema for site creation
const createSiteSchema = z.object({
    name: z.string().min(2, { message: 'Site name must be at least 2 characters.' }),
    subdomain: z.string()
        .min(3, { message: 'Subdomain must be at least 3 characters.' })
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Subdomain can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.',
    })
        .optional().or(z.literal('')), // Allow empty string for optional subdomain
    domain: z.string().optional().or(z.literal('')),
    selectedLogo: z.string().url({ message: "Invalid URL for logo" }).optional().or(z.literal('')),
    selectedColor: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, { message: "Invalid hex color format" }).optional().or(z.literal('')),
    selectedContentTypes: z.array(z.string().uuid("Each content type ID must be a valid UUID")).optional().default([]), // Default to empty array
});
// Get all sites for the current user
router.get('/', async (req, res) => {
    try {
        const currentUserId = "49a44198-e6e5-4b1e-b8fb-b1c50ee0639d"; // Placeholder
        if (!currentUserId) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }
        const userSitesData = await db
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
            space_ids: sites.space_ids
        })
            .from(sites)
            .innerJoin(memberships, eq(memberships.siteId, sites.id))
            .where(eq(memberships.userId, currentUserId));
        const formattedSites = userSitesData.map(site => ({
            ...site,
            state: site.status,
            createdAt: site.createdAt?.toISOString(),
            updatedAt: site.updatedAt?.toISOString(),
        }));
        return res.status(200).json(formattedSites);
    }
    catch (error) {
        logger.error('[API_SITES] Error fetching sites:', error);
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
        logger.info(`[API_SITES] Looking for site with identifier: ${identifier}`);
        const isSiteUUID = uuidRegex.test(identifier);
        let queryCondition = isSiteUUID ? or(eq(sites.id, identifier), eq(sites.subdomain, identifier)) : eq(sites.subdomain, identifier);
        const siteData = await db.query.sites.findFirst({
            where: queryCondition,
            with: {
                owner: {
                    columns: {
                        id: true,
                        username: true,
                        full_name: true,
                        avatar_url: true
                    }
                }
            }
        });
        if (!siteData) {
            logger.warn(`[API_SITES] Site not found with identifier: ${identifier}`);
            return res.status(404).json({ message: 'Site not found.' });
        }
        let populatedContentTypes = [];
        const siteContentTypes = siteData.content_types; // Explicitly type
        if (siteContentTypes && Array.isArray(siteContentTypes) && siteContentTypes.length > 0) {
            const cmsTypeIds = siteContentTypes.filter(id => typeof id === 'string' && uuidRegex.test(id));
            if (cmsTypeIds.length > 0) {
                try {
                    populatedContentTypes = await db.select({
                        id: cms_types.id,
                        name: cms_types.name,
                        label: cms_types.label,
                        icon_name: cms_types.icon_name,
                        color: cms_types.color,
                        type: cms_types.type,
                        fields: cms_types.fields
                    }).from(cms_types).where(sql `${cms_types.id} IN ${cmsTypeIds}`);
                }
                catch (cmsError) {
                    logger.error(`[API_SITES] Error fetching details for CMS types: ${cmsTypeIds.join(', ')}`, cmsError);
                    populatedContentTypes = siteContentTypes.map(id => ({ id, name: 'Error', label: 'Error - CMS Type lookup failed' }));
                }
            }
        }
        const response = {
            ...siteData,
            ownerId: siteData.owner_id,
            createdAt: siteData.createdAt?.toISOString(),
            updatedAt: siteData.updatedAt?.toISOString(),
            state: siteData.status,
            content_types: populatedContentTypes,
        };
        logger.info(`[API_SITES] Found site: ${response.name}`);
        return res.status(200).json(response);
    }
    catch (error) {
        logger.error(`[API_SITES] Error fetching site:`, error);
        return res.status(500).json({ message: 'Error fetching site from database', details: error.message });
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
        logger.info("=== Site Creation Request ===");
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        logger.info("[API_SITES] Parsed body for site creation:", body);
        const validationResult = createSiteSchema.safeParse(body);
        if (!validationResult.success) {
            logger.error("[API_SITES] Validation failed:", validationResult.error.flatten().fieldErrors);
            return res.status(400).json({
                message: 'Invalid site data.',
                errors: { fieldErrors: validationResult.error.flatten().fieldErrors },
            });
        }
        const payload = validationResult.data;
        logger.info("[API_SITES] Validated payload:", payload);
        const currentUserId = "49a44198-e6e5-4b1e-b8fb-b1c50ee0639d"; // Placeholder
        // Ensure this user exists in your 'users' table locally and in Supabase
        // const userExists = await db.query.users.findFirst({ where: eq(users.id, currentUserId) });
        // if (!userExists) {
        //   logger.error(`[API_SITES] Critical: Owner/Creator user with ID ${currentUserId} does not exist.`);
        //   return res.status(500).json({ message: 'Site owner record not found.' });
        // }
        if (payload.subdomain) {
            const existingSiteWithSubdomain = await db.query.sites.findFirst({
                where: eq(sites.subdomain, payload.subdomain),
            });
            if (existingSiteWithSubdomain) {
                logger.warn(`[API_SITES] Conflict: Subdomain '${payload.subdomain}' already exists.`);
                return res.status(409).json({ message: 'This subdomain is already taken.', errors: { fieldErrors: { subdomain: ['This subdomain is already taken.'] } } });
            }
        }
        const logoUrl = payload.selectedLogo || null;
        const brandColor = payload.selectedColor || null;
        const contentTypeIds = payload.selectedContentTypes || []; // Default to empty array if undefined
        logger.info("[API_SITES] Processed content type IDs for site storage:", contentTypeIds);
        const siteValues = {
            name: payload.name,
            subdomain: payload.subdomain,
            owner_id: currentUserId,
            status: 'active',
            logo_url: logoUrl,
            brand_color: brandColor,
            content_types: contentTypeIds,
            plan: 'lite',
            // space_ids will be updated later
        };
        const siteInsertResult = await db
            .insert(sites)
            .values(siteValues)
            .returning();
        if (!siteInsertResult || siteInsertResult.length === 0) {
            throw new Error('Failed to create the site record in the database.');
        }
        const newDbSite = siteInsertResult[0];
        const createdSiteId = newDbSite.id;
        logger.info('[API_SITES] Site record created successfully:', { id: newDbSite.id, name: newDbSite.name, subdomain: newDbSite.subdomain });
        await db.insert(memberships).values({
            userId: currentUserId,
            siteId: createdSiteId,
            role: 'admin',
        });
        logger.info(`[API_SITES] User ${currentUserId} added as admin to site ${createdSiteId}`);
        let createdSpaceIds = [];
        if (contentTypeIds.length > 0) {
            const cmsTypeDetails = await db.select({
                id: cms_types.id,
                name: cms_types.name, // This is the slug (e.g., "ideas-wishlist")
                label: cms_types.label, // This is the display name (e.g., "Ideas & Wishlist")
                description: cms_types.description
            }).from(cms_types).where(sql `${cms_types.id} IN ${contentTypeIds}`);
            logger.info(`[API_SITES] Found ${cmsTypeDetails.length} CMS types for creating default spaces.`);
            for (const cmsType of cmsTypeDetails) {
                logger.info(`[API_SITES] Processing CMS Type for default space - ID: ${cmsType.id}, Name (for slug): ${cmsType.name}, Label (for space name): ${cmsType.label}`);
                const spaceName = cmsType.label;
                const spaceSlug = cmsType.name;
                if (!spaceName || typeof spaceName !== 'string' || spaceName.trim() === '') {
                    logger.error(`[API_SITES] Critical error: CMS Type ${cmsType.id} (${cmsType.name}) has an invalid or missing label: '${cmsType.label}'. Skipping space creation.`);
                    continue;
                }
                if (!spaceSlug || typeof spaceSlug !== 'string' || spaceSlug.trim() === '') {
                    logger.error(`[API_SITES] Critical error: CMS Type ${cmsType.id} (${cmsType.label}) has an invalid or missing name (slug): '${cmsType.name}'. Skipping space creation.`);
                    continue;
                }
                const spaceData = {
                    name: spaceName,
                    slug: spaceSlug,
                    description: cmsType.description || `${spaceName} space`,
                    site_id: createdSiteId,
                    creator_id: currentUserId,
                    visibility: 'public',
                    cms_type: cmsType.id,
                    hidden: false,
                };
                logger.info(`[API_SITES] Attempting to create space in database with data:`, spaceData);
                try {
                    const spaceInsertResult = await db.insert(spaces).values(spaceData).returning({ id: spaces.id });
                    if (spaceInsertResult && spaceInsertResult.length > 0 && spaceInsertResult[0].id) {
                        createdSpaceIds.push(spaceInsertResult[0].id);
                        logger.info(`[API_SITES] Space '${spaceData.name}' created successfully with ID: ${spaceInsertResult[0].id}`);
                    }
                    else {
                        logger.error(`[API_SITES] Space creation for CMS Type ${cmsType.name} returned empty or invalid result:`, spaceInsertResult);
                    }
                }
                catch (spaceCreationError) {
                    logger.error(`[API_SITES] Error creating default space for CMS Type ${cmsType.name} (ID: ${cmsType.id}):`, spaceCreationError);
                }
            }
            if (createdSpaceIds.length > 0) {
                logger.info(`[API_SITES] Updating site ${createdSiteId} with space IDs: ${createdSpaceIds.join(', ')}`);
                await db.update(sites).set({ space_ids: createdSpaceIds }).where(eq(sites.id, createdSiteId));
                newDbSite.space_ids = createdSpaceIds;
                logger.info(`[API_SITES] Site ${createdSiteId} updated with space_ids.`);
            }
        }
        const responseSite = {
            ...newDbSite,
            ownerId: newDbSite.owner_id,
            createdAt: newDbSite.createdAt?.toISOString(),
            updatedAt: newDbSite.updatedAt?.toISOString(),
            state: newDbSite.status,
            space_ids: newDbSite.space_ids || []
        };
        return res.status(201).json(responseSite);
    }
    catch (error) {
        logger.error('[API_SITES] Error during site creation process:', error);
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
// Get spaces for a site (Updated to handle siteId or subdomain and populate cmsType details)
router.get('/:siteId/spaces', async (req, res) => {
    try {
        const { siteId } = req.params;
        logger.info(`[API_SITES_SPACES] Fetching spaces for site identifier: ${siteId}`);
        const isSiteUUID = uuidRegex.test(siteId);
        let actualSiteId = siteId;
        if (!isSiteUUID) {
            const siteBySubdomain = await db.query.sites.findFirst({
                where: eq(sites.subdomain, siteId),
                columns: { id: true }
            });
            if (!siteBySubdomain) {
                logger.warn(`[API_SITES_SPACES] Site not found with subdomain: ${siteId}`);
                return res.status(404).json({ message: 'Site not found by subdomain' });
            }
            actualSiteId = siteBySubdomain.id;
            logger.info(`[API_SITES_SPACES] Found site ID ${actualSiteId} for subdomain ${siteId}`);
        }
        else {
            // If it is a UUID, verify the site exists
            const siteExists = await db.query.sites.findFirst({
                where: eq(sites.id, actualSiteId),
                columns: { id: true }
            });
            if (!siteExists) {
                logger.warn(`[API_SITES_SPACES] Site not found with UUID: ${actualSiteId}`);
                return res.status(404).json({ message: 'Site not found by UUID' });
            }
        }
        const siteSpacesWithDetails = await db
            .select({
            space_id: spaces.id,
            space_name: spaces.name,
            space_slug: spaces.slug,
            space_description: spaces.description,
            space_visibility: spaces.visibility,
            space_hidden: spaces.hidden,
            space_site_id: spaces.site_id,
            space_creator_id: spaces.creator_id,
            space_created_at: spaces.created_at,
            space_updated_at: spaces.updated_at,
            cms_type_id: cms_types.id,
            cms_type_name_slug: cms_types.name, // Renamed to avoid conflict with space.name
            cms_type_label_text: cms_types.label, // Renamed to avoid conflict
            cms_type_icon: cms_types.icon_name,
            cms_type_color: cms_types.color,
        })
            .from(spaces)
            .leftJoin(cms_types, eq(spaces.cms_type, cms_types.id))
            .where(eq(spaces.site_id, actualSiteId));
        logger.info(`[API_SITES_SPACES] Found ${siteSpacesWithDetails.length} spaces for site ${actualSiteId}`);
        const formattedSpaces = siteSpacesWithDetails.map(s => ({
            id: s.space_id,
            name: s.space_name,
            slug: s.space_slug,
            description: s.space_description,
            visibility: s.space_visibility,
            hidden: s.space_hidden,
            site_id: s.space_site_id,
            creator_id: s.space_creator_id,
            created_at: s.space_created_at,
            updated_at: s.space_updated_at,
            cms_type: s.cms_type_id,
            cms_type_name: s.cms_type_name_slug, // Use the aliased name
            cms_type_label: s.cms_type_label_text, // Use the aliased label
            cms_type_icon: s.cms_type_icon,
            cms_type_color: s.cms_type_color,
        }));
        return res.status(200).json(formattedSpaces);
    }
    catch (error) {
        logger.error('[API_SITES_SPACES] Error fetching spaces:', error);
        return res.status(500).json({ message: 'Failed to fetch spaces', details: error.message });
    }
});
export default router;
