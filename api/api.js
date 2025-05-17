// Vercel serverless function handler
export default function handler(req, res) {
  // Log request details for debugging
  console.log(`[VERCEL_API] Request received: ${req.method} ${req.url}`);
  console.log(`[VERCEL_API] Request path: ${req.url}`);
  
  // Simple response for testing
  return res.status(200).json({
    message: 'Vercel API is working!',
    method: req.method,
    url: req.url,
    path: req.url,
    timestamp: new Date().toISOString()
  });
} 