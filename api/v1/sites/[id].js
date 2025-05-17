// Serverless function for specific site details
export default function handler(req, res) {
  console.log(`[VERCEL_API] Site details endpoint called for: ${req.query.id}`);
  
  // Set proper headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  const siteId = req.query.id;
  
  // Sample sites data
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
  
  // Find site by ID or subdomain
  const site = sites.find(
    site => site.id === siteId || site.subdomain === siteId
  );
  
  if (!site) {
    console.log(`[VERCEL_API] Site not found for ID/subdomain: ${siteId}`);
    return res.status(404).json({ message: 'Site not found' });
  }
  
  console.log(`[VERCEL_API] Site found:`, site);
  return res.status(200).json(site);
} 