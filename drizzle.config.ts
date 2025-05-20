import { defineConfig } from "drizzle-kit";
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL environment variable not found. Using default development database URL.");
  process.env.DATABASE_URL = "postgres://postgres:postgres@localhost:5432/bettermode_dev";
}

export default defineConfig({
  out: "./migrations",
  schema: "./server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
