# API Migration Guide

This document provides guidance for developers working with the new API structure in the BetterMode application.

## Overview

We've migrated our API from a scattered approach to a unified structure with the following benefits:
- Consistent URL patterns
- Improved type safety with Zod validation
- Better error handling
- Clear separation of concerns

## New API Structure

All API endpoints follow this pattern:
- Base URL: `/api/v1`
- Sites endpoints: `/api/v1/sites`
- Individual site: `/api/v1/sites/:identifier` (can be ID or subdomain)

## For Developers

### Using the Client API

For all new code, use the API client in `client/src/lib/api.ts` rather than direct fetch calls:

```typescript
import { sitesApi } from '@/lib/api';

// Get all sites
const sites = await sitesApi.getAllSites();

// Get a specific site by ID or subdomain
const site = await sitesApi.getSite('site-subdomain');

// Create a new site
const newSite = await sitesApi.createSite({
  name: 'My New Site',
  subdomain: 'mynewsite'
});
```

### Important Note on Legacy API Calls

The old API endpoints (`/api/sites`, `/api/mock-site`, etc.) have been completely removed. All code must use the new API endpoints. The client-side API module in `client/src/lib/api.ts` provides backward compatibility for legacy functions, but these will be deprecated in future updates.

### Adding New Endpoints

When adding new API endpoints:

1. Create a new file in the appropriate directory under `server/api/`
2. Implement the endpoint using Express Router
3. Add Zod validation for request and response data
4. Add the new route to `server/api/index.ts`
5. Add client methods to `client/src/lib/api.ts`

Example:

```typescript
// server/api/users/index.ts
import express from 'express';
import { z } from 'zod';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  // Implementation...
});

// Get user by ID
router.get('/:id', async (req, res) => {
  // Implementation...
});

export default router;
```

Then register it in `server/api/index.ts`:

```typescript
import usersRouter from './users/index';
apiRouter.use(`${API_PREFIX}/users`, usersRouter);
```

## Troubleshooting

If you encounter issues:

1. Check server logs for error messages
2. Verify API endpoint paths are correct
3. Check Zod validation in both client and server
4. Test endpoint directly using curl or Postman