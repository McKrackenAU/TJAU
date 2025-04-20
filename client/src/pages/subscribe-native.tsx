import { useState } from 'react';
import { useLocation } from 'wouter';
import { AppLayout } from '@/components/app-layout';
import { AppStoreSubscription } from '@/components/subscription/app-store-subscription';
import { Card, CardContent } from '@/components/ui/card';
import { isNativeApp } from '@/services/app-store-payments';

export default function SubscribeNativePage() {
  const [, setLocation] = useLocation();
  
  // Redirect to the web-based subscription page if not in a native app
  const handleFallback = () => {
    setLocation('/subscribe');
  };
  
  // On successful subscription, navigate to the home page
  const handleSuccess = () => {
    setLocation('/');
  };
  
  return (
    <AppLayout>
      <div className="container max-w-md mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Subscribe to Tarot Journey
        </h1>
        
        <Card>
          <CardContent className="p-0">
            <AppStoreSubscription 
              onComplete={handleSuccess}
              onCancel={handleFallback}
            />
          </CardContent>
        </Card>
        
        <p className="text-sm text-center text-muted-foreground mt-6">
          Your subscription will automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period.
          You can manage your subscriptions in your device's account settings after purchase.
        </p>
        
        <div className="flex justify-center mt-6">
          <button
            onClick={handleFallback}
            className="text-sm text-primary hover:underline"
          >
            {isNativeApp() ? 'Use web payment instead' : 'Go to web subscription'}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}