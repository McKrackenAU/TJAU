import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Define output directories
const IOS_OUTPUT_DIR = path.resolve('ios/App/App/Assets.xcassets/AppIcon.appiconset');
const ANDROID_OUTPUT_DIR = path.resolve('android/app/src/main/res');

// Create output directories if they don't exist
if (!fs.existsSync(IOS_OUTPUT_DIR)) {
  fs.mkdirSync(IOS_OUTPUT_DIR, { recursive: true });
}

// Create Android resource directories if they don't exist
const androidResDirs = [
  'drawable',
  'drawable-ldpi',
  'drawable-mdpi', 
  'drawable-hdpi',
  'drawable-xhdpi',
  'drawable-xxhdpi',
  'drawable-xxxhdpi',
  'mipmap-mdpi',
  'mipmap-hdpi',
  'mipmap-xhdpi',
  'mipmap-xxhdpi',
  'mipmap-xxxhdpi',
  'mipmap-anydpi-v26',
];

for (const dir of androidResDirs) {
  const fullPath = path.join(ANDROID_OUTPUT_DIR, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
}

// iOS icon sizes required for App Store submission
const IOS_ICON_SIZES = [
  { size: 20, scales: [1, 2, 3] },       // Notification icon (20pt)
  { size: 29, scales: [1, 2, 3] },       // Settings icon (29pt)
  { size: 40, scales: [1, 2, 3] },       // Spotlight icon (40pt)
  { size: 60, scales: [2, 3] },          // App icon (60pt)
  { size: 76, scales: [1, 2] },          // iPad app icon (76pt)
  { size: 83.5, scales: [2] },           // iPad Pro app icon (83.5pt)
  { size: 1024, scales: [1] }            // App Store icon (1024pt)
];

// Android icon sizes
const ANDROID_ICON_SIZES = [
  { name: 'drawable-ldpi/ic_launcher.png', size: 36 },
  { name: 'drawable-mdpi/ic_launcher.png', size: 48 },
  { name: 'drawable-hdpi/ic_launcher.png', size: 72 },
  { name: 'drawable-xhdpi/ic_launcher.png', size: 96 },
  { name: 'drawable-xxhdpi/ic_launcher.png', size: 144 },
  { name: 'drawable-xxxhdpi/ic_launcher.png', size: 192 },
  { name: 'mipmap-mdpi/ic_launcher.png', size: 48 },
  { name: 'mipmap-hdpi/ic_launcher.png', size: 72 },
  { name: 'mipmap-xhdpi/ic_launcher.png', size: 96 },
  { name: 'mipmap-xxhdpi/ic_launcher.png', size: 144 },
  { name: 'mipmap-xxxhdpi/ic_launcher.png', size: 192 },
];

// Create iOS icons
async function generateIosIcons() {
  try {
    console.log('Generating iOS app icons...');
    
    // Source icon (should be high resolution, at least 1024x1024)
    const sourceIcon = path.resolve('generated-icon.png');
    const svgBuffer = fs.readFileSync(sourceIcon);
    
    // Generate Contents.json file for iOS
    const contentsJsonTemplate = {
      images: [] as any[],
      info: {
        version: 1,
        author: "xcode"
      }
    };
    
    // Generate each icon size with appropriate scales
    for (const { size, scales } of IOS_ICON_SIZES) {
      for (const scale of scales) {
        const pixelSize = Math.round(size * scale);
        const filename = `AppIcon-${size}x${size}@${scale}x.png`;
        
        await sharp(svgBuffer)
          .resize(pixelSize, pixelSize)
          .png()
          .toFile(path.join(IOS_OUTPUT_DIR, filename));
        
        contentsJsonTemplate.images.push({
          size: `${size}x${size}`,
          idiom: size >= 76 ? "ipad" : "iphone",
          filename,
          scale: `${scale}x`
        });
        
        console.log(`Created iOS icon: ${filename}`);
      }
    }
    
    // Add the 1024x1024 App Store icon
    await sharp(svgBuffer)
      .resize(1024, 1024)
      .png()
      .toFile(path.join(IOS_OUTPUT_DIR, 'AppIcon-1024x1024@1x.png'));
    
    contentsJsonTemplate.images.push({
      size: "1024x1024",
      idiom: "ios-marketing",
      filename: "AppIcon-1024x1024@1x.png",
      scale: "1x"
    });
    
    // Write Contents.json
    fs.writeFileSync(
      path.join(IOS_OUTPUT_DIR, 'Contents.json'),
      JSON.stringify(contentsJsonTemplate, null, 2)
    );
    
    console.log('iOS app icon generation complete!');
  } catch (error) {
    console.error('Error generating iOS app icons:', error);
  }
}

// Create Android icons
async function generateAndroidIcons() {
  try {
    console.log('Generating Android app icons...');
    
    // Source icon
    const sourceIcon = path.resolve('generated-icon.png');
    const svgBuffer = fs.readFileSync(sourceIcon);
    
    // Generate each icon size
    for (const { name, size } of ANDROID_ICON_SIZES) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(ANDROID_OUTPUT_DIR, name));
      
      console.log(`Created Android icon: ${name}`);
    }
    
    // Create adaptive icon background and foreground (new in Android 8.0+)
    const adaptiveIconDir = path.join(ANDROID_OUTPUT_DIR, 'mipmap-anydpi-v26');
    
    // Create ic_launcher.xml for adaptive icons
    const adaptiveIconXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>`;
    
    fs.writeFileSync(path.join(adaptiveIconDir, 'ic_launcher.xml'), adaptiveIconXml);
    
    // Create colors.xml for background color
    const colorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#6c43bc</color>
</resources>`;
    
    const valuesDir = path.join(ANDROID_OUTPUT_DIR, 'values');
    if (!fs.existsSync(valuesDir)) {
      fs.mkdirSync(valuesDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(valuesDir, 'colors.xml'), colorsXml);
    
    console.log('Android app icon generation complete!');
  } catch (error) {
    console.error('Error generating Android app icons:', error);
  }
}

// Create splash screens for both platforms
async function generateSplashScreens() {
  try {
    console.log('Generating splash screens...');
    
    // Source icon
    const sourceIcon = path.resolve('generated-icon.png');
    const svgBuffer = fs.readFileSync(sourceIcon);
    
    // iOS splash screen sizes
    const iosSplashDir = path.resolve('ios/App/App/Assets.xcassets/Splash.imageset');
    if (!fs.existsSync(iosSplashDir)) {
      fs.mkdirSync(iosSplashDir, { recursive: true });
    }
    
    // Create splash screen for iOS
    for (const scale of [1, 2, 3]) {
      const width = 2732 * scale;
      const height = 2732 * scale;
      
      // Create a purple gradient background
      const splashScreen = sharp({
        create: {
          width,
          height,
          channels: 4,
          background: { r: 108, g: 67, b: 188, alpha: 1 }
        }
      });
      
      // Resize the icon to be 30% of the width
      const iconSize = Math.round(width * 0.3);
      const resizedIcon = await sharp(svgBuffer)
        .resize(iconSize, iconSize)
        .toBuffer();
      
      // Add the icon to the center of the splash screen
      await splashScreen
        .composite([
          {
            input: resizedIcon,
            gravity: 'center'
          }
        ])
        .png()
        .toFile(path.join(iosSplashDir, `splash@${scale}x.png`));
      
      console.log(`Created iOS splash screen: splash@${scale}x.png`);
    }
    
    // Create Contents.json for iOS splash screens
    const splashContentsJson = {
      images: [
        {
          idiom: "universal",
          filename: "splash@1x.png",
          scale: "1x"
        },
        {
          idiom: "universal",
          filename: "splash@2x.png",
          scale: "2x"
        },
        {
          idiom: "universal",
          filename: "splash@3x.png",
          scale: "3x"
        }
      ],
      info: {
        version: 1,
        author: "xcode"
      }
    };
    
    fs.writeFileSync(
      path.join(iosSplashDir, 'Contents.json'),
      JSON.stringify(splashContentsJson, null, 2)
    );
    
    // Android splash screen (drawable/splash.png)
    const androidSplashDir = path.join(ANDROID_OUTPUT_DIR, 'drawable');
    
    // Create a purple gradient background
    const androidSplash = sharp({
      create: {
        width: 1920,
        height: 1920,
        channels: 4,
        background: { r: 108, g: 67, b: 188, alpha: 1 }
      }
    });
    
    // Resize the icon to be 30% of the width
    const androidIconSize = Math.round(1920 * 0.3);
    const androidResizedIcon = await sharp(svgBuffer)
      .resize(androidIconSize, androidIconSize)
      .toBuffer();
    
    // Add the icon to the center of the splash screen
    await androidSplash
      .composite([
        {
          input: androidResizedIcon,
          gravity: 'center'
        }
      ])
      .png()
      .toFile(path.join(androidSplashDir, 'splash.png'));
    
    console.log('Created Android splash screen: drawable/splash.png');
    
    console.log('Splash screen generation complete!');
  } catch (error) {
    console.error('Error generating splash screens:', error);
  }
}

// Run all generation functions
async function generateAppStoreAssets() {
  await generateIosIcons();
  await generateAndroidIcons();
  await generateSplashScreens();
  
  console.log('All app store assets generated successfully!');
}

generateAppStoreAssets();