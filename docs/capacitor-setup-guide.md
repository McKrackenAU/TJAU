# Capacitor Setup Guide for Tarot Journey

This guide provides detailed instructions for setting up Capacitor in the Tarot Journey project to create native mobile applications for iOS and Android.

## Prerequisites

Before starting, ensure you have:

1. Node.js 16+ and npm installed
2. For iOS development:
   - macOS computer
   - Xcode 13+
   - CocoaPods (`sudo gem install cocoapods`)
   - iOS device or simulator for testing
3. For Android development:
   - Android Studio
   - Java Development Kit (JDK) 11+
   - Android SDK Platform 33+
   - Android device or emulator for testing

## 1. Environment Setup

### Install Capacitor CLI

The Capacitor CLI is already installed in the project, but if you're setting up a new environment, run:

```bash
npm install -g @capacitor/cli
```

### Project Dependencies

The following Capacitor packages are already installed in the project:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npm install @capacitor/app @capacitor/splash-screen @capacitor/status-bar @capacitor/local-notifications
npm install capacitor-plugin-purchase
```

## 2. Project Configuration

### Capacitor Configuration

The `capacitor.config.ts` file controls how Capacitor builds and configures your native apps. Important settings include:

- `appId`: The unique app identifier (bundle ID in iOS, package name in Android)
- `appName`: The display name of your app
- `webDir`: The directory containing your built web assets (should be 'public')
- `server`: Configuration for development server

### Build Web Application

Before adding platforms or syncing, build the web application:

```bash
npm run build
```

### Initialize Capacitor

To initialize Capacitor in the project and add platforms:

```bash
# Initialize capacitor (if not already done)
npx cap init

# Add iOS platform
npx cap add ios

# Add Android platform
npx cap add android
```

## 3. iOS-Specific Setup

### Configure iOS Project

1. Open the iOS project in Xcode:

```bash
npx cap open ios
```

2. Configure project settings in Xcode:
   - Select the project in the Navigator panel
   - Go to "Signing & Capabilities" tab
   - Set a Team (requires Apple Developer account)
   - Configure any required capabilities (e.g., Push Notifications)

3. App Icons and Splash Screen:
   - Replace the placeholder icons in `App/App/Assets.xcassets/AppIcon.appiconset`
   - Configure splash screen images in the Assets catalog

4. Info.plist Configuration:
   - Update the application's privacy descriptions for any required permissions

### Setup In-App Purchases for iOS

1. Register in-app products in App Store Connect:
   - Create subscription product with ID `io.tarotjourney.subscription.monthly`
   - Configure subscription pricing and duration
   - Set up a 7-day free trial

2. Configure StoreKit for testing:
   - In Xcode, go to Product > Scheme > Edit Scheme
   - Select the Run action
   - Check "StoreKit Configuration" and select your configuration file

## 4. Android-Specific Setup

### Configure Android Project

1. Open the Android project in Android Studio:

```bash
npx cap open android
```

2. Configure application settings:
   - Update `android/app/src/main/res/values/strings.xml` for app name
   - Configure app icons in `android/app/src/main/res/mipmap-*` directories
   - Review and update themes in `android/app/src/main/res/values/styles.xml`

3. AndroidManifest.xml Configuration:
   - Add any required permissions
   - Set up deep linking (if needed)
   - Configure activity launch mode and orientation

4. Gradle Configuration:
   - Review and update build.gradle files as needed
   - Configure Play Billing dependencies

### Setup In-App Purchases for Android

1. Register products in Google Play Console:
   - Create subscription product with ID `io.tarotjourney.subscription.monthly`
   - Configure subscription pricing and free trial period
   - Set up tax and compliance information

2. Configure billing permissions:
   - Ensure `BILLING` permission is added to AndroidManifest.xml
   - Apply the correct version of Play Billing Library in build.gradle

## 5. Working with Capacitor Plugins

### Core Plugins

The project uses these core Capacitor plugins:

1. **App**: For app lifecycle events
   ```typescript
   import { App } from '@capacitor/app';
   
   App.addListener('appStateChange', ({ isActive }) => {
     console.log('App is now ' + (isActive ? 'active' : 'inactive'));
   });
   ```

2. **SplashScreen**: For controlling the native splash screen
   ```typescript
   import { SplashScreen } from '@capacitor/splash-screen';
   
   // Show the splash screen until the app is ready
   SplashScreen.show();
   
   // Hide the splash screen when ready
   SplashScreen.hide();
   ```

3. **StatusBar**: For controlling the status bar appearance
   ```typescript
   import { StatusBar } from '@capacitor/status-bar';
   
   // Set status bar style
   StatusBar.setStyle({ style: 'dark' });
   ```

4. **LocalNotifications**: For scheduling notifications
   ```typescript
   import { LocalNotifications } from '@capacitor/local-notifications';
   
   // Request permission
   await LocalNotifications.requestPermissions();
   
   // Schedule notification
   await LocalNotifications.schedule({
     notifications: [
       {
         title: "Tarot Journey",
         body: "Time for your daily reading!",
         id: 1,
         schedule: { at: new Date(Date.now() + 1000 * 60 * 60 * 24) }
       }
     ]
   });
   ```

### Purchases Plugin

For in-app purchases, we use the capacitor-plugin-purchase plugin:

```typescript
import { PurchasePlugin } from 'capacitor-plugin-purchase';

// Initialize the plugin
await PurchasePlugin.initialize();

// Fetch products
const products = await PurchasePlugin.getProducts({
  productIds: ['io.tarotjourney.subscription.monthly']
});

// Make a purchase
const purchase = await PurchasePlugin.buyProduct({
  productId: 'io.tarotjourney.subscription.monthly'
});

// Restore purchases
const restored = await PurchasePlugin.restorePurchases();
```

## 6. Development Workflow

### Syncing Web Code to Native Projects

After making changes to your web code:

1. Build the web app:
   ```bash
   npm run build
   ```

2. Sync changes to native projects:
   ```bash
   npx cap sync
   ```

### Live Reload for Development

For faster development with live reload:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Update capacitor.config.ts to use the dev server:
   ```typescript
   server: {
     url: 'http://YOUR_LOCAL_IP:5000',
     cleartext: true
   }
   ```

3. Run with live reload:
   ```bash
   npx cap run ios --livereload --external
   # or
   npx cap run android --livereload --external
   ```

## 7. Building for Production

### iOS Production Build

1. Open the iOS project in Xcode:
   ```bash
   npx cap open ios
   ```

2. Select "Generic iOS Device" as the build target

3. Go to Product > Archive

4. When archiving is complete, the organizer window will appear where you can upload to App Store Connect

### Android Production Build

1. Open the Android project in Android Studio:
   ```bash
   npx cap open android
   ```

2. Go to Build > Generate Signed Bundle / APK

3. Select Android App Bundle for Play Store distribution

4. Enter your keystore information

5. Select the release build variant

6. Complete the build process

## 8. Troubleshooting

### Common Issues

- **Plugin not found**: Make sure the plugin is installed and you've run `npx cap sync`
- **iOS build errors**: Check for proper code signing, provisioning profiles, and Xcode version
- **Android build errors**: Verify Gradle version compatibility and SDK versions
- **In-app purchase errors**: Ensure product IDs match exactly with store console configurations

### Debugging Tips

- iOS: Use Xcode's debugger and console log
- Android: Use logcat in Android Studio
- In-app purchases: Test with StoreKit Testing on iOS and Google Play Billing test accounts

## 9. Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS App Development Guide](https://developer.apple.com/app-store/submitting/)
- [Android App Development Guide](https://developer.android.com/studio/publish)
- [StoreKit Testing](https://developer.apple.com/documentation/xcode/setting-up-storekit-testing-in-xcode)
- [Google Play Billing Library](https://developer.android.com/google/play/billing)