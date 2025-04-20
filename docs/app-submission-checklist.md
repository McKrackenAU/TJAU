# App Store Submission Checklist for Tarot Journey

Use this checklist to ensure your Tarot Journey app is ready for submission to both the Apple App Store and Google Play Store.

## Required Assets

### App Icon
- [ ] High-resolution app icon (1024x1024px PNG without transparency for App Store)
- [ ] Adaptive icon assets for Android (foreground and background layers)
- [ ] All required icon sizes generated (can be automated with capacitor resources)

### Screenshots
- [ ] iPhone screenshots (6.5" and 5.5" displays at minimum)
- [ ] iPad screenshots (if supporting iPad)
- [ ] Android phone screenshots (multiple sizes)
- [ ] Android tablet screenshots (if supporting tablets)
- [ ] Ensure screenshots highlight key features of the app
- [ ] Localized screenshots for each supported language

### Preview Video (Optional but Recommended)
- [ ] 15-30 second app preview video
- [ ] Follows platform-specific guidelines for dimensions and format
- [ ] Showcases key user flows and features

## Metadata

### App Store Information
- [ ] App name (matches what's in your app)
- [ ] Subtitle (30 characters)
- [ ] App Store categories (Primary: Lifestyle, Secondary: Education)
- [ ] Keywords (optimize for search)
- [ ] Description (engaging, clear, accurate)
- [ ] What's New (for updates)
- [ ] Support URL
- [ ] Marketing URL (optional)
- [ ] Privacy Policy URL (required)

### Google Play Information
- [ ] App title (matches what's in your app)
- [ ] Short description (80 characters)
- [ ] Full description (engaging, clear, accurate)
- [ ] App categories (Primary: Lifestyle, Secondary: Education)
- [ ] Tags/keywords
- [ ] Contact details
- [ ] Privacy Policy URL (required)
- [ ] Website URL

## Technical Requirements

### iOS/App Store
- [ ] App built with latest Xcode version
- [ ] Supports iOS 14 or later
- [ ] Includes necessary privacy usage descriptions in Info.plist
- [ ] App works in airplane mode or displays appropriate error messages
- [ ] All App Store guidelines followed
- [ ] IAP products configured in App Store Connect
- [ ] Sandbox testing completed for all IAPs
- [ ] App permissions are minimal and justified
- [ ] IPv6 compatibility

### Android/Google Play
- [ ] Targets Android API level 31 (Android 12) or higher
- [ ] Minimum SDK version set appropriately (Android 7.0+)
- [ ] All required app permissions declared and explained
- [ ] App works in airplane mode or displays appropriate error messages
- [ ] Google Play policies followed
- [ ] IAP products configured in Google Play Console
- [ ] Testing completed for all IAPs
- [ ] App bundle (.aab) prepared instead of APK

## Functionality Testing

- [ ] Sign in/registration works properly
- [ ] Subscription enrollment functions correctly
  - [ ] 7-day free trial works as expected
  - [ ] Payment processes correctly
  - [ ] Receipt verification works
- [ ] Subscription management accessible
- [ ] Restoring purchases works correctly
- [ ] Subscription status displayed correctly in app
- [ ] No crashes or freezes during normal use
- [ ] App handles poor network conditions gracefully
- [ ] All features accessible and working
- [ ] Push notifications work if implemented

## Content

- [ ] All tarot card imagery included and loading properly
- [ ] No placeholder or test content in production build
- [ ] Spelling and grammar checked
- [ ] Links functioning properly
- [ ] No broken images or media
- [ ] Audio content plays properly
- [ ] No copyright violations
- [ ] Content meets platform standards (no adult content, etc.)

## Compliance

### Privacy Requirements
- [ ] Privacy policy URL active and complete
- [ ] App Tracking Transparency implementation (iOS)
- [ ] Data collection disclosure complete (Google Play Data Safety)
- [ ] GDPR compliance implemented if serving EU users
- [ ] CCPA compliance implemented if serving California users
- [ ] User data handling follows best practices

### Subscription Compliance
- [ ] Clear terms of subscription displayed before purchase
- [ ] Free trial terms clearly explained
- [ ] Renewal terms made clear to users
- [ ] Cancellation process explained
- [ ] No misleading subscription marketing
- [ ] Restoration of purchases implemented

### Platform-Specific Guidelines
- [ ] App Store Review Guidelines reviewed and followed
- [ ] Google Play Developer Program Policies reviewed and followed
- [ ] Age rating appropriate

## Final Checks

- [ ] App tested on multiple physical devices
- [ ] App tested on both platforms (iOS and Android)
- [ ] All analytics and crash reporting functioning
- [ ] Versioning correct (version number and build number)
- [ ] Backend services functioning properly
- [ ] Verify deep links and universal links work (if applicable)
- [ ] Tested with VoiceOver/TalkBack for accessibility
- [ ] Final production build created with proper signing

## Submission Process

### App Store
- [ ] App Store Connect account has required agreements signed
- [ ] Banking and tax information current
- [ ] App Review Information prepared (test account credentials, demo instructions)
- [ ] Build uploaded via Xcode or App Store Connect
- [ ] All required metadata entered
- [ ] Pricing and availability set
- [ ] In-app purchases configured and ready for review
- [ ] Content rights documentation ready if needed

### Google Play
- [ ] Google Play Console account setup complete
- [ ] Merchant account setup for IAPs
- [ ] Developer content policy agreement signed
- [ ] App content rating questionnaire completed
- [ ] Target countries and pricing set
- [ ] In-app products configured 
- [ ] Test track created and tested
- [ ] Roll-out approach decided (staged or full release)

## Post-Submission

- [ ] Monitor review status
- [ ] Be prepared to respond to reviewer questions quickly
- [ ] Prepare marketing materials for launch
- [ ] Set up app store optimization monitoring
- [ ] Plan for regular updates and improvements