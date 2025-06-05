/**
 * Prepare Production Build for Mobile Deployment
 * 
 * This script prepares your app for production mobile deployment by:
 * 1. Setting production environment variables
 * 2. Building the web application for production
 * 3. Configuring Capacitor for production
 * 4. Ensuring all assets point to production URLs
 */

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';

const execAsync = util.promisify(exec);

// Production configuration
const PRODUCTION_SERVER_URL = 'https://www.tarotjourney.au';
const CAPACITOR_CONFIG_PATH = path.resolve('capacitor.config.ts');
const VITE_CONFIG_PATH = path.resolve('vite.config.ts');

// Helper function to run a command and log output
async function runCommand(command, description) {
  console.log(`\n${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr && !stderr.includes('warning')) console.error(stderr);
    console.log(`✓ ${description} completed`);
    return true;
  } catch (error) {
    console.error(`Error: ${description} failed`);
    console.error(error.message);
    return false;
  }
}

// Update Capacitor config for production
function updateCapacitorConfig() {
  console.log('\nUpdating Capacitor configuration for production...');
  
  const capacitorConfig = `import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'au.tarotjourney.app',
  appName: 'Tarot Journey',
  webDir: 'dist/public',
  bundledWebRuntime: false,
  // Production server configuration
  server: {
    url: '${PRODUCTION_SERVER_URL}',
    cleartext: false,
    // Allow navigation to required domains
    allowNavigation: [
      'www.tarotjourney.au',
      'tarotjourney.au',
      '*.stripe.com',
      '*.apple.com',
      'api.elevenlabs.io'
    ]
  },
  // Splash screen configuration
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#6c43bc",
      androidSplashResourceName: "splash",
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#6c43bc'
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#6c43bc'
    },
    PurchasePlugin: {
      defaultProductIdentifier: 'au.tarotjourney.subscription.monthly',
      validateReceipts: true
    }
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'tarotjourney',
    backgroundColor: '#6c43bc',
    limitsNavigationsToAppBoundDomains: false
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    backgroundColor: '#6c43bc',
    overrideUserAgent: 'Tarot Journey App',
    buildOptions: {
      keystorePath: '',
      keystorePassword: '',
      keystoreAlias: '',
      keystoreAliasPassword: '',
      signingType: 'apksigner'
    }
  }
};

export default config;`;

  fs.writeFileSync(CAPACITOR_CONFIG_PATH, capacitorConfig);
  console.log('✓ Capacitor configuration updated for production');
}

// Create production environment file
function createProductionEnv() {
  console.log('\nCreating production environment configuration...');
  
  const prodEnv = `# Production Environment Variables
NODE_ENV=production
VITE_APP_URL=${PRODUCTION_SERVER_URL}
VITE_API_URL=${PRODUCTION_SERVER_URL}/api
VITE_SOCKET_URL=${PRODUCTION_SERVER_URL}
`;

  fs.writeFileSync('.env.production', prodEnv);
  console.log('✓ Production environment file created');
}

// Main function
async function prepareProductionBuild() {
  console.log('=== PREPARING PRODUCTION BUILD FOR MOBILE DEPLOYMENT ===');
  
  try {
    // Step 1: Create production environment
    createProductionEnv();
    
    // Step 2: Update Capacitor config for production
    updateCapacitorConfig();
    
    // Step 3: Build the web application for production
    const buildSuccess = await runCommand('NODE_ENV=production npm run build', 'Building web application for production');
    
    if (!buildSuccess) {
      console.error('Failed to build the web application. Aborting.');
      return;
    }
    
    // Step 4: Generate app icons and splash screens
    await runCommand('npx tsx scripts/generate-app-store-icons.ts', 'Generating app store assets');
    
    // Step 5: Add platforms if they don't exist
    if (!fs.existsSync('ios')) {
      await runCommand('npx cap add ios', 'Adding iOS platform');
    }
    
    if (!fs.existsSync('android')) {
      await runCommand('npx cap add android', 'Adding Android platform');
    }
    
    // Step 6: Copy web assets to native projects
    await runCommand('npx cap copy', 'Copying web assets to native projects');
    
    // Step 7: Sync native dependencies
    await runCommand('npx cap sync', 'Syncing native dependencies');
    
    console.log('\n=== PRODUCTION BUILD PREPARATION COMPLETE ===');
    console.log('\nYour mobile apps are now configured to use the production server:');
    console.log(`${PRODUCTION_SERVER_URL}`);
    console.log('\nNext steps:');
    console.log('1. Open iOS project: npx cap open ios');
    console.log('2. Open Android project: npx cap open android');
    console.log('3. Build and deploy to app stores');
    console.log('\nImportant: The mobile apps will now connect to your production server,');
    console.log('ensuring users get the latest features and voice improvements.');
    
  } catch (error) {
    console.error('Production build preparation failed:', error);
  }
}

// Run the preparation
prepareProductionBuild();