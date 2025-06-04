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

# 6. Copy client build to public directory for Vercel
if [ -d "./dist/public" ]; then
  echo "Copying client build to public directory..."
  mkdir -p ./public
  cp -r ./dist/public/* ./public/
  echo "✓ Client files copied to public directory"
else
  echo "❌ dist/public directory not found!"
fi

# 7. Verify build
echo -e "\nVerifying build structure:"
echo "========================"

# Check main files
files_to_check=(
  "api/index.js"
  "api/vercel-handler.js"
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
  "public/index.html"
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

# Create public directory at root if it doesn't exist
if [ ! -d "./public" ] && [ -d "./dist/public" ]; then
  echo -e "\nCreating symlink from dist/public to public..."
  ln -s dist/public public
elif [ -d "./dist/public" ]; then
  echo -e "\nPublic directory already exists"
else
  echo -e "\n❌ dist/public directory not found!"
  all_good=false
fi

if $all_good; then
  echo -e "\n✅ Build successful! Ready for Vercel deployment."
else
  echo -e "\n❌ Build has issues. Please check the missing files."
  exit 1
fi 