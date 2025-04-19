import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Container } from "@/components/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StripeSubscriptionForm } from "@/components/subscription/subscription-form";
import { AppStoreSubscription } from "@/components/subscription/app-store-subscription";
import { isNativeApp, isIOSApp, isAndroidApp } from "@/services/app-store-payments";

export default function SubscribeNativePage() {
  const { user, isLoading } = useAuth();
  const [isCheckingNative, setIsCheckingNative] = useState(true);
  const [isRunningInNativeApp, setIsRunningInNativeApp] = useState(false);
  
  useEffect(() => {
    // Check if running in a native container (iOS/Android app)
    const checkNativeEnvironment = async () => {
      const nativeApp = isNativeApp();
      setIsRunningInNativeApp(nativeApp);
      setIsCheckingNative(false);
    };
    
    checkNativeEnvironment();
  }, []);
  
  // Show loading state while checking authentication and environment
  if (isLoading || isCheckingNative) {
    return (
      <Container className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Container>
    );
  }
  
  // Redirect to home if already subscribed
  if (user?.isSubscribed) {
    return <Redirect to="/" />;
  }
  
  // If running in native app, show the appropriate payment UI
  if (isRunningInNativeApp) {
    return (
      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Tarot Journey Premium
            </h1>
            <p className="text-muted-foreground mt-2">
              {isIOSApp() ? "App Store" : "Google Play"} Subscription
            </p>
          </div>
          
          <AppStoreSubscription />
        </div>
      </Container>
    );
  }
  
  // Otherwise, show the web subscription options (Stripe)
  return (
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Tarot Journey Premium
          </h1>
          <p className="text-muted-foreground mt-2">
            Choose your subscription plan
          </p>
        </div>
        
        <Tabs defaultValue="monthly" className="max-w-md mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly (Save 15%)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly">
            <StripeSubscriptionForm 
              planId="price_monthly"
              planName="Monthly"
              planPrice="$11.11"
              planInterval="month"
              planDescription="Billed monthly"
            />
          </TabsContent>
          
          <TabsContent value="yearly">
            <StripeSubscriptionForm 
              planId="price_yearly"
              planName="Yearly"
              planPrice="$113.00"
              planInterval="year"
              planDescription="Billed annually (Save 15%)"
            />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}