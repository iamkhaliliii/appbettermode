import express from 'express';
import sitesRouter from './sites.js';

console.log('[API] Router initialized');

const apiRouter = express.Router();

// Logging middleware
apiRouter.use((req, res, next) => {
  console.log(`[API] Request received: ${req.method} ${req.originalUrl}`);
  next();
});

// Register all API routes
apiRouter.use('/sites', sitesRouter);

// API health check endpoint
apiRouter.get('/health', (_req, res) => {
  console.log('[API] Health check endpoint called');
  res.status(200).json({ status: 'ok', message: 'API is healthy' });
});

// Handle 404 for API routes
apiRouter.use('/*', (req, res) => {
  console.log(`[API] 404 for route: ${req.originalUrl}`);
  res.status(404).json({ message: 'API endpoint not found' });
});

export default apiRouter; 