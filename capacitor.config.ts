import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.tarotjourney.app',
  appName: 'Tarot Journey',
  webDir: 'public',
  bundledWebRuntime: false,
  // Server configuration
  server: {
    // Production server settings
    hostname: 'tarotjourney.replit.app',
    // Allow navigation to our domains
    allowNavigation: [
      'tarotjourney.replit.app',
      'localhost',
      '*.stripe.com',
      '*.apple.com' 
    ]
  },
  // Splash screen configuration
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#6c43bc", // Primary brand color
      androidSplashResourceName: "splash",
      splashFullScreen: true,
      splashImmersive: true
    },
    // Status bar configuration
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#6c43bc' // Primary brand color
    },
    // Local notifications for reminders
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#6c43bc' // Primary brand color
    },
    // Purchase plugin configuration
    PurchasePlugin: {
      // Default product ID for subscription
      defaultProductIdentifier: 'io.tarotjourney.subscription.monthly',
      // Enable receipt validation
      validateReceipts: true
    }
  },
  // iOS specific configuration
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    // Scheme for deep linking
    scheme: 'tarotjourney',
    // iOS build configuration
    backgroundColor: '#6c43bc',
    limitsNavigationsToAppBoundDomains: true,
    // App Store deployment settings
    appStoreDeployment: {
      version: '1.0.0',
      buildNumber: '1',
      automaticSensitiveDataProtection: true,
      appStoreConnectApiKeyId: '',  // Fill this when deploying
      appStoreConnectApiKeyIssuer: '', // Fill this when deploying
      appStoreConnectApiKeyContent: '' // Fill this when deploying
    }
  },
  // Android specific configuration
  android: {
    // Set to false for production builds
    allowMixedContent: false,
    // Backup rules - tells Android what to backup
    // This is important for preserving user data
    captureInput: true,
    backgroundColor: '#6c43bc',
    overrideUserAgent: 'Tarot Journey App',
    // Play Store deployment settings
    buildOptions: {
      keystorePath: '',  // Path to your keystore file (fill when deploying)
      keystorePassword: '',  // Fill this when deploying
      keystoreAlias: '',  // Fill this when deploying
      keystoreAliasPassword: '',  // Fill this when deploying
      signingType: 'apksigner'
    },
    versionCode: 1,
    versionName: '1.0.0'
  }
};

export default config;