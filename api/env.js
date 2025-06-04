import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Export a flag to indicate env setup is complete
export const envSetupCompleted = true;

// Log that env has been loaded (useful for debugging)
console.log('[env.js] Environment variables loaded via dotenv');

// Export commonly used env variables for convenience
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const DATABASE_URL = process.env.DATABASE_URL;
export const POSTGRES_URL = process.env.POSTGRES_URL;
export const VERCEL = process.env.VERCEL;
export const PORT = process.env.PORT || 3000;