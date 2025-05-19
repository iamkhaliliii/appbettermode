#!/bin/bash

# Find all files that import BrowserMockup or CommunityContent from the old paths and update them
find client/src -type f -name "*.tsx" -exec sed -i '' 's|@/components/layout/browser-mockup|@/components/layout/dashboard/browser-mockup|g' {} \;
find client/src -type f -name "*.tsx" -exec sed -i '' 's|@/components/layout/community-content|@/components/layout/dashboard/community-content|g' {} \;

echo "Updated import paths for UI components" 