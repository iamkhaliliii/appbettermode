import express from 'express';
import sitesRouter from './sites/index.js';
const apiRouter = express.Router();
// Register all API routes
apiRouter.use('/sites', sitesRouter);
// API health check endpoint
apiRouter.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is healthy' });
});
// Handle 404 for API routes
apiRouter.use('/*', (_req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});
export default apiRouter;
