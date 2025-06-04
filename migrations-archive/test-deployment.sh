#!/bin/bash

echo "Testing deployment readiness..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test 1: Check Node version
echo -n "Checking Node.js version... "
node_version=$(node -v)
if [[ $node_version =~ ^v(1[468]|20) ]]; then
  echo -e "${GREEN}✓ $node_version${NC}"
else
  echo -e "${RED}✗ $node_version (Vercel supports Node 14.x, 16.x, 18.x, 20.x)${NC}"
fi

# Test 2: Check npm packages
echo -n "Checking npm packages... "
if npm list > /dev/null 2>&1; then
  echo -e "${GREEN}✓ All packages installed${NC}"
else
  echo -e "${RED}✗ Some packages missing. Run 'npm install'${NC}"
fi

# Test 3: Check TypeScript compilation
echo -n "Testing TypeScript compilation... "
if npx tsc --noEmit > /dev/null 2>&1; then
  echo -e "${GREEN}✓ TypeScript compiles without errors${NC}"
else
  echo -e "${RED}✗ TypeScript compilation errors found${NC}"
  npx tsc --noEmit
fi

# Test 4: Test build command
echo -n "Testing build command... "
if npm run build > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Build succeeds${NC}"
else
  echo -e "${RED}✗ Build failed${NC}"
fi

# Test 5: Check for required environment variables
echo "Checking environment variables..."
required_vars=("DATABASE_URL" "SESSION_SECRET")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo -e "${RED}✗ $var is not set${NC}"
  else
    echo -e "${GREEN}✓ $var is set${NC}"
  fi
done

# Test 6: Check Vercel configuration
echo -n "Checking vercel.json... "
if [ -f "vercel.json" ]; then
  echo -e "${GREEN}✓ vercel.json exists${NC}"
else
  echo -e "${RED}✗ vercel.json missing${NC}"
fi

# Test 7: Check for common issues
echo "Checking for common issues..."

# Check for .env file (should not be committed)
if [ -f ".env" ]; then
  echo -e "${GREEN}✓ .env file exists locally${NC}"
  if git ls-files --error-unmatch .env > /dev/null 2>&1; then
    echo -e "${RED}✗ WARNING: .env is tracked by git! Add to .gitignore${NC}"
  fi
else
  echo -e "${RED}✗ No .env file found (create one for local development)${NC}"
fi

# Check API directory structure
echo "Checking API directory structure..."
if [ -d "api" ]; then
  echo -e "${GREEN}✓ api directory exists${NC}"
  
  # After build, check for required files
  if npm run build > /dev/null 2>&1; then
    required_files=("api/index.js" "api/env.js")
    for file in "${required_files[@]}"; do
      if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file exists${NC}"
      else
        echo -e "${RED}✗ $file missing after build${NC}"
      fi
    done
  fi
else
  echo -e "${RED}✗ api directory missing${NC}"
fi

echo -e "\nDeployment readiness check complete!"
echo -e "If all checks pass, run: ${GREEN}vercel --prod${NC}" 