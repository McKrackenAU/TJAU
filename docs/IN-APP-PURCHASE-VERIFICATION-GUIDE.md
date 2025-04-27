# In-App Purchase Verification Guide

This guide provides detailed instructions for implementing and testing server-side verification of in-app purchases for both iOS (App Store) and Android (Google Play Store) in Tarot Journey.

## Why Server-Side Verification Is Crucial

Client-side verification alone is not secure because:
- Client code can be manipulated
- Receipt data can be forged
- Jailbroken/rooted devices can bypass security measures

Server-side verification ensures:
- Legitimacy of purchases
- Protection against fraud
- Proper entitlement management
- Consistent subscription tracking

## iOS (App Store) Verification Implementation

### Step 1: Collect Receipt Data from the App

When a purchase is completed in your iOS app, collect the receipt data:

```javascript
// In your client-side code
async function validateAppStoreReceipt(transactionReceipt) {
  try {
    const response = await fetch('/api/verify-ios-receipt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receipt: transactionReceipt,
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Receipt validation failed:', error);
    throw error;
  }
}
```

### Step 2: Set Up Server Verification Endpoint

Create an API endpoint in your Express app to handle verification:

```javascript
// In your server routes
app.post('/api/verify-ios-receipt', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  const userId = req.user.id;
  const { receipt } = req.body;
  
  if (!receipt) {
    return res.status(400).json({ error: 'Receipt data is required' });
  }
  
  try {
    const verificationResult = await verifyAppStoreReceipt(receipt);
    
    // Update user subscription status based on verification result
    if (verificationResult.status === 0) { // Status 0 means success
      const latestReceipt = verificationResult.latest_receipt_info;
      
      if (latestReceipt && latestReceipt.length > 0) {
        // Sort by purchase date descending to get the latest
        latestReceipt.sort((a, b) => 
          parseInt(b.purchase_date_ms) - parseInt(a.purchase_date_ms)
        );
        
        const latest = latestReceipt[0];
        const productId = latest.product_id;
        const expiresDateMs = parseInt(latest.expires_date_ms);
        const isActive = Date.now() < expiresDateMs;
        
        // Update user subscription in database
        await storage.updateUserSubscription(userId, {
          isSubscribed: isActive,
          stripeSubscriptionId: latest.original_transaction_id // Use as reference
        });
        
        return res.json({
          success: true,
          isActive,
          expiresDate: new Date(expiresDateMs).toISOString(),
          productId
        });
      }
    }
    
    return res.status(400).json({
      success: false,
      error: 'Invalid receipt',
      details: verificationResult
    });
  } catch (error) {
    console.error('Receipt verification failed:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error during verification'
    });
  }
});
```

### Step 3: Implement the Verification Logic

```javascript
async function verifyAppStoreReceipt(receiptData) {
  // Apple's production and sandbox verification URLs
  const productionUrl = 'https://buy.itunes.apple.com/verifyReceipt';
  const sandboxUrl = 'https://sandbox.itunes.apple.com/verifyReceipt';
  
  // First, try production environment
  try {
    const response = await fetch(productionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'receipt-data': receiptData,
        'password': process.env.APP_STORE_SHARED_SECRET, // Your shared secret from App Store Connect
      }),
    });
    
    const result = await response.json();
    
    // Status 21007 means this receipt is from the sandbox environment
    if (result.status === 21007) {
      // Retry with the sandbox URL
      return await verifySandboxReceipt(receiptData);
    }
    
    return result;
  } catch (error) {
    console.error('Production receipt verification failed:', error);
    // Fallback to sandbox verification
    return await verifySandboxReceipt(receiptData);
  }
}

async function verifySandboxReceipt(receiptData) {
  const sandboxUrl = 'https://sandbox.itunes.apple.com/verifyReceipt';
  
  try {
    const response = await fetch(sandboxUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'receipt-data': receiptData,
        'password': process.env.APP_STORE_SHARED_SECRET,
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Sandbox receipt verification failed:', error);
    throw error;
  }
}
```

## Google Play (Android) Verification Implementation

### Step 1: Set Up Google Play Developer API Access

1. Create a service account in Google Cloud Console
2. Download the JSON key file
3. Grant the service account access to your Google Play Console

### Step 2: Collect Purchase Data from the App

```javascript
// In your client-side code
async function validateGooglePlayPurchase(purchaseData) {
  try {
    const response = await fetch('/api/verify-android-purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        purchaseData,
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Purchase validation failed:', error);
    throw error;
  }
}
```

### Step 3: Set Up Server Verification Endpoint

```javascript
// In your server routes
app.post('/api/verify-android-purchase', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  const userId = req.user.id;
  const { purchaseData } = req.body;
  
  if (!purchaseData || !purchaseData.purchaseToken || !purchaseData.productId) {
    return res.status(400).json({ error: 'Complete purchase data is required' });
  }
  
  try {
    const verificationResult = await verifyGooglePlayPurchase(
      purchaseData.packageName,
      purchaseData.productId,
      purchaseData.purchaseToken
    );
    
    // For subscriptions
    if (verificationResult.acknowledgementState === 1 && 
        verificationResult.purchaseState === 0) {
      
      const expiryTimeMillis = parseInt(verificationResult.expiryTimeMillis);
      const isActive = Date.now() < expiryTimeMillis;
      
      // Update user subscription in database
      await storage.updateUserSubscription(userId, {
        isSubscribed: isActive,
        stripeSubscriptionId: verificationResult.orderId // Use as reference
      });
      
      return res.json({
        success: true,
        isActive,
        expiresDate: new Date(expiryTimeMillis).toISOString(),
        productId: purchaseData.productId
      });
    }
    
    return res.status(400).json({
      success: false,
      error: 'Invalid purchase',
      details: verificationResult
    });
  } catch (error) {
    console.error('Purchase verification failed:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error during verification'
    });
  }
});
```

### Step 4: Implement Google Play Verification Logic Using Google API Client Library

First, install the required library:

```bash
npm install googleapis
```

Then implement the verification logic:

```javascript
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

// Service account key path - update with your actual path
const KEY_FILE_PATH = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Cache the auth client to avoid creating it for every verification
let androidPublisher = null;

async function getAndroidPublisher() {
  if (androidPublisher) {
    return androidPublisher;
  }
  
  try {
    const key = JSON.parse(fs.readFileSync(KEY_FILE_PATH));
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/androidpublisher']
    );
    
    await jwtClient.authorize();
    
    androidPublisher = google.androidpublisher({
      version: 'v3',
      auth: jwtClient
    });
    
    return androidPublisher;
  } catch (error) {
    console.error('Error creating Android Publisher client:', error);
    throw error;
  }
}

async function verifyGooglePlayPurchase(packageName, productId, purchaseToken) {
  try {
    const publisher = await getAndroidPublisher();
    
    // For one-time products
    if (productId.startsWith('product.')) {
      const res = await publisher.purchases.products.get({
        packageName,
        productId,
        token: purchaseToken
      });
      
      return res.data;
    } 
    // For subscriptions
    else if (productId.startsWith('subscription.')) {
      const res = await publisher.purchases.subscriptions.get({
        packageName,
        subscriptionId: productId,
        token: purchaseToken
      });
      
      return res.data;
    } else {
      throw new Error('Unknown product type');
    }
  } catch (error) {
    console.error('Google Play purchase verification failed:', error);
    throw error;
  }
}
```

## Testing In-App Purchase Verification

### Testing iOS Verification

1. **Set up a Sandbox Tester account**:
   - Go to App Store Connect > Users and Access > Sandbox Testers
   - Add a new sandbox tester account
   - This account can make test purchases without actual charges

2. **Test in development environment**:
   - Sign out of your regular Apple ID on your test device
   - Sign in with the sandbox tester account
   - Make a test purchase in your app
   - Verify the receipt is being sent to your server
   - Check logs for verification results

### Testing Android Verification

1. **Set up test accounts**:
   - In Google Play Console > Settings > License Testing
   - Add your test email addresses

2. **Test in development environment**:
   - Add your app to the internal testing track
   - Use a test account to install the app
   - Make test purchases using the Google Play Billing Library
   - Verify the purchase data is being sent to your server
   - Check logs for verification results

## Best Practices

1. **Secure Storage**:
   - Store receipt/purchase data securely
   - Never rely solely on client-side verification

2. **Error Handling**:
   - Implement retry mechanisms for network failures
   - Have graceful fallbacks if verification servers are unreachable

3. **Receipt/Purchase Caching**:
   - Cache valid receipts/purchases to reduce API calls
   - But always re-verify for important entitlement changes

4. **Subscription Management**:
   - Check expiration dates regularly
   - Handle grace periods and billing retries
   - Properly manage subscription state transitions

5. **Logging and Monitoring**:
   - Log all verification attempts
   - Monitor for unusual patterns that might indicate fraud
   - Set up alerts for verification service failures

## Resources

- [App Store Server API Documentation](https://developer.apple.com/documentation/appstoreserverapi)
- [Google Play Developer API Documentation](https://developers.google.com/android-publisher)
- [Apple Subscription Best Practices](https://developer.apple.com/app-store/subscriptions/)
- [Google Play Billing Library Documentation](https://developer.android.com/google/play/billing)