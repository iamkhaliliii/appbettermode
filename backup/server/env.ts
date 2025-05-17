    // server/env.ts
    import dotenv from 'dotenv';
    import path from 'path';

    const envPath = path.resolve(process.cwd(), '.env');
    // console.log(`[env.ts] Attempting to load .env from: ${envPath}`); // Optional: for deep debugging
    const result = dotenv.config({ path: envPath });

    if (result.error) {
      console.error('[env.ts] Error loading .env file:', result.error);
      // throw result.error; // Optionally re-throw, or handle as needed
    }
    // console.log('[env.ts] .env file loaded. DATABASE_URL:', process.env.DATABASE_URL); // Optional: for deep debugging