#!/bin/bash

# Find all files that import DashboardLayout from the old path and update them
find client/src/pages/dashboard -type f -name "*.tsx" -exec sed -i '' 's|@/components/layout/dashboard-layout|@/components/layout/dashboard/dashboard-layout|g' {} \;

echo "Updated import paths in dashboard pages" 