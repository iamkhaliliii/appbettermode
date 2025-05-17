// server/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg'; // Changed to default import
const { Pool } = pg; // Destructure Pool from the default export
import * as schema from './schema.js';
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error('FATAL ERROR: DATABASE_URL environment variable is not set or empty.');
    throw new Error('DATABASE_URL environment variable is not set or empty.');
}
// Configuration for Supabase (uses standard node-postgres)
const pool = new Pool({
    connectionString,
    // Supabase requires SSL. 
    // 'pg' module defaults to SSL being preferred if the server supports it.
    // If you encounter SSL errors, you might need to be more explicit:
    ssl: {
        rejectUnauthorized: false, // This might be needed depending on the Vercel environment and Supabase setup.
        // For production, ideally, you'd configure this more securely 
        // if Vercel's environment doesn't automatically handle the CA certs for Supabase.
    }
});
export const db = drizzle(pool, { schema });
console.log("Drizzle db client for Supabase initialized in server/db/index.ts");
// Remove other examples if you wish, or keep them commented for reference.
// Example for Vercel Postgres (using @vercel/postgres):
// import { sql } from "@vercel/postgres";
// import { drizzle } from 'drizzle-orm/vercel-postgres';
// import * as schema from './schema';
// if (!process.env.POSTGRES_URL) { // Vercel Postgres uses POSTGRES_URL by default
//   throw new Error('POSTGRES_URL environment variable is not set.');
// }
// export const db = drizzle(sql, { schema });
// Example for Neon Serverless Driver (using @neondatabase/serverless):
// import { neon } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-http';
// import * as schema from './schema';
// if (!process.env.DATABASE_URL) {
//    throw new Error('DATABASE_URL (for Neon) environment variable is not set.');
// }
// const sql = neon(process.env.DATABASE_URL!);
// export const db = drizzle(sql, { schema }); 
