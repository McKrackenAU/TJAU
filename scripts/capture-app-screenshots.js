/**
 * App Store Screenshot Generator
 * 
 * This script captures screenshots of your app for submission to the
 * Apple App Store and Google Play Store. It uses Puppeteer to open
 * different pages of your application and take screenshots at the
 * correct dimensions.
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Create output directories
const SCREENSHOTS_DIR = path.resolve('app-store-assets/screenshots');
const IOS_DIR = path.resolve(SCREENSHOTS_DIR, 'ios');
const ANDROID_DIR = path.resolve(SCREENSHOTS_DIR, 'android');

// Ensure directories exist
[SCREENSHOTS_DIR, IOS_DIR, ANDROID_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Define screenshot configurations
const devices = {
  // iOS device dimensions
  ios: [
    { name: '6.5-inch', width: 1284, height: 2778 }, // iPhone 12 Pro Max
    { name: '5.5-inch', width: 1242, height: 2208 }, // iPhone 8 Plus
    { name: '12.9-inch', width: 2048, height: 2732 }  // iPad Pro
  ],
  // Android device dimensions
  android: [
    { name: 'phone', width: 1080, height: 1920 },     // Standard phone
    { name: 'tablet-7', width: 1200, height: 1920 },  // 7-inch tablet
    { name: 'tablet-10', width: 1600, height: 2560 }  // 10-inch tablet
  ]
};

// Define app pages to capture
const pages = [
  { name: 'home', path: '/', waitSelector: '.home-page' },
  { name: 'cards', path: '/cards', waitSelector: '.cards-grid' },
  { name: 'reading', path: '/reading/daily', waitSelector: '.reading-page' },
  { name: 'journal', path: '/journal', waitSelector: '.journal-page' },
  { name: 'learning', path: '/learning', waitSelector: '.learning-page' }
];

// Check if development server is running
function isServerRunning() {
  try {
    execSync('curl -s http://localhost:5000');
    return true;
  } catch (error) {
    return false;
  }
}

// Capture screenshots
async function captureScreenshots() {
  // Check if server is running
  if (!isServerRunning()) {
    console.error('Error: Development server is not running. Please start the server with "npm run dev"');
    process.exit(1);
  }

  console.log('Launching browser for screenshot capture...');
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // First login to the app - adjust selectors based on your app's structure
    const loginPage = await browser.newPage();
    await loginPage.goto('http://localhost:5000/login', { waitUntil: 'networkidle2' });
    
    // Fill login form and submit - adjust selectors as needed
    await loginPage.type('#email', 'test@example.com');
    await loginPage.type('#password', 'password');
    await loginPage.click('button[type="submit"]');
    
    // Wait for login to complete
    await loginPage.waitForNavigation({ waitUntil: 'networkidle2' });
    
    // Get the cookies to reuse for other pages
    const cookies = await loginPage.cookies();
    await loginPage.close();

    // Process each device type
    for (const platform of ['ios', 'android']) {
      console.log(`\nCapturing ${platform} screenshots...`);
      const outputDir = platform === 'ios' ? IOS_DIR : ANDROID_DIR;
      
      // Process each device size
      for (const device of devices[platform]) {
        console.log(`\nDevice: ${device.name} (${device.width}x${device.height})`);
        const deviceDir = path.join(outputDir, device.name);
        
        if (!fs.existsSync(deviceDir)) {
          fs.mkdirSync(deviceDir, { recursive: true });
        }
        
        // Process each app page
        for (const page of pages) {
          console.log(`  Capturing ${page.name} page...`);
          
          // Open a new page with the device dimensions
          const tab = await browser.newPage();
          
          // Set cookies to maintain login state
          await tab.setCookie(...cookies);
          
          // Set viewport to match device dimensions
          await tab.setViewport({ 
            width: device.width, 
            height: device.height,
            deviceScaleFactor: 2  // For high-quality screenshots
          });
          
          // Navigate to the page
          await tab.goto(`http://localhost:5000${page.path}`, { 
            waitUntil: 'networkidle2',
            timeout: 60000  // 60 second timeout
          });
          
          // Wait for content to be loaded
          try {
            await tab.waitForSelector(page.waitSelector, { timeout: 10000 });
          } catch (error) {
            console.warn(`    Warning: Selector "${page.waitSelector}" not found, continuing anyway`);
          }
          
          // Additional wait to ensure any animations complete
          await tab.waitForTimeout(2000);
          
          // Take screenshot
          const screenshotPath = path.join(deviceDir, `${page.name}.png`);
          await tab.screenshot({ 
            path: screenshotPath,
            fullPage: false,
            type: 'png',
            quality: 100
          });
          
          console.log(`    Saved to ${screenshotPath}`);
          await tab.close();
        }
      }
    }
    
    console.log('\nScreenshot capture completed successfully!');
    console.log(`All screenshots saved to: ${SCREENSHOTS_DIR}`);
    
  } catch (error) {
    console.error('Error capturing screenshots:', error);
  } finally {
    await browser.close();
  }
}

// Run the screenshot capture
captureScreenshots();