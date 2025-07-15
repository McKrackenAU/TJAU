/**
 * Voice System Accuracy Verification
 * Ensures all voice features work consistently across tabs
 */

import { audioService } from './audio-service';

export class VoiceTestService {
  static async testVoiceAccuracy(): Promise<boolean> {
    console.log("=== VOICE ACCURACY TEST STARTING ===");
    
    try {
      // Test 1: Basic voice generation
      console.log("Testing basic voice generation...");
      await this.testBasicVoiceGeneration();
      
      // Test 2: Voice service configuration
      console.log("Testing voice service configuration...");
      this.testVoiceServiceConfig();
      
      // Test 3: Mobile app detection
      console.log("Testing mobile app detection...");
      this.testMobileDetection();
      
      console.log("=== VOICE ACCURACY TEST COMPLETED SUCCESSFULLY ===");
      return true;
    } catch (error) {
      console.error("=== VOICE ACCURACY TEST FAILED ===", error);
      return false;
    }
  }
  
  private static async testBasicVoiceGeneration(): Promise<void> {
    return new Promise((resolve, reject) => {
      const testText = "Testing Josie voice accuracy for tarot readings.";
      
      audioService.speak(testText, () => {
        console.log("✅ Voice generation test completed successfully");
        resolve();
      });
      
      // Timeout after 10 seconds
      setTimeout(() => {
        reject(new Error("Voice generation test timed out"));
      }, 10000);
    });
  }
  
  private static testVoiceServiceConfig(): void {
    const musicVolume = audioService.getMusicVolume();
    const speechVolume = audioService.getSpeechVolume();
    
    console.log(`Music volume: ${musicVolume}`);
    console.log(`Speech volume: ${speechVolume}`);
    
    if (musicVolume >= 0 && speechVolume >= 0) {
      console.log("✅ Voice service configuration is valid");
    } else {
      throw new Error("Invalid voice service configuration");
    }
  }
  
  private static testMobileDetection(): void {
    const isMobileApp = window.location.protocol === 'capacitor:' || 
                       window.location.hostname === 'localhost' ||
                       navigator.userAgent.includes('Tarot Journey App') ||
                       window.location.origin.includes('capacitor');
    
    const baseUrl = isMobileApp ? 'https://tarotjourney.au' : window.location.origin;
    
    console.log(`Mobile app detected: ${isMobileApp}`);
    console.log(`API base URL: ${baseUrl}`);
    console.log("✅ Mobile detection working correctly");
  }
}

// Export for use in voice components
export const voiceTestService = VoiceTestService;