# Tarot Journey App Store Deployment Documentation

This directory contains all the documentation needed for deploying the Tarot Journey app to the Apple App Store and Google Play Store.

## Getting Started

Before proceeding with app store deployment, make sure you have:

1. An Apple Developer Account ($99/year)
2. A Google Play Developer Account ($25 one-time)
3. Xcode installed for iOS development
4. Android Studio installed for Android development

## Documentation Files

### Setup and Configuration
- [Capacitor Setup Guide](capacitor-setup-guide.md) - Initial setup for Capacitor
- [Native App Configuration](native-app-configuration.md) - Configure iOS and Android projects

### Deployment Process
- [App Store Submission Guide](app-store-submission-guide.md) - Step-by-step guide for submission
- [In-App Purchase Verification](in-app-purchase-verification.md) - Server-side verification setup

## Useful Scripts

The following scripts are available in the `scripts` directory to help with app store deployment:

- `generate-app-store-icons.ts` - Generates all required app icons and splash screens
- `create-app-icon.ts` - Creates the source icon for app store assets
- `prepare-capacitor.js` - Prepares your app for Capacitor build
- `test-in-app-purchases.js` - Tests in-app purchase functionality
- `capture-app-screenshots.js` - Captures app screenshots for store listings

## Deployment Workflow

1. **Prepare Assets**
   ```bash
   # Generate app icon
   npx tsx scripts/create-app-icon.ts
   
   # Generate all app store assets (icons, splash screens)
   npx tsx scripts/generate-app-store-icons.ts
   ```

2. **Build for Capacitor**
   ```bash
   # Build web assets and prepare native projects
   node scripts/prepare-capacitor.js
   ```

3. **Configure Native Projects**
   Follow the instructions in [Native App Configuration](native-app-configuration.md) to configure the iOS and Android projects.

4. **Take Screenshots**
   ```bash
   # Capture screenshots for app store listings
   node scripts/capture-app-screenshots.js
   ```

5. **Submit to App Stores**
   Follow the detailed instructions in [App Store Submission Guide](app-store-submission-guide.md) to submit your app to the Apple App Store and Google Play Store.

## Common Issues and Solutions

### iOS Issues
- **Code Signing Errors**: Ensure your provisioning profiles are correctly set up in Xcode
- **Missing Icons**: Verify all icon sizes are generated and properly added to the Xcode project
- **App Store Rejection**: Review Apple's guidelines and make sure your app complies

### Android Issues
- **Signing Errors**: Check your keystore file and signing configuration
- **Google Play Rejections**: Verify your app meets all Google Play policies
- **Icon Issues**: Ensure adaptive icons are properly configured

## Support

If you encounter any issues during the deployment process, refer to:

- [Apple Developer Forums](https://developer.apple.com/forums/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Capacitor Documentation](https://capacitorjs.com/docs)

## Environment Variables

Make sure these environment variables are set in your production environment:

```
# Apple App Store
APPLE_SHARED_SECRET=your_app_specific_shared_secret

# Google Play Store
GOOGLE_PLAY_SERVICE_ACCOUNT_KEY_PATH=/path/to/service-account-key.json
```

These are required for in-app purchase verification.