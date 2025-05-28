import { IS_DEV } from './environment.js';
/**
 * Wrap an async express route handler to automatically catch errors
 */
export function asyncHandler(fn) {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (error) {
            console.error(`Error in API handler for ${req.method} ${req.path}:`, error);
            // Send appropriate error response
            if (!res.headersSent) {
                res.status(500).json({
                    message: 'Internal server error',
                    error: IS_DEV ? error.message : undefined
                });
            }
        }
    };
}
/**
 * Add standard cache control headers for API responses
 */
export function cacheControl(maxAge = 0, staleWhileRevalidate = 0) {
    return (req, res, next) => {
        if (maxAge === 0 && staleWhileRevalidate === 0) {
            res.setHeader('Cache-Control', 'no-store, max-age=0');
        }
        else {
            res.setHeader('Cache-Control', `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`);
        }
        next();
    };
}
/**
 * Utility to set standard API response
 */
export function apiResponse(res, status, data) {
    return res.status(status).json(data);
}
/**
 * Standard error response
 */
export function apiError(res, status, message, details) {
    return res.status(status).json({
        message,
        ...details && { details }
    });
}
