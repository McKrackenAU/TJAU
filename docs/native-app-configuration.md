# Native App Configuration Guide for Tarot Journey

This guide explains how to configure the native iOS and Android projects after running the `prepare-capacitor.js` script.

## iOS Configuration (Xcode)

### Opening the Project
```bash
npx cap open ios
```

### Required Configuration

1. **Signing & Capabilities**:
   - Select the project in Xcode's navigator
   - Select the "App" target
   - Go to "Signing & Capabilities" tab
   - Select your Team (Apple Developer account)
   - The Bundle Identifier should match `io.tarotjourney.app` (as in capacitor.config.ts)

2. **Add Capabilities**:
   - Click "+ Capability"
   - Add "In-App Purchase" capability
   - Add "Push Notifications" if you plan to use them
   - Add "Background Modes" > "Remote notifications" if needed

3. **Info.plist Settings**:
   - Set "Privacy - Camera Usage Description" if you use the camera
   - Set minimum iOS version to 13.0 or higher
   - Ensure proper URL schemes are configured for deep linking

4. **App Store Information**:
   - Verify app icon assets are properly set up in Assets.xcassets
   - Verify launch screen is configured correctly

### Building for TestFlight

1. Select "Any iOS Device" as the build target
2. Select Product > Archive
3. Once the archive is complete, click "Distribute App"
4. Select "App Store Connect" as the distribution method
5. Follow the prompts to upload to App Store Connect

## Android Configuration (Android Studio)

### Opening the Project
```bash
npx cap open android
```

### Required Configuration

1. **Package Name**:
   - Verify the package name in `AndroidManifest.xml` matches `io.tarotjourney.app` (as in capacitor.config.ts)

2. **Signing Configuration**:
   - Create a keystore file for signing your app:
     ```bash
     keytool -genkey -v -keystore tarotjourney.keystore -alias tarotjourney -keyalg RSA -keysize 2048 -validity 10000
     ```
   - Move the keystore file to `android/app/`
   - Add signing configuration to `app/build.gradle`:
     ```gradle
     android {
       signingConfigs {
         release {
           storeFile file('tarotjourney.keystore')
           storePassword 'your-store-password'
           keyAlias 'tarotjourney'
           keyPassword 'your-key-password'
         }
       }
       buildTypes {
         release {
           signingConfig signingConfigs.release
           ...
         }
       }
     }
     ```

3. **App Permissions**:
   - Verify needed permissions in `AndroidManifest.xml`:
     ```xml
     <uses-permission android:name="android.permission.INTERNET" />
     <uses-permission android:name="com.android.vending.BILLING" />
     <!-- Add any other required permissions -->
     ```

4. **App Icons**:
   - Verify app icons are properly set in the res/ directories
   - Check splash screen configuration

### Building for Google Play

1. Select Build > Generate Signed Bundle/APK
2. Choose "Android App Bundle" (AAB) for Google Play submission
3. Select your keystore and provide your credentials
4. Select "release" as the build variant
5. The AAB file will be generated in `app/release/`

## Testing In-App Purchases

### iOS Testing

1. Create a sandbox tester account in App Store Connect
2. Configure product IDs in App Store Connect
3. Sign out of the App Store on your test device
4. Run the app and attempt to make a purchase
5. Sign in with the sandbox tester account when prompted

### Android Testing

1. Create test accounts in Google Play Console
2. Configure in-app products in Google Play Console
3. Add your test account to the app's testers list
4. Install the app via Google Play (test track)
5. Make purchases using the test account

## Troubleshooting

### iOS Issues
- If Xcode complains about provisioning profiles, verify your Apple Developer account status
- Make sure your device is registered in your developer account if testing on a physical device
- Check that in-app purchase capability is enabled

### Android Issues
- If you encounter signing issues, regenerate the keystore
- Make sure the package name is consistent throughout the app
- Verify Google Play Billing library is properly integrated

## Final Checklist Before Submission

- App icon and splash screen display correctly
- All app functionality works in the native environment
- In-app purchases can be completed successfully
- App complies with platform-specific design guidelines
- Privacy policy is accessible within the app
- Screenshots and metadata are prepared for app store listings