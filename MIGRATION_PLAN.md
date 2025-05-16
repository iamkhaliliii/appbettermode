# API Migration Plan

This document outlines the steps for migrating the existing scattered API endpoints to our new unified API structure.

## Current Status

We've successfully implemented the following:

- Created a unified API router structure in `server/api/index.ts`
- Implemented the sites API in `server/api/sites/index.ts`
- Fixed server middleware ordering to properly handle API requests
- Updated client-side API to use the new v1 endpoints
- Fixed sites dashboard page to use the new API client
- Removed all old API files completely

## Migration Steps

### 1. API Structure Reorganization

- [x] Create `server/api/index.ts` with API router
- [x] Create `server/api/sites/index.ts` for sites endpoints
- [x] Remove old API code
- [ ] Migrate other API endpoints to the new structure

### 2. API Endpoints Migration

#### Sites API
- [x] GET /api/v1/sites - Get all sites for current user
- [x] GET /api/v1/sites/:identifier - Get site by ID or subdomain
- [x] POST /api/v1/sites - Create a new site

#### Users API (To be implemented)
- [ ] Create `server/api/users/index.ts`
- [ ] GET /api/v1/users - Get all users
- [ ] GET /api/v1/users/:id - Get user by ID
- [ ] GET /api/v1/users/me - Get current user
- [ ] POST /api/v1/users - Create a new user

#### Content API (To be implemented)
- [ ] Create `server/api/content/index.ts`
- [ ] GET /api/v1/content - Get all content
- [ ] GET /api/v1/content/:id - Get content by ID
- [ ] POST /api/v1/content - Create new content

### 3. Client-Side Integration

- [x] Create unified API client in `client/src/lib/api.ts`
- [x] Update SitesDashboardPage to use new API
- [x] Update site dashboard page to use new API
- [ ] Update all other components to use the new API

### 4. Cleanup Plan (Completed)

- [x] Remove old API files completely
- [x] Update documentation

## Fixed Issues

1. Resolved Zod schema validation errors for site data
2. Fixed API routing to prevent Vite middleware from intercepting API requests
3. Updated site details endpoint to properly handle lookup by subdomain
4. Fixed dashboard site page to use new API client
5. Removed old APIs and cleaned up the codebase

## API Features to Add

1. Authentication and authorization middleware
2. Request validation middleware
3. Rate limiting
4. Error handling middleware
5. API documentation using Swagger/OpenAPI

## Testing Strategy

1. Write unit tests for each API endpoint
2. Create integration tests for API workflows
3. Test client-side integration with the new API

## Timeline

- Phase 1 (Current): Sites API Migration - COMPLETED
- Phase 2: Users API Migration - 2 days
- Phase 3: Content API Migration - 3 days
- Phase 4: Other APIs Migration - 5 days
- Phase 5: Testing & Cleanup - 2 days

Total estimated time: 12 days 