// Health check endpoint for Vercel
import { db } from "./db/index.js";

export default async function handler(req, res) {
  console.log('[VERCEL_API] Health check endpoint called');
  
  // Set proper headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Check database connection
  let dbStatus = 'unknown';
  
  try {
    // Try a simple db query to check connection
    await db.execute('SELECT 1');
    dbStatus = 'connected';
  } catch (error) {
    console.error('[VERCEL_API] DB health check error:', error);
    dbStatus = 'error';
  }
  
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: 'vercel',
    database: dbStatus,
    version: '1.0.0'
  });
} 