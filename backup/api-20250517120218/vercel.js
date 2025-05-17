// Specialized entry point for Vercel deployment
import './env.js';
import express from 'express';
import sitesRouter from './routes/sites.js';

console.log('[VERCEL_SERVERLESS] API entrypoint initialized');

// Create a minimal Express app
const app = express();
app.use(express.json());

// Direct API routes
const apiRouter = express.Router();
apiRouter.use('/sites', sitesRouter);

// Add a health check endpoint
apiRouter.get('/health', (_req, res) => {
  console.log('[VERCEL_SERVERLESS] Health check called');
  res.status(200).json({ status: 'ok', message: 'API is healthy' });
});

// 404 handler for API routes
apiRouter.use('/*', (req, res) => {
  console.log(`[VERCEL_SERVERLESS] 404 for API route: ${req.path}`);
  res.status(404).json({ message: 'API endpoint not found' });
});

// Mount the API router
app.use('/api/v1', apiRouter);

// Testing endpoint
app.get('/test-vercel', (req, res) => {
  console.log('[VERCEL_SERVERLESS] Test endpoint called');
  res.status(200).json({ message: 'Vercel deployment is working' });
});

// Export the handler for Vercel
export default app;