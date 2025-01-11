#!/bin/bash
# Clean up previous build artifacts
rm -rf dist
rm -rf node_modules/.tmp

# Run TypeScript build
npm run type-check

# If TypeScript check passes, proceed with build
if [ $? -eq 0 ]; then
  npm run build
else
  echo "TypeScript check failed. Please fix the errors before building."
  exit 1
fi 