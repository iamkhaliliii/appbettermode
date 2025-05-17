# appbettermode

Modern SPA App for Bettermode API Implementation

## Unified API Architecture

This project uses a unified API architecture that works seamlessly in both local development and Vercel production environments. See [API.md](API.md) for detailed documentation.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Environment Setup

The application requires the following environment variables:

- `NODE_ENV` - Set to `development` or `production`
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 4000)

## API Routes

- `/api/v1/sites` - Get all sites or create a new site
- `/api/v1/sites/:id` - Get a specific site by ID or subdomain
- `/api/health` - API health check endpoint
