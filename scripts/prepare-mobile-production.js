#!/usr/bin/env node

/**
 * Mobile Production Build Script
 * Prepares the app for mobile deployment with proper voice and API routing
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 Preparing Tarot Journey for Mobile Production...\n');

// Step 1: Update Capacitor config for production
console.log('📱 Updating Capacitor configuration...');
const capacitorConfig = `import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'au.tarotjourney.app',
  appName: 'Tarot Journey',
  webDir: 'dist/public',
  // Production server configuration for mobile apps
  server: {
    url: 'https://www.tarotjourney.au',
    cleartext: false,
    androidScheme: 'https',
    iosScheme: 'https',
    allowNavigation: [
      'www.tarotjourney.au',
      'tarotjourney.au',
      '*.stripe.com',
      '*.apple.com',
      'api.elevenlabs.io',
      'openai.com'
    ]
  },
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

fs.writeFileSync('capacitor.config.ts', capacitorConfig);
console.log('✅ Capacitor config updated for production\n');

// Step 2: Build the web assets
console.log('🔨 Building web assets...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Web assets built successfully\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 3: Sync with Capacitor
console.log('🔄 Syncing with Capacitor...');
try {
  execSync('npx cap sync', { stdio: 'inherit' });
  console.log('✅ Capacitor sync completed\n');
} catch (error) {
  console.error('❌ Capacitor sync failed:', error.message);
  process.exit(1);
}

// Step 4: Create mobile-specific optimizations
console.log('⚡ Creating mobile optimizations...');

// Create mobile performance config
const mobileConfig = {
  production: true,
  apiBaseURL: 'https://www.tarotjourney.au',
  josieVoiceId: 'LSufHJs05fSH7jJqUHhF',
  optimizations: {
    reducedTokens: true,
    mobileCache: true,
    fastVoice: true
  },
  timestamp: new Date().toISOString()
};

fs.writeFileSync('dist/public/mobile-config.json', JSON.stringify(mobileConfig, null, 2));
console.log('✅ Mobile optimizations configured\n');

console.log('🎉 Mobile production build completed successfully!');
console.log('\nNext steps:');
console.log('📱 iOS: Run "npx cap open ios" and build in Xcode');
console.log('📱 Android: Run "npx cap open android" and build in Android Studio');
console.log('\nKey mobile features enabled:');
console.log('🎵 Josie voice synthesis');
console.log('⚡ Optimized API routing to www.tarotjourney.au');
console.log('📱 Mobile-specific caching');
console.log('🚀 Reduced latency for meditation generation');