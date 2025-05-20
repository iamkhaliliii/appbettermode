import { logger } from './logger.js';
/**
 * Creates a Vercel serverless function handler from an Express router
 * This enables the same API routes to be used both in development (Express) and production (Vercel)
 */
export function createVercelHandler(router) {
    return async function handler(req, res) {
        // Convert the Vercel request to an Express-like request format
        // This makes our Express routes work in a Vercel serverless function
        const url = req.url || '/';
        const path = url.split('?')[0] || '/';
        // Generate random request ID for logging
        const requestId = Math.random().toString(36).substring(2, 15);
        logger.info(`[Vercel] Request ${requestId}: ${req.method} ${url}`);
        try {
            // Set up a simple dispatching system
            // Find the matching route in the router
            let routeFound = false;
            let responseData = null;
            let responseStatus = 200;
            // Process middleware and route handlers
            for (const layer of router.stack) {
                if (!layer.route)
                    continue; // Skip middleware
                const route = layer.route;
                const routePath = route.path;
                // Check if the path matches the route pattern
                // This is a simplified matcher that doesn't handle route parameters
                if (path.match(new RegExp(`^${routePath.replace(/:[^/]+/g, '[^/]+')}$`))) {
                    routeFound = true;
                    // Check if the method is supported by the route
                    const methods = Object.keys(route.methods).map(m => m.toUpperCase());
                    if (methods.includes(req.method || 'GET')) {
                        // Process the route handler
                        // This is a mock execution - in reality we'd need to run the actual handlers
                        logger.info(`[Vercel] Matched route: ${routePath} [${methods.join(', ')}]`);
                        // Extract the handler function
                        const handler = route.stack[0].handle;
                        // Create a response object with similar methods to Express
                        const mockRes = {
                            status: (code) => {
                                responseStatus = code;
                                return mockRes;
                            },
                            json: (data) => {
                                responseData = data;
                                res.status(responseStatus).json(data);
                                return mockRes;
                            },
                            send: (data) => {
                                responseData = data;
                                res.status(responseStatus).send(data);
                                return mockRes;
                            },
                            end: () => {
                                res.status(responseStatus).end();
                                return mockRes;
                            },
                            setHeader: (name, value) => {
                                res.setHeader(name, value);
                                return mockRes;
                            },
                            getHeader: (name) => {
                                // This doesn't exist in NextApiResponse but we mock it for compatibility
                                return res.getHeader(name);
                            }
                        };
                        // Call the handler
                        await handler(req, mockRes);
                        break;
                    }
                }
            }
            if (!routeFound) {
                logger.warn(`[Vercel] No matching route found for ${path}`);
                res.status(404).json({ message: 'API endpoint not found' });
            }
            else if (responseData === null) {
                // If no response was sent, end the response
                res.status(204).end();
            }
        }
        catch (error) {
            logger.error(`[Vercel] Error handling request ${requestId}:`, error);
            res.status(500).json({
                message: 'Internal Server Error',
                error: process.env.NODE_ENV === 'development'
                    ? (error instanceof Error ? error.message : String(error))
                    : 'An unexpected error occurred'
            });
        }
    };
}
