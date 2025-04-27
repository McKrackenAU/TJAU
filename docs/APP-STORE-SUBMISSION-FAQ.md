# App Store Submission FAQ

This document addresses common questions and issues that may arise during the submission of the Tarot Journey app to the Apple App Store and Google Play Store.

## Apple App Store FAQs

### 1. Why was my app rejected?

Common reasons for App Store rejection include:

- **Incomplete Information**: Missing required metadata, privacy policy, or screenshots
- **Crashes and Bugs**: Apple tests all functionality during review
- **Privacy Concerns**: Missing privacy permissions explanations or privacy policy
- **Payment Issues**: Not using Apple's in-app purchase system for digital goods
- **Poor Performance**: Slow loading times, excessive memory usage
- **Misleading Description**: App functionality doesn't match description

**Solution**: Carefully read the rejection reason, fix the identified issues, and resubmit. Apple's review team provides specific feedback on what needs to be addressed.

### 2. How long does the App Store review process take?

**Answer**: Typically 24-48 hours, but it can vary from a few hours to several days depending on review queue and complexity of your app. Initial submissions usually take longer than updates.

### 3. How do I expedite the review process?

**Answer**: For urgent situations, you can request an expedited review:
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "Contact Us"
3. Select "App Review"
4. Choose "Request Expedited Review"
5. Provide a compelling business justification

Note that Apple grants expedited reviews only in limited circumstances.

### 4. What should I do if my app has content or features that might be flagged?

**Answer**: Be proactive:
1. Include detailed explanations in the "App Review Information" section
2. Provide demo account credentials if your app requires login
3. Add notes about any edge cases or potentially confusing features
4. If your app has user-generated content, explain your moderation process

### 5. How do I set up TestFlight for beta testing?

**Answer**:
1. Upload your build to App Store Connect
2. Go to the TestFlight tab
3. Add internal testers (up to 100 people on your team)
4. Add external testers (up to 10,000 people)
5. For external testing, you'll need to provide beta test information and submit for a Beta App Review

## Google Play Store FAQs

### 1. Why was my app rejected from the Play Store?

Common reasons include:

- **Policy Violations**: Not following Google Play policies
- **Content Issues**: Inappropriate content for your selected audience
- **Metadata Problems**: Misleading store listing, inappropriate screenshots
- **Security Concerns**: Permissions not justified or explained
- **Performance Issues**: Crashes, ANRs (Application Not Responding)

**Solution**: Google provides specific policy violation details. Address each issue directly and resubmit.

### 2. How long does the Google Play review process take?

**Answer**: Typically 1-3 days for new apps, and sometimes as quick as a few hours for updates to existing apps. Review times may increase during holidays or when submitting apps with sensitive permissions.

### 3. What's the difference between internal testing, closed testing, and open testing?

**Answer**:
- **Internal testing**: Limited to up to 100 testers who are part of your Play Console account
- **Closed testing**: For specific groups of testers you invite via email or link
- **Open testing**: Available to anyone who has the link, but not visible in Play Store searches

Each level provides progressively wider distribution before full production release.

### 4. How do I handle app signing for Google Play?

**Answer**: Use Google Play App Signing:
1. When you first upload your app, elect to use Play App Signing
2. Upload your app signing key if you have an existing app
3. For new apps, Google can generate and manage the signing key

This allows Google to re-sign and deliver optimized APKs to users while you maintain control of your upload key.

### 5. How do I set up a staged rollout for updates?

**Answer**:
1. Go to Production track in the Play Console
2. Create a new release
3. Upload your AAB/APK
4. Under "Rollout percentage," select a percentage less than 100%
5. Monitor performance before increasing the percentage

This helps catch issues before they affect your entire user base.

## In-App Purchases FAQs

### 1. Why aren't my in-app purchases working in testing?

**Potential issues**:
- **Sandbox Environment**: Make sure you're testing with sandbox/test accounts
- **Product IDs**: Verify product IDs match exactly between app and store console
- **Receipt Validation**: Check server-side validation logic
- **Entitlements**: Ensure subscription entitlements are being properly applied

**Solution**: Use TestFlight for iOS and internal testing tracks for Android to test the complete purchase flow before production release.

### 2. How do I test subscription renewals without waiting for the actual period?

**Answer**:
- **Apple**: Use StoreKit testing configuration files in Xcode for local testing
- **Google**: Use Google Play Billing Library test instruments
- Both platforms offer ways to simulate renewal periods in their sandbox/test environments

### 3. What receipt validation best practices should I follow?

**Answer**:
- Always validate receipts server-side, not just client-side
- Store original purchase data securely
- Implement retry logic for network failures
- Have fallback mechanisms if validation servers are unavailable
- Keep your validation logic updated as platform APIs evolve

## Publishing and Updates FAQs

### 1. How do I handle version numbering across platforms?

**Answer**: Use a consistent versioning scheme:
- **Version name** (e.g., 1.2.3): Visible to users, follows semantic versioning
- **Version code/build number**: Integer that always increases, not visible to users

Increment both appropriately for each release, keeping them synchronized across platforms when possible.

### 2. How often should I update my app?

**Answer**: Find a balance:
- Too frequent: May annoy users and risk introducing bugs
- Too infrequent: May signal abandonment

A good cadence is:
- Minor updates: Every 2-4 weeks
- Major updates: Every 2-3 months
- Critical bug fixes: As soon as possible

### 3. What's the best way to announce updates to users?

**Answer**:
- Use in-app messaging for major features
- Provide a "What's New" section in the app
- Use the app store description field to highlight changes
- For significant updates, consider email newsletters to registered users

## Technical Issues FAQs

### 1. How do I resolve common iOS build errors?

**Answer** for common issues:
- **Missing provisioning profiles**: Verify Apple Developer account and signing identity
- **Bitcode issues**: Ensure all dependencies support bitcode if required
- **Architectural issues**: Verify all dependencies support your target architectures
- **Swift version conflicts**: Update dependencies or use compatibility mode

### 2. How do I resolve common Android build errors?

**Answer** for common issues:
- **Gradle sync failures**: Update Gradle and Android Gradle Plugin versions
- **Duplicate classes**: Check for library conflicts and use proper exclude rules
- **Memory issues during build**: Increase Gradle memory allocation
- **ProGuard/R8 issues**: Verify ProGuard rules are correctly configured

### 3. How do I maintain compatibility across different device versions?

**Answer**:
- Test on a range of devices and OS versions
- Use feature detection rather than version checking
- Employ polyfills and fallbacks for newer APIs
- Leverage platform compatibility libraries
- Consider using a service like Firebase Test Lab or BrowserStack for broader testing

## Resources

- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Developer Policy Center](https://play.google.com/about/developer-content-policy/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Capacitor Documentation](https://capacitorjs.com/docs)