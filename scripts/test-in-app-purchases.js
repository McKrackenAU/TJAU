/**
 * Test script for in-app purchases on iOS and Android
 * 
 * This script helps debug and test in-app purchase functionality 
 * when running in a Capacitor native app.
 */

// Import necessary modules for testing
import { Capacitor } from '@capacitor/core';
import axios from 'axios';

// Configuration
const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000'
  : 'https://tarotjourney.replit.app';

// Check if running as a native app
const isNative = Capacitor.isNativePlatform();
const platform = Capacitor.getPlatform();

// Log environment info
console.log('In-App Purchase Test Environment:');
console.log(`- Running on: ${platform}`);
console.log(`- Native platform: ${isNative ? 'Yes' : 'No'}`);
console.log(`- API URL: ${API_URL}`);

// Define test function
async function testPurchases() {
  if (!isNative) {
    console.log('This script should be run in a native app environment (iOS/Android)');
    console.log('For testing in a browser, use the Stripe integration instead');
    return;
  }

  try {
    console.log('\nTesting In-App Purchases:');
    
    // Step 1: Import the purchase plugin dynamically
    console.log('1. Loading purchase plugin...');
    const purchaseModule = await import('capacitor-plugin-purchase');
    const Purchase = purchaseModule.default || purchaseModule.Purchase;
    
    if (!Purchase) {
      throw new Error('Purchase plugin not available');
    }
    
    console.log('✓ Purchase plugin loaded successfully');
    
    // Step 2: Initialize the plugin
    console.log('\n2. Initializing purchase plugin...');
    await Purchase.initialize();
    console.log('✓ Purchase plugin initialized successfully');
    
    // Step 3: Get available products
    console.log('\n3. Fetching available products...');
    const products = await Purchase.getProducts();
    console.log('Available products:');
    products.forEach(product => {
      console.log(`- ${product.productId}: ${product.title} (${product.price})`);
    });
    
    // Step 4: Test purchase flow (simulated)
    console.log('\n4. Simulating purchase flow...');
    console.log('To perform an actual purchase, call:');
    console.log('Purchase.purchaseProduct("io.tarotjourney.subscription.monthly")');
    
    // Step 5: Test server verification
    console.log('\n5. Testing server verification endpoint...');
    try {
      const mockPurchase = {
        platform: platform === 'ios' ? 'ios' : 'android',
        purchase: {
          productId: 'io.tarotjourney.subscription.monthly',
          transactionId: 'test-transaction-123',
          transactionDate: Date.now(),
          isSubscription: true
        }
      };
      
      // This will fail without authentication, but confirms endpoint is working
      const response = await axios.post(`${API_URL}/api/verify-purchase`, mockPurchase);
      console.log('Server response:', response.data);
    } catch (error) {
      console.log('Server verification test (expected error):', error.message);
      console.log('Note: This is expected to fail without authentication');
    }
    
    console.log('\nTest completed. For full testing:');
    console.log('1. Build and run the app on an actual device');
    console.log('2. Sign in to the app');
    console.log('3. Attempt a real purchase using a sandbox account');
  } catch (error) {
    console.error('Error during in-app purchase test:', error);
  }
}

// Run the test
testPurchases();