#!/bin/bash

# Exit on error
set -e

echo "-------------------------------------"
echo "Building Tarot Journey for App Deployment"
echo "-------------------------------------"

# Step 1: Build the web app
echo "Step 1: Building web application..."
npm run build

# Step 2: Copy web assets to native platforms
echo "Step 2: Copying and syncing with native platforms..."
npx cap copy
npx cap sync

echo "-------------------------------------"
echo "Build process completed!"
echo "-------------------------------------"
echo "Next steps:"
echo "1. To open Android project: ./scripts/open-android.sh"
echo "2. To open iOS project: ./scripts/open-ios.sh"
echo "3. Follow the instructions in docs/MOBILE-APP-DEPLOYMENT-GUIDE.md"
echo "-------------------------------------"