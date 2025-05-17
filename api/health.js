// Health check endpoint for Vercel
export default function handler(req, res) {
  console.log('[VERCEL_HEALTH] Health check endpoint called');
  
  // Return basic information about the request and environment
  return res.status(200).json({
    status: 'ok',
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers
    }
  });
} 