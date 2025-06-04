#!/bin/bash

# Exit if any command fails
set -e

echo "Starting migration to remove CMS_ tables and add other_properties column..."

# Run the migration script directly with Node.js
echo "Running migration..."
NODE_ENV=development node server/db/drop-cms-tables-migration.js

echo "Migration completed successfully!" 