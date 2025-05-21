#!/bin/bash

# Script to migrate spaces.cms_type from TEXT to UUID with foreign key reference

# Get the current directory
CURRENT_DIR="$(pwd)"

# Extract database connection string from get_db_schema.py
if [ -f "${CURRENT_DIR}/get_db_schema.py" ]; then
  DATABASE_URL=$(grep -o 'DATABASE_URL = "[^"]*"' "${CURRENT_DIR}/get_db_schema.py" | cut -d '"' -f 2)
  
  if [ -z "${DATABASE_URL}" ]; then
    echo "Could not find DATABASE_URL in get_db_schema.py"
    exit 1
  fi
  
  echo "Found DATABASE_URL from get_db_schema.py"
  echo "Using DATABASE_URL: ${DATABASE_URL}"
  
  # Run the space cms_type migration script
  echo "Running space cms_type migration script..."
  NODE_ENV=development DATABASE_URL="${DATABASE_URL}" npx tsx server/db/migrate-space-cms-type.ts
  
  # Check if the script executed successfully
  if [ $? -eq 0 ]; then
    echo "Space cms_type column successfully migrated to UUID!"
    echo "Now restarting the server to use the updated schema..."
    npm run dev
  else
    echo "Failed to migrate spaces.cms_type column. See error messages above."
  fi
else
  echo "Error: get_db_schema.py not found in the current directory."
  echo "Please make sure you're running this script from the project root."
  exit 1
fi 