/**
 * Environment detection and configuration utilities
 */

export const IS_VERCEL = process.env.VERCEL === '1';
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PROD = process.env.NODE_ENV === 'production';
export const SERVER_PORT = process.env.PORT || 4000;

/**
 * Get the base URL for API requests based on environment
 */
export function getApiBaseUrl(): string {
  if (IS_VERCEL) {
    return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
  }
  
  if (IS_DEV) {
    return `http://localhost:${SERVER_PORT}`;
  }
  
  // Default fallback
  return '';
}

/**
 * Set standard CORS and content-type headers for API responses
 */
export function setApiResponseHeaders(res: any): void {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Add cache control for API responses
  res.setHeader('Cache-Control', 'no-store, max-age=0');
}

/**
 * Handle CORS preflight requests
 */
export function handleCorsPreflightRequest(req: any, res: any): boolean {
  if (req.method === 'OPTIONS') {
    setApiResponseHeaders(res);
    res.status(200).end();
    return true;
  }
  return false;
} 