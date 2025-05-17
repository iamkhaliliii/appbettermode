// Import the fetchBrandData utility
import { fetchBrandData } from "../../server/utils/brandfetch.js";

// Brandfetch API key
const BRANDFETCH_API_KEY = 'rPJ4fYfXffPHxhNAIo8lU7mDRQXHsrYqKXQ678ySJsc=';

export default async function handler(req, res) {
  console.log(`[VERCEL_API] Brand fetch endpoint called`);
  
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
  
  const domain = req.query.domain;
  
  if (!domain) {
    return res.status(400).json({ error: 'Missing required query parameter: domain' });
  }
  
  try {
    console.log(`[VERCEL_API] Fetching brand data for domain: ${domain}`);
    
    // Fetch brand data from Brandfetch API
    const { logoUrl, primaryColor, brandColors } = await fetchBrandData(domain, BRANDFETCH_API_KEY);
    
    // Format the response to match the Brandfetch API structure
    // but include only the fields we need
    const response = {
      name: domain.split('.')[0], // Extract name from domain as a fallback
      logos: [],
      colors: []
    };
    
    // Add logos
    if (logoUrl) {
      const logoFormat = logoUrl.endsWith('.svg') ? 'svg' : 'png';
      response.logos = [
        {
          type: 'logo',
          theme: 'light',
          formats: [
            {
              src: logoUrl,
              format: logoFormat
            }
          ]
        }
      ];
    }
    
    // Add colors
    if (primaryColor) {
      response.colors = [
        {
          hex: primaryColor,
          type: 'primary'
        }
      ];
      
      // Add additional colors if available
      if (brandColors && Array.isArray(brandColors)) {
        response.colors = brandColors;
      }
    }
    
    console.log(`[VERCEL_API] Successfully fetched brand data for ${domain}`);
    return res.status(200).json(response);
  } catch (error) {
    console.error(`[VERCEL_API] Error fetching brand data:`, error);
    return res.status(500).json({ 
      error: 'Failed to fetch brand data',
      details: error.message || 'Unknown error'
    });
  }
} 