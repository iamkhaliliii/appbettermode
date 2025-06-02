#!/bin/bash

echo "Preparing project for Vercel deployment..."

# Note: We don't run cleanup-api.sh here anymore because
# it might delete files we need during the build process

# 1. Install dependencies
echo "Installing dependencies..."
npm install

# 2. Build client
echo "Building client..."
npm run build:client

# 3. Build server  
echo "Building server..."
npm run build:server

# 4. Run build script to copy files
echo "Running build script..."
node scripts/build.mjs

# 5. Fix any missing files
echo "Fixing build issues..."
bash scripts/fix-vercel-build.sh

# 6. Verify build
echo -e "\nVerifying build structure:"
echo "========================"

# Check main files
files_to_check=(
  "api/index.js"
  "api/env.js"
  "api/routes/index.js"
  "api/routes/sites.js"
  "api/routes/posts.js"
  "api/routes/cms-types.js"
  "api/routes/spaces.js"
  "api/routes/users.js"
  "api/db/index.js"
  "api/db/schema.js"
  "api/utils/logger.js"
  "api/utils/environment.js"
)

all_good=true
for file in "${files_to_check[@]}"; do
  if [ -f "$file" ]; then
    echo "✓ $file"
  else
    echo "✗ $file MISSING!"
    all_good=false
  fi
done

if $all_good; then
  echo -e "\n✅ Build successful! Ready for Vercel deployment."
else
  echo -e "\n❌ Build has issues. Please check the missing files."
  exit 1
fi 