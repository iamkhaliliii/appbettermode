import './env'; // Ensures .env is loaded
import express from 'express';
import path from 'path';
import http from 'http';
import apiRoutes from './routes/index.js';
import { db } from './db/index.js';
import { logger } from './utils/logger.js';
const app = express();
const PORT = process.env.PORT || 4000; // Changed default port from 3030 to 4000
const IS_DEV = process.env.NODE_ENV === 'development';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// API routes
app.use('/api/v1', apiRoutes);
// Create an HTTP server instance
const server = http.createServer(app);
if (IS_DEV) {
    // Development mode: Set up Vite middleware
    import('./vite.js').then((viteModule) => {
        if (viteModule.setupVite && typeof viteModule.setupVite === 'function') {
            viteModule.setupVite(app, server);
            logger.info('Vite Dev Middleware configured.');
        }
        else {
            logger.error('setupVite function not found or failed to load correctly.');
        }
    }).catch(error => {
        logger.error('Failed to load or setup Vite Dev Middleware:', error);
    });
}
else {
    // Production mode: Serve static files
    const clientBuildPath = path.join(__dirname, '../dist/public');
    app.use(express.static(clientBuildPath));
    // SPA fallback for client-side routing
    app.get('*', (req, res) => {
        if (req.method === 'GET' && !req.path.startsWith('/api') && req.accepts('html') && !req.path.includes('.')) {
            res.sendFile(path.join(clientBuildPath, 'index.html'));
        }
        else if (!req.path.startsWith('/api')) {
            res.status(404).sendFile(path.join(clientBuildPath, 'index.html'));
        }
    });
}
// Start the server
server.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
    logger.info(`Database initialized: ${db ? true : false}`);
    if (IS_DEV) {
        logger.info(`Development server running at http://localhost:${PORT}`);
    }
});
export default app;
