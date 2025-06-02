# Vercel Deployment Checklist

## Pre-Deployment Steps

### 1. Environment Setup
- [ ] Create `.env` file locally with required variables
- [ ] Ensure `.env` is in `.gitignore`
- [ ] Set up PostgreSQL database (Neon, Supabase, or Vercel Postgres)

### 2. Required Environment Variables in Vercel Dashboard
```bash
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
SESSION_SECRET=generate-secure-random-string-here
```

### 3. Test Locally
```bash
# Install dependencies
npm install

# Test TypeScript compilation
npm run check

# Test build process
npm run build

# Run deployment test
bash test-deployment.sh
```

### 4. Fix Common Issues

#### Issue: Routes missing in API folder
```bash
# Run the fix script after build
bash scripts/fix-build.sh
```

#### Issue: TypeScript errors
```bash
# Check for TypeScript errors
npx tsc --noEmit
```

#### Issue: Build fails
```bash
# Clean and rebuild
rm -rf api dist node_modules
npm install
npm run build
```

## Deployment Commands

### First Time Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project
vercel link
```

### Deploy to Vercel
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Post-Deployment Verification

### 1. Check Build Logs
- Go to Vercel Dashboard → Your Project → Functions tab
- Verify all API endpoints are deployed

### 2. Test API Endpoints
```bash
# Replace with your actual domain
curl https://your-app.vercel.app/api/v1/sites
```

### 3. Test Client Routes
- Visit: `https://your-app.vercel.app/`
- Test navigation to `/dashboard`, `/sites`, etc.

### 4. Check Database Connection
- Verify data loads correctly
- Check Vercel function logs for any database errors

## Troubleshooting

### API Routes Not Working
1. Check `vercel.json` rewrites configuration
2. Verify API files are in the correct location
3. Check function logs in Vercel dashboard

### Build Errors
1. Check Node.js version compatibility
2. Verify all dependencies are in `package.json`
3. Run `npm run vercel-build` locally to test

### Database Connection Issues
1. Verify `DATABASE_URL` format and credentials
2. Check if database allows connections from Vercel IPs
3. Enable SSL mode if required

### Client-Side Routing Issues
1. Verify rewrites in `vercel.json`
2. Check that index.html is served for all routes
3. Ensure proper cache headers are set

## Security Checklist
- [ ] Environment variables are set in Vercel (not in code)
- [ ] `.env` file is not committed to git
- [ ] SESSION_SECRET is a secure random string
- [ ] CORS is properly configured for production
- [ ] Database connection uses SSL

## Performance Optimization
- [ ] Static assets have proper cache headers
- [ ] Images are optimized
- [ ] Build output is minimized
- [ ] Unused dependencies are removed

## Final Steps
1. Test all critical user flows
2. Monitor error logs for first 24 hours
3. Set up alerts for API errors
4. Document any custom configuration 