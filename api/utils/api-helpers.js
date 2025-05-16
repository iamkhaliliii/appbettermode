/**
 * Helper to create a handler for Next.js API routes
 * @param {Object} routes Map of HTTP_METHOD path to handler functions
 * @returns {Function} Next.js API handler
 */
export function createApiHandler(routes) {
    return async (req, res) => {
        // Get the path minus the first segment (e.g., /sites/by-subdomain -> /by-subdomain)
        const path = req.url.split('/').slice(2).join('/');
        const method = req.method;
        const routeKey = `${method} ${path}`;
        console.log(`API request: ${routeKey}`);
        // Find matching route handler
        const handler = routes[routeKey];
        if (!handler) {
            res.setHeader('Allow', Object.keys(routes).map(key => key.split(' ')[0]));
            return res.status(405).end(`Method ${method} Not Allowed for ${path}`);
        }
        try {
            await handler(req, res);
        }
        catch (error) {
            console.error(`Error in API handler for ${routeKey}:`, error);
            return res.status(500).json({
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    };
}
/**
 * Helper specifically for React SWR data fetching
 */
export function createReactSWRHandler(routes) {
    const handler = createApiHandler(routes);
    // Add appropriate cache control headers for SWR
    return async (req, res) => {
        res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
        return handler(req, res);
    };
}
