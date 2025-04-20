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
 * iOS implementation via StoreKit using Capacitor
 */
class IOSPaymentProcessor implements PlatformPaymentProcessor {
  async initialize(): Promise<void> {
    try {
      // Check if Capacitor plugin is available
      if (typeof (window as any).Capacitor !== 'undefined') {
        // Import the purchase plugin dynamically
        const { PurchasePlugin } = await import('capacitor-plugin-purchase');
        
        // Initialize the plugin
        await PurchasePlugin.initialize({
          ios: {
            // Set any iOS-specific initialization options here
            validateReceipts: true
          }
        });
        console.log('iOS payment processor initialized');
      } else {
        console.warn('Capacitor not available for payment processing');
      }
    } catch (error) {
      console.error('Failed to initialize iOS payment processor:', error);
      throw error;
    }
  }

  async getProducts(): Promise<AppStoreProduct[]> {
    try {
      // In real implementation, fetch available products using the plugin
      const { PurchasePlugin } = await import('capacitor-plugin-purchase');
      
      // Request available products from App Store
      const response = await PurchasePlugin.getProducts({
        // List of product identifiers registered in App Store Connect
        productIds: ['io.tarotjourney.subscription.monthly']
      });
      
      // Process and return the products
      if (response && response.products && response.products.length > 0) {
        return response.products.map(product => ({
          id: product.productId,
          title: product.title,
          description: product.description,
          price: product.price,
          priceAmountMicros: parseInt(product.priceAmountMicros, 10),
          priceCurrencyCode: product.currencyCode,
          type: product.type === 'subs' ? 'subscription' : 'non-subscription'
        }));
      }
      
      // Fallback for development/testing
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
    } catch (error) {
      console.error('Failed to get iOS products:', error);
      throw error;
    }
  }

  async purchaseProduct(productId: string): Promise<AppStorePurchase | null> {
    try {
      // Use the Capacitor purchase plugin to start the purchase flow
      const { PurchasePlugin } = await import('capacitor-plugin-purchase');
      
      // Start the purchase process
      const result = await PurchasePlugin.buyProduct({
        productId: productId,
        // Additional purchase options go here
      });
      
      // Check if purchase was successful
      if (result && result.transactionId) {
        // Return the purchase details
        return {
          productId: productId,
          transactionId: result.transactionId,
          transactionDate: result.transactionDate || Date.now(),
          isSubscription: productId.includes('subscription'),
          expiryDate: result.expiryDate || Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days from now if not provided
        };
      }
      
      return null; // Purchase was canceled or failed
    } catch (error) {
      console.error(`Error purchasing product ${productId}:`, error);
      throw error;
    }
  }

  async restorePurchases(): Promise<AppStorePurchase[]> {
    try {
      // Use the Capacitor purchase plugin to restore purchases
      const { PurchasePlugin } = await import('capacitor-plugin-purchase');
      
      // Restore previous purchases
      const result = await PurchasePlugin.restorePurchases();
      
      if (result && result.purchases && result.purchases.length > 0) {
        // Map the restored purchases to our format
        return result.purchases.map(purchase => ({
          productId: purchase.productId,
          transactionId: purchase.transactionId,
          transactionDate: purchase.transactionDate || Date.now(),
          isSubscription: purchase.productId.includes('subscription'),
          expiryDate: purchase.expiryDate
        }));
      }
      
      return []; // No purchases to restore
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    }
  }

  async checkSubscriptionStatus(): Promise<boolean> {
    try {
      // Check if user has active subscription through StoreKit
      const { PurchasePlugin } = await import('capacitor-plugin-purchase');
      
      // Get existing purchases
      const result = await PurchasePlugin.getPurchases();
      
      if (result && result.purchases && result.purchases.length > 0) {
        // Find active subscriptions
        const activeSubscriptions = result.purchases.filter(purchase => 
          purchase.productId.includes('subscription') && 
          purchase.expiryDate && 
          purchase.expiryDate > Date.now()
        );
        
        return activeSubscriptions.length > 0;
      }
      
      return false; // No active subscriptions
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }

  async getSubscriptionExpiryDate(): Promise<Date | null> {
    try {
      // Get expiry date of current subscription using the plugin
      const { PurchasePlugin } = await import('capacitor-plugin-purchase');
      
      // Get existing purchases
      const result = await PurchasePlugin.getPurchases();
      
      if (result && result.purchases && result.purchases.length > 0) {
        // Find subscription purchases
        const subscriptions = result.purchases.filter(purchase => 
          purchase.productId.includes('subscription') && 
          purchase.expiryDate
        );
        
        if (subscriptions.length > 0) {
          // Get the furthest expiry date if there are multiple
          const latestExpiryDate = Math.max(...subscriptions.map(s => s.expiryDate));
          return new Date(latestExpiryDate);
        }
      }
      
      return null; // No subscription found
    } catch (error) {
      console.error('Error getting subscription expiry date:', error);
      return null;
    }
  }
}

/**
 * Android implementation via Google Play Billing using Capacitor
 */
class AndroidPaymentProcessor implements PlatformPaymentProcessor {
  async initialize(): Promise<void> {
    try {
      // Check if Capacitor plugin is available
      if (typeof (window as any).Capacitor !== 'undefined') {
        // Import the purchase plugin dynamically
        const { PurchasePlugin } = await import('capacitor-plugin-purchase');
        
        // Initialize the plugin
        await PurchasePlugin.initialize({
          android: {
            // Set any Android-specific initialization options here
            validatePurchases: true
          }
        });
        console.log('Android payment processor initialized');
      } else {
        console.warn('Capacitor not available for payment processing on Android');
      }
    } catch (error) {
      console.error('Failed to initialize Android payment processor:', error);
      throw error;
    }
  }

  async getProducts(): Promise<AppStoreProduct[]> {
    try {
      // In real implementation, fetch available products using the plugin
      const { PurchasePlugin } = await import('capacitor-plugin-purchase');
      
      // Request available products from Google Play
      const response = await PurchasePlugin.getProducts({
        // List of product identifiers registered in Google Play Console
        productIds: ['io.tarotjourney.subscription.monthly']
      });
      
      // Process and return the products
      if (response && response.products && response.products.length > 0) {
        return response.products.map(product => ({
          id: product.productId,
          title: product.title,
          description: product.description,
          price: product.price,
          priceAmountMicros: parseInt(product.priceAmountMicros, 10),
          priceCurrencyCode: product.currencyCode,
          type: product.type === 'subs' ? 'subscription' : 'non-subscription'
        }));
      }
      
      // Fallback for development/testing
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
    } catch (error) {
      console.error('Failed to get Android products:', error);
      throw error;
    }
  }

  async purchaseProduct(productId: string): Promise<AppStorePurchase | null> {
    try {
      // Use the Capacitor purchase plugin to start the purchase flow
      const { PurchasePlugin } = await import('capacitor-plugin-purchase');
      
      // Start the purchase process
      const result = await PurchasePlugin.buyProduct({
        productId: productId,
        // Android-specific purchase options go here
      });
      
      // Check if purchase was successful
      if (result && result.transactionId) {
        // Return the purchase details
        return {
          productId: productId,
          transactionId: result.transactionId,
          transactionDate: result.transactionDate || Date.now(),
          isSubscription: productId.includes('subscription'),
          expiryDate: result.expiryDate || Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days from now if not provided
        };
      }
      
      return null; // Purchase was canceled or failed
    } catch (error) {
      console.error(`Error purchasing product ${productId}:`, error);
      throw error;
    }
  }

  async restorePurchases(): Promise<AppStorePurchase[]> {
    try {
      // Use the Capacitor purchase plugin to restore purchases
      const { PurchasePlugin } = await import('capacitor-plugin-purchase');
      
      // Restore previous purchases
      const result = await PurchasePlugin.restorePurchases();
      
      if (result && result.purchases && result.purchases.length > 0) {
        // Map the restored purchases to our format
        return result.purchases.map(purchase => ({
          productId: purchase.productId,
          transactionId: purchase.transactionId,
          transactionDate: purchase.transactionDate || Date.now(),
          isSubscription: purchase.productId.includes('subscription'),
          expiryDate: purchase.expiryDate
        }));
      }
      
      return []; // No purchases to restore
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    }
  }

  async checkSubscriptionStatus(): Promise<boolean> {
    try {
      // Check if user has active subscription through Google Play Billing
      const { PurchasePlugin } = await import('capacitor-plugin-purchase');
      
      // Get existing purchases
      const result = await PurchasePlugin.getPurchases();
      
      if (result && result.purchases && result.purchases.length > 0) {
        // Find active subscriptions
        const activeSubscriptions = result.purchases.filter(purchase => 
          purchase.productId.includes('subscription') && 
          purchase.expiryDate && 
          purchase.expiryDate > Date.now()
        );
        
        return activeSubscriptions.length > 0;
      }
      
      return false; // No active subscriptions
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }

  async getSubscriptionExpiryDate(): Promise<Date | null> {
    try {
      // Get expiry date of current subscription using the plugin
      const { PurchasePlugin } = await import('capacitor-plugin-purchase');
      
      // Get existing purchases
      const result = await PurchasePlugin.getPurchases();
      
      if (result && result.purchases && result.purchases.length > 0) {
        // Find subscription purchases
        const subscriptions = result.purchases.filter(purchase => 
          purchase.productId.includes('subscription') && 
          purchase.expiryDate
        );
        
        if (subscriptions.length > 0) {
          // Get the furthest expiry date if there are multiple
          const latestExpiryDate = Math.max(...subscriptions.map(s => s.expiryDate));
          return new Date(latestExpiryDate);
        }
      }
      
      return null; // No subscription found
    } catch (error) {
      console.error('Error getting subscription expiry date:', error);
      return null;
    }
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