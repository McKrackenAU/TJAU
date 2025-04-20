import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.tarotjourney.app',
  appName: 'Tarot Journey',
  webDir: 'public',
  bundledWebRuntime: false,
  // Server configuration
  server: {
    // In production, this should be your actual domain
    // For local development, you can use localhost
    hostname: 'localhost',
    // Allow navigation to our domain (replace with your actual domain in production)
    allowNavigation: ['localhost']
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
    // Minimum iOS version supported
    minVersion: '13.0'
  },
  // Android specific configuration
  android: {
    // Allow cleartext (non-HTTPS) traffic for development
    // Should be false for production
    allowMixedContent: true,
    // Backup rules - tells Android what to backup
    // This is important for preserving user data
    captureInput: true,
    // Permissions requested by the app
    permissions: [
      'android.permission.INTERNET',
      'android.permission.VIBRATE',
      'android.permission.RECEIVE_BOOT_COMPLETED'
    ]
  }
};

export default config;