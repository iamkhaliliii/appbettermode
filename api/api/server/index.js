import './env'; // Ensures .env is loaded
import express from 'express';
import path from 'path';
import http from 'http';
import apiRoutes from './api/index.js';
import { db } from './db/index.js';
import { logger } from './utils/logger.js';
// DO NOT ADD: import { env } from './env'; // This was incorrect
const app = express();
const PORT = process.env.PORT || 3030; // Use process.env
const IS_DEV = process.env.NODE_ENV === 'development';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// API routes
app.use('/api/v1', apiRoutes);
// Create an HTTP server instance. This is needed for Vite dev server integration.
const server = http.createServer(app);
if (IS_DEV) {
    // Dynamically import Vite dev middleware setup only in development
    // Use 'as any' to prevent TSC from deeply analyzing the dev-only ./vite module during production build
    import('./vite.js').then((viteModule) => {
        if (viteModule.setupVite && typeof viteModule.setupVite === 'function') {
            viteModule.setupVite(app, server); // Pass both app and the http.Server instance
            if (viteModule.log && typeof viteModule.log === 'function') {
                viteModule.log('Vite Dev Middleware configured.');
            }
            else {
                logger.info('Vite Dev Middleware configured (custom log not found).');
            }
        }
        else {
            logger.error('setupVite function not found in ./vite module or ./vite failed to load correctly.');
        }
    }).catch(error => {
        logger.error('Failed to load or setup Vite Dev Middleware:', error);
    });
}
else {
    // Production mode: Serve static files from the client build output directory
    // __dirname in CommonJS refers to the directory of the current file.
    // After build, server/index.js will be in 'api/', so __dirname is 'api/'.
    // To get to 'dist/public' from 'api/', we go up one level then into 'dist/public'.
    const clientBuildPath = path.join(__dirname, '../dist/public');
    app.use(express.static(clientBuildPath));
    // SPA fallback: For any GET request not matching API or a static file, serve index.html
    app.get('*', (req, res) => {
        if (req.method === 'GET' && !req.path.startsWith('/api') && req.accepts('html') && !req.path.includes('.')) {
            res.sendFile(path.join(clientBuildPath, 'index.html'));
        }
        else if (!req.path.startsWith('/api')) {
            // For other non-API GET requests (e.g., direct access to a file not found by static, or bad paths)
            // send index.html to let client router handle or show its 404.
            res.status(404).sendFile(path.join(clientBuildPath, 'index.html'));
        }
        // API routes not matched by apiRoutes will be handled by Express default 404.
    });
}
// Use the http.Server instance to listen, as Vite Dev Server might attach to it.
server.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
    const dbInitialized = db ? true : false;
    logger.info(`Database object initialized: ${dbInitialized}`);
    if (IS_DEV) {
        logger.info(`Development server running at http://localhost:${PORT}`);
    }
});
export default app; // Export app for Vercel (serverless functions might use the Express app)
