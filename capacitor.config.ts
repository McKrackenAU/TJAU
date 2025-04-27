import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'au.tarotjourney.app',
  appName: 'Tarot Journey',
  webDir: 'public',
  bundledWebRuntime: false,
  // Server configuration
  server: {
    // Production server settings
    hostname: 'www.tarotjourney.au',
    // Allow navigation to our domains
    allowNavigation: [
      'www.tarotjourney.au',
      'tarotjourney.au',
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
      defaultProductIdentifier: 'au.tarotjourney.subscription.monthly',
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
    limitsNavigationsToAppBoundDomains: true
    // Version and build info should be added in Xcode
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
    }
    // Version info should be set in build.gradle
  }
};

export default config;