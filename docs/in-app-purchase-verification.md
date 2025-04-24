# In-App Purchase Verification Guide

This guide explains how to update the server-side verification code to properly validate in-app purchases from the Apple App Store and Google Play Store.

## Current Implementation Status

The app currently has placeholder verification code in `server/app-store-verification.ts`. This needs to be updated with proper receipt validation before going to production.

## Apple App Store Receipt Verification

Update the `verifyIOSPurchase` function in `server/app-store-verification.ts` with the following implementation:

```typescript
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

    // Extract receipt data from the purchase
    const receiptData = purchase.receipt;
    if (!receiptData) {
      return res.status(400).json({ error: "Missing receipt data" });
    }

    // Determine which environment to use for verification
    // Start with Production, and if it fails with code 21007, switch to Sandbox
    let verifyEndpoint = 'https://buy.itunes.apple.com/verifyReceipt';
    
    // Data to send to Apple's verification server
    const requestData = {
      'receipt-data': receiptData,
      'password': process.env.APPLE_SHARED_SECRET, // Your App-Specific Shared Secret
      'exclude-old-transactions': true
    };

    // First try production environment
    let response = await axios.post(verifyEndpoint, requestData);
    let responseData = response.data;
    
    // If it's a test receipt and we used production environment, try sandbox
    if (responseData.status === 21007) {
      verifyEndpoint = 'https://sandbox.itunes.apple.com/verifyReceipt';
      response = await axios.post(verifyEndpoint, requestData);
      responseData = response.data;
    }

    // Check if the verification was successful
    if (responseData.status !== 0) {
      console.error('Receipt verification failed with status:', responseData.status);
      return res.status(400).json({ error: "Receipt verification failed", code: responseData.status });
    }

    // Verify the receipt is for the correct app
    if (responseData.receipt.bundle_id !== 'io.tarotjourney.app') {
      return res.status(400).json({ error: "Receipt is for a different app" });
    }

    // Check for subscription information
    if (!responseData.latest_receipt_info || responseData.latest_receipt_info.length === 0) {
      return res.status(400).json({ error: "No subscription information found" });
    }

    // Get the latest subscription
    const latestSubscription = responseData.latest_receipt_info.sort((a, b) => {
      return parseInt(b.purchase_date_ms) - parseInt(a.purchase_date_ms);
    })[0];

    // Check product ID
    if (latestSubscription.product_id !== 'io.tarotjourney.subscription.monthly') {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    // Calculate expiry date
    const expiryDate = new Date(parseInt(latestSubscription.expires_date_ms));
    const isActive = expiryDate > new Date();

    // Update user subscription in database
    await storage.updateUserSubscription(userId, {
      isSubscribed: isActive,
      stripeSubscriptionId: `ios_${latestSubscription.transaction_id}`
    });

    return res.status(200).json({
      success: true,
      subscription: {
        active: isActive,
        expiryDate: expiryDate.toISOString(),
        productId: latestSubscription.product_id,
        transactionId: latestSubscription.transaction_id
      }
    });
  } catch (error) {
    console.error("iOS Purchase verification error:", error);
    return res.status(500).json({ error: "Failed to verify purchase" });
  }
}
```

## Google Play Store Receipt Verification

Update the `verifyAndroidPurchase` function with proper Google Play Developer API verification:

```typescript
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

    // Extract purchase token
    const { productId, purchaseToken } = purchase;
    if (!productId || !purchaseToken) {
      return res.status(400).json({ error: "Missing purchase details" });
    }

    // Verify the purchase is for the correct product
    if (productId !== 'io.tarotjourney.subscription.monthly') {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    // Initialize Google Play API client with your service account credentials
    // This requires the 'google-auth-library' and 'googleapis' packages
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
      keyFile: process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_KEY_PATH
    });

    const androidpublisher = google.androidpublisher({
      version: 'v3',
      auth
    });

    // Verify the purchase with Google Play Developer API
    const response = await androidpublisher.purchases.subscriptions.get({
      packageName: 'io.tarotjourney.app',
      subscriptionId: productId,
      token: purchaseToken
    });

    // Check if the subscription is valid
    const subscriptionInfo = response.data;
    const expiryTimeMillis = parseInt(subscriptionInfo.expiryTimeMillis);
    const expiryDate = new Date(expiryTimeMillis);
    const isActive = expiryDate > new Date();

    // Get current subscription state
    // See: https://developer.android.com/google/play/billing/subscriptions#subscription-state-api
    const paymentState = subscriptionInfo.paymentState;
    
    // Check if payment is valid (0 = payment pending, 1 = payment received)
    if (paymentState !== 1) {
      return res.status(400).json({ 
        error: "Subscription payment not completed",
        state: paymentState
      });
    }

    // Update user subscription in database
    await storage.updateUserSubscription(userId, {
      isSubscribed: isActive,
      stripeSubscriptionId: `android_${purchaseToken.substring(0, 20)}`
    });

    return res.status(200).json({
      success: true,
      subscription: {
        active: isActive,
        expiryDate: expiryDate.toISOString(),
        productId: productId,
        purchaseToken: purchaseToken.substring(0, 10) + '...' // Truncated for security
      }
    });
  } catch (error) {
    console.error("Android Purchase verification error:", error);
    return res.status(500).json({ error: "Failed to verify purchase" });
  }
}
```

## Required Dependencies

For Google Play verification, install the necessary packages:

```bash
npm install google-auth-library googleapis
```

## Environment Variables

Add these environment variables to your production server:

```
# Apple App Store
APPLE_SHARED_SECRET=your_app_specific_shared_secret

# Google Play Store
GOOGLE_PLAY_SERVICE_ACCOUNT_KEY_PATH=/path/to/service-account-key.json
```

## How to Get Required Credentials

### Apple App Store Shared Secret

1. Log in to [App Store Connect](https://appstoreconnect.apple.com)
2. Go to "Apps" > Your App > "App Information"
3. Find "App-Specific Shared Secret" section
4. Click "Generate" or copy existing secret

### Google Play Service Account Key

1. Log in to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to "IAM & Admin" > "Service Accounts"
3. Create a new service account with "Google Play Android Developer" permissions
4. Generate and download a JSON key file
5. Store this file securely on your server

## Testing Receipt Verification

### Testing Apple App Store Verification

1. Use a sandbox tester account to make a purchase in your test app
2. The app will receive a receipt which is passed to your server
3. Test with both sandbox and production environments

### Testing Google Play Verification

1. Add test accounts in Google Play Console
2. Upload your app to a closed testing track
3. Make a purchase with your test account
4. The app will receive a purchase token which is passed to your server

## Common Verification Issues

### Apple App Store:

- Status 21000: The request is not in the expected format
- Status 21002: The receipt data is malformed
- Status 21003: The receipt could not be authenticated
- Status 21004: The shared secret does not match
- Status 21005: The receipt server is unavailable
- Status 21006: This receipt is valid but the subscription has expired
- Status 21007: This receipt is from the test environment, but sent to production
- Status 21008: This receipt is from the production environment, but sent to test

### Google Play Store:

- 400 Bad Request: Check package name, subscription ID, and purchase token
- 401 Unauthorized: Check service account permissions
- 404 Not Found: The subscription may not exist or may have been canceled

## Security Considerations

- Never store raw receipt data or purchase tokens in logs
- Implement proper error handling to avoid exposing sensitive information
- Keep your shared secrets and service account keys secure
- Validate all input data thoroughly
- Consider implementing additional server-side checks for fraud prevention