import express from 'express';
import { db } from '../db/index.js';
import { sites, memberships } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { setApiResponseHeaders, handleCorsPreflightRequest } from '../utils/environment.js';
import { fetchBrandData } from '../utils/brandfetch.js';
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
            state: sites.state,
            status: sites.status,
        })
            .from(sites)
            .innerJoin(memberships, eq(memberships.siteId, sites.id))
            .where(eq(memberships.userId, currentUserId));
        return res.status(200).json(userSites);
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
            state: sites.state,
            status: sites.status,
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
                state: sites.state,
                status: sites.status,
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
        console.log(`Found site:`, site);
        return res.status(200).json(site);
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
        // Handle both string and object body formats (for Vercel compatibility)
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const validationResult = createSiteSchema.safeParse(body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Invalid site data.',
                errors: { fieldErrors: validationResult.error.flatten().fieldErrors },
            });
        }
        const payload = validationResult.data;
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
        let contentTypes = payload.selectedContentTypes || [];
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
            state: 'pending',
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
            state: 'pending', // Default state for new sites
            logo_url: logoUrl,
            brand_color: brandColor,
            content_types: contentTypes.length > 0 ? contentTypes : undefined,
        })
            .returning({
            id: sites.id,
            name: sites.name,
            subdomain: sites.subdomain,
            ownerId: sites.owner_id,
            createdAt: sites.createdAt,
            updatedAt: sites.updatedAt,
            state: sites.state,
            status: sites.status,
            logo_url: sites.logo_url,
            brand_color: sites.brand_color,
            content_types: sites.content_types,
        });
        if (!siteInsertResult || siteInsertResult.length === 0) {
            throw new Error('Failed to create the site record in the database.');
        }
        const newSite = siteInsertResult[0];
        console.log('Site created successfully:', newSite);
        // Automatically add the creator as an admin member of the new site
        await db.insert(memberships).values({
            userId: currentUserId,
            siteId: newSite.id,
            role: 'admin', // Assigning 'admin' role to the creator
        });
        console.log(`User ${currentUserId} added as admin to site ${newSite.id}`);
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
export default router;
