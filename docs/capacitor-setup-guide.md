# Capacitor Setup Guide for Tarot Journey

This guide explains how to set up Capacitor.js to package the Tarot Journey PWA as native apps for iOS and Android.

## Prerequisites

1. Node.js and npm (already installed)
2. Xcode (for iOS builds)
3. Android Studio (for Android builds)
4. Apple Developer account (for iOS publication)
5. Google Play Developer account (for Android publication)

## Step 1: Install Capacitor

```bash
# Install the Capacitor CLI and core packages
npm install @capacitor/cli @capacitor/core

# Install the platform-specific packages
npm install @capacitor/ios @capacitor/android
```

## Step 2: Initialize Capacitor

```bash
# Initialize Capacitor with your app information
npx cap init "Tarot Journey" "io.tarotjourney.app" --web-dir=public
```

## Step 3: Configure Capacitor

Create or modify `capacitor.config.ts` in the project root:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.tarotjourney.app',
  appName: 'Tarot Journey',
  webDir: 'public',
  bundledWebRuntime: false,
  server: {
    hostname: 'app.tarotjourney.io',
    androidScheme: 'https',
    iosScheme: 'https',
    allowNavigation: ['app.tarotjourney.io']
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#6c43bc",
      androidSplashResourceName: "splash",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
```

## Step 4: Build the Web App

```bash
# Build the production version of the web app
npm run build
```

## Step 5: Add Platforms

```bash
# Add iOS platform
npx cap add ios

# Add Android platform
npx cap add android
```

## Step 6: Update Native Projects

After making changes to the web app, you need to copy the updated files to the native projects:

```bash
# Build web app
npm run build

# Copy web assets to native projects
npx cap copy

# Sync native plugins
npx cap sync
```

## Step 7: iOS Configuration

### Open the iOS project:

```bash
npx cap open ios
```

This will open the project in Xcode. From there:

1. Update app icons in the Assets catalog
2. Configure app capabilities (in the Signing & Capabilities tab)
3. Set up your App Store Connect information
4. Configure provisioning profiles

### Important iOS Files:

- `ios/App/App/Info.plist` - App metadata and permissions
- `ios/App/App/Assets.xcassets` - App icons and images
- `ios/App/App/AppDelegate.swift` - App initialization code

## Step 8: Android Configuration

### Open the Android project:

```bash
npx cap open android
```

This will open the project in Android Studio. From there:

1. Update app icons in the `android/app/src/main/res` directory
2. Configure app metadata in `android/app/src/main/AndroidManifest.xml`
3. Update app signing configuration

### Important Android Files:

- `android/app/src/main/AndroidManifest.xml` - App permissions and metadata
- `android/app/src/main/res/values/strings.xml` - App name and other strings
- `android/app/build.gradle` - App dependencies and build configuration

## Step 9: In-App Purchase Integration

### For iOS (App Store):

1. Set up in-app purchases in App Store Connect
   - Create a subscription product with ID `io.tarotjourney.subscription.monthly`
   - Configure the subscription tier, price point ($11.11 AUD), and renewal terms
   - Set up the subscription groups and configure a 7-day free trial

2. Install the purchase plugin: `npm install capacitor-plugin-purchase`

3. Configure subscription verification
   - Set up App Store Server Notifications in App Store Connect
   - Configure the notification URL to point to your server endpoint
   - Update server verification logic in `/server/app-store-verification.ts`

4. Implement the client-side integration
   - Update `IOSPaymentProcessor` in `app-store-payments.ts` to use the plugin
   - Test the purchase flow with StoreKit testing in development

### For Android (Google Play):

1. Set up in-app products in Google Play Console
   - Create a subscription product with ID `io.tarotjourney.subscription.monthly`
   - Configure the price point ($11.11 AUD) and subscription terms
   - Set up the free trial period (7 days)
   - Configure the grace period and account hold settings

2. Configure the app for Google Play Billing
   - Add the required billing permissions to AndroidManifest.xml
   - Set up real-time developer notifications for subscription events

3. Implement the client-side integration
   - Update `AndroidPaymentProcessor` in `app-store-payments.ts` to use the plugin
   - Test the purchase flow with Google Play's testing tracks

## Step 10: Publishing

### iOS (App Store):

1. Archive the app in Xcode
2. Upload to App Store Connect
3. Fill in all required metadata, screenshots, and preview information
4. Submit for review

### Android (Google Play):

1. Generate a signed APK/AAB in Android Studio
2. Upload to Google Play Console
3. Fill in all required metadata, screenshots, and preview information
4. Submit for review

## Step 11: Updates

To update the app after it's published:

1. Make changes to the web app
2. Run `npm run build`
3. Run `npx cap copy`
4. Run `npx cap sync`
5. Open the native projects and rebuild/resubmit

## Troubleshooting

### Common iOS Issues:

- Missing provisioning profiles
- App capabilities not properly configured
- Missing privacy usage descriptions in Info.plist

### Common Android Issues:

- Signing configuration errors
- Manifest merge conflicts
- Missing dependencies

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Store Guidelines](https://play.google.com/about/developer-content-policy/)
- [In-App Purchase Documentation](https://capacitorjs.com/docs/apis/in-app-purchases)