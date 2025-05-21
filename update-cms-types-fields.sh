#!/bin/bash

# Exit if any command fails
set -e

echo "Starting migration to add new fields to cms_types table..."

# Run the migration script directly with Node.js
echo "Running migration..."
NODE_ENV=development node server/db/update-cms-types-table.js

echo "Migration completed successfully!" 