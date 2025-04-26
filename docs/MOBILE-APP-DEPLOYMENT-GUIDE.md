# Tarot Journey Mobile App Deployment Guide

This guide provides comprehensive, step-by-step instructions for building and deploying the Tarot Journey app to both the Apple App Store and Google Play Store using Capacitor.

## Prerequisites

Before beginning the deployment process, ensure you have the following:

### Required Accounts
- **Apple Developer Account** ($99/year) - Required for iOS app deployment
- **Google Play Developer Account** ($25 one-time fee) - Required for Android app deployment

### Required Software
- **Node.js** (v14 or later)
- **Git**
- **Xcode** (latest version, Mac only) - For iOS development
- **Android Studio** (latest version) - For Android development
- **JDK 11+** - Required for Android builds

## Step 1: Prepare Your Local Environment

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tarot-journey
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the web application**

   ```bash
   npm run build
   ```

## Step 2: Configure App Details

### For Both Platforms

1. **Update app metadata in `capacitor.config.ts`**

   - Review and update the app ID, name, and other configuration details
   - Make sure the `server.hostname` is set to your production server
   - Ensure `allowMixedContent` is set to `false` for production

2. **Prepare app assets**

   Generate app icons and splash screens by running:

   ```bash
   npx tsx scripts/generate-app-store-icons.ts
   ```

## Step 3: Android App Preparation

1. **Add the Android platform (if not already added)**

   ```bash
   npx cap add android
   ```

2. **Copy web assets to Android project**

   ```bash
   npx cap copy android
   ```

3. **Open Android Studio**

   ```bash
   npx cap open android
   ```

4. **Configure app signing**

   In Android Studio:
   
   a. Go to `Build > Generate Signed Bundle/APK`
   b. Create a new keystore or use an existing one
   c. Fill in the keystore details in `capacitor.config.ts` under `android.buildOptions`
   d. Set up your app's `build.gradle` file with the correct version code and version name

5. **Customize the Android app**

   a. Update app icons in `android/app/src/main/res/`
   b. Configure colors in `android/app/src/main/res/values/colors.xml`
   c. Review `AndroidManifest.xml` and ensure all required permissions are set

6. **Build release AAB**

   ```bash
   cd android
   ./gradlew bundleRelease
   ```
   
   The output file will be located at: `android/app/build/outputs/bundle/release/app-release.aab`

## Step 4: iOS App Preparation (Mac only)

1. **Add the iOS platform (if not already added)**

   ```bash
   npx cap add ios
   ```

2. **Copy web assets to iOS project**

   ```bash
   npx cap copy ios
   ```

3. **Open Xcode**

   ```bash
   npx cap open ios
   ```

4. **Configure app signing**

   In Xcode:
   
   a. Select the project in the Project Navigator
   b. Go to the "Signing & Capabilities" tab
   c. Sign in with your Apple Developer account
   d. Select your team and provisioning profile
   e. Update bundle identifier if needed (must match what's in your Apple Developer account)

5. **Customize the iOS app**

   a. Set up app icons and splash screens
   b. Configure Info.plist with necessary entries
   c. Ensure all required capabilities are enabled

6. **Build the app for archive**

   a. Select "Any iOS Device (arm64)" as the build target
   b. Choose `Product > Archive` from the menu
   c. Once archived, the Xcode Organizer will open

## Step 5: Google Play Store Submission

1. **Set up Google Play Console**

   a. Log in to [Google Play Console](https://play.google.com/console)
   b. Create a new app
   c. Fill in the app details, store listing, and content rating information

2. **Prepare store listing materials**

   - App title: "Tarot Journey"
   - Short description (80 characters max)
   - Full description (4000 characters max)
   - Screenshots in required dimensions
   - Feature graphic (1024x500px)
   - App icon (512x512px)
   - Content rating questionnaire

3. **Configure in-app purchases**

   a. Go to "Monetize > Products > In-app products"
   b. Add your subscription products
      - Product ID: `io.tarotjourney.subscription.monthly`
      - Display name: "Tarot Journey Monthly Subscription"
      - Description and pricing details

4. **Upload your app bundle**

   a. Go to "Production > Releases > Create new release"
   b. Upload your AAB file
   c. Fill in release notes
   d. Review and submit for approval

5. **Complete release**

   a. Consider starting with a staged rollout (e.g., 10% of users)
   b. Monitor for crashes or issues
   c. Gradually increase rollout percentage

## Step 6: Apple App Store Submission

1. **Set up App Store Connect**

   a. Log in to [App Store Connect](https://appstoreconnect.apple.com)
   b. Create a new app
   c. Fill in app information, pricing, and availability

2. **Prepare store listing materials**

   - App name: "Tarot Journey"
   - Subtitle
   - Keywords
   - Description
   - Support URL
   - Marketing URL (optional)
   - Screenshots for all required device sizes
   - App preview videos (optional)
   - App Store icon (1024x1024px)

3. **Configure in-app purchases**

   a. Go to "Features > In-App Purchases > + button"
   b. Select "Auto-Renewable Subscription"
   c. Configure the subscription:
      - Reference Name: "Tarot Journey Monthly Subscription"
      - Product ID: `io.tarotjourney.subscription.monthly`
      - Pricing and subscription duration
      - Add localization information

4. **Upload build from Xcode**

   a. In Xcode Organizer, select your archive
   b. Click "Distribute App"
   c. Choose "App Store Connect"
   d. Follow the steps in the distribution wizard
   e. Wait for the build to process in App Store Connect

5. **Submit for review**

   a. Go to "App Store > iOS App"
   b. Select the version you want to submit
   c. Complete all required information
   d. Click "Submit for Review"

## Step 7: Post-Submission Tasks

### App Store Connect

1. **Monitor review status**
   - Review typically takes 24-48 hours
   - Be prepared to answer any questions from the review team

2. **Set up App Analytics**
   - Monitor downloads, engagement, and retention
   - Track in-app purchase conversions

### Google Play Console

1. **Monitor release status**
   - Track your staged rollout
   - Watch for crashes and ANRs (Application Not Responding)

2. **Set up Play Console analytics**
   - Monitor performance metrics
   - Track user acquisition and retention

## Common Issues and Solutions

### iOS Common Issues

1. **App Store rejection due to metadata**
   - Ensure your app description, screenshots, and preview video accurately represent your app
   - Avoid mentioning competing platforms

2. **App Store rejection due to functionality**
   - Test thoroughly before submission
   - Ensure all app features work as described
   - Make sure subscription terms are clear

3. **Missing privacy policy**
   - Ensure your privacy policy covers all data collection practices
   - Make sure it's accessible within the app

### Android Common Issues

1. **App Bundle signing issues**
   - Ensure you're using the correct keystore and key alias
   - Keep your keystore file secure - losing it means you can't update your app

2. **Target API level requirements**
   - Google Play requires apps to target recent API levels
   - Update your `build.gradle` file accordingly

3. **Permission issues**
   - Only request permissions you actually need
   - Provide clear explanations for sensitive permissions

## Maintenance Guide

### Publishing Updates

1. **Prepare your update**
   - Increment version numbers in `capacitor.config.ts`
   - For iOS: Update both version and build number
   - For Android: Update versionCode and versionName

2. **Rebuild and resubmit**
   - Follow the same build process as above
   - For minor updates, the review process is often faster

### Security Considerations

1. **API Credentials**
   - Never embed sensitive API keys directly in your app
   - Use server-side validation for in-app purchases

2. **User Data**
   - Follow platform-specific guidelines for user data handling
   - Comply with GDPR, CCPA, and other privacy regulations

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Developer Program Policies](https://play.google.com/about/developer-content-policy/)
- [Stripe Mobile API Documentation](https://stripe.com/docs/mobile)

## Need Help?

If you encounter issues during deployment, consult:
- The Capacitor community on [GitHub](https://github.com/ionic-team/capacitor)
- Apple Developer Forums for iOS issues
- Google Play Help Center for Android issues