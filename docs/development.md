# Development Guide

This document explains the development process and how to work with the project.

## Prerequisites

- Node.js version 18 or higher
- npm or yarn
- PostgreSQL database

## Setting Up the Development Environment

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with the following content:

```
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
PORT=4000
```

3. Run the application in development mode:

```bash
npm run dev
```

4. Access the application:
   - Frontend: http://localhost:4000
   - API: http://localhost:4000/api/v1

## Directory Structure

```
App-bettermode/
├── api/                    # Compiled JavaScript files for Vercel (from code in 'server/')
├── client/                 # Frontend code
│   └── src/
│       ├── components/     # React components
│       ├── hooks/          # Custom hooks
│       ├── lib/            # Helper functions and API client
│       ├── pages/          # Application pages
│       └── types/          # TypeScript definitions
├── docs/                   # Documentation
├── scripts/                # Helper scripts
├── server/                 # Backend code (main source - TypeScript)
│   ├── db/                 # Database connection and models
│   ├── routes/             # API routes
│   └── utils/              # Helper functions
├── package.json            # Dependencies and scripts
└── vercel.json             # Vercel configuration
```

> **Important**: Always make changes in the `server` directory, not in `api`. The `api` folder contains compiled code that is updated by running `npm run build`.

## Workflow

### Local Development

1. Create a new branch from `main`
2. Make your changes in the `server` or `client` folder
3. Test the application locally by running `npm run dev`
4. Commit your changes

### Deploying to Vercel

1. Use `npm run build` to build the production version
2. Make sure all necessary files are in the `api` folder
3. Merge your changes to `main`
4. Vercel will automatically deploy the application

## Coding Recommendations

1. Use TypeScript for all new code
2. Use Zod for data validation
3. For each new API, first create the necessary components on the server, then write the client code
4. Make all changes in `server`, not in `api`
5. Use `try/catch` for error handling

## Debugging

### Server Debugging

To log in the server, use the following code:

```typescript
import { logger } from '../utils/logger.js';

logger.info('Log message');
logger.error('Error message', error);
```

### Debugging API in Vercel

To log in Vercel functions, use `console.log` and view the logs in the Vercel panel:

```javascript
console.log('[VERCEL_API] Log message', data);
```

## Tests

Currently, automated tests are not implemented. For manual testing, use tools like Postman or Thunder Client. 