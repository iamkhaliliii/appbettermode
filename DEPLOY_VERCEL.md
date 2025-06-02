# Vercel Deployment Guide for BetterMode App

## Prerequisites

1. A Vercel account (https://vercel.com)
2. Vercel CLI installed: `npm i -g vercel`
3. A PostgreSQL database (Neon, Supabase, or Vercel Postgres)

## Environment Variables

Add these environment variables in Vercel Dashboard → Settings → Environment Variables:

```bash
# Required
DATABASE_URL=your_postgres_connection_string
SESSION_SECRET=generate_a_secure_random_string

# Optional (Vercel sets these automatically)
NODE_ENV=production
VERCEL=1
VERCEL_URL=your-domain.vercel.app
```

## Deployment Steps

### 1. Initial Setup

```bash
# Login to Vercel
vercel login

# Link your project
vercel link
```

### 2. Configure Environment Variables

```bash
# Add environment variables via CLI
vercel env add DATABASE_URL
vercel env add SESSION_SECRET
```

### 3. Deploy

```bash
# Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

## Troubleshooting

### Common Issues:

1. **Build Errors**: Check that all dependencies are in `package.json` (not devDependencies)
2. **API Routes Not Working**: Ensure rewrites in `vercel.json` are correct
3. **Database Connection**: Verify DATABASE_URL is properly set in Vercel
4. **Session Issues**: Make sure SESSION_SECRET is set

### Verify Deployment:

1. Check build logs in Vercel dashboard
2. Test API endpoints: `https://your-domain.vercel.app/api/v1/sites`
3. Verify client routing works properly

## Post-Deployment

1. Set up custom domain (optional)
2. Configure production environment variables
3. Set up monitoring and analytics
4. Test all features thoroughly 