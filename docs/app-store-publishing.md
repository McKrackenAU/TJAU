# Publishing Tarot Journey to App Stores

This document outlines the process for packaging our Progressive Web App (PWA) into native app containers and publishing it to the Apple App Store and Google Play Store.

## Prerequisites

1. Apple Developer Account ($99/year)
2. Google Play Developer Account ($25 one-time fee)
3. App assets ready (icons, screenshots, descriptions)
4. Privacy policy document

## PWA Wrapper Options

### Option 1: PWA Builder (Recommended for simplicity)

[PWA Builder](https://www.pwabuilder.com/) provides an easy way to package your PWA for app stores.

1. Visit https://www.pwabuilder.com/
2. Enter your PWA URL
3. Generate packages for Android and iOS
4. Follow the platform-specific publishing instructions

### Option 2: Capacitor.js (More customization)

[Capacitor.js](https://capacitorjs.com/) allows deeper integration with native features.

```bash
# Installation
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android

# Initialize Capacitor
npx cap init TarotJourney io.tarotjourney.app

# Add platforms
npx cap add ios
npx cap add android

# Build your web app
npm run build

# Copy web assets
npx cap copy

# Open native IDEs
npx cap open ios
npx cap open android
```

## Apple App Store Submission

1. Use Xcode to prepare your app
2. Configure app metadata, icons, and splash screens
3. Set up App Store Connect with:
   - App Information
   - Pricing and Availability
   - App Privacy details
4. Submit for review

## Google Play Store Submission

1. Use Android Studio to prepare your app
2. Generate a signed APK/AAB
3. Set up Google Play Console with:
   - Store listing
   - Content rating
   - Pricing & distribution
4. Submit for review

## Subscription Implementation

Our app uses Stripe for subscription management which is compliant with app store policies when:

1. We clearly inform users they are subscribing via our website, not through in-app purchases
2. We do not provide direct links to subscribe from within the app (when downloaded from app stores)
3. We implement the required app store in-app purchase APIs for subscriptions initiated from the app store versions

### iOS Specific Requirements

- Use StoreKit for IAP when users subscribe from iOS app
- Don't mention external payment methods within the app
- Implement restore purchases functionality

### Android Specific Requirements

- Use Google Play Billing for IAP when users subscribe from Android app
- Clearly separate website purchases from in-app purchases

## Testing Before Submission

1. Test installation experience
2. Verify offline functionality
3. Ensure responsive design works on all device sizes
4. Test deep linking and share functionality
5. Verify push notifications (if implemented)