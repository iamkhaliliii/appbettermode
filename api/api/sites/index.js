"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../../db/index");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
const router = express_1.default.Router();
// Zod schema for site creation
const createSiteSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, { message: 'Site name must be at least 2 characters.' }),
    subdomain: zod_1.z.string()
        .min(3, { message: 'Subdomain must be at least 3 characters.' })
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Subdomain can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.',
    })
        .optional(),
});
// Get all sites for the current user
router.get('/', async (req, res) => {
    try {
        // TODO: Replace with actual authenticated user ID from req.user
        const currentUserId = "49a44198-e6e5-4b1e-b8fb-b1c50ee0639d"; // Placeholder
        if (!currentUserId) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }
        const userSites = await index_1.db
            .select({
            id: schema_1.sites.id,
            name: schema_1.sites.name,
            subdomain: schema_1.sites.subdomain,
            ownerId: schema_1.sites.owner_id,
            role: schema_1.memberships.role,
            createdAt: schema_1.sites.createdAt,
            updatedAt: schema_1.sites.updatedAt,
            state: schema_1.sites.state,
            status: schema_1.sites.status,
        })
            .from(schema_1.sites)
            .innerJoin(schema_1.memberships, (0, drizzle_orm_1.eq)(schema_1.memberships.siteId, schema_1.sites.id))
            .where((0, drizzle_orm_1.eq)(schema_1.memberships.userId, currentUserId));
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
        let site = await index_1.db
            .select({
            id: schema_1.sites.id,
            name: schema_1.sites.name,
            subdomain: schema_1.sites.subdomain,
            ownerId: schema_1.sites.owner_id,
            createdAt: schema_1.sites.createdAt,
            updatedAt: schema_1.sites.updatedAt,
            state: schema_1.sites.state,
            status: schema_1.sites.status,
        })
            .from(schema_1.sites)
            .where((0, drizzle_orm_1.eq)(schema_1.sites.subdomain, identifier))
            .limit(1)
            .then(results => results[0] || null);
        // If not found by subdomain, try UUID (if it looks like a UUID)
        if (!site && identifier.includes('-') && identifier.length > 30) {
            console.log(`Not found by subdomain, trying UUID: ${identifier}`);
            site = await index_1.db
                .select({
                id: schema_1.sites.id,
                name: schema_1.sites.name,
                subdomain: schema_1.sites.subdomain,
                ownerId: schema_1.sites.owner_id,
                createdAt: schema_1.sites.createdAt,
                updatedAt: schema_1.sites.updatedAt,
                state: schema_1.sites.state,
                status: schema_1.sites.status,
            })
                .from(schema_1.sites)
                .where((0, drizzle_orm_1.eq)(schema_1.sites.id, identifier))
                .limit(1)
                .then(results => results[0] || null);
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
// Create a new site
router.post('/', async (req, res) => {
    try {
        const validationResult = createSiteSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Invalid site data.',
                errors: validationResult.error.flatten().fieldErrors,
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
            const existingSiteWithSubdomain = await index_1.db.query.sites.findFirst({
                where: (0, drizzle_orm_1.eq)(schema_1.sites.subdomain, payload.subdomain),
            });
            if (existingSiteWithSubdomain) {
                return res.status(409).json({ message: 'Subdomain is already taken.' });
            }
        }
        // Skip transaction, create only the site without membership
        console.log('Creating site with data:', {
            name: payload.name,
            subdomain: payload.subdomain,
            ownerId: currentUserId,
            state: 'pending'
        });
        const siteInsertResult = await index_1.db
            .insert(schema_1.sites)
            .values({
            name: payload.name,
            subdomain: payload.subdomain,
            owner_id: currentUserId,
            state: 'pending', // Default state for new sites
        })
            .returning({
            id: schema_1.sites.id,
            name: schema_1.sites.name,
            subdomain: schema_1.sites.subdomain,
            ownerId: schema_1.sites.owner_id, // CORRECTED: Use DB column name (sites.owner_id) for value, but key is 'ownerId'
            createdAt: schema_1.sites.createdAt,
            updatedAt: schema_1.sites.updatedAt,
            state: schema_1.sites.state,
            status: schema_1.sites.status,
        });
        if (!siteInsertResult || siteInsertResult.length === 0) {
            throw new Error('Failed to create the site record in the database.');
        }
        const newSite = siteInsertResult[0];
        console.log('Site created successfully:', newSite);
        // Automatically add the creator as an admin member of the new site
        await index_1.db.insert(schema_1.memberships).values({
            userId: currentUserId,
            siteId: newSite.id, // newSite.id should be the UUID of the newly created site
            role: 'admin', // Assigning 'admin' role to the creator
            // joined_at will be set by default (defaultNow() in schema)
        });
        console.log(`User ${currentUserId} added as admin to site ${newSite.id}`);
        return res.status(201).json(newSite);
    }
    catch (error) {
        console.error('Error creating site:', error);
        // Add more detailed error information
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
        const sitesColumns = await index_1.db.execute(`SELECT column_name, data_type, is_nullable 
       FROM information_schema.columns 
       WHERE table_name = 'sites'
       ORDER BY ordinal_position`);
        // Get column information for memberships table
        const membershipsColumns = await index_1.db.execute(`SELECT column_name, data_type, is_nullable 
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
exports.default = router;
