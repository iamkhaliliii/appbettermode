#!/bin/bash

echo "Fixing build issues..."

# Ensure routes directory exists in api
if [ ! -d "./api/routes" ]; then
  echo "Routes directory missing in api folder. Creating..."
  mkdir -p ./api/routes
fi

# Copy compiled routes if they exist
if [ -f "./api/routes.js" ]; then
  echo "Found compiled routes.js, moving to routes/index.js"
  mv ./api/routes.js ./api/routes/index.js
fi

# Check if all required files exist
echo "Checking required files..."
required_files=(
  "api/index.js"
  "api/env.js"
  "api/routes/index.js"
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