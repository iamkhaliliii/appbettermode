import express from 'express';
import sitesRouter from './sites.js';
import postsRouter from './posts.js';
import { fetchBrandData, testBrandfetchAPI } from '../utils/brandfetch.js';
import { logger } from '../utils/logger.js';
console.log('[API] Router initialized - routes are being registered');
const apiRouter = express.Router();
// Brandfetch API key
const BRANDFETCH_API_KEY = 'rPJ4fYfXffPHxhNAIo8lU7mDRQXHsrYqKXQ678ySJsc=';
// List all registered routes for debugging
const listRoutes = () => {
    logger.info('[API] Registered routes:');
    apiRouter.stack.forEach((r) => {
        if (r.route && r.route.path) {
            logger.info(`[API] Route: ${r.route.path}`);
        }
    });
};
// Logging middleware
apiRouter.use((req, res, next) => {
    logger.info(`[API] Request received: ${req.method} ${req.originalUrl} (matched: ${req.path})`);
    next();
});
// Register all API routes
apiRouter.use('/sites', sitesRouter);
logger.info('[API] Sites routes registered');
// Register posts router for the new unified posts handling
apiRouter.use('/posts', postsRouter);
logger.info('[API] Posts routes registered');
// Brand fetch endpoint
apiRouter.get('/brand-fetch', async (req, res) => {
    logger.info(`[API] Brand fetch endpoint called with domain: ${req.query.domain}`);
    const domain = req.query.domain;
    if (!domain) {
        return res.status(400).json({ error: 'Missing required query parameter: domain' });
    }
    try {
        logger.info(`[API] Fetching brand data for domain: ${domain}`);
        // Fetch brand data from Brandfetch API
        const { logoUrl, brandColor } = await fetchBrandData(domain, BRANDFETCH_API_KEY);
        // Format the response to match the Brandfetch API structure
        // but include only the fields we need
        const response = {
            name: domain.split('.')[0], // Extract name from domain as a fallback
            logos: [],
            colors: []
        };
        // Add logos
        if (logoUrl) {
            const logoFormat = logoUrl.endsWith('.svg') ? 'svg' : 'png';
            response.logos = [
                {
                    type: 'logo',
                    theme: 'light',
                    formats: [
                        {
                            src: logoUrl,
                            format: logoFormat
                        }
                    ]
                }
            ];
        }
        // Add colors
        if (brandColor) {
            response.colors = [
                {
                    hex: brandColor,
                    type: 'primary'
                }
            ];
        }
        logger.info(`[API] Successfully fetched brand data for ${domain}`);
        return res.status(200).json(response);
    }
    catch (error) {
        logger.error(`[API] Error fetching brand data:`, error);
        return res.status(500).json({
            error: 'Failed to fetch brand data',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
logger.info('[API] Brand fetch endpoint registered');
// API health check endpoint
apiRouter.get('/health', (_req, res) => {
    logger.info('[API] Health check endpoint called');
    res.status(200).json({ status: 'ok', message: 'API is healthy' });
});
logger.info('[API] Health check endpoint registered');
// Test Brandfetch API connection
apiRouter.get('/test-brandfetch', async (_req, res) => {
    logger.info('[API] Test Brandfetch API connection endpoint called');
    try {
        const result = await testBrandfetchAPI(BRANDFETCH_API_KEY);
        if (result.success) {
            return res.status(200).json({
                status: 'success',
                message: 'Brandfetch API connection successful',
                data: {
                    logoUrl: result.data?.logoUrl,
                    primaryColor: result.data?.brandColor
                }
            });
        }
        else {
            return res.status(500).json({
                status: 'error',
                message: 'Brandfetch API connection failed',
                error: result.error
            });
        }
    }
    catch (error) {
        logger.error('[API] Error testing Brandfetch API:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error testing Brandfetch API',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
logger.info('[API] Test Brandfetch API endpoint registered');
// Handle 404 for API routes
apiRouter.use((req, res) => {
    logger.warn(`[API] 404 for route: ${req.originalUrl}`);
    res.status(404).json({ message: 'API endpoint not found' });
});
// Log all registered routes
listRoutes();
export default apiRouter;
