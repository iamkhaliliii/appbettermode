import express from 'express';
import { db } from '../db/index.js';
import { cms_types } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { setApiResponseHeaders, handleCorsPreflightRequest } from '../utils/environment.js';
const router = express.Router();
// Zod schema for CMS type creation/update
const cmsTypeSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    description: z.string().optional(),
    color: z.string().optional(),
    icon_name: z.string().optional(),
    favorite: z.boolean().optional(),
    type: z.enum(['official', 'custom']).optional(),
    fields: z.array(z.object({
        key: z.string().min(1),
        label: z.string().min(1),
        type: z.string().min(1),
        placeholder: z.string().optional(),
        options: z.array(z.object({
            value: z.string(),
            label: z.string()
        })).optional()
    }))
});
// Apply CORS headers and handle OPTIONS requests for all routes
router.use((req, res, next) => {
    setApiResponseHeaders(res);
    if (handleCorsPreflightRequest(req, res))
        return;
    next();
});
// Get all CMS types
router.get('/', async (req, res) => {
    try {
        const result = await db.select().from(cms_types);
        return res.status(200).json(result);
    }
    catch (error) {
        console.error('Error fetching CMS types:', error);
        return res.status(500).json({ message: 'Error fetching CMS types from database' });
    }
});
// Get all favorite CMS types
router.get('/favorites', async (req, res) => {
    try {
        // Temporary fix: Handle missing columns in production
        try {
            const result = await db.select().from(cms_types).where(eq(cms_types.favorite, true));
            return res.status(200).json(result);
        } catch (dbError) {
            // If column doesn't exist error, return default favorites
            if (dbError.code === '42703') {
                console.warn('Warning: favorite column is missing in cms_types table. Returning default favorites.');
                // Return basic query and filter by name
                const result = await db.select({
                    id: cms_types.id,
                    name: cms_types.name,
                    fields: cms_types.fields
                }).from(cms_types);
                
                // Default favorite types
                const favoriteTypes = ['discussion', 'event'];
                const favorites = result.filter(r => favoriteTypes.includes(r.name));
                
                // Add mock data for missing fields
                const enrichedFavorites = favorites.map(fav => ({
                    ...fav,
                    description: `Create ${fav.name} content`,
                    color: fav.name === 'discussion' ? '#3b82f6' : '#10b981',
                    icon_name: fav.name === 'discussion' ? 'message-circle' : 'calendar',
                    favorite: true,
                    type: 'official'
                }));
                
                return res.status(200).json(enrichedFavorites);
            }
            throw dbError;
        }
    }
    catch (error) {
        console.error('Error fetching favorite CMS types:', error);
        return res.status(500).json({ message: 'Error fetching favorite CMS types from database' });
    }
});
// Get all CMS types by type (official/custom)
router.get('/category/:type', async (req, res) => {
    try {
        const { type } = req.params;
        if (!type || !['official', 'custom'].includes(type)) {
            return res.status(400).json({ message: 'Invalid CMS type category. Must be "official" or "custom".' });
        }
        
        // Temporary fix: Handle missing columns in production
        try {
            // Cast type to the enum type
            const categoryType = type;
            const result = await db.select().from(cms_types).where(eq(cms_types.type, categoryType));
            return res.status(200).json(result);
        } catch (dbError) {
            // If column doesn't exist error, return all cms_types for 'official' type
            if (dbError.code === '42703') {
                console.warn('Warning: Some columns are missing in cms_types table. Returning basic data.');
                // Return basic query without type filter
                const result = await db.select({
                    id: cms_types.id,
                    name: cms_types.name,
                    fields: cms_types.fields
                }).from(cms_types);
                
                // For official type, return some predefined types
                if (type === 'official') {
                    const officialTypes = ['discussion', 'event', 'qa', 'blog', 'knowledge', 'wishlist', 'jobs'];
                    return res.status(200).json(result.filter(r => officialTypes.includes(r.name)));
                }
                
                return res.status(200).json(result);
            }
            throw dbError;
        }
    }
    catch (error) {
        console.error('Error fetching CMS types by category:', error);
        return res.status(500).json({ message: 'Error fetching CMS types from database' });
    }
});
// Get a single CMS type by name
router.get('/name/:name', async (req, res) => {
    try {
        const { name } = req.params;
        if (!name) {
            return res.status(400).json({ message: 'CMS type name is required' });
        }
        const result = await db.select().from(cms_types).where(eq(cms_types.name, name));
        if (result.length === 0) {
            return res.status(404).json({ message: 'CMS type not found' });
        }
        return res.status(200).json(result[0]);
    }
    catch (error) {
        console.error('Error fetching CMS type by name:', error);
        return res.status(500).json({ message: 'Error fetching CMS type from database' });
    }
});
// Get a single CMS type by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[DEBUG] Fetching CMS type with ID: ${id}`);
        if (!id) {
            console.log(`[DEBUG] CMS type ID is missing`);
            return res.status(400).json({ message: 'CMS type ID is required' });
        }
        const result = await db.select().from(cms_types).where(eq(cms_types.id, id));
        console.log(`[DEBUG] CMS type query result:`, result);
        if (result.length === 0) {
            console.log(`[DEBUG] CMS type not found with ID: ${id}`);
            return res.status(404).json({ message: 'CMS type not found' });
        }
        console.log(`[DEBUG] Returning CMS type:`, result[0]);
        return res.status(200).json(result[0]);
    }
    catch (error) {
        console.error('Error fetching CMS type:', error);
        return res.status(500).json({ message: 'Error fetching CMS type from database' });
    }
});
// Create a new CMS type
router.post('/', async (req, res) => {
    try {
        // Handle both string and object body formats (for Vercel compatibility)
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const validationResult = cmsTypeSchema.safeParse(body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Invalid CMS type data',
                errors: { fieldErrors: validationResult.error.flatten().fieldErrors },
            });
        }
        const { name, description, color, icon_name, favorite, type, fields } = validationResult.data;
        // Check if the name already exists
        const existingType = await db.select().from(cms_types).where(eq(cms_types.name, name));
        if (existingType.length > 0) {
            return res.status(409).json({ message: 'A CMS type with this name already exists' });
        }
        // Create the new CMS type
        const result = await db.insert(cms_types).values({
            name,
            description,
            color,
            icon_name,
            favorite,
            type: type,
            fields: fields,
        }).returning();
        return res.status(201).json(result[0]);
    }
    catch (error) {
        console.error('Error creating CMS type:', error);
        return res.status(500).json({
            message: 'Error creating CMS type in database',
            details: error.message || 'Unknown error',
        });
    }
});
// Toggle favorite status
router.patch('/:id/toggle-favorite', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'CMS type ID is required' });
        }
        // Get current status
        const existingType = await db.select({ favorite: cms_types.favorite }).from(cms_types).where(eq(cms_types.id, id));
        if (existingType.length === 0) {
            return res.status(404).json({ message: 'CMS type not found' });
        }
        const currentFavorite = existingType[0].favorite;
        // Toggle the favorite status
        const result = await db.update(cms_types)
            .set({ favorite: !currentFavorite })
            .where(eq(cms_types.id, id))
            .returning();
        return res.status(200).json(result[0]);
    }
    catch (error) {
        console.error('Error toggling favorite status:', error);
        return res.status(500).json({
            message: 'Error updating CMS type in database',
            details: error.message || 'Unknown error',
        });
    }
});
// Update an existing CMS type
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'CMS type ID is required' });
        }
        // Handle both string and object body formats (for Vercel compatibility)
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const validationResult = cmsTypeSchema.partial().safeParse(body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Invalid CMS type data',
                errors: { fieldErrors: validationResult.error.flatten().fieldErrors },
            });
        }
        // Check if the CMS type exists
        const existingType = await db.select().from(cms_types).where(eq(cms_types.id, id));
        if (existingType.length === 0) {
            return res.status(404).json({ message: 'CMS type not found' });
        }
        // Prepare update data
        const updateData = {};
        if (body.name !== undefined)
            updateData.name = body.name;
        if (body.description !== undefined)
            updateData.description = body.description;
        if (body.color !== undefined)
            updateData.color = body.color;
        if (body.icon_name !== undefined)
            updateData.icon_name = body.icon_name;
        if (body.favorite !== undefined)
            updateData.favorite = body.favorite;
        if (body.type !== undefined)
            updateData.type = body.type;
        if (body.fields !== undefined)
            updateData.fields = body.fields;
        // Update the CMS type
        const result = await db.update(cms_types)
            .set(updateData)
            .where(eq(cms_types.id, id))
            .returning();
        return res.status(200).json(result[0]);
    }
    catch (error) {
        console.error('Error updating CMS type:', error);
        return res.status(500).json({
            message: 'Error updating CMS type in database',
            details: error.message || 'Unknown error',
        });
    }
});
// Delete a CMS type
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'CMS type ID is required' });
        }
        // Check if the CMS type exists
        const existingType = await db.select().from(cms_types).where(eq(cms_types.id, id));
        if (existingType.length === 0) {
            return res.status(404).json({ message: 'CMS type not found' });
        }
        // Delete the CMS type
        await db.delete(cms_types).where(eq(cms_types.id, id));
        return res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting CMS type:', error);
        return res.status(500).json({
            message: 'Error deleting CMS type from database',
            details: error.message || 'Unknown error',
        });
    }
});
export default router;
