// Simplified entry point for Vercel deployment
import express from 'express';

// Create a minimal Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simplified API handling for Vercel
app.get('/api/v1/sites', (req, res) => {
  console.log('[VERCEL] GET /api/v1/sites request received');
  return res.status(200).json({
    message: 'Sites API endpoint',
    data: [
      { id: '1', name: 'Example Site 1', subdomain: 'example1' },
      { id: '2', name: 'Example Site 2', subdomain: 'example2' },
    ]
  });
});

app.get('/api/v1/sites/:id', (req, res) => {
  console.log(`[VERCEL] GET /api/v1/sites/${req.params.id} request received`);
  return res.status(200).json({
    message: `Site details for ID: ${req.params.id}`,
    site: {
      id: req.params.id,
      name: `Example Site ${req.params.id}`,
      subdomain: `example${req.params.id}`,
      created: new Date().toISOString()
    }
  });
});

app.get('/test-vercel', (req, res) => {
  console.log('[VERCEL] GET /test-vercel request received');
  return res.status(200).json({ 
    message: 'Vercel deployment is working', 
    timestamp: new Date().toISOString() 
  });
});

app.get('/api/health', (req, res) => {
  console.log('[VERCEL] GET /api/health request received');
  return res.status(200).json({ status: 'ok', message: 'API is healthy' });
});

// Fallback for any other API routes
app.all('*', (req, res) => {
  console.log(`[VERCEL] Request to unknown route: ${req.method} ${req.url}`);
  return res.status(200).json({ 
    message: 'Vercel API handler',
    method: req.method,
    path: req.url
  });
});

// Export the handler for Vercel
export default app;
