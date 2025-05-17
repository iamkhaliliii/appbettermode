import { fetchBrandData } from "../../server/utils/brandfetch.js";

// Brandfetch API key
const BRANDFETCH_API_KEY = 'rPJ4fYfXffPHxhNAIo8lU7mDRQXHsrYqKXQ678ySJsc=';

export default async function handler(req, res) {
  console.log(`[VERCEL_API] Test Brandfetch API endpoint called`);
  
  // Set proper headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }
  
  try {
    console.log(`[VERCEL_API] Testing Brandfetch API with brandfetch.com domain`);
    
    // Use the free test domain brandfetch.com
    const testDomain = 'brandfetch.com';
    
    // Fetch brand data from Brandfetch API
    const { logoUrl, primaryColor, brandColors } = await fetchBrandData(testDomain, BRANDFETCH_API_KEY);
    
    if (logoUrl || primaryColor || brandColors) {
      console.log(`[VERCEL_API] Brandfetch API test successful`);
      return res.status(200).json({
        status: 'success',
        message: 'Brandfetch API connection successful',
        data: {
          logoUrl,
          primaryColor,
          colorsCount: brandColors?.length || 0
        }
      });
    } else {
      console.error(`[VERCEL_API] Brandfetch API test failed: No data returned`);
      return res.status(500).json({
        status: 'error',
        message: 'Brandfetch API connection failed',
        error: 'No brand data found for brandfetch.com'
      });
    }
  } catch (error) {
    console.error(`[VERCEL_API] Error testing Brandfetch API:`, error);
    return res.status(500).json({ 
      status: 'error',
      message: 'Error testing Brandfetch API',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 