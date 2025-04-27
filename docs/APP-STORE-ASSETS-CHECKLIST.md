# App Store Assets Checklist

Use this checklist to ensure you have all the necessary assets ready for submitting Tarot Journey to the app stores.

## Apple App Store Assets

### Required App Store Connect Information

- [ ] App Name: "Tarot Journey"
- [ ] Subtitle (30 characters max)
- [ ] App Store Category: "Lifestyle" or "Education"
- [ ] Keywords (100 characters max)
- [ ] Description (4000 characters max)
- [ ] Support URL
- [ ] Privacy Policy URL
- [ ] App Store Icon (1024×1024px)
- [ ] Price and Availability
- [ ] Age Rating Information

### Screenshots (All PNG format)

- [ ] **iPhone 6.5" Display**
  - [ ] 3-10 screenshots
  - [ ] 1284×2778px portrait or 2778×1284px landscape

- [ ] **iPhone 5.5" Display**
  - [ ] 3-10 screenshots
  - [ ] 1242×2208px portrait or 2208×1242px landscape

- [ ] **iPad Pro 12.9" Display (3rd generation)**
  - [ ] 3-10 screenshots
  - [ ] 2048×2732px portrait or 2732×2048px landscape

### App Preview Videos (Optional but Recommended)

- [ ] 15-30 seconds in length
- [ ] Appropriate resolution for target devices
- [ ] No references to specific pricing

### In-App Purchase Information

- [ ] Reference Name: "Tarot Journey Monthly Subscription"
- [ ] Product ID: "io.tarotjourney.subscription.monthly"
- [ ] Price Tier
- [ ] Display Name
- [ ] Description
- [ ] Screenshots/Preview

## Google Play Store Assets

### Required Store Listing Information

- [ ] App Name: "Tarot Journey"
- [ ] Short Description (80 characters max)
- [ ] Full Description (4000 characters max)
- [ ] App Category: "Lifestyle" or "Education"
- [ ] Email Address for Contact
- [ ] Privacy Policy URL
- [ ] High-res Icon (512×512px)
- [ ] Content Rating Questionnaire Answers
- [ ] Target Audience and Content Information

### Graphics

- [ ] **Feature Graphic**
  - [ ] 1024×500px JPG or PNG (no alpha)

- [ ] **Phone Screenshots** (2-8 screenshots)
  - [ ] 16:9 aspect ratio
  - [ ] Minimum 320px wide, maximum 3840px wide
  - [ ] PNG or JPEG format

- [ ] **7-inch Tablet Screenshots** (Optional)
  - [ ] 16:9 aspect ratio
  - [ ] Minimum 320px wide, maximum 3840px wide
  - [ ] PNG or JPEG format

- [ ] **10-inch Tablet Screenshots** (Optional)
  - [ ] 16:9 aspect ratio
  - [ ] Minimum 320px wide, maximum 3840px wide
  - [ ] PNG or JPEG format

### Promo Video (Optional but Recommended)

- [ ] YouTube URL
- [ ] 30-120 seconds in length
- [ ] Showcases app functionality and benefits

### In-App Products Information

- [ ] Product ID: "io.tarotjourney.subscription.monthly"
- [ ] Name: "Tarot Journey Monthly Subscription"
- [ ] Description
- [ ] Price
- [ ] Subscription Period

## Additional Marketing Assets

- [ ] App website
- [ ] Social media graphics
- [ ] Email newsletter templates
- [ ] Press release materials

## Tools for Creating Assets

- **Screenshot Capture**: Use scripts/capture-app-screenshots.js
- **Icon Generation**: Use scripts/generate-app-store-icons.ts
- **Image Editing**: Adobe Photoshop, Figma, or Canva
- **Video Creation**: Adobe Premiere, iMovie, or Camtasia

## Best Practices

1. **Consistency**: Maintain consistent branding across all platforms
2. **Localization**: Consider localizing assets for target markets
3. **Updates**: Update assets regularly with new features
4. **Testing**: View assets on actual devices before submission
5. **Competition**: Review competing apps for positioning ideas

## Asset Generation Commands

```bash
# Generate all required icons
npx tsx scripts/generate-app-store-icons.ts

# Generate images for App Store review
npx tsx scripts/capture-app-screenshots.js
```