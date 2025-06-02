#!/bin/bash

echo "Fixing Vercel build issues..."

# First ensure api/index.js exists
if [ ! -f "./api/index.js" ]; then
  # Look for the main server file in various locations
  if [ -f "./api/routes/index.js" ] && grep -q "app.use('/api/v1'" "./api/routes/index.js"; then
    echo "Moving main server file to api root..."
    mv "./api/routes/index.js" "./api/index.js"
  elif [ -f "./api/v1/index.js" ] && grep -q "app.use('/api/v1'" "./api/v1/index.js"; then
    echo "Found main server file in v1 directory..."
    cp "./api/v1/index.js" "./api/index.js"
  elif [ -f "./api/server.js" ]; then
    echo "Found server.js, renaming to index.js..."
    mv "./api/server.js" "./api/index.js"
  else
    # Create the main server file if it doesn't exist anywhere
    echo "Main server file not found. Creating api/index.js..."
    cat > "./api/index.js" << 'EOF'
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { logger } from './utils/logger.js';
import { env } from './env.js';

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1', routes);

// Error handling
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Not found' } });
});

const PORT = process.env.PORT || 3000;

if (env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

export default app;
EOF
  fi
fi

# Ensure routes directory exists
mkdir -p ./api/routes

# Try to find and copy missing route files from various locations
echo "Looking for compiled route files..."

# Function to find and copy a route file
find_and_copy_route() {
  local filename=$1
  
  # Skip if already exists
  if [ -f "./api/routes/${filename}.js" ]; then
    echo "✓ ${filename}.js already exists"
    return 0
  fi
  
  # Check various locations
  if [ -f "./api/${filename}.js" ]; then
    echo "Found ${filename}.js at api root"
    mv "./api/${filename}.js" "./api/routes/${filename}.js"
    return 0
  fi
  
  # Check v1 directory
  if [ -f "./api/v1/${filename}.js" ]; then
    echo "Found ${filename}.js in v1 directory"
    cp "./api/v1/${filename}.js" "./api/routes/${filename}.js"
    return 0
  fi
  
  # Check backup directories for most recent working version
  for backup_dir in $(ls -d backup/api-* 2>/dev/null | sort -r); do
    if [ -f "${backup_dir}/routes/${filename}.js" ]; then
      echo "Found ${filename}.js in ${backup_dir}"
      cp "${backup_dir}/routes/${filename}.js" "./api/routes/${filename}.js"
      return 0
    fi
  done
  
  # As last resort, create a minimal stub file
  if [ "$filename" == "posts" ] || [ "$filename" == "cms-types" ] || [ "$filename" == "spaces" ] || [ "$filename" == "users" ]; then
    echo "Creating minimal ${filename}.js stub..."
    cat > "./api/routes/${filename}.js" << 'EOF'
import express from 'express';
const router = express.Router();

// Temporary stub - full implementation pending
router.get('/', (req, res) => {
  res.json({ message: `${filename} endpoint - implementation pending` });
});

export default router;
EOF
    # Fix the filename placeholder
    sed -i '' "s/\${filename}/${filename}/g" "./api/routes/${filename}.js" 2>/dev/null || \
    sed -i "s/\${filename}/${filename}/g" "./api/routes/${filename}.js"
  fi
}

# Copy route files
route_files=("index" "sites" "posts" "cms-types" "spaces" "users")

for file in "${route_files[@]}"; do
  find_and_copy_route "$file"
done

# Ensure routes/index.js imports all routes correctly
if [ -f "./api/routes/index.js" ]; then
  echo "Checking routes/index.js imports..."
  
  # Check if it's actually the API routes aggregator
  if grep -q "import sitesRouter" "./api/routes/index.js"; then
    echo "✓ routes/index.js appears to be correct"
  else
    echo "routes/index.js might be incorrect, checking for correct version..."
    
    # Look for the correct routes aggregator file
    if [ -f "./api/v1/index.js" ] && grep -q "import sitesRouter" "./api/v1/index.js"; then
      echo "Found correct routes aggregator in v1/index.js"
      cp "./api/v1/index.js" "./api/routes/index.js"
    fi
  fi
fi

# Final verification
echo -e "\nVerifying API structure:"
echo "========================"

if [ -f "./api/index.js" ]; then
  echo "✓ api/index.js (main server)"
else
  echo "✗ api/index.js MISSING!"
fi

for file in "${route_files[@]}"; do
  if [ -f "./api/routes/${file}.js" ]; then
    size=$(wc -c < "./api/routes/${file}.js")
    echo "✓ api/routes/${file}.js (${size} bytes)"
  else
    echo "✗ api/routes/${file}.js MISSING!"
  fi
done

echo -e "\nBuild fix complete!" 