#!/bin/bash

# Exit if any command fails
set -e

echo "Starting migration to create cms_types table..."

# Run the migration script directly with Node.js
echo "Running migration..."
NODE_ENV=development node server/db/add-cms-types-table.js

echo "Migration completed successfully!" 