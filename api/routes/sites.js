// Standalone serverless function for /api/v1/sites
import express from 'express';
import { db } from "../db/index.js";
import { sites } from "../db/schema.js";
import { eq, or } from "drizzle-orm";

const router = express.Router();

console.log('[API_SITES] /api/v1/sites router initialized');

// Middleware for CORS and logging (optional, can be handled globally)
router.use((req, res, next) => {
  console.log(`[API_SITES] Request: ${req.method} ${req.originalUrl}`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// GET a single site by ID or subdomain
router.get('/:identifier', async (req, res) => {
  const { identifier } = req.params;
  console.log(`[API_SITES] Attempting to fetch site with identifier: ${identifier}`);
  try {
    const site = await db.query.sites.findFirst({
      where: or(eq(sites.id, identifier), eq(sites.subdomain, identifier)),
      // Example: include owner data if you have relations setup
      // with: {
      //   owner: true 
      // }
    });

    if (!site) {
      console.log(`[API_SITES] Site not found for identifier: ${identifier}`);
      return res.status(404).json({ message: 'Site not found' });
    }
    
    // Ensure the response structure matches frontend expectations
    const formattedSite = {
      id: site.id,
      name: site.name,
      subdomain: site.subdomain,
      ownerId: site.owner_id, // Map owner_id to ownerId
      createdAt: site.createdAt?.toISOString(), // Ensure dates are ISO strings
      updatedAt: site.updatedAt?.toISOString(),
      status: site.status,
      plan: site.plan,
      logo_url: site.logo_url,
      brand_color: site.brand_color,
      content_types: site.content_types,
      space_ids: site.space_ids
      // Map other fields as necessary
    };

    console.log(`[API_SITES] Site found:`, formattedSite);
    return res.status(200).json(formattedSite);
  } catch (error) {
    console.error(`[API_SITES] Error fetching site by identifier ${identifier}:`, error);
    return res.status(500).json({ message: 'Error fetching site from database', details: error.message });
  }
});

// GET all sites
router.get('/', async (req, res) => {
  try {
    console.log('[API_SITES] Fetching all sites from database');
    const allSites = await db.query.sites.findMany();
    
    const formattedSites = allSites.map(site => ({
      id: site.id,
      name: site.name,
      subdomain: site.subdomain,
      ownerId: site.owner_id,
      createdAt: site.createdAt?.toISOString(),
      updatedAt: site.updatedAt?.toISOString(),
      status: site.status,
      plan: site.plan,
      logo_url: site.logo_url,
      brand_color: site.brand_color
      // Ensure all fields expected by the list view are here
    }));
    
    console.log(`[API_SITES] Found ${formattedSites.length} sites`);
    return res.status(200).json(formattedSites);
  } catch (error) {
    console.error('[API_SITES] Error fetching all sites:', error);
    return res.status(500).json({ 
      message: 'Error fetching sites from database',
      details: error.message || 'Unknown error'
    });
  }
});

// POST - Create a new site
router.post('/', async (req, res) => {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { name, subdomain, ownerId } = body; // Expect ownerId from client
    
    console.log(`[API_SITES] Attempting to create site: ${name}, subdomain: ${subdomain}`);
    
    // Basic validation (replace with Zod for robustness)
    const errors = { fieldErrors: {} };
    if (!name || name.length < 2) {
      errors.fieldErrors.name = ['Site name must be at least 2 characters.'];
    }
    if (subdomain) {
      if (subdomain.length < 3) {
        errors.fieldErrors.subdomain = ['Subdomain must be at least 3 characters.'];
      } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(subdomain)) {
        errors.fieldErrors.subdomain = ['Invalid subdomain format.'];
      }
      const existingSite = await db.query.sites.findFirst({ where: eq(sites.subdomain, subdomain) });
      if (existingSite) {
        errors.fieldErrors.subdomain = ['This subdomain is already taken.'];
      }
    }
    if (Object.keys(errors.fieldErrors).length > 0) {
      console.log(`[API_SITES] Validation errors:`, errors);
      return res.status(400).json({ message: 'Invalid site data.', errors });
    }
    
    const insertResult = await db.insert(sites)
      .values({
        name: name,
        subdomain: subdomain || null,
        owner_id: ownerId || '49a44198-e6e5-4b1e-b8fb-b1c50ee0639d', // Use provided ownerId or fallback
        status: 'active' // Default status
      })
      .returning();
    
    if (!insertResult || insertResult.length === 0) {
      throw new Error('Failed to create site in database');
    }
    
    const newDbSite = insertResult[0];
    const newSiteResponse = {
      id: newDbSite.id,
      name: newDbSite.name,
      subdomain: newDbSite.subdomain,
      ownerId: newDbSite.owner_id,
      createdAt: newDbSite.createdAt?.toISOString(),
      updatedAt: newDbSite.updatedAt?.toISOString(),
      status: newDbSite.status,
      plan: newDbSite.plan,
      logo_url: newDbSite.logo_url,
      brand_color: newDbSite.brand_color
    };
    
    console.log(`[API_SITES] Site created successfully:`, newSiteResponse);
    return res.status(201).json(newSiteResponse);
  } catch (error) {
    console.error(`[API_SITES] Error creating site:`, error);
    return res.status(500).json({ 
      message: 'Error creating site in database',
      details: error.message || 'Unknown error'
    });
  }
});

export default router; 