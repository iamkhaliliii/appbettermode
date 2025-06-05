import express from 'express';
import sitesRouter from './sites.js';
import { postsRouter } from './posts.js';
import cmsTypesRouter from './cms-types.js';
import spacesRouter from './spaces.js';
import { usersRouter } from './users.js';
import { fetchBrandData } from '../utils/brandfetch.js';
import { logger } from '../utils/logger.js';
console.log('[API] Router initialized - routes are being registered');
const apiRouter = express.Router();
// Get Brandfetch API key from environment variables
const BRANDFETCH_API_KEY = process.env.BRANDFETCH_API_KEY;

// Demo data generator for when API key is not configured
const getDemoDataForDomain = (domain) => {
    const companyName = domain.split('.')[0];
    const capitalizedName = companyName.charAt(0).toUpperCase() + companyName.slice(1);
    // Generate demo colors based on company name
    const colors = [
        '#3B82F6', // Blue
        '#10B981', // Green  
        '#F59E0B', // Yellow
        '#EF4444', // Red
        '#8B5CF6', // Purple
        '#06B6D4', // Cyan
        '#F97316', // Orange
        '#84CC16', // Lime
    ];
    const colorIndex = companyName.length % colors.length;
    const primaryColor = colors[colorIndex];
    // Generate demo logo URL (using a placeholder service)
    const logoUrl = `https://via.placeholder.com/200x80/${primaryColor.slice(1)}/ffffff?text=${capitalizedName}`;
    return {
        name: capitalizedName,
        description: `${capitalizedName} is a leading company in its industry, providing innovative solutions and exceptional service to customers worldwide.`,
        logos: [
            {
                type: 'logo',
                theme: 'light',
                formats: [
                    {
                        src: logoUrl,
                        format: 'png'
                    }
                ]
            }
        ],
        colors: [
            {
                hex: primaryColor,
                type: 'primary'
            }
        ],
        companyInfo: {
            name: capitalizedName,
            description: `${capitalizedName} is a leading company in its industry.`,
            industry: 'Technology',
            location: 'Global',
            employees: Math.floor(Math.random() * 10000) + 100
        },
        demo: true
    };
};
// List all registered routes for debugging
const listRoutes = () => {
    logger.info('[API] Registered routes:');
    // Direct routes on the apiRouter
    apiRouter.stack.forEach((r) => {
        if (r.route && r.route.path) {
            logger.info(`[API] Route: ${r.route.path}`);
        }
    });
    // Log nested routes
    const stackToLog = apiRouter.stack.filter(layer => layer.name === 'router' && layer.handle);
    stackToLog.forEach((layer) => {
        if (!layer.regexp)
            return;
        const path = layer.regexp.toString().replace('\\/?(?=\\/|$)', '').replace(/^\/\^/, '').replace(/\\/g, '');
        const mountPath = path.replace(/\(\?:\(\[\^\\\/]\+\?\)\)/g, ':params').replace(/\(\?=\\\/\|\$\)/g, '').replace(/\(\?:\(\.\*\)\)/g, ':params');
        logger.info(`[API] Router mounted at: ${mountPath}`);
        if (layer.handle && layer.handle.stack) {
            layer.handle.stack.forEach((nestedLayer) => {
                if (nestedLayer.route && nestedLayer.route.path) {
                    logger.info(`[API] ---> ${mountPath}${nestedLayer.route.path}`);
                }
            });
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
// Register cms-types router for content type management
apiRouter.use('/cms-types', cmsTypesRouter);
logger.info('[API] CMS Types routes registered');
// Register users router for user data
apiRouter.use('/users', usersRouter);
logger.info('[API] Users routes registered');
// Register dedicated spaces router for space management
apiRouter.use('/spaces', spacesRouter);
logger.info('[API] Spaces routes registered');
// Test brand fetch endpoint (for connection testing)
apiRouter.get('/test-brandfetch', async (req, res) => {
    try {
        logger.info(`[API] Test brand fetch endpoint called`);
        if (!BRANDFETCH_API_KEY) {
            logger.warn('[API] BRANDFETCH_API_KEY not set, returning demo mode response');
            return res.json({
                status: 'success',
                message: 'Demo mode: Brandfetch API simulation active',
                testDomain: 'demo.com',
                hasData: {
                    logoUrl: true,
                    brandColor: true,
                    companyInfo: true
                },
                demo: true
            });
        }
        // Import testBrandfetchAPI function
        const { testBrandfetchAPI } = await import('../utils/brandfetch.js');
        logger.info(`[API] Testing brand fetch API connection`);
        const testResult = await testBrandfetchAPI(BRANDFETCH_API_KEY);
        res.json({
            status: testResult.success ? 'success' : 'error',
            message: testResult.success ? 'Brandfetch API connection successful' : 'Brandfetch API connection failed',
            testDomain: 'nike.com',
            hasData: testResult.data ? {
                logoUrl: !!testResult.data.logoUrl,
                brandColor: !!testResult.data.brandColor,
                companyInfo: !!testResult.data.companyInfo
            } : null,
            error: testResult.error
        });
    }
    catch (error) {
        logger.error(`[API] Error in test brand fetch endpoint: ${error instanceof Error ? error.message : 'Unknown error'}`);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while testing brand fetch',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
logger.info('[API] Test brand fetch endpoint registered');

// Brand fetch endpoint
apiRouter.get('/brand-fetch', async (req, res) => {
    logger.info(`[API] Brand fetch endpoint called with domain: ${req.query.domain}`);
    const domain = req.query.domain;
    if (!domain) {
        return res.status(400).json({
            message: 'Domain parameter is required',
            error: 'Missing domain parameter'
        });
    }
    if (!BRANDFETCH_API_KEY) {
        logger.warn(`[API] BRANDFETCH_API_KEY not set, returning demo data for domain: ${domain}`);
        // Return demo data based on domain
        const demoData = getDemoDataForDomain(domain);
        return res.json(demoData);
    }
    try {
        logger.info(`[API] Fetching brand data for domain: ${domain}`);
        // Fetch brand data from Brandfetch API
        const brandData = await fetchBrandData(domain, BRANDFETCH_API_KEY);
        // Format the response to match what the frontend expects
        const response = {
            name: brandData.companyInfo?.name || domain.split('.')[0],
            description: brandData.companyInfo?.description,
            logos: [],
            colors: [],
            companyInfo: brandData.companyInfo || undefined
        };
        // Add logos
        if (brandData.logoUrl) {
            const logoFormat = brandData.logoUrl.endsWith('.svg') ? 'svg' : 'png';
            response.logos = [
                {
                    type: 'logo',
                    theme: 'light',
                    formats: [
                        {
                            src: brandData.logoUrl,
                            format: logoFormat
                        }
                    ]
                }
            ];
        }
        // Add colors
        if (brandData.brandColor) {
            response.colors = [
                {
                    hex: brandData.brandColor,
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
            message: 'Internal server error while fetching brand data',
            error: error instanceof Error ? error.message : 'Unknown error'
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
// Test endpoint to verify API is working
apiRouter.get('/test', (req, res) => {
    res.json({
        message: 'API is working correctly!',
        timestamp: new Date().toISOString(),
        headers: {
            host: req.headers.host,
            origin: req.headers.origin,
            referer: req.headers.referer
        }
    });
});
// Handle 404 for API routes
apiRouter.use((req, res) => {
    logger.warn(`[API] 404 for route: ${req.originalUrl}`);
    res.status(404).json({ message: 'API endpoint not found' });
});
// Log all registered routes
listRoutes();
export default apiRouter;
