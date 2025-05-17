# API Directory Structure

This directory contains the compiled JavaScript files that serve as serverless functions on Vercel.

## Directory Structure

- `/v1/` - API endpoints (version 1)
  - `/sites.js` - Main endpoint for sites collection
  - `/sites/[id].js` - Dynamic endpoint for individual sites
  
- `/db/` - Database connection and schema
  - `index.js` - Database connection setup
  - `schema.js` - Database schema definitions
  
- `/utils/` - Utility functions
  - `logger.js` - Logging utilities
  - `api-helpers.js` - API response helpers

- `health.js` - Health check endpoint
- `index.js` - Main API entry point

## Local vs Vercel Execution

The files in this directory are produced from TypeScript files in the `/server` directory during the build process. They are compiled to be compatible with both:

1. Local execution via Node.js
2. Serverless execution on Vercel

## Important Notes

- Do not edit these files directly. Instead, modify the TypeScript source files in the `/server` directory.
- Run `npm run build` to update these files after making changes to the TypeScript source.
- The `scripts/build.mjs` script manages synchronization between `/server` and `/api` during the build process.
- Use the health check endpoint (`/api/health`) to verify your API deployment.

## Environment Variables

These serverless functions rely on the following environment variables:

- `NODE_ENV` - Set to 'production' for Vercel deployment
- `DATABASE_URL` - PostgreSQL connection string
- `VERCEL` - Set to '1' in the Vercel environment 