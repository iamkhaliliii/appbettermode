# System Architecture

This document explains the overall architecture of the application and how different components interact with each other.

## Project Structure Overview

The project consists of three main parts:

1. **Frontend (client)** - React application built with Vite
2. **Backend (server)** - TypeScript files that are the source code for the API
3. **Vercel API (api)** - Compiled JavaScript files from the server folder for deployment on Vercel

## Relationship Between Server and API Folders

- The `server` folder contains TypeScript source code that developers write and edit
- The `api` folder contains compiled JavaScript code used for execution in Vercel environment
- You should never directly edit the `api` folder; always make changes in `server` and then compile with `npm run build`

## Data Flow

```
Client (React) <--> API (Express/Vercel) <--> Database (PostgreSQL)
```

## Development Workflow

1. Changes are made to TypeScript files in the `server` folder
2. A local development server is launched with `npm run dev`
3. TypeScript files are compiled to JavaScript with `npm run build`
4. Compiled files in the `api` folder are used for deployment on Vercel

## Unified API Architecture

The unified API architecture is designed to work simultaneously in two environments:

1. **Local Development Environment**: Uses Express.js to serve the API
2. **Vercel Environment**: Uses Serverless functions to serve the API

The key to this architecture is in the following files:

- `server/utils/environment.ts`: Detects the execution environment
- `server/utils/errors.ts`: Standardizes error responses
- `client/src/lib/api.ts`: API adapter on the client side

## Database

This project uses PostgreSQL as the database and works with the following libraries:

- **Drizzle ORM**: For database interaction
- **Zod**: For data validation

Database models are defined in `server/db/schema.ts`.

## API Routes

### Sites API:

- `GET /api/v1/sites`: Get a list of all sites
- `POST /api/v1/sites`: Create a new site
- `GET /api/v1/sites/:id`: Get information about a specific site by ID or subdomain

### Health API:

- `GET /api/health`: Check API health status

## Error Handling

Errors are returned in a standardized format with the following structure:

```json
{
  "message": "Error message",
  "errors": {
    "fieldErrors": {
      "field1": ["Error related to field1"],
      "field2": ["Error related to field2"]
    }
  }
}
```

## Security

CORS headers are automatically set for all APIs. User authentication will be implemented in the next version.
