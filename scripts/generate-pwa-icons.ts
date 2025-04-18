import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const OUTPUT_DIR = path.resolve('client/public/icons');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Icon sizes required by manifest.json
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Create PNG icons from SVG for each size
async function generateIcons() {
  try {
    console.log('Generating PWA icons...');
    
    // Generate app icons from the main SVG
    const svgBuffer = fs.readFileSync(path.join(OUTPUT_DIR, 'icon-512x512.svg'));
    
    // Generate each icon size
    for (const size of ICON_SIZES) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(OUTPUT_DIR, `icon-${size}x${size}.png`));
      
      console.log(`Created icon-${size}x${size}.png`);
    }
    
    // Generate favicon
    const faviconSvg = fs.readFileSync(path.join(OUTPUT_DIR, 'favicon-196.svg'));
    await sharp(faviconSvg)
      .resize(196, 196)
      .png()
      .toFile(path.join(OUTPUT_DIR, `favicon-196.png`));
    console.log('Created favicon-196.png');
    
    // Generate Apple touch icon
    const appleSvg = fs.readFileSync(path.join(OUTPUT_DIR, 'apple-icon-180.svg'));
    await sharp(appleSvg)
      .resize(180, 180)
      .png()
      .toFile(path.join(OUTPUT_DIR, `apple-icon-180.png`));
    console.log('Created apple-icon-180.png');
    
    // Generate Apple splash screens (simplified for demo)
    // In production, you'd want unique designs for each screen size
    const splashSizes = [
      { width: 2048, height: 2732, name: 'apple-splash-2048-2732.jpg' }, // iPad Pro 12.9"
      { width: 1668, height: 2388, name: 'apple-splash-1668-2388.jpg' }, // iPad Pro 11"
      { width: 1536, height: 2048, name: 'apple-splash-1536-2048.jpg' }, // iPad Air
      { width: 1242, height: 2688, name: 'apple-splash-1242-2688.jpg' }, // iPhone XS Max
      { width: 1125, height: 2436, name: 'apple-splash-1125-2436.jpg' }, // iPhone X/XS
      { width: 828, height: 1792, name: 'apple-splash-828-1792.jpg' },   // iPhone XR
      { width: 750, height: 1334, name: 'apple-splash-750-1334.jpg' },   // iPhone 8
      { width: 640, height: 1136, name: 'apple-splash-640-1136.jpg' },   // iPhone SE
    ];
    
    // Create a simple splash screen with a gradient background and the app icon
    for (const { width, height, name } of splashSizes) {
      // Create a purple gradient background
      const splashScreen = sharp({
        create: {
          width,
          height,
          channels: 4,
          background: { r: 109, g: 40, b: 217, alpha: 1 }
        }
      });
      
      // Resize the icon to be 30% of the smallest dimension
      const iconSize = Math.min(width, height) * 0.3;
      const resizedIcon = await sharp(svgBuffer)
        .resize(Math.round(iconSize), Math.round(iconSize))
        .toBuffer();
      
      // Add the icon to the center of the splash screen
      await splashScreen
        .composite([
          {
            input: resizedIcon,
            gravity: 'center'
          }
        ])
        .jpeg({ quality: 90 })
        .toFile(path.join(OUTPUT_DIR, name));
      
      console.log(`Created ${name}`);
    }
    
    console.log('PWA icon generation complete!');
  } catch (error) {
    console.error('Error generating PWA icons:', error);
  }
}

generateIcons();