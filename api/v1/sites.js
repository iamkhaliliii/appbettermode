// Standalone serverless function for /api/v1/sites
console.log('[VERCEL_API] /api/v1/sites endpoint initialized');

// Serverless function for sites list
export default function handler(req, res) {
  console.log(`[VERCEL_API] Sites ${req.method} request received`);

  // Set proper headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Handle POST request for creating a new site
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { name, subdomain } = body;
      
      console.log(`[VERCEL_API] Attempting to create site: ${name}, subdomain: ${subdomain}`);
      
      const errors = { fieldErrors: {} };
      
      // Validate name
      if (!name || name.length < 2) {
        errors.fieldErrors.name = ['Site name must be at least 2 characters.'];
      }
      
      // Validate subdomain if provided
      if (subdomain) {
        if (subdomain.length < 3) {
          errors.fieldErrors.subdomain = ['Subdomain must be at least 3 characters.'];
        } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(subdomain)) {
          errors.fieldErrors.subdomain = ['Invalid subdomain format (lowercase letters, numbers, and hyphens).'];
        }
      }
      
      // Return validation errors if any
      if (Object.keys(errors.fieldErrors).length > 0) {
        console.log(`[VERCEL_API] Validation errors:`, errors);
        return res.status(400).json({
          message: 'Invalid site data.',
          errors: errors
        });
      }
      
      // Create a new site
      const newSite = {
        id: `site-${Date.now()}`,
        name,
        subdomain: subdomain || null,
        ownerId: '49a44198-e6e5-4b1e-b8fb-b1c50ee0639d',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        state: 'pending',
        status: 'active'
      };
      
      console.log(`[VERCEL_API] Site created successfully:`, newSite);
      return res.status(201).json(newSite);
    } catch (error) {
      console.error(`[VERCEL_API] Error creating site:`, error);
      return res.status(500).json({ 
        message: 'Error creating site in database',
        details: error.message || 'Unknown error'
      });
    }
  }
  
  // Handle GET request for listing sites
  const sites = [
    {
      id: '2108ce1a-ef73-4203-a6f8-bac4c0ad110d',
      name: 'My First Test Site',
      subdomain: 'myfirstsite',
      ownerId: '49a44198-e6e5-4b1e-b8fb-b1c50ee0639d',
      createdAt: '2025-05-15T15:40:54.181Z',
      updatedAt: '2025-05-15T15:40:54.181Z',
      state: 'pending',
      status: 'active'
    },
    {
      id: '8abc0268-b470-48cf-898d-695fae5bf72e',
      name: 'Amir',
      subdomain: 'amir',
      ownerId: '49a44198-e6e5-4b1e-b8fb-b1c50ee0639d',
      createdAt: '2025-05-15T15:47:40.603Z',
      updatedAt: '2025-05-15T15:47:40.603Z',
      state: 'pending',
      status: 'active'
    }
  ];
  
  return res.status(200).json(sites);
} 