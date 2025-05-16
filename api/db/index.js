"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// server/db/index.ts
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = __importDefault(require("pg")); // Changed to default import
const { Pool } = pg_1.default; // Destructure Pool from the default export
const schema = __importStar(require("./schema.js"));
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
exports.db = (0, node_postgres_1.drizzle)(pool, { schema });
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
