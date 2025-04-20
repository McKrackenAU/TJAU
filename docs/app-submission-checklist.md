# App Store Submission Checklist

This document provides a comprehensive checklist to ensure that the Tarot Journey app is fully prepared for submission to both the Apple App Store and Google Play Store.

## App Metadata

- [ ] App name: "Tarot Journey"
- [ ] App description (short and long versions)
- [ ] App icon in required sizes
- [ ] Screenshots for all required device sizes
- [ ] Promotional video (optional but recommended)
- [ ] Keywords for App Store optimization
- [ ] Privacy policy URL
- [ ] Support website URL
- [ ] Contact email address
- [ ] Copyright information

## Apple App Store Requirements

### App Information
- [ ] App Store category: Lifestyle or Education
- [ ] Secondary category: Reference
- [ ] Age rating: 12+ 
- [ ] Pricing: Free with in-app purchases
- [ ] Available territories: All territories
- [ ] Release type: Manual or Automatic

### Technical Requirements
- [ ] iOS target version: iOS 13.0 or later
- [ ] App size under 4GB
- [ ] Supports all required device families (iPhone, iPad)
- [ ] App Store icon (1024x1024px)
- [ ] Launch screen configured
- [ ] App uses Apple frameworks appropriately
- [ ] No deprecated APIs used

### In-App Purchases
- [ ] Subscription product configured in App Store Connect
- [ ] Product ID matches app code: "io.tarotjourney.subscription.monthly"
- [ ] Subscription pricing set
- [ ] Subscription duration: Monthly
- [ ] Free trial period: 7 days
- [ ] Subscription group created
- [ ] Subscription levels defined (if offering multiple tiers)
- [ ] Subscription terms displayed in app
- [ ] Receipt validation implemented on server
- [ ] Restore purchases functionality included

### Review Guidelines
- [ ] App complies with Apple [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [ ] Test account provided for review
- [ ] Notes for reviewer explaining app functionality
- [ ] Demonstration account with sample data
- [ ] Special instructions for testing subscription features

## Google Play Store Requirements

### Store Listing
- [ ] App category: Lifestyle or Education
- [ ] Store listing created for each supported language
- [ ] Feature graphic (1024x500px)
- [ ] Screenshots for phone, 7" tablet, 10" tablet
- [ ] Content rating questionnaire completed
- [ ] Target audience and content settings defined
- [ ] Store listing preview for each device type

### Technical Requirements
- [ ] API level target: API level 33+ (Android 13)
- [ ] Minimum API level: API level 24 (Android 7.0)
- [ ] App bundle size optimized (under 150MB if possible)
- [ ] App signing configured
- [ ] App permissions justified and minimized
- [ ] Native libraries included
- [ ] Adaptive icon implemented

### In-App Products
- [ ] Subscription product added to Google Play Console
- [ ] Product ID matches app code: "io.tarotjourney.subscription.monthly"
- [ ] Subscription pricing set for all countries
- [ ] Free trial period: 7 days
- [ ] Subscription grace period set
- [ ] Billing permission added to AndroidManifest.xml
- [ ] Server-side validation implemented

### Policy Compliance
- [ ] App complies with [Google Play policies](https://play.google.com/about/developer-content-policy/)
- [ ] Data safety form completed
- [ ] Personal information handling disclosure
- [ ] Target audience and content configured
- [ ] App permissions explanation provided

## App Functionality Testing

### User Experience
- [ ] Onboarding flow works properly
- [ ] Registration/login functions on native platforms
- [ ] All app features accessible and functional
- [ ] UI displays correctly on all supported device sizes
- [ ] Appropriate loading states shown during network operations
- [ ] Error handling provides clear user feedback
- [ ] Back button behavior works as expected (Android)

### In-App Purchases
- [ ] Subscription purchase flow works on both platforms
- [ ] Free trial activation works correctly
- [ ] Receipt/purchase token validation functions properly
- [ ] Users can restore previous purchases
- [ ] Subscription management screen shows correct status
- [ ] Expiration handling works correctly
- [ ] Users can cancel subscription within the app
- [ ] Payment failures handled gracefully

### Performance
- [ ] App startup time is optimized (under 5 seconds)
- [ ] Network operations use appropriate caching
- [ ] App performs well on lower-end devices
- [ ] Memory usage is optimized
- [ ] Battery consumption is reasonable
- [ ] App functions in low-connectivity scenarios
- [ ] Crash reporting implemented

## Legal Requirements

- [ ] Terms of Service document available
- [ ] Privacy Policy covers all data collection
- [ ] GDPR compliance (for European users)
- [ ] CCPA compliance (for California users)
- [ ] Age restrictions properly implemented
- [ ] In-app purchase disclosures comply with platform rules
- [ ] Usage of copyrighted tarot card images is properly licensed
- [ ] Subscription terms clearly communicated to users

## Submission Assets

### Apple App Store
- [ ] App binary built for App Store with release configuration
- [ ] TestFlight version tested with external testers
- [ ] App Store Connect listing complete
- [ ] App Review Information completed
- [ ] App privacy details provided
- [ ] In-app purchase details configured

### Google Play Store
- [ ] Android App Bundle (AAB) created with release configuration
- [ ] Internal testing track used for pre-release validation
- [ ] Play Store listing complete for all languages
- [ ] Content rating questionnaire completed
- [ ] Data safety form completed
- [ ] In-app products configured

## Post-Submission Plan

- [ ] Monitor review status in both app stores
- [ ] Prepare for potential review rejection issues
- [ ] Plan post-approval marketing
- [ ] Set up monitoring for crash reports and reviews
- [ ] Establish process for handling user feedback
- [ ] Schedule regular update cycles
- [ ] Monitor subscription conversion and retention rates