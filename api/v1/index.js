// Vercel serverless function handler for /api/v1
export default function handler(req, res) {
  const path = req.url || '';
  
  // Log the request for debugging
  console.log(`[VERCEL_API_V1] Request received: ${req.method} ${path}`);
  
  // Extract the endpoint path (everything after /api/v1)
  const endpoint = path.replace(/^\/api\/v1\/?/, '');
  console.log(`[VERCEL_API_V1] Endpoint: ${endpoint}`);
  
  // Handle different API endpoints
  if (endpoint.startsWith('sites')) {
    return handleSites(req, res, endpoint);
  }
  
  // Default response for unknown endpoints
  return res.status(200).json({
    message: 'API v1 endpoint working',
    endpoint: endpoint || 'root',
    method: req.method,
    timestamp: new Date().toISOString()
  });
}

// Handle sites-related endpoints
function handleSites(req, res, endpoint) {
  const parts = endpoint.split('/').filter(Boolean);
  
  // Just sites - list all sites
  if (parts.length === 1) {
    return res.status(200).json({
      message: 'Sites API endpoint',
      data: [
        { id: '1', name: 'Example Site 1', subdomain: 'example1' },
        { id: '2', name: 'Example Site 2', subdomain: 'example2' },
      ]
    });
  }
  
  // sites/{id} - get a specific site
  if (parts.length === 2) {
    const siteId = parts[1];
    return res.status(200).json({
      message: `Site details for ID: ${siteId}`,
      site: {
        id: siteId,
        name: `Example Site ${siteId}`,
        subdomain: `example${siteId}`,
        created: new Date().toISOString()
      }
    });
  }
  
  // Default response for other site paths
  return res.status(200).json({
    message: 'Unknown sites endpoint',
    path: endpoint
  });
} 