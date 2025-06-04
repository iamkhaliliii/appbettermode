import express from 'express';
import { db } from '../db/index.js';
import { posts, post_tags, tags, users, spaces, sites } from '../db/schema.js';
import { eq, and, inArray, desc, sql } from 'drizzle-orm';
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
    cover_image_url: z.string().optional(),
    tags: z.array(z.string().uuid()).optional(),
    other_properties: z.record(z.any()).optional(),
});
// Apply CORS headers and handle OPTIONS requests for all routes
router.use((req, res, next) => {
    setApiResponseHeaders(res);
    if (handleCorsPreflightRequest(req, res))
        return;
    next();
});
// Debug endpoint to check post types
router.get('/debug/types', async (req, res) => {
    try {
        // Get distinct cms_type values and count for each
        const result = await db.execute(sql `
      SELECT cms_type, COUNT(*) as count 
      FROM posts 
      GROUP BY cms_type 
      ORDER BY count DESC
    `);
        // Log the result
        console.log('Debug - Post types in database:', result.rows);
        return res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error fetching post types:', error);
        return res.status(500).json({ message: 'Error fetching post types from database' });
    }
});
// Debug endpoint to check all discussion posts
router.get('/debug/discussions', async (req, res) => {
    try {
        // Get all discussion posts with their spaces
        const result = await db.select({
            id: posts.id,
            title: posts.title,
            cms_type: posts.cms_type,
            status: posts.status,
            space_id: posts.space_id,
            site_id: posts.site_id,
            created_at: posts.created_at,
            other_properties: posts.other_properties,
        })
            .from(posts)
            .where(eq(posts.cms_type, 'discussion'))
            .orderBy(desc(posts.created_at));
        // For each post, get space info
        const postsWithSpaceInfo = await Promise.all(result.map(async (post) => {
            let spaceName = 'Unknown';
            let spaceSlug = 'unknown';
            let spaceCmsType = 'unknown';
            if (post.space_id) {
                const spaceInfo = await db.select({
                    name: spaces.name,
                    slug: spaces.slug,
                    cms_type: spaces.cms_type
                })
                    .from(spaces)
                    .where(eq(spaces.id, post.space_id))
                    .limit(1);
                if (spaceInfo.length > 0) {
                    spaceName = spaceInfo[0].name;
                    spaceSlug = spaceInfo[0].slug;
                    spaceCmsType = spaceInfo[0].cms_type || 'unknown';
                }
            }
            return {
                ...post,
                space_name: spaceName,
                space_slug: spaceSlug,
                space_cms_type: spaceCmsType
            };
        }));
        console.log('Debug - All discussion posts:', postsWithSpaceInfo);
        return res.status(200).json(postsWithSpaceInfo);
    }
    catch (error) {
        console.error('Error fetching discussion posts:', error);
        return res.status(500).json({ message: 'Error fetching discussion posts from database' });
    }
});
// Endpoint to fix discussion posts by moving them to the correct space
router.get('/fix-discussions', async (req, res) => {
    try {
        // Find all discussions posts
        const discussionPosts = await db.select()
            .from(posts)
            .where(eq(posts.cms_type, 'discussion'));
        console.log('Found discussion posts:', JSON.stringify(discussionPosts, null, 2));
        // Find the discussions space
        const discussionsSpaces = await db.select()
            .from(spaces)
            .where(eq(spaces.slug, 'discussions'));
        console.log('Found discussions spaces:', JSON.stringify(discussionsSpaces, null, 2));
        // Also query the specific space we're seeing in the UI
        const uiSpaceId = 'b6e92f3b-57fa-4525-ab22-9e3123a9c237';
        const uiSpace = await db.select()
            .from(spaces)
            .where(eq(spaces.id, uiSpaceId));
        console.log('UI Space:', JSON.stringify(uiSpace, null, 2));
        if (discussionPosts.length === 0) {
            return res.status(404).json({ message: 'No discussion posts found to fix' });
        }
        if (discussionsSpaces.length === 0) {
            return res.status(404).json({ message: 'No discussions space found' });
        }
        const correctSpaceId = discussionsSpaces[0].id;
        const spaceDetails = {
            discussionsSpaceId: correctSpaceId,
            uiSpaceId,
            match: correctSpaceId === uiSpaceId,
            postSpaceIds: discussionPosts.map(p => p.space_id)
        };
        console.log('Space comparison:', spaceDetails);
        // Move all discussion posts to the correct space
        const updateResults = await Promise.all(discussionPosts.map(async (post) => {
            // Skip posts that are already in the correct space
            if (post.space_id === uiSpaceId) {
                return { id: post.id, status: 'skipped', reason: 'already in correct space' };
            }
            // Update post to the correct space
            const result = await db.update(posts)
                .set({ space_id: uiSpaceId })
                .where(eq(posts.id, post.id))
                .returning();
            return {
                id: post.id,
                status: 'updated',
                old_space_id: post.space_id,
                new_space_id: uiSpaceId
            };
        }));
        return res.status(200).json({
            message: 'Discussion posts have been fixed',
            updates: updateResults,
            spaceDetails
        });
    }
    catch (error) {
        console.error('Error fixing discussion posts:', error);
        return res.status(500).json({ message: 'Error fixing discussion posts' });
    }
});
// Get all posts for a site
router.get('/site/:siteId', async (req, res) => {
    try {
        const { siteId } = req.params;
        const { cmsType, status, spaceId, authorId, limit = '50', offset = '0' } = req.query;
        // Log the request parameters for debugging
        console.log('Post request parameters:', { siteId, cmsType, status, spaceId, authorId });
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
            cover_image_url: posts.cover_image_url,
            other_properties: posts.other_properties,
        })
            .from(posts)
            .where(whereCondition)
            .orderBy(desc(posts.created_at))
            .limit(Number(limit))
            .offset(Number(offset));
        // Log the results for debugging
        console.log(`Found ${result.length} posts matching the criteria`);
        // For each post, fetch its tags
        const postsWithTags = await Promise.all(result.map(async (post) => {
            // Get related tags for this post
            const postTags = await db
                .select({
                id: tags.id,
                name: tags.name,
                icon: tags.icon,
            })
                .from(tags)
                .innerJoin(post_tags, eq(post_tags.tag_id, tags.id))
                .where(eq(post_tags.post_id, post.id));
            // Return post with tags included
            return {
                ...post,
                tags: postTags,
            };
        }));
        return res.status(200).json(postsWithTags);
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ message: 'Error fetching posts from database' });
    }
});
// Test mock endpoint
router.get('/mock-test', (req, res) => {
    res.json({ message: 'Mock test endpoint works!' });
});
// Mock content generation endpoint (GET for testing)
router.get('/mock/:siteIdentifier', async (req, res) => {
    try {
        const { siteIdentifier } = req.params;
        if (!siteIdentifier) {
            return res.status(400).json({ message: 'Site identifier is required' });
        }
        // Get site details by identifier (subdomain)
        const site = await db.query.sites.findFirst({
            where: eq(sites.subdomain, siteIdentifier),
            with: {
                owner: true
            }
        });
        if (!site) {
            return res.status(404).json({ message: 'Site not found' });
        }
        // Get all CMS types
        const cmsTypes = await db.query.cms_types.findMany();
        // Get all spaces for this site
        const siteSpaces = await db.query.spaces.findMany({
            where: eq(spaces.site_id, site.id)
        });
        // Mock data templates for each content type
        const mockTemplates = {
            'job-board': [
                {
                    title: 'Senior Frontend Developer',
                    content: { job_title: 'Senior Frontend Developer', job_description: 'We are looking for an experienced frontend developer to join our team and help build amazing user experiences.', job_location: 'Remote', apply_url: 'https://example.com/apply' }
                },
                {
                    title: 'Backend Engineer',
                    content: { job_title: 'Backend Engineer', job_description: 'Join our backend team to develop scalable APIs and services that power our platform.', job_location: 'San Francisco, CA', apply_url: 'https://example.com/apply' }
                },
                {
                    title: 'DevOps Engineer',
                    content: { job_title: 'DevOps Engineer', job_description: 'Help us build and maintain our cloud infrastructure and deployment pipelines.', job_location: 'New York, NY', apply_url: 'https://example.com/apply' }
                },
                {
                    title: 'Product Designer',
                    content: { job_title: 'Product Designer', job_description: 'Design beautiful and intuitive user interfaces for our web and mobile applications.', job_location: 'Remote', apply_url: 'https://example.com/apply' }
                }
            ],
            'event': [
                {
                    title: 'Tech Conference 2024',
                    content: { event_title: 'Tech Conference 2024', event_date: '2024-07-15T09:00:00Z', event_location: 'San Francisco Convention Center', event_description: 'Join us for the biggest tech conference of the year featuring keynotes from industry leaders.' }
                },
                {
                    title: 'Developer Meetup',
                    content: { event_title: 'Developer Meetup', event_date: '2024-06-20T18:00:00Z', event_location: 'Local Co-working Space', event_description: 'Monthly meetup for developers to network and share knowledge.' }
                },
                {
                    title: 'Design Workshop',
                    content: { event_title: 'Design Workshop', event_date: '2024-06-25T14:00:00Z', event_location: 'Design Studio', event_description: 'Hands-on workshop covering the latest design trends and tools.' }
                },
                {
                    title: 'Startup Pitch Night',
                    content: { event_title: 'Startup Pitch Night', event_date: '2024-07-10T19:00:00Z', event_location: 'Innovation Hub', event_description: 'Watch promising startups pitch their ideas to investors and the community.' }
                }
            ],
            'qa': [
                {
                    title: 'How to optimize React performance?',
                    content: { question_title: 'How to optimize React performance?', question_details: 'I have a React app that is running slowly. What are the best practices for optimizing performance?' }
                },
                {
                    title: 'Best practices for API design?',
                    content: { question_title: 'Best practices for API design?', question_details: 'What are the key principles to follow when designing RESTful APIs?' }
                },
                {
                    title: 'How to handle authentication in SPAs?',
                    content: { question_title: 'How to handle authentication in SPAs?', question_details: 'What is the most secure way to handle user authentication in single-page applications?' }
                },
                {
                    title: 'Database migration strategies?',
                    content: { question_title: 'Database migration strategies?', question_details: 'What are the best practices for handling database migrations in production?' }
                }
            ],
            'ideas-wishlist': [
                {
                    title: 'Dark mode support',
                    content: { idea_title: 'Dark mode support', idea_description: 'Add dark mode theme option to improve user experience in low-light environments.' }
                },
                {
                    title: 'Mobile app',
                    content: { idea_title: 'Mobile app', idea_description: 'Develop a native mobile application for iOS and Android platforms.' }
                },
                {
                    title: 'Advanced search filters',
                    content: { idea_title: 'Advanced search filters', idea_description: 'Implement more sophisticated search and filtering capabilities.' }
                },
                {
                    title: 'Real-time notifications',
                    content: { idea_title: 'Real-time notifications', idea_description: 'Add push notifications and real-time updates for better user engagement.' }
                }
            ],
            'knowledge-base': [
                {
                    title: 'Getting Started Guide',
                    content: { kb_title: 'Getting Started Guide', kb_content: 'This comprehensive guide will help you get started with our platform and make the most of its features.' }
                },
                {
                    title: 'API Documentation',
                    content: { kb_title: 'API Documentation', kb_content: 'Complete reference for our REST API including endpoints, parameters, and examples.' }
                },
                {
                    title: 'Troubleshooting Common Issues',
                    content: { kb_title: 'Troubleshooting Common Issues', kb_content: 'Solutions to frequently encountered problems and how to resolve them.' }
                },
                {
                    title: 'Best Practices',
                    content: { kb_title: 'Best Practices', kb_content: 'Recommended practices and guidelines for optimal platform usage.' }
                }
            ],
            'blog': [
                {
                    title: 'Introducing Our New Features',
                    content: { article_title: 'Introducing Our New Features', article_body: 'We are excited to announce several new features that will enhance your experience on our platform.', cover_image_url: 'https://example.com/image1.jpg' }
                },
                {
                    title: 'The Future of Technology',
                    content: { article_title: 'The Future of Technology', article_body: 'Exploring emerging technologies and their potential impact on various industries.', cover_image_url: 'https://example.com/image2.jpg' }
                },
                {
                    title: 'Building Better User Experiences',
                    content: { article_title: 'Building Better User Experiences', article_body: 'Learn how to create intuitive and engaging user interfaces that delight your users.', cover_image_url: 'https://example.com/image3.jpg' }
                },
                {
                    title: 'Behind the Scenes: Our Development Process',
                    content: { article_title: 'Behind the Scenes: Our Development Process', article_body: 'Take a look at how our team develops and maintains our platform.', cover_image_url: 'https://example.com/image4.jpg' }
                }
            ],
            'discussion': [
                {
                    title: 'What are your favorite development tools?',
                    content: { discussion_title: 'What are your favorite development tools?', discussion_body: 'Share your favorite tools and explain why they improve your development workflow.' }
                },
                {
                    title: 'Remote work best practices',
                    content: { discussion_title: 'Remote work best practices', discussion_body: 'Let\'s discuss strategies for staying productive and connected while working remotely.' }
                },
                {
                    title: 'Learning new technologies',
                    content: { discussion_title: 'Learning new technologies', discussion_body: 'How do you approach learning new programming languages and frameworks?' }
                },
                {
                    title: 'Open source contributions',
                    content: { discussion_title: 'Open source contributions', discussion_body: 'Share your experiences contributing to open source projects and tips for getting started.' }
                }
            ],
            'changelog': [
                {
                    title: 'Version 2.1.0 - Major Updates',
                    content: { update_title: 'Version 2.1.0 - Major Updates', update_description: 'This release includes new features, performance improvements, and bug fixes.', update_date: '2024-06-15' }
                },
                {
                    title: 'Version 2.0.5 - Bug Fixes',
                    content: { update_title: 'Version 2.0.5 - Bug Fixes', update_description: 'Fixed several issues reported by users and improved stability.', update_date: '2024-06-10' }
                },
                {
                    title: 'Version 2.0.4 - Performance Improvements',
                    content: { update_title: 'Version 2.0.4 - Performance Improvements', update_description: 'Optimized loading times and reduced memory usage.', update_date: '2024-06-05' }
                },
                {
                    title: 'Version 2.0.3 - Security Updates',
                    content: { update_title: 'Version 2.0.3 - Security Updates', update_description: 'Enhanced security measures and vulnerability patches.', update_date: '2024-06-01' }
                }
            ]
        };
        const createdPosts = [];
        // For each space in the site
        for (const space of siteSpaces) {
            // Find the CMS type for this space
            const cmsType = cmsTypes.find(ct => ct.id === space.cms_type);
            if (!cmsType)
                continue;
            const templates = mockTemplates[cmsType.name];
            if (!templates)
                continue;
            // Create 4 posts for this space
            for (const template of templates) {
                const newPost = await db.insert(posts).values({
                    title: template.title,
                    content: template.content,
                    content_format: 'richtext',
                    status: 'published',
                    author_id: site.owner_id,
                    space_id: space.id,
                    site_id: site.id,
                    cms_type: cmsType.name,
                    published_at: new Date(),
                    other_properties: {}
                }).returning();
                createdPosts.push(newPost[0]);
            }
        }
        return res.json({
            message: 'Mock content created successfully',
            created_posts: createdPosts.length,
            posts: createdPosts
        });
    }
    catch (error) {
        console.error('Error creating mock content:', error);
        return res.status(500).json({ message: 'Failed to create mock content' });
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
                cover_image_url: payload.cover_image_url,
                other_properties: payload.other_properties || {},
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
            if (payload.cover_image_url !== undefined)
                updateData.cover_image_url = payload.cover_image_url;
            // Handle other_properties specially to merge rather than overwrite if partial update
            if (payload.other_properties !== undefined) {
                if (existingPost.other_properties && Object.keys(existingPost.other_properties).length > 0 &&
                    typeof payload.other_properties === 'object') {
                    // Merge existing and new properties
                    updateData.other_properties = {
                        ...existingPost.other_properties,
                        ...payload.other_properties
                    };
                }
                else {
                    // Set directly if no existing properties or complete replacement
                    updateData.other_properties = payload.other_properties;
                }
            }
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
export { router as postsRouter };
