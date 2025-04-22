#!/bin/bash

# Exit on error
set -e

echo "-------------------------------------"
echo "Setting up Native Platforms for Tarot Journey"
echo "-------------------------------------"

# Step 1: Install required Capacitor plugins
echo "Step 1: Installing Capacitor plugins..."
npm install @capacitor/push-notifications @capacitor/haptics @capacitor/share @capacitor/network

# Step 2: Add Android platform if not already added
if [ ! -d "./android" ]; then
  echo "Step 2: Adding Android platform..."
  npx cap add android
else
  echo "Step 2: Android platform already exists."
fi

# Step 3: Add iOS platform if on macOS and not already added
if [[ "$OSTYPE" == "darwin"* ]]; then
  if [ ! -d "./ios" ]; then
    echo "Step 3: Adding iOS platform..."
    npx cap add ios
  else
    echo "Step 3: iOS platform already exists."
  fi
else
  echo "Step 3: Skipping iOS platform (requires macOS)."
fi

# Step 4: Update native platforms with web content
echo "Step 4: Syncing web content to native platforms..."
npx cap sync

# Step 5: Update Capacitor plugins configuration
echo "Step 5: Configuring Capacitor plugins..."

# Create plugins configuration file if it doesn't exist
if [ ! -f "./capacitor.config.ts" ]; then
  echo "Creating capacitor.config.ts file..."
  cp capacitor.config.ts.example capacitor.config.ts
fi

# Step 6: Generate app icons and splash screens
echo "Step 6: Generating app icons and splash screens..."
npx tsx scripts/generate-app-store-icons.ts

echo "-------------------------------------"
echo "Native platform setup completed!"
echo "-------------------------------------"
echo "Next steps:"
echo "1. Run 'npx cap open android' to open Android Studio"
echo "2. Run 'npx cap open ios' to open Xcode (macOS only)"
echo "3. Configure app signing in the respective IDEs"
echo "4. Build and test on real devices"
echo "-------------------------------------"