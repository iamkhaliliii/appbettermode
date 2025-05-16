import express from 'express';
import sitesRouter from './sites/index';

const apiRouter = express.Router();

// API version prefix
const API_PREFIX = '/api/v1';

// Register all API routes
apiRouter.use(`${API_PREFIX}/sites`, sitesRouter);

// API health check endpoint
apiRouter.get(`${API_PREFIX}/health`, (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is healthy' });
});

// Handle 404 for API routes
apiRouter.use(`${API_PREFIX}/*`, (_req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

export default apiRouter; 