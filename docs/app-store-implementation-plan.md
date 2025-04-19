# Tarot Journey App Store Implementation Plan

This document outlines the technical strategy for packaging our PWA as native apps for the Apple App Store and Google Play Store.

## Phase 1: Prepare PWA Foundation (Complete)

- [x] Implement responsive design with mobile-first approach
- [x] Create service worker for offline functionality
- [x] Add install prompt for web-based PWA
- [x] Implement app icon sets for different platforms
- [x] Add manifest.json with appropriate configuration
- [x] Test PWA install experience on various devices

## Phase 2: Capacitor Integration (Current)

- [ ] Install Capacitor core and CLI
- [ ] Initialize Capacitor project with app metadata
- [ ] Configure Capacitor for iOS and Android platforms
- [ ] Add necessary plugins:
  - [ ] In-App Purchases
  - [ ] Push Notifications
  - [ ] Splash Screen
  - [ ] App (for deep linking)
  - [ ] Status Bar
  - [ ] Keyboard
  - [ ] Storage

## Phase 3: Platform-Specific Setup

### iOS
- [ ] Create required app icons in all sizes
- [ ] Configure Info.plist with necessary permissions
- [ ] Set up entitlements for StoreKit
- [ ] Configure push notification certificates
- [ ] Implement iOS-specific styling/safe areas
- [ ] Set up proper deep linking

### Android
- [ ] Create required app icons and splash screens
- [ ] Configure AndroidManifest.xml
- [ ] Set up Google Play billing permissions
- [ ] Implement Android-specific styling
- [ ] Configure FCM for push notifications
- [ ] Set up proper deep linking/app links

## Phase 4: In-App Purchase Implementation

- [ ] Implement unified payment service abstraction (already started)
- [ ] Add platform detection (web/iOS/Android)
- [ ] Integrate StoreKit for iOS
- [ ] Integrate Google Play Billing for Android
- [ ] Create subscription verification endpoints on server
- [ ] Implement receipt/purchase validation
- [ ] Add restore purchases functionality
- [ ] Test subscription flow in sandbox environments

## Phase 5: Continuous Delivery

- [ ] Set up automated builds for iOS/Android
- [ ] Create TestFlight release process
- [ ] Create Google Play internal test track
- [ ] Configure app signing for both platforms
- [ ] Document release process for future updates

## Phase 6: App Submission

- [ ] Prepare all required metadata:
  - [ ] App descriptions
  - [ ] Keywords/SEO
  - [ ] Screenshots and previews
  - [ ] Age ratings
  - [ ] Privacy policy
- [ ] Complete App Store Review Information
- [ ] Complete Play Store Data Safety form
- [ ] Publish to TestFlight for final testing
- [ ] Publish to Google Play internal testing
- [ ] Submit for review on both platforms

## Technical Considerations

### Authentication

Our existing authentication system needs to handle:
- Web login (existing)
- Native app login using the same backend
- Session persistence across app restarts

Implementation:
- Use the same Auth API endpoints
- Store tokens securely using native secure storage
- Add biometric authentication option for native apps

### Networking

- Handle different network environments
- Implement retry logic for flaky connections
- Enhance offline support for native apps

### Platform-Specific Features

iOS:
- Support for Sign in with Apple
- Support for iCloud backup of user data
- Native share sheet integration

Android:
- Material design components to match platform expectations
- App shortcuts
- Widget support

## Timeline

1. **Week 1**: Capacitor setup and initial platform configuration
2. **Week 2**: In-app purchase implementation and testing
3. **Week 3**: Platform-specific optimizations and fixes
4. **Week 4**: App store submission preparation and submission

## Required Resources

- Apple Developer Account ($99/year)
- Google Play Developer Account ($25 one-time)
- Test devices (iOS and Android)
- Apple App-Specific Password for CI/CD
- Google Play API access for CI/CD
- Certificates and provisioning profiles
- Test subscription accounts

## Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| App store rejection | High | Medium | Carefully review guidelines before submission |
| In-app purchase issues | High | Medium | Thorough testing in sandbox environments |
| Performance issues on lower-end devices | Medium | Medium | Performance profiling and optimization |
| Native plugin compatibility | Medium | Low | Stick to official and well-maintained plugins |
| API changes in future OS versions | Medium | Medium | Stay updated on beta releases and developer news |

## Success Metrics

- App approved on both stores within first submission
- User retention matches or exceeds web version
- Subscription conversion rate at or above industry average (1-5%)
- Positive ratings/reviews (target: 4.5+ stars)
- Low crash rate (<0.5%)
- Fast app startup time (<2 seconds)