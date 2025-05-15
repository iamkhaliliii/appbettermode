
import '../server/env'; // یا './env' بسته به محل فایل env.ts - این خط باید اولین خط اجرایی باشد

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);

// Initialize Drizzle with the schema
export const db = drizzle(client, { schema }); 