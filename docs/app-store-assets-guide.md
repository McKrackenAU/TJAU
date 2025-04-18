# App Store Assets Preparation Guide

This guide will help you prepare all the necessary visual assets required for publishing Tarot Journey to both Apple App Store and Google Play Store.

## Icon Requirements

### iOS App Store Icons

| Usage | Size | Format |
|-------|------|--------|
| App Icon | 1024 x 1024px | PNG (no alpha) |
| iPhone | 180 x 180px | PNG |
| iPhone Spotlight | 120 x 120px | PNG |
| iPhone Settings | 87 x 87px | PNG |
| iPad | 167 x 167px | PNG |
| iPad Spotlight | 152 x 152px | PNG |
| iPad Settings | 58 x 58px | PNG |
| App Store | 1024 x 1024px | JPEG or PNG |

### Android Play Store Icons

| Usage | Size | Format |
|-------|------|--------|
| Play Store Listing | 512 x 512px | PNG (32-bit) |
| Adaptive Icon - Foreground | 108 x 108dp | PNG |
| Adaptive Icon - Background | 108 x 108dp | PNG |
| Legacy Icon | 48 x 48dp | PNG |

## Screenshot Requirements

### iOS App Store Screenshots

| Device | Portrait Size | Landscape Size |
|--------|---------------|---------------|
| iPhone 6.5" (iPhone 13 Pro Max) | 1284 x 2778px | 2778 x 1284px |
| iPhone 5.5" (iPhone 8 Plus) | 1242 x 2208px | 2208 x 1242px |
| iPad Pro 12.9" (3rd gen) | 2048 x 2732px | 2732 x 2048px |
| iPad Pro 12.9" (2nd gen) | 2048 x 2732px | 2732 x 2048px |

**Notes:**
- Provide at least one screenshot for each device size
- You can submit up to 10 screenshots per device
- Screenshots should show actual app content, not marketing materials

### Google Play Store Screenshots

| Type | Size | Requirements |
|------|------|--------------|
| Phone Screenshots | 1080 x 1920px minimum | At least 2 required |
| 7-inch Tablet | 1080 x 1920px minimum | Optional |
| 10-inch Tablet | 1080 x 1920px minimum | Optional |

**Notes:**
- JPEG or 24-bit PNG (no alpha)
- Maximum 8 screenshots per type
- Screenshots must be clear and readable

## Additional Required Assets

### iOS App Store

| Asset | Dimensions | Format | Notes |
|-------|------------|--------|-------|
| App Preview Videos | Device specific | .mp4 | 15-30 seconds, optional |

### Google Play Store

| Asset | Dimensions | Format | Notes |
|-------|------------|--------|-------|
| Feature Graphic | 1024 x 500px | JPEG or PNG (no alpha) | Required |
| Promo Graphic | 180 x 120px | JPEG or PNG (no alpha) | Optional |
| TV Banner | 1280 x 720px | JPEG or PNG (no alpha) | Required for TV apps |
| Promo Video | YouTube URL | N/A | Optional |

## Creating Assets from Existing Resources

### Using the PWA Icons as a Base

1. Start with the highest resolution PWA icon (512x512px)
2. Upscale to 1024x1024px for App Store icon using image editing software
3. Create all other required sizes by scaling down from this master asset

### Screenshot Capture Process

1. **Mobile Device Screenshots**
   - Install the PWA on actual devices or use simulators/emulators
   - Navigate to key screens in the app
   - Take screenshots of important features
   - Crop/resize as needed to meet requirements

2. **Using Device Frames**
   - Add device frames to plain screenshots using a tool like [App Launch Pad](https://theapplaunchpad.com/)
   - Ensure frames match the actual devices you're targeting

### Recommended Screenshot Scenes for Tarot Journey

1. Home screen / dashboard
2. Card reading interface
3. Learning track selection
4. Lesson interface with tarot card explanation
5. Journal entry creation
6. Meditation feature
7. Profile page
8. Settings page

## Tools for Asset Creation

1. **[Adobe Photoshop](https://www.adobe.com/products/photoshop.html)** - Professional image editing
2. **[Figma](https://www.figma.com/)** - Design tool with export options
3. **[Canva](https://www.canva.com/)** - Easy-to-use design tool with templates
4. **[Sketch](https://www.sketch.com/)** - Design tool popular for app interfaces
5. **[App Icon Maker](https://appiconmaker.co/)** - Free online tool to generate all icon sizes
6. **[Device Art Generator](https://developer.android.com/distribute/marketing-tools/device-art-generator)** - Add device frames to screenshots
7. **[App Launch Pad](https://theapplaunchpad.com/)** - Create marketing images with device frames

## Optimization Tips

1. **Maintain Visual Consistency**
   - Use the same color scheme and visual style across all assets
   - Ensure your brand is immediately recognizable

2. **Focus on Clarity**
   - Make text readable at small sizes
   - Avoid cluttering images with too much information

3. **Highlight Key Features**
   - Your assets should showcase the main features of Tarot Journey
   - Consider what will appeal most to potential users

4. **Test on Actual Devices**
   - View icons and screenshots on physical devices when possible
   - Check how they appear in both light and dark modes

5. **Follow Platform Guidelines**
   - Adhere to [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
   - Follow [Google Material Design](https://material.io/design) for Android assets

## File Organization

Keep your assets organized in clearly labeled folders:

```
app-store-assets/
├── ios/
│   ├── icons/
│   ├── screenshots/
│   │   ├── iphone_6_5/
│   │   ├── iphone_5_5/
│   │   └── ipad_12_9/
│   └── previews/
├── android/
│   ├── icons/
│   ├── screenshots/
│   │   ├── phone/
│   │   ├── 7_inch_tablet/
│   │   └── 10_inch_tablet/
│   ├── feature_graphic/
│   └── promo_graphic/
└── source_files/
    ├── master_icon.psd
    └── screenshot_templates.sketch
```

By following this organizational structure, you'll have all assets ready when it's time to submit to app stores.