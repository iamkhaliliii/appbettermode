#!/bin/bash

echo "Ensuring correct API structure..."

# First, compile TypeScript files
echo "Compiling TypeScript files..."
npx tsc -p server/tsconfig.server.json

# Check if main index.js exists at root of api
if [ ! -f "./api/index.js" ]; then
  echo "Main index.js missing at api root!"
  
  # Look for it in other locations
  if [ -f "./api/routes/index.js" ]; then
    # It might have been incorrectly placed in routes
    echo "Found index.js in routes folder. Checking if it's the main server file..."
    
    # Check if it imports express and sets up the server
    if grep -q "import express" "./api/routes/index.js" && grep -q "app.use('/api/v1'" "./api/routes/index.js"; then
      echo "This is the main server file. Moving to api root..."
      mv "./api/routes/index.js" "./api/index.js"
    fi
  fi
fi

# Ensure routes directory exists
mkdir -p ./api/routes

# List of expected route files
route_files=("index" "sites" "posts" "cms-types" "spaces" "users")

# Compile and copy route files
echo "Ensuring all route files are in place..."

for file in "${route_files[@]}"; do
  # Check if the compiled JS file exists anywhere in api directory
  found=false
  
  if [ -f "./api/routes/${file}.js" ]; then
    echo "✓ Route file ${file}.js already exists in correct location"
    found=true
  elif [ -f "./api/${file}.js" ]; then
    echo "Found ${file}.js at api root, moving to routes..."
    mv "./api/${file}.js" "./api/routes/${file}.js"
    found=true
  elif [ -f "./api/v1/${file}.js" ]; then
    echo "Found ${file}.js in v1 directory, copying to routes..."
    cp "./api/v1/${file}.js" "./api/routes/${file}.js"
    found=true
  fi
  
  if [ "$found" = false ]; then
    echo "✗ Warning: ${file}.js not found anywhere in api directory"
    
    # Try to compile it directly from source if it exists
    if [ -f "./server/routes/${file}.ts" ]; then
      echo "  Attempting to compile from source..."
      npx tsc "./server/routes/${file}.ts" --outDir "./api/routes" --module nodenext --target es2022 --esModuleInterop --resolveJsonModule --skipLibCheck
    fi
  fi
done

# Final verification
echo -e "\nFinal API structure verification:"
echo "================================"

# Check main files
if [ -f "./api/index.js" ]; then
  echo "✓ api/index.js (main server file)"
else
  echo "✗ api/index.js MISSING - API will not work!"
fi

if [ -f "./api/env.js" ]; then
  echo "✓ api/env.js"
else
  echo "✗ api/env.js MISSING"
fi

# Check route files
echo -e "\nRoute files:"
for file in "${route_files[@]}"; do
  if [ -f "./api/routes/${file}.js" ]; then
    echo "✓ api/routes/${file}.js"
  else
    echo "✗ api/routes/${file}.js MISSING"
  fi
done

# Check other required directories
echo -e "\nOther required files:"
if [ -f "./api/db/index.js" ]; then
  echo "✓ api/db/index.js"
else
  echo "✗ api/db/index.js MISSING"
fi

if [ -f "./api/utils/logger.js" ]; then
  echo "✓ api/utils/logger.js"
else
  echo "✗ api/utils/logger.js MISSING"
fi

if [ -f "./api/utils/environment.js" ]; then
  echo "✓ api/utils/environment.js"  
else
  echo "✗ api/utils/environment.js MISSING"
fi

echo -e "\nAPI structure check complete!" 