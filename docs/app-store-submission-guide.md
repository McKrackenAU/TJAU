# App Store Submission Guide

This guide provides detailed instructions for submitting the Tarot Journey app to the Apple App Store and Google Play Store.

## Preparing for Submission

### 1. App Assets and Metadata

#### Required for Both Platforms:
- App name: "Tarot Journey"
- App description (short and long versions)
- Keywords/tags
- Privacy policy URL
- Support website URL
- Developer contact information

#### Apple App Store Specific:
- App Store icon (1024x1024px)
- Screenshots for iPhone and iPad (in required dimensions)
- App preview videos (optional but recommended)
- Age rating information
- App Store category: "Lifestyle" or "Education"

#### Google Play Store Specific:
- High-resolution icon (512x512px)
- Feature graphic (1024x500px)
- Screenshots in various sizes
- Promo video (optional but recommended)
- Content rating questionnaire answers
- App category: "Lifestyle" or "Education"

### 2. In-App Purchase Configuration

#### Apple App Store:
1. Log in to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to your app > Features > In-App Purchases
3. Create a new in-app purchase:
   - Type: Auto-Renewable Subscription
   - Reference Name: "Tarot Journey Monthly Subscription"
   - Product ID: "io.tarotjourney.subscription.monthly"
   - Configure pricing and subscription duration (monthly)
   - Add localized information and review screenshot

#### Google Play Store:
1. Log in to [Google Play Console](https://play.google.com/console)
2. Navigate to your app > Monetize > Products > In-app products
3. Create a new subscription:
   - Product ID: "io.tarotjourney.subscription.monthly"
   - Name: "Tarot Journey Monthly Subscription"
   - Description: Explain subscription benefits
   - Configure pricing and subscription period (monthly)

## Submission Process

### Apple App Store Submission

#### 1. Prepare App Binary
- Run `npm run build` to build web assets
- Run Capacitor sync and copy commands:
  ```bash
  npx cap sync ios
  npx cap copy ios
  ```
- Open Xcode: `npx cap open ios`
- Verify signing and capabilities
- Create Archive: Product > Archive

#### 2. Submit to App Store Connect
- In Xcode's Archive organizer, click "Distribute App"
- Select "App Store Connect"
- Select automatic signing or manual signing
- Upload the binary
- Wait for processing (can take 10-30 minutes)

#### 3. Complete App Store Connect Listing
- Log in to [App Store Connect](https://appstoreconnect.apple.com)
- Navigate to your app
- Complete all required metadata:
  - App information
  - Pricing and availability
  - App privacy information
  - Version information
  - Upload screenshots and app preview videos
- Submit for review

#### 4. Respond to Review Questions
- Apple review team may ask questions about your app
- Be prepared to respond promptly
- Average review time: 1-3 days

### Google Play Store Submission

#### 1. Prepare App Bundle
- Run `npm run build` to build web assets
- Run Capacitor sync and copy commands:
  ```bash
  npx cap sync android
  npx cap copy android
  ```
- Open Android Studio: `npx cap open android`
- Verify signing configuration
- Build Bundle: Build > Generate Signed Bundle/APK > Android App Bundle

#### 2. Create Google Play Listing
- Log in to [Google Play Console](https://play.google.com/console)
- Navigate to your app
- Complete all required sections:
  - Store listing
  - Content rating
  - Pricing & distribution
  - App content
  - Upload app bundle (.aab file)
- Submit app to production or a test track

#### 3. Release Management
- Consider using a closed testing track first
- Invite testers to validate the app before production release
- Gradual rollout is recommended for production

## Post-Submission

### Monitoring and Updates

#### App Analytics:
- Monitor app performance using App Store Connect or Google Play Console
- Track downloads, revenue, and user engagement

#### Updates Process:
1. Make changes to your app
2. Increment version number in Capacitor config
3. Rebuild and resubmit following the same process
4. For critical updates, request expedited review (Apple)

### In-App Purchase Verification

Ensure server-side verification is properly implemented:

#### For iOS:
```javascript
// Production verification endpoint
const verifyEndpoint = 'https://buy.itunes.apple.com/verifyReceipt';
// Sandbox verification endpoint
const sandboxVerifyEndpoint = 'https://sandbox.itunes.apple.com/verifyReceipt';
```

#### For Android:
Use Google Play Developer API for verification with your service account credentials.

## Compliance Checklist

Before submitting, ensure your app meets these requirements:

### Apple App Store Guidelines:
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- Clear subscription terms and user-initiated cancellation process
- Privacy policy that complies with Apple's requirements
- No mention of external payment methods

### Google Play Policies:
- [Google Play Developer Policy Center](https://play.google.com/about/developer-content-policy/)
- Handling of user data complies with Play policies
- Subscription disclosure requirements
- Content appropriate for the selected target audience

## Resources

- [Apple App Store Resources](https://developer.apple.com/app-store/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Capacitor Documentation](https://capacitorjs.com/docs)

## Troubleshooting Common Issues

### App Rejected by Apple:
- Metadata issues: Ensure all descriptions accurately represent your app
- Design issues: Follow iOS Human Interface Guidelines
- Functionality problems: Fix any crashes or bugs
- Missing information: Complete all required metadata fields

### App Rejected by Google:
- Policy violations: Review the exact policy cited
- Crashes and bugs: Test thoroughly on multiple Android devices
- Metadata issues: Ensure store listing is complete and accurate
- Permission issues: Only request necessary permissions

If your app is rejected, don't get discouraged. Review the feedback, make the necessary changes, and resubmit.