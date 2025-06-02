#!/bin/bash

echo "Fixing build issues..."

# Ensure routes directory exists in api
if [ ! -d "./api/routes" ]; then
  echo "Routes directory missing in api folder. Creating..."
  mkdir -p ./api/routes
fi

# Copy compiled routes if they exist in the wrong location
if [ -f "./api/routes.js" ]; then
  echo "Found compiled routes.js, moving to routes/index.js"
  mv ./api/routes.js ./api/routes/index.js
fi

# Check for compiled route files and copy them to the correct location
route_files=("index" "sites" "posts" "cms-types" "spaces" "users")

for file in "${route_files[@]}"; do
  if [ -f "./api/${file}.js" ] && [ ! -f "./api/routes/${file}.js" ]; then
    echo "Moving ${file}.js to routes directory"
    mv "./api/${file}.js" "./api/routes/${file}.js"
  fi
done

# Fix for old v1 structure - if files are in api/v1, move them to routes
if [ -d "./api/v1" ]; then
  echo "Found old v1 directory structure, migrating files..."
  if [ -f "./api/v1/index.js" ] && [ ! -f "./api/routes/index.js" ]; then
    cp "./api/v1/index.js" "./api/routes/index.js"
  fi
  if [ -f "./api/v1/sites.js" ] && [ ! -f "./api/routes/sites.js" ]; then
    cp "./api/v1/sites.js" "./api/routes/sites.js"
  fi
fi

# Check if all required files exist
echo "Checking required files..."
required_files=(
  "api/index.js"
  "api/env.js"
  "api/routes/index.js"
  "api/routes/sites.js"
  "api/routes/posts.js"
  "api/routes/cms-types.js"
  "api/routes/spaces.js"
  "api/routes/users.js"
  "api/db/index.js"
  "api/utils/logger.js"
  "api/utils/environment.js"
)

for file in "${required_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✓ $file exists"
  else
    echo "✗ $file is missing!"
  fi
done

echo "Build fix complete!" 