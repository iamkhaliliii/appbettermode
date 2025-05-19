#!/bin/bash

# Cleanup script for redundant API files
# This script removes files and folders that are no longer needed with our unified API architecture

echo "Starting API folder cleanup..."

# Create backup directory
BACKUP_DIR="./backup/api-$(date +%Y%m%d%H%M%S)"
mkdir -p $BACKUP_DIR
echo "Created backup directory: $BACKUP_DIR"

# Backup then remove redundant directories
if [ -d "./api/api" ]; then
  echo "Backing up api/api/ directory..."
  cp -r ./api/api $BACKUP_DIR/
  echo "Removing redundant api/api/ directory..."
  rm -rf ./api/api
fi

if [ -d "./api/routes" ]; then
  echo "Backing up api/routes/ directory..."
  cp -r ./api/routes $BACKUP_DIR/
  echo "Removing redundant api/routes/ directory..."
  rm -rf ./api/routes
fi

# Backup then remove redundant files
if [ -f "./api/api.js" ]; then
  echo "Backing up api/api.js file..."
  cp ./api/api.js $BACKUP_DIR/
  echo "Removing redundant api/api.js file..."
  rm ./api/api.js
fi

if [ -f "./api/vercel.js" ]; then
  echo "Backing up api/vercel.js file..."
  cp ./api/vercel.js $BACKUP_DIR/
  echo "Removing redundant api/vercel.js file..."
  rm ./api/vercel.js
fi

# Remove .DS_Store files
find ./api -name ".DS_Store" -type f -delete
echo "Removed .DS_Store files"

echo "Cleaning API directory..."

# Remove any .ts files from the api directory (these should be compiled to .js)
find api -name "*.ts" -type f -delete

echo "API folder cleanup complete!"
echo "Redundant files were backed up to: $BACKUP_DIR"
echo "The API folder now has a clean structure with essential files only." 