/**
 * App Store Payment Integration Service
 * 
 * Handles in-app purchases for iOS and Android when the app is distributed
 * through the Apple App Store or Google Play Store.
 */

// Types for app store products/purchases
export interface AppStoreProduct {
  id: string;
  title: string;
  description: string; 
  price: string;
  priceAmountMicros: number;
  priceCurrencyCode: string;
  type: 'subscription' | 'non-subscription';
}

export interface SubscriptionPeriod {
  unit: 'day' | 'week' | 'month' | 'year';
  count: number;
}

export interface AppStorePurchase {
  productId: string;
  transactionId: string;
  transactionDate: number;
  isSubscription: boolean;
  expiryDate?: number; // Only for subscriptions
}

// Type guard for detecting platform
export const isNativeApp = (): boolean => {
  // Check if app is running in a Capacitor/Cordova container
  return typeof (window as any).Capacitor !== 'undefined' || 
         document.URL.startsWith('capacitor://') ||
         document.URL.startsWith('cordova://');
};

export const isIOSApp = (): boolean => {
  if (!isNativeApp()) return false;
  
  // Check if running in iOS container
  return typeof (window as any).Capacitor !== 'undefined' &&
         (window as any).Capacitor.getPlatform() === 'ios';
};

export const isAndroidApp = (): boolean => {
  if (!isNativeApp()) return false;
  
  // Check if running in Android container
  return typeof (window as any).Capacitor !== 'undefined' &&
         (window as any).Capacitor.getPlatform() === 'android';
};

/**
 * Interface for platform-specific payment processors
 */
export interface PlatformPaymentProcessor {
  initialize(): Promise<void>;
  getProducts(): Promise<AppStoreProduct[]>;
  purchaseProduct(productId: string): Promise<AppStorePurchase | null>;
  restorePurchases(): Promise<AppStorePurchase[]>;
  checkSubscriptionStatus(): Promise<boolean>;
  getSubscriptionExpiryDate(): Promise<Date | null>;
}

/**
 * Factory to get appropriate payment processor based on platform
 */
export const getPaymentProcessor = (): PlatformPaymentProcessor | null => {
  if (isIOSApp()) {
    return new IOSPaymentProcessor();
  } else if (isAndroidApp()) {
    return new AndroidPaymentProcessor();
  }
  return null; // Web version uses Stripe directly
};

/**
 * iOS implementation via StoreKit
 */
class IOSPaymentProcessor implements PlatformPaymentProcessor {
  async initialize(): Promise<void> {
    // Initialize StoreKit integration
    // In a real implementation, this would use Capacitor plugins
    console.log('iOS payment processor initialized');
  }

  async getProducts(): Promise<AppStoreProduct[]> {
    // Fetch available products from App Store Connect
    return [
      {
        id: 'io.tarotjourney.subscription.monthly',
        title: 'Tarot Journey Premium',
        description: 'Monthly subscription with all premium features',
        price: '$11.11',
        priceAmountMicros: 11110000,
        priceCurrencyCode: 'AUD',
        type: 'subscription'
      }
    ];
  }

  async purchaseProduct(productId: string): Promise<AppStorePurchase | null> {
    // Implement StoreKit purchase flow
    console.log(`Purchasing product: ${productId}`);
    
    // Simulate successful purchase
    return {
      productId,
      transactionId: `ios_${Date.now()}`,
      transactionDate: Date.now(),
      isSubscription: true,
      expiryDate: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days from now
    };
  }

  async restorePurchases(): Promise<AppStorePurchase[]> {
    // Implement StoreKit restore purchases
    console.log('Restoring purchases');
    return [];
  }

  async checkSubscriptionStatus(): Promise<boolean> {
    // Check if user has active subscription through StoreKit
    return false;
  }

  async getSubscriptionExpiryDate(): Promise<Date | null> {
    // Get expiry date of current subscription
    return null;
  }
}

/**
 * Android implementation via Google Play Billing
 */
class AndroidPaymentProcessor implements PlatformPaymentProcessor {
  async initialize(): Promise<void> {
    // Initialize Google Play Billing
    // In a real implementation, this would use Capacitor plugins
    console.log('Android payment processor initialized');
  }

  async getProducts(): Promise<AppStoreProduct[]> {
    // Fetch available products from Google Play
    return [
      {
        id: 'io.tarotjourney.subscription.monthly',
        title: 'Tarot Journey Premium',
        description: 'Monthly subscription with all premium features',
        price: '$11.11',
        priceAmountMicros: 11110000,
        priceCurrencyCode: 'AUD',
        type: 'subscription'
      }
    ];
  }

  async purchaseProduct(productId: string): Promise<AppStorePurchase | null> {
    // Implement Google Play Billing purchase flow
    console.log(`Purchasing product: ${productId}`);
    
    // Simulate successful purchase
    return {
      productId,
      transactionId: `android_${Date.now()}`,
      transactionDate: Date.now(),
      isSubscription: true,
      expiryDate: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days from now
    };
  }

  async restorePurchases(): Promise<AppStorePurchase[]> {
    // Implement Google Play Billing restore purchases
    console.log('Restoring purchases');
    return [];
  }

  async checkSubscriptionStatus(): Promise<boolean> {
    // Check if user has active subscription through Google Play Billing
    return false;
  }

  async getSubscriptionExpiryDate(): Promise<Date | null> {
    // Get expiry date of current subscription
    return null;
  }
}

/**
 * Unified payment service that works across platforms
 */
export class PaymentService {
  private processor: PlatformPaymentProcessor | null = null;
  
  constructor() {
    this.processor = getPaymentProcessor();
  }
  
  /**
   * Determines if we should use native in-app purchases
   * or redirect to web-based Stripe payment
   */
  isNativePaymentSupported(): boolean {
    return this.processor !== null;
  }
  
  /**
   * Initializes the appropriate payment processor
   */
  async initialize(): Promise<void> {
    if (this.processor) {
      await this.processor.initialize();
    }
  }
  
  /**
   * Purchases a subscription using the appropriate platform API
   */
  async purchaseSubscription(): Promise<boolean> {
    if (!this.processor) {
      console.log('Native payments not supported, using web payment flow');
      return false;
    }
    
    try {
      const products = await this.processor.getProducts();
      if (products.length === 0) {
        console.error('No subscription products available');
        return false;
      }
      
      // Get the subscription product
      const subscriptionProduct = products.find(p => p.type === 'subscription');
      if (!subscriptionProduct) {
        console.error('No subscription product found');
        return false;
      }
      
      // Purchase the subscription
      const purchase = await this.processor.purchaseProduct(subscriptionProduct.id);
      
      if (purchase) {
        // Send purchase verification to our server
        await this.verifyPurchaseWithServer(purchase);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      return false;
    }
  }
  
  /**
   * Restores previous purchases
   */
  async restorePurchases(): Promise<boolean> {
    if (!this.processor) return false;
    
    try {
      const purchases = await this.processor.restorePurchases();
      
      if (purchases && purchases.length > 0) {
        // Verify each restored purchase with our server
        for (const purchase of purchases) {
          await this.verifyPurchaseWithServer(purchase);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      return false;
    }
  }
  
  /**
   * Sends purchase verification to our server
   */
  private async verifyPurchaseWithServer(purchase: AppStorePurchase): Promise<void> {
    try {
      const response = await fetch('/api/verify-app-store-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: isIOSApp() ? 'ios' : 'android',
          purchase,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify purchase with server');
      }
      
      const result = await response.json();
      console.log('Purchase verification result:', result);
    } catch (error) {
      console.error('Error verifying purchase with server:', error);
      throw error;
    }
  }
  
  /**
   * Checks if the user has an active subscription
   */
  async hasActiveSubscription(): Promise<boolean> {
    if (!this.processor) return false;
    return this.processor.checkSubscriptionStatus();
  }
  
  /**
   * Gets the subscription expiry date
   */
  async getSubscriptionExpiryDate(): Promise<Date | null> {
    if (!this.processor) return null;
    return this.processor.getSubscriptionExpiryDate();
  }
}