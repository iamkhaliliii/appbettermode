// api/index.js - Legacy compatibility adapter
// DEPRECATED: All API functionality has been migrated to /api/v1 endpoints

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Add a deprecation notice middleware for API calls
app.use('/api', (req, res, next) => {
  console.warn(`DEPRECATED API ENDPOINT USED: ${req.path} - Please migrate to /api/v1 endpoints`);
  next();
});

// Serve static assets
const staticPath = path.join(__dirname, '../dist/public');

if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));
}

// Handle SPA routing - return index.html for all other requests
app.get('*', (req, res) => {
  // API requests should already be handled by specific routes, this is for the frontend only
  const indexPath = path.join(staticPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Not found - Build files are missing');
  }
});

// Export for Vercel
export default app;