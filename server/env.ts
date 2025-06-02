    // server/env.ts
    import dotenv from 'dotenv';
    import path from 'path';

    const envPath = path.resolve(process.cwd(), '.env');
    // console.log(`[env.ts] Attempting to load .env from: ${envPath}`); // Optional: for deep debugging
    const result = dotenv.config({ path: envPath });

    if (result.error) {
      // It's often okay for .env to be missing in production, Vercel injects env vars
      console.warn('[env.ts] Warning: .env file not found or error loading it. This might be normal in production. Error:', result.error.message);
    }
    // console.log('[env.ts] .env file loaded. DATABASE_URL:', process.env.DATABASE_URL); // Optional: for deep debugging

    export const envSetupCompleted = true; // Dummy export