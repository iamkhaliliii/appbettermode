import express from 'express';
import sitesRouter from './sites/index.js';
console.log('[VERCEL_LOG_TEST] server/api/index.ts: Top of file reached before router setup'); // Explicit Vercel Log Test
const apiRouter = express.Router();
apiRouter.use((req, res, next) => {
    console.log(`[VERCEL_LOG_TEST] Request received for: ${req.method} ${req.originalUrl}`);
    console.log(`[VERCEL_LOG_TEST] Request headers: ${JSON.stringify(req.headers)}`);
    next();
});
// Register all API routes
apiRouter.use('/sites', sitesRouter);
// API health check endpoint
apiRouter.get('/health', (_req, res) => {
    console.log('[VERCEL_LOG_TEST] Health check endpoint called');
    res.status(200).json({ status: 'ok', message: 'API is healthy' });
});
// Handle 404 for API routes
apiRouter.use('/*', (req, res) => {
    console.log(`[VERCEL_LOG_TEST] 404 for API route: ${req.originalUrl}`);
    res.status(404).json({ message: 'API endpoint not found' });
});
export default apiRouter;
