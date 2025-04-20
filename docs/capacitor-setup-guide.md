# Capacitor Setup Guide for Tarot Journey

This document outlines the necessary steps to set up Capacitor for both iOS and Android platforms, enabling the Tarot Journey app to be published on the Apple App Store and Google Play Store.

## Prerequisites

1. Node.js (v14 or later)
2. Xcode (for iOS builds)
3. Android Studio (for Android builds)
4. CocoaPods (for iOS dependencies)
5. JDK 11 or later (for Android builds)

## Initial Setup

1. The project already has Capacitor installed with the following packages:
   - @capacitor/core
   - @capacitor/cli
   - @capacitor/ios
   - @capacitor/android
   - @capacitor/app
   - @capacitor/splash-screen
   - @capacitor/status-bar
   - @capacitor/local-notifications
   - capacitor-plugin-purchase (for in-app purchases)

2. The `capacitor.config.ts` file in the root directory contains all necessary configuration:
   - App name, ID, and version information
   - iOS and Android specific settings
   - Permissions and capabilities

## iOS Setup

### Configure App Settings

1. Open the `capacitor.config.ts` file and ensure the iOS section is properly configured:

```typescript
ios: {
  contentInset: 'always',
  backgroundColor: '#ffffff',
  scheme: 'tarotjourney',
  preferredContentMode: 'mobile',
  minVersion: '13.0', // Minimum iOS version supported
  permissions: [
    'CAMERA',
    'MICROPHONE'
  ]
}
```

2. Verify the app ID in `capacitor.config.ts` matches your Apple Developer account's bundle identifier.

### Building for iOS

1. Build the web assets:
```bash
npm run build
```

2. Add the iOS platform if not already added:
```bash
npx cap add ios
```

3. Copy the web assets to the iOS project:
```bash
npx cap copy ios
```

4. Update native dependencies:
```bash
npx cap sync ios
```

5. Open the project in Xcode:
```bash
npx cap open ios
```

6. In Xcode:
   - Set your team signing certificate
   - Configure app capabilities (push notifications, in-app purchases)
   - Update app icon and splash screen assets
   - Configure App Store Connect information

7. Create Archive for App Store submission:
   - In Xcode, select "Product" > "Archive"
   - Upload to App Store using the organizer window

## Android Setup

### Configure App Settings

1. Open the `capacitor.config.ts` file and ensure the Android section is properly configured:

```typescript
android: {
  allowMixedContent: true,
  captureInput: true,
  backgroundColor: '#ffffff',
  webViewUserAgentAppend: 'TarotJourney',
  permissions: [
    'android.permission.CAMERA',
    'android.permission.RECORD_AUDIO',
    'android.permission.READ_EXTERNAL_STORAGE',
    'android.permission.WRITE_EXTERNAL_STORAGE'
  ]
}
```

2. Verify the app ID in `capacitor.config.ts` matches your Google Play Console's application ID.

### Building for Android

1. Build the web assets:
```bash
npm run build
```

2. Add the Android platform if not already added:
```bash
npx cap add android
```

3. Copy the web assets to the Android project:
```bash
npx cap copy android
```

4. Update native dependencies:
```bash
npx cap sync android
```

5. Open the project in Android Studio:
```bash
npx cap open android
```

6. In Android Studio:
   - Update app icon and splash screen assets
   - Configure signing configuration for release
   - Verify manifest permissions

7. Build AAB for Google Play submission:
   - In Android Studio, select "Build" > "Generate Signed Bundle / APK"
   - Choose "Android App Bundle" 
   - Create or select your keystore file
   - Generate the signed AAB
   - Upload to Google Play Console

## Setting Up In-App Purchases

### iOS (App Store)

1. Configure in-app purchase products in App Store Connect:
   - Log in to App Store Connect
   - Select your app and go to the "Features" tab
   - In the "In-App Purchases" section, create your subscription products
   - For Tarot Journey, set up the following product:
     - Product ID: `io.tarotjourney.subscription.monthly` 
     - Type: Auto-Renewable Subscription
     - Include 7-day free trial
     - Configure subscription tiers and localized pricing

2. The in-app purchase functionality is already implemented in:
   - `client/src/services/app-store-payments.ts`
   - `client/src/components/subscription/app-store-subscription.tsx`
   - `client/src/pages/subscribe-native.tsx`

### Android (Google Play)

1. Configure in-app purchase products in Google Play Console:
   - Log in to Google Play Console
   - Select your app and go to "Monetization setup"
   - Create subscription products
   - For Tarot Journey, set up the following product:
     - Product ID: `io.tarotjourney.subscription.monthly`
     - Type: Subscription
     - Include 7-day free trial
     - Configure subscription tiers and pricing

2. The in-app purchase functionality is already implemented in the same files as iOS.

## Testing In-App Purchases

### iOS TestFlight

1. Make sure your app is uploaded to TestFlight in App Store Connect
2. Add internal or external testers
3. Configure Sandbox tester accounts for testing in-app purchases
4. Use these accounts for testing without actual charges

### Android Testing

1. Create a closed testing track in Google Play Console
2. Upload your app bundle
3. Add testers via email addresses or Google Groups
4. Configure test accounts for in-app purchase testing

## Backend Verification

The server-side verification for app store purchases is implemented in:
- `server/app-store-verification.ts`
- `server/routes.ts` (endpoint: `/api/verify-app-store-purchase`)

For production, enhance these with:
1. Real receipt validation with Apple and Google servers
2. Secure storage of purchase records
3. Proper error handling and logging
4. Webhook handling for subscription status changes

## Troubleshooting

### Common iOS Issues:
- Signing certificate problems: Verify team and provisioning profiles
- Missing entitlements: Check app capabilities in Xcode
- Rejected submissions: Review App Store Guidelines

### Common Android Issues:
- Missing permissions: Check Android Manifest
- Version code conflicts: Ensure each submission has an incremented version code
- Package name issues: Verify consistent package naming

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Capacitor In-App Purchase Plugin Documentation](https://github.com/capacitor-community/in-app-purchases)