import express from 'express';
import { db } from '../db/index.js';
import { posts, post_tags, tags, users, spaces } from '../db/schema.js';
import { eq, and, inArray, desc } from 'drizzle-orm';
import { z } from 'zod';
import { setApiResponseHeaders, handleCorsPreflightRequest } from '../utils/environment.js';
const router = express.Router();
// Zod schema for post creation/update
const postSchema = z.object({
    title: z.string().min(1, { message: 'Title is required.' }),
    content: z.string().min(1, { message: 'Content is required.' }),
    status: z.enum(['draft', 'published', 'archived', 'scheduled', 'pending_review']),
    author_id: z.string().uuid().optional(),
    space_id: z.string().uuid().optional(),
    published_at: z.string().datetime().optional(),
    cms_type: z.string(),
    site_id: z.string().uuid(),
    locked: z.boolean().optional(),
    hidden: z.boolean().optional(),
    tags: z.array(z.string().uuid()).optional(),
});
// Apply CORS headers and handle OPTIONS requests for all routes
router.use((req, res, next) => {
    setApiResponseHeaders(res);
    if (handleCorsPreflightRequest(req, res))
        return;
    next();
});
// Get all posts for a site
router.get('/site/:siteId', async (req, res) => {
    try {
        const { siteId } = req.params;
        const { cmsType, status, spaceId, authorId, limit = '50', offset = '0' } = req.query;
        if (!siteId) {
            return res.status(400).json({ message: 'Site ID is required.' });
        }
        // Build the where conditions - start with the required site condition
        const conditions = [eq(posts.site_id, siteId)];
        // Add optional filters
        if (cmsType && typeof cmsType === 'string') {
            conditions.push(eq(posts.cms_type, cmsType));
        }
        if (status && typeof status === 'string') {
            // Only add if status is a valid enum value
            if (['draft', 'published', 'archived', 'scheduled', 'pending_review'].includes(status)) {
                conditions.push(eq(posts.status, status));
            }
        }
        if (spaceId && typeof spaceId === 'string') {
            conditions.push(eq(posts.space_id, spaceId));
        }
        if (authorId && typeof authorId === 'string') {
            conditions.push(eq(posts.author_id, authorId));
        }
        // Combine all conditions with AND
        const whereCondition = conditions.length > 1
            ? and(...conditions)
            : conditions[0];
        // Execute the query with all conditions
        const result = await db.select({
            id: posts.id,
            title: posts.title,
            content: posts.content,
            status: posts.status,
            author_id: posts.author_id,
            space_id: posts.space_id,
            published_at: posts.published_at,
            created_at: posts.created_at,
            updated_at: posts.updated_at,
            cms_type: posts.cms_type,
            site_id: posts.site_id,
            locked: posts.locked,
            hidden: posts.hidden,
        })
            .from(posts)
            .where(whereCondition)
            .orderBy(desc(posts.created_at))
            .limit(Number(limit))
            .offset(Number(offset));
        return res.status(200).json(result);
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ message: 'Error fetching posts from database' });
    }
});
// Get a single post by ID
router.get('/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required.' });
        }
        // Get post data
        const post = await db.query.posts.findFirst({
            where: eq(posts.id, postId),
        });
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        // Get related tags
        const postTags = await db
            .select({
            id: tags.id,
            name: tags.name,
            color: tags.color,
            icon: tags.icon,
        })
            .from(tags)
            .innerJoin(post_tags, eq(post_tags.tag_id, tags.id))
            .where(eq(post_tags.post_id, postId));
        // Get author information if available
        let author = null;
        if (post.author_id) {
            author = await db.query.users.findFirst({
                where: eq(users.id, post.author_id),
                columns: {
                    id: true,
                    username: true,
                    full_name: true,
                    avatar_url: true,
                },
            });
        }
        // Get space information if available
        let space = null;
        if (post.space_id) {
            space = await db.query.spaces.findFirst({
                where: eq(spaces.id, post.space_id),
                columns: {
                    id: true,
                    name: true,
                    icon_url: true,
                },
            });
        }
        // Return post with related data
        return res.status(200).json({
            ...post,
            tags: postTags,
            author,
            space,
        });
    }
    catch (error) {
        console.error('Error fetching post:', error);
        return res.status(500).json({ message: 'Error fetching post from database' });
    }
});
// Create a new post
router.post('/', async (req, res) => {
    try {
        // Handle both string and object body formats (for Vercel compatibility)
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const validationResult = postSchema.safeParse(body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Invalid post data.',
                errors: { fieldErrors: validationResult.error.flatten().fieldErrors },
            });
        }
        const payload = validationResult.data;
        // Begin transaction
        const result = await db.transaction(async (tx) => {
            // Create the post
            const postResult = await tx
                .insert(posts)
                .values({
                title: payload.title,
                content: payload.content,
                status: payload.status,
                author_id: payload.author_id,
                space_id: payload.space_id,
                published_at: payload.published_at ? new Date(payload.published_at) : undefined,
                cms_type: payload.cms_type,
                site_id: payload.site_id,
                locked: payload.locked,
                hidden: payload.hidden,
            })
                .returning();
            // If there are tags, add them to post_tags
            if (payload.tags && payload.tags.length > 0 && postResult.length > 0) {
                const postId = postResult[0].id;
                // Verify that all tag IDs exist
                const existingTags = await tx
                    .select({ id: tags.id })
                    .from(tags)
                    .where(and(inArray(tags.id, payload.tags), eq(tags.site_id, payload.site_id)));
                const validTagIds = existingTags.map(tag => tag.id);
                // Insert valid tag relationships
                if (validTagIds.length > 0) {
                    await Promise.all(validTagIds.map(tagId => tx.insert(post_tags).values({
                        post_id: postId,
                        tag_id: tagId,
                    })));
                }
            }
            return postResult;
        });
        if (!result || result.length === 0) {
            throw new Error('Failed to create post in database.');
        }
        return res.status(201).json(result[0]);
    }
    catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({
            message: 'Error creating post in database',
            details: error.message || 'Unknown error',
        });
    }
});
// Update an existing post
router.put('/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required.' });
        }
        // Handle both string and object body formats (for Vercel compatibility)
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const validationResult = postSchema.partial().safeParse(body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Invalid post data.',
                errors: { fieldErrors: validationResult.error.flatten().fieldErrors },
            });
        }
        const payload = validationResult.data;
        // Verify the post exists
        const existingPost = await db.query.posts.findFirst({
            where: eq(posts.id, postId),
        });
        if (!existingPost) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        // Begin transaction
        const result = await db.transaction(async (tx) => {
            // Update the post
            const updateData = {};
            if (payload.title !== undefined)
                updateData.title = payload.title;
            if (payload.content !== undefined)
                updateData.content = payload.content;
            if (payload.status !== undefined)
                updateData.status = payload.status;
            if (payload.author_id !== undefined)
                updateData.author_id = payload.author_id;
            if (payload.space_id !== undefined)
                updateData.space_id = payload.space_id;
            if (payload.published_at !== undefined)
                updateData.published_at = new Date(payload.published_at);
            if (payload.locked !== undefined)
                updateData.locked = payload.locked;
            if (payload.hidden !== undefined)
                updateData.hidden = payload.hidden;
            // Always update the 'updated_at' field
            updateData.updated_at = new Date();
            const postResult = await tx
                .update(posts)
                .set(updateData)
                .where(eq(posts.id, postId))
                .returning();
            // Update tags if they were provided
            if (payload.tags !== undefined) {
                // Remove existing tag relationships
                await tx
                    .delete(post_tags)
                    .where(eq(post_tags.post_id, postId));
                // Add new tag relationships
                if (payload.tags.length > 0) {
                    // Verify that all tag IDs exist
                    const existingTags = await tx
                        .select({ id: tags.id })
                        .from(tags)
                        .where(and(inArray(tags.id, payload.tags), eq(tags.site_id, existingPost.site_id)));
                    const validTagIds = existingTags.map(tag => tag.id);
                    // Insert valid tag relationships
                    if (validTagIds.length > 0) {
                        await Promise.all(validTagIds.map(tagId => tx.insert(post_tags).values({
                            post_id: postId,
                            tag_id: tagId,
                        })));
                    }
                }
            }
            return postResult;
        });
        if (!result || result.length === 0) {
            throw new Error('Failed to update post in database.');
        }
        return res.status(200).json(result[0]);
    }
    catch (error) {
        console.error('Error updating post:', error);
        return res.status(500).json({
            message: 'Error updating post in database',
            details: error.message || 'Unknown error',
        });
    }
});
// Delete a post
router.delete('/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required.' });
        }
        // Verify the post exists
        const existingPost = await db.query.posts.findFirst({
            where: eq(posts.id, postId),
        });
        if (!existingPost) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        // Begin transaction
        await db.transaction(async (tx) => {
            // Delete tag relationships first
            await tx
                .delete(post_tags)
                .where(eq(post_tags.post_id, postId));
            // Delete the post itself
            await tx
                .delete(posts)
                .where(eq(posts.id, postId));
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({
            message: 'Error deleting post from database',
            details: error.message || 'Unknown error',
        });
    }
});
export default router;
