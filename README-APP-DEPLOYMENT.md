# Tarot Journey App Deployment Guide

This guide provides instructions on how to deploy Tarot Journey as a native app to both Apple App Store and Google Play Store.

## Prerequisites

Before starting the deployment process, ensure you have:

1. Apple Developer Account (for iOS deployment)
2. Google Play Developer Account (for Android deployment)
3. Xcode installed (for iOS, macOS only)
4. Android Studio installed (for Android)
5. Node.js and npm

## Setup and Build Scripts

We've created several scripts to help with the deployment process. Here's how to use them:

### 1. Setup Native Platforms

This script installs necessary Capacitor plugins and sets up Android and iOS platforms:

```bash
# Make the script executable (if not already)
chmod +x scripts/setup-native-platforms.sh

# Run the setup script
./scripts/setup-native-platforms.sh
```

### 2. Generate App Store Assets

Generate all required app icons and splash screens for both iOS and Android:

```bash
# Run the icon generation script
npx tsx scripts/generate-app-store-icons.ts
```

### 3. Test In-App Purchases

Test the in-app purchase functionality on a real device:

```bash
# Run the test script on a device
npx tsx scripts/test-in-app-purchases.ts
```

### 4. Build Native Apps

Build the final packages for submission to app stores:

```bash
# Make the script executable (if not already)
chmod +x scripts/build-native-apps.sh

# Run the build script
./scripts/build-native-apps.sh
```

### 5. Open Native IDEs

Open the native IDEs to finalize the builds and submit to app stores:

```bash
# Open Android Studio
npx cap open android

# Open Xcode (macOS only)
npx cap open ios
```

## Manual Steps

After running the above scripts, there are some manual steps required in each IDE:

### Android Studio (Google Play)

1. **Configure Signing Keys**:
   - Go to `Build > Generate Signed Bundle/APK`
   - Create or import your keystore
   - Configure signing information

2. **Build Release Bundle**:
   - Create an App Bundle (AAB) for Play Store submission
   - Or create an APK for direct distribution

3. **Submit to Play Store**:
   - Log in to Google Play Console
   - Create a new app or update existing app
   - Upload the AAB file
   - Fill out store listing information
   - Complete the content rating questionnaire
   - Set up pricing and distribution

### Xcode (App Store)

1. **Configure Signing**:
   - Select your team in the Signing & Capabilities tab
   - Ensure your Bundle Identifier matches your App Store Connect entry

2. **Create Archive**:
   - Select a device or "Generic iOS Device" as the build target
   - Choose `Product > Archive`

3. **Submit to App Store**:
   - In the Archives organizer, click "Distribute App"
   - Select "App Store Connect"
   - Follow the prompts to upload

## App Store Guidelines

For detailed submission guidelines, please see:
- [Apple App Store Submission Guide](docs/app-store-submission-guide.md)
- [Google Play Submission Guide](docs/app-store-submission-guide.md)

## Privacy Policy

A Privacy Policy is required for both app stores. We've created one at:
- `/public/privacy-policy.html`

Make sure to host this policy on your website and provide the URL during app submission.

## Testing Before Submission

Before submitting to app stores:

1. Test on multiple real devices
2. Verify all features work correctly
3. Test in-app purchases and subscription flows
4. Check performance and UI on different screen sizes

## Support

If you encounter any issues with the deployment process, please contact the development team for assistance.

## Version Control

Remember to commit all changes to your repository before building the final release versions.