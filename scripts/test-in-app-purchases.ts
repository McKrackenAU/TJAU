/**
 * Test script for in-app purchases
 * 
 * This script helps test the in-app purchase functionality
 * for both Apple App Store and Google Play Store.
 */

import { InAppPurchase } from 'capacitor-plugin-purchase';
import { isPlatform } from '@capacitor/core';

const TEST_PRODUCT_IDS = {
  iOS: ['io.tarotjourney.subscription.monthly'],
  android: ['io.tarotjourney.subscription.monthly']
};

async function testInAppPurchases() {
  console.log('Starting in-app purchase test...');
  
  try {
    // Initialize the purchase plugin
    console.log('Initializing purchase plugin...');
    await InAppPurchase.initialize();
    
    // Get platform-specific products
    const productIds = isPlatform('ios') 
      ? TEST_PRODUCT_IDS.iOS 
      : TEST_PRODUCT_IDS.android;
    
    console.log(`Testing products: ${productIds.join(', ')}`);
    
    // Get product details
    console.log('Fetching product details...');
    const { products } = await InAppPurchase.getProducts({
      productIds
    });
    
    console.log('Available products:');
    products.forEach(product => {
      console.log(`- ${product.title} (${product.productId}): ${product.price}`);
      console.log(`  Description: ${product.description}`);
    });
    
    console.log('\nListing purchases...');
    const { purchases } = await InAppPurchase.getPurchases();
    
    if (purchases.length === 0) {
      console.log('No active purchases found.');
    } else {
      console.log('Active purchases:');
      purchases.forEach(purchase => {
        console.log(`- ${purchase.productId}: ${purchase.state}`);
        console.log(`  Transaction date: ${new Date(purchase.transactionDate).toLocaleString()}`);
        if (purchase.expiryDate) {
          console.log(`  Expiry date: ${new Date(purchase.expiryDate).toLocaleString()}`);
        }
      });
    }
    
    // Testing purchase events
    console.log('\nSetting up purchase event listeners...');
    
    InAppPurchase.addListener('purchaseCompleted', (purchase) => {
      console.log('Purchase completed!', purchase);
    });
    
    InAppPurchase.addListener('purchaseFailed', (error) => {
      console.error('Purchase failed:', error);
    });
    
    console.log('\nTest completed successfully!');
    console.log('\nTo test a purchase:');
    console.log('1. Use the app UI to initiate a purchase');
    console.log('2. Check the console logs for purchase events');
    console.log('3. For sandbox testing in iOS, use a Sandbox Apple ID');
    console.log('4. For testing in Android, add a test account in Google Play Console');
    
  } catch (error) {
    console.error('Error testing in-app purchases:', error);
  }
}

// Only run in native app environment
if (isPlatform('ios') || isPlatform('android')) {
  testInAppPurchases();
} else {
  console.log('This test must be run on an iOS or Android device.');
  console.log('Use "npx cap run ios" or "npx cap run android" to test on a device.');
}

export {};