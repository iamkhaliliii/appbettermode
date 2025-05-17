// Standalone serverless function for /api/v1/sites
import { db } from "../db/index.js";
import { sites } from "../db/schema.js";

console.log('[VERCEL_API] /api/v1/sites endpoint initialized');

// Serverless function for sites list
export default async function handler(req, res) {
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
        
        // Check if subdomain is already taken
        const existingSite = await db.query.sites.findFirst({
          where: eq(sites.subdomain, subdomain)
        });
        
        if (existingSite) {
          errors.fieldErrors.subdomain = ['This subdomain is already taken.'];
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
      
      // Create a new site in the database
      const insertResult = await db.insert(sites)
        .values({
          name: name,
          subdomain: subdomain || null,
          owner_id: '49a44198-e6e5-4b1e-b8fb-b1c50ee0639d', // Placeholder user ID
          state: 'pending',
          status: 'active'
        })
        .returning();
      
      if (!insertResult || insertResult.length === 0) {
        throw new Error('Failed to create site in database');
      }
      
      const newSite = {
        id: insertResult[0].id,
        name: insertResult[0].name,
        subdomain: insertResult[0].subdomain,
        ownerId: insertResult[0].owner_id,
        createdAt: insertResult[0].createdAt,
        updatedAt: insertResult[0].updatedAt,
        state: insertResult[0].state,
        status: insertResult[0].status
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
  try {
    console.log('[VERCEL_API] Fetching all sites from database');
    
    // Fetch all sites from the database
    const allSites = await db.query.sites.findMany();
    
    // Format the response to match the expected format
    const formattedSites = allSites.map(site => ({
      id: site.id,
      name: site.name,
      subdomain: site.subdomain,
      ownerId: site.owner_id,
      createdAt: site.createdAt,
      updatedAt: site.updatedAt,
      state: site.state,
      status: site.status
    }));
    
    console.log(`[VERCEL_API] Found ${formattedSites.length} sites`);
    return res.status(200).json(formattedSites);
  } catch (error) {
    console.error('[VERCEL_API] Error fetching sites:', error);
    return res.status(500).json({ 
      message: 'Error fetching sites from database',
      details: error.message || 'Unknown error'
    });
  }
} 