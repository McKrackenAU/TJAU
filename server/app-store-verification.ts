import { Request, Response } from "express";
import { storage } from "./storage";

interface AppStorePurchase {
  productId: string;
  transactionId: string;
  transactionDate: number;
  isSubscription: boolean;
  expiryDate?: number;
}

interface VerificationRequest {
  platform: 'ios' | 'android';
  purchase: AppStorePurchase;
}

/**
 * Handles verification of in-app purchases from iOS App Store
 */
export async function verifyIOSPurchase(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const purchase = req.body.purchase as AppStorePurchase;
    if (!purchase) {
      return res.status(400).json({ error: "Invalid purchase data" });
    }

    // In a production app, you would validate the receipt with Apple's servers
    // using the /verifyReceipt endpoint
    
    // For now, we'll just verify that it's our expected product ID
    if (purchase.productId !== "io.tarotjourney.subscription.monthly") {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    // If this is a subscription, update the user's subscription status
    if (purchase.isSubscription) {
      // Calculate expiry date if not provided
      const expiryDate = purchase.expiryDate 
        ? new Date(purchase.expiryDate) 
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      
      // Update user subscription in database
      await storage.updateUserSubscription(userId, {
        isSubscribed: true,
        stripeSubscriptionId: `ios_${purchase.transactionId}`
      });
      
      return res.status(200).json({
        success: true,
        subscription: {
          active: true,
          expiryDate: expiryDate.toISOString()
        }
      });
    } else {
      // One-time purchase (not implemented in this app)
      return res.status(400).json({ error: "One-time purchases not supported" });
    }
  } catch (error) {
    console.error("iOS Purchase verification error:", error);
    return res.status(500).json({ error: "Failed to verify purchase" });
  }
}

/**
 * Handles verification of in-app purchases from Google Play Store
 */
export async function verifyAndroidPurchase(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const purchase = req.body.purchase as AppStorePurchase;
    if (!purchase) {
      return res.status(400).json({ error: "Invalid purchase data" });
    }

    // In a production app, you would validate the purchase token with Google Play Developer API
    
    // For now, we'll just verify that it's our expected product ID
    if (purchase.productId !== "io.tarotjourney.subscription.monthly") {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    // If this is a subscription, update the user's subscription status
    if (purchase.isSubscription) {
      // Calculate expiry date if not provided
      const expiryDate = purchase.expiryDate 
        ? new Date(purchase.expiryDate) 
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      
      // Update user subscription in database
      await storage.updateUserSubscription(userId, {
        isSubscribed: true,
        stripeSubscriptionId: `android_${purchase.transactionId}`
      });
      
      return res.status(200).json({
        success: true,
        subscription: {
          active: true,
          expiryDate: expiryDate.toISOString()
        }
      });
    } else {
      // One-time purchase (not implemented in this app)
      return res.status(400).json({ error: "One-time purchases not supported" });
    }
  } catch (error) {
    console.error("Android Purchase verification error:", error);
    return res.status(500).json({ error: "Failed to verify purchase" });
  }
}

/**
 * Main handler for app store purchase verification
 */
export function handleAppStorePurchaseVerification(req: Request, res: Response) {
  const { platform } = req.body as VerificationRequest;
  
  if (platform === 'ios') {
    return verifyIOSPurchase(req, res);
  } else if (platform === 'android') {
    return verifyAndroidPurchase(req, res);
  } else {
    return res.status(400).json({ error: "Invalid platform specified" });
  }
}