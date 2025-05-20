// Serverless function for specific site details
import { db } from "../../db/index.js";
import { sites } from "../../db/schema.js";
import { eq, or } from "drizzle-orm";

export default async function handler(req, res) {
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
  
  try {
    console.log(`[VERCEL_API] Fetching site from database with ID or subdomain: ${siteId}`);
    
    // Try to find the site by ID or subdomain
    let site;
    
    // First try as subdomain
    site = await db.query.sites.findFirst({
      where: eq(sites.subdomain, siteId)
    });
    
    // If not found by subdomain, try by ID
    if (!site && siteId.includes('-') && siteId.length > 30) {
      console.log(`[VERCEL_API] Not found by subdomain, trying UUID: ${siteId}`);
      site = await db.query.sites.findFirst({
        where: eq(sites.id, siteId)
      });
    }
    
    if (!site) {
      console.log(`[VERCEL_API] Site not found for ID/subdomain: ${siteId}`);
      return res.status(404).json({ message: 'Site not found' });
    }
    
    // Format the response to match the expected format
    const formattedSite = {
      id: site.id,
      name: site.name,
      subdomain: site.subdomain,
      ownerId: site.owner_id,
      createdAt: site.createdAt,
      updatedAt: site.updatedAt,
      state: site.status,
      status: site.status
    };
    
    console.log(`[VERCEL_API] Site found:`, formattedSite);
    return res.status(200).json(formattedSite);
  } catch (error) {
    console.error(`[VERCEL_API] Error fetching site:`, error);
    return res.status(500).json({ 
      message: 'Error fetching site from database',
      details: error.message || 'Unknown error'
    });
  }
} 