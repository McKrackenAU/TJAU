#!/bin/bash

# Exit on error
set -e

echo "-------------------------------------"
echo "Building Tarot Journey Native Apps"
echo "-------------------------------------"

# Step 1: Build the web app
echo "Step 1: Building web application..."
npm run build

# Step 2: Generate app icons and splash screens
echo "Step 2: Generating app icons and splash screens..."
npx tsx scripts/generate-app-store-icons.ts

# Step 3: Copy web assets to native platforms
echo "Step 3: Copying web assets to native platforms..."
npx cap sync

# Step 4: Build Android app
echo "Step 4: Building Android app..."

if [ -d "./android" ]; then
  echo "Building Android APK..."
  cd android
  ./gradlew assembleDebug
  echo "Android Debug APK built at: android/app/build/outputs/apk/debug/app-debug.apk"
  
  echo "Building Android AAB (App Bundle) for Play Store..."
  ./gradlew bundleRelease
  echo "Android Release AAB built at: android/app/build/outputs/bundle/release/app-release.aab"
  cd ..
else
  echo "Android platform not found. Run 'npx cap add android' first."
fi

# Step 5: Build iOS app (Mac only)
echo "Step 5: Building iOS app..."
if [[ "$OSTYPE" == "darwin"* ]]; then
  if [ -d "./ios" ]; then
    echo "Building iOS app..."
    cd ios
    xcodebuild -workspace App/App.xcworkspace -scheme App -configuration Release -allowProvisioningUpdates
    echo "iOS app built. Open Xcode to archive and upload to App Store."
    cd ..
  else
    echo "iOS platform not found. Run 'npx cap add ios' first."
  fi
else
  echo "iOS builds can only be created on macOS."
fi

echo "-------------------------------------"
echo "Build process completed!"
echo "-------------------------------------"
echo "Next steps:"
echo "1. Test the debug builds on real devices"
echo "2. Sign the release builds with your signing keys"
echo "3. Upload to Google Play and App Store"
echo "-------------------------------------"