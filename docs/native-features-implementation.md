# Native Features Implementation Guide

This guide outlines how to implement native device features in Tarot Journey using Capacitor, which will help with app store approval by making the app more than just a wrapped website.

## Prerequisites

- Node.js and npm installed
- Existing Tarot Journey PWA
- Basic knowledge of TypeScript/JavaScript
- XCode (for iOS development)
- Android Studio (for Android development)

## Getting Started with Capacitor

Capacitor is a cross-platform app runtime that makes it easy to build web apps that run natively on iOS, Android, and the web.

### Installation

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor in your project
npx cap init "Tarot Journey" "com.tarotjourney.app" --web-dir=client/dist

# Add platforms
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
```

## Implementing Native Features

### 1. Push Notifications

Push notifications are critical for reengagement and are expected in native apps.

```bash
# Install the push notifications plugin
npm install @capacitor/push-notifications
```

**Implementation example:**

```typescript
// client/src/hooks/use-push-notifications.tsx
import { useEffect, useState } from 'react';
import { Plugins } from '@capacitor/core';
import { PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';

export function usePushNotifications() {
  const [hasPermission, setHasPermission] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    // Request permission
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        setHasPermission(true);
        registerPush();
      }
    });
    
    // Register with FCM/APNS
    const registerPush = async () => {
      await PushNotifications.register();
    };
    
    // Listen for registration success
    PushNotifications.addListener('registration', (token: Token) => {
      setToken(token.value);
      // Send token to server
      submitToken(token.value);
    });
    
    // Listen for notification received
    PushNotifications.addListener('pushNotificationReceived', 
      (notification: PushNotificationSchema) => {
        console.log('Notification received', notification);
        // Handle notification display
      }
    );
    
    // Listen for notification action clicked
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification) => {
        console.log('Push action performed', notification);
        // Handle navigation based on notification data
      }
    );
    
    return () => {
      // Remove listeners
      PushNotifications.removeAllListeners();
    };
  }, []);
  
  const submitToken = async (token: string) => {
    // Send to your server
    try {
      await fetch('/api/user/push-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
    } catch (error) {
      console.error('Failed to submit push token:', error);
    }
  };
  
  return { hasPermission, token };
}
```

### 2. Device Camera Access

Implement card scanning or profile photo uploads using the device camera.

```bash
# Install the camera plugin
npm install @capacitor/camera
```

**Implementation example:**

```typescript
// client/src/components/camera-capture.tsx
import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Button } from '@/components/ui/button';

export function CameraCapture({ onCapture }: { onCapture: (imageUrl: string) => void }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      
      const imageUrl = image.webPath;
      if (imageUrl) {
        setImageUrl(imageUrl);
        onCapture(imageUrl);
      }
    } catch (error) {
      console.error('Failed to take photo:', error);
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      {imageUrl && (
        <div className="relative w-full aspect-square max-w-md overflow-hidden rounded-lg">
          <img src={imageUrl} alt="Captured" className="w-full h-full object-cover" />
        </div>
      )}
      
      <Button onClick={takePicture}>
        {imageUrl ? "Retake Photo" : "Take Photo"}
      </Button>
    </div>
  );
}
```

### 3. Local Notifications

Send scheduled reminders for daily tarot readings or meditation sessions.

```bash
# Install the local notifications plugin
npm install @capacitor/local-notifications
```

**Implementation example:**

```typescript
// client/src/hooks/use-reminders.tsx
import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

export function useReminders() {
  // Schedule a daily reading reminder
  const scheduleDailyReminder = async (hour: number, minute: number) => {
    const now = new Date();
    const scheduleTime = new Date(now);
    scheduleTime.setHours(hour, minute, 0);
    
    // If time is in the past, set for tomorrow
    if (scheduleTime <= now) {
      scheduleTime.setDate(scheduleTime.getDate() + 1);
    }
    
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: "Daily Tarot Reading",
          body: "It's time for your daily tarot card reading!",
          schedule: {
            at: scheduleTime,
            repeats: true,
            every: 'day'
          },
          sound: 'crystal.mp3',
          actionTypeId: 'DAILY_READING'
        }
      ]
    });
  };
  
  // Schedule a meditation reminder
  const scheduleMeditationReminder = async (hour: number, minute: number) => {
    const now = new Date();
    const scheduleTime = new Date(now);
    scheduleTime.setHours(hour, minute, 0);
    
    // If time is in the past, set for tomorrow
    if (scheduleTime <= now) {
      scheduleTime.setDate(scheduleTime.getDate() + 1);
    }
    
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 2,
          title: "Tarot Meditation",
          body: "Take a moment for your daily tarot meditation practice",
          schedule: {
            at: scheduleTime,
            repeats: true,
            every: 'day'
          },
          sound: 'nature.mp3',
          actionTypeId: 'MEDITATION'
        }
      ]
    });
  };
  
  // Cancel all reminders
  const cancelAllReminders = async () => {
    await LocalNotifications.cancelAll();
  };
  
  useEffect(() => {
    // Request permission
    LocalNotifications.requestPermissions();
    
    // Set up action types/handlers
    LocalNotifications.registerActionTypes({
      types: [
        {
          id: 'DAILY_READING',
          actions: [
            {
              id: 'view',
              title: 'Daily Reading'
            }
          ]
        },
        {
          id: 'MEDITATION',
          actions: [
            {
              id: 'view',
              title: 'Start Meditation'
            }
          ]
        }
      ]
    });
    
    // Listen for notification actions
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      // Handle navigation based on the notification
      if (notification.actionTypeId === 'DAILY_READING') {
        window.location.href = '/reading/daily';
      } else if (notification.actionTypeId === 'MEDITATION') {
        window.location.href = '/meditation';
      }
    });
    
    return () => {
      LocalNotifications.removeAllListeners();
    };
  }, []);
  
  return {
    scheduleDailyReminder,
    scheduleMeditationReminder,
    cancelAllReminders
  };
}
```

### 4. Device Storage for Offline Use

Implement robust offline storage beyond what the browser offers.

```bash
# Install the storage plugin
npm install @capacitor/storage
```

**Implementation example:**

```typescript
// client/src/hooks/use-tarot-storage.tsx
import { useEffect, useState } from 'react';
import { Storage } from '@capacitor/storage';
import type { TarotCard, Reading } from '@shared/schema';

export function useTarotStorage() {
  // Save reading to device storage
  const saveReading = async (reading: Reading) => {
    try {
      // Get existing readings
      const { value } = await Storage.get({ key: 'offline_readings' });
      const readings = value ? JSON.parse(value) : [];
      
      // Add new reading
      readings.push({
        ...reading,
        offlineId: Date.now().toString(),
        syncStatus: 'pending'
      });
      
      // Save back to storage
      await Storage.set({
        key: 'offline_readings',
        value: JSON.stringify(readings)
      });
      
      return true;
    } catch (error) {
      console.error('Failed to save reading:', error);
      return false;
    }
  };
  
  // Get all offline readings
  const getOfflineReadings = async (): Promise<Reading[]> => {
    try {
      const { value } = await Storage.get({ key: 'offline_readings' });
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Failed to get offline readings:', error);
      return [];
    }
  };
  
  // Save card data for offline use
  const cacheCardsForOffline = async (cards: TarotCard[]) => {
    try {
      await Storage.set({
        key: 'offline_cards',
        value: JSON.stringify(cards)
      });
      return true;
    } catch (error) {
      console.error('Failed to cache cards:', error);
      return false;
    }
  };
  
  // Get cached cards
  const getOfflineCards = async (): Promise<TarotCard[]> => {
    try {
      const { value } = await Storage.get({ key: 'offline_cards' });
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Failed to get offline cards:', error);
      return [];
    }
  };
  
  // Sync pending readings when online
  const syncOfflineReadings = async () => {
    try {
      const readings = await getOfflineReadings();
      const pendingReadings = readings.filter(r => r.syncStatus === 'pending');
      
      for (const reading of pendingReadings) {
        try {
          // Upload to server
          const response = await fetch('/api/readings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reading)
          });
          
          if (response.ok) {
            // Update sync status
            reading.syncStatus = 'synced';
          }
        } catch (err) {
          console.error('Failed to sync reading:', err);
        }
      }
      
      // Save updated statuses
      await Storage.set({
        key: 'offline_readings',
        value: JSON.stringify(readings)
      });
      
      return true;
    } catch (error) {
      console.error('Failed to sync readings:', error);
      return false;
    }
  };
  
  return {
    saveReading,
    getOfflineReadings,
    cacheCardsForOffline,
    getOfflineCards,
    syncOfflineReadings
  };
}
```

### 5. Haptic Feedback

Add tactile feedback for card interactions or meditation sequences.

```bash
# Install the haptics plugin
npm install @capacitor/haptics
```

**Implementation example:**

```typescript
// client/src/hooks/use-haptic-feedback.tsx
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export function useHapticFeedback() {
  // Gentle impact for UI interactions
  const lightImpact = async () => {
    await Haptics.impact({ style: ImpactStyle.Light });
  };
  
  // Medium impact for card selections
  const mediumImpact = async () => {
    await Haptics.impact({ style: ImpactStyle.Medium });
  };
  
  // Heavy impact for significant events
  const heavyImpact = async () => {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  };
  
  // Vibration pattern for card reveal
  const cardRevealVibration = async () => {
    await Haptics.vibrate({ duration: 100 });
    setTimeout(async () => {
      await Haptics.vibrate({ duration: 300 });
    }, 150);
  };
  
  // Success vibration pattern
  const successVibration = async () => {
    await Haptics.notification({ type: 'success' });
  };
  
  // Warning vibration pattern
  const warningVibration = async () => {
    await Haptics.notification({ type: 'warning' });
  };
  
  return {
    lightImpact,
    mediumImpact,
    heavyImpact,
    cardRevealVibration,
    successVibration,
    warningVibration
  };
}
```

## Server-Side Changes for Native Features

### Setting Up Push Notification Server

```typescript
// server/push-service.ts
import * as admin from 'firebase-admin';
import { storage } from './storage';

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
});

export async function sendPushNotification(userId: number, title: string, body: string, data?: Record<string, string>) {
  try {
    // Get user from database
    const user = await storage.getUser(userId);
    if (!user || !user.pushToken) {
      console.log(`No push token for user ${userId}`);
      return false;
    }
    
    // Create notification message
    const message = {
      token: user.pushToken,
      notification: {
        title,
        body
      },
      data: data || {},
      android: {
        priority: 'high',
        notification: {
          icon: 'notification_icon',
          color: '#6D28D9'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default'
          }
        }
      }
    };
    
    // Send the message
    const response = await admin.messaging().send(message);
    console.log('Push notification sent:', response);
    return true;
  } catch (error) {
    console.error('Failed to send push notification:', error);
    return false;
  }
}
```

### Adding API Routes for Push Notifications

```typescript
// server/routes.ts (add to existing routes)
import { sendPushNotification } from './push-service';

// ...existing code...

// Add push token to user
app.post('/api/user/push-token', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    
    // Update user's push token in database
    await storage.updateUserPushToken(userId, token);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to save push token:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send test notification
app.post('/api/notifications/test', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user!.id;
    await sendPushNotification(
      userId,
      'Test Notification',
      'This is a test notification from Tarot Journey'
    );
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to send test notification:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
```

## Building and Deploying

### Building for iOS

```bash
# Build the web app
npm run build

# Update iOS native project with the latest web code
npx cap copy ios
npx cap update ios

# Open the iOS project in Xcode
npx cap open ios
```

In Xcode:
1. Configure signing with your Apple Developer account
2. Add required permissions in Info.plist (camera, notifications)
3. Build and run on a device or simulator
4. Archive and upload to App Store Connect

### Building for Android

```bash
# Build the web app
npm run build

# Update Android native project with the latest web code
npx cap copy android
npx cap update android

# Open the Android project in Android Studio
npx cap open android
```

In Android Studio:
1. Configure app signing
2. Add required permissions in AndroidManifest.xml
3. Build and run on a device or emulator
4. Generate signed bundle (AAB) for Google Play

## Conclusion

By implementing these native features, your app will:
1. Provide genuine value beyond what's possible on the web
2. Be much more likely to be approved by app store reviewers
3. Offer a better user experience with true native capabilities
4. Have better reengagement mechanisms through notifications

These implementations should help you successfully publish Tarot Journey to both the Apple App Store and Google Play Store while enhancing the overall app experience.