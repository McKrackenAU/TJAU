import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { PaymentService } from "@/services/app-store-payments";
import { isIOSApp, isAndroidApp } from "@/services/app-store-payments";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export function AppStoreSubscription() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [paymentService] = useState(new PaymentService());
  const [platform, setPlatform] = useState<'ios' | 'android' | null>(null);
  
  // Initialize payment service and check subscription status
  useEffect(() => {
    const initPaymentService = async () => {
      try {
        if (isIOSApp()) {
          setPlatform('ios');
        } else if (isAndroidApp()) {
          setPlatform('android');
        }
        
        // Initialize payment processor
        await paymentService.initialize();
        
        // Check if user already has an active subscription
        const hasSubscription = await paymentService.hasActiveSubscription();
        setIsSubscribed(hasSubscription);
        
        if (hasSubscription) {
          const expiry = await paymentService.getSubscriptionExpiryDate();
          setExpiryDate(expiry);
        }
      } catch (error) {
        console.error("Failed to initialize payment service:", error);
        toast({
          title: "Subscription Service Error",
          description: "Unable to connect to the app store. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    initPaymentService();
  }, []);
  
  // Handle subscription purchase
  const handleSubscribe = async () => {
    setIsLoading(true);
    
    try {
      const success = await paymentService.purchaseSubscription();
      
      if (success) {
        setIsSubscribed(true);
        const expiry = await paymentService.getSubscriptionExpiryDate();
        setExpiryDate(expiry);
        
        // Update user data in the cache
        queryClient.invalidateQueries(["/api/user"]);
        
        toast({
          title: "Subscription Activated",
          description: "Thank you for subscribing to Tarot Journey Premium!",
        });
      }
    } catch (error) {
      console.error("Subscription purchase failed:", error);
      toast({
        title: "Subscription Failed",
        description: "Unable to complete your subscription. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle restoring purchases
  const handleRestorePurchases = async () => {
    setIsLoading(true);
    
    try {
      const restored = await paymentService.restorePurchases();
      
      if (restored) {
        setIsSubscribed(true);
        const expiry = await paymentService.getSubscriptionExpiryDate();
        setExpiryDate(expiry);
        
        // Update user data in the cache
        queryClient.invalidateQueries(["/api/user"]);
        
        toast({
          title: "Subscription Restored",
          description: "Your subscription has been successfully restored.",
        });
      } else {
        toast({
          title: "No Subscriptions Found",
          description: "We couldn't find any active subscriptions associated with your account.",
        });
      }
    } catch (error) {
      console.error("Restore purchases failed:", error);
      toast({
        title: "Restore Failed",
        description: "Unable to restore your purchases. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format expiry date for display
  const formatExpiryDate = (date: Date | null) => {
    if (!date) return "Unknown";
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Get platform-specific text
  const getPlatformText = () => {
    if (platform === 'ios') return "App Store";
    if (platform === 'android') return "Google Play";
    return "app store";
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Premium Subscription</CardTitle>
        <CardDescription>
          {isSubscribed
            ? `Your subscription is active until ${formatExpiryDate(expiryDate)}`
            : `Subscribe to unlock all premium features in Tarot Journey`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-primary" />
              <span>Daily AI-powered tarot interpretations</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-primary" />
              <span>Advanced spread interpretations</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-primary" />
              <span>Guided meditations for each card</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-primary" />
              <span>Unlimited journal entries</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-primary" />
              <span>Ad-free experience</span>
            </div>
          </div>
          
          {isSubscribed && (
            <div className="mt-4 p-3 bg-primary/10 rounded-md">
              <p className="text-sm">
                Your subscription will automatically renew through {getPlatformText()}. 
                You can manage your subscription in your {getPlatformText()} account settings.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        {isSubscribed ? (
          <div className="w-full p-3 bg-primary/20 rounded-md text-center">
            <p className="font-medium">Premium Subscription Active</p>
            <p className="text-sm text-muted-foreground">
              Next billing date: {formatExpiryDate(expiryDate)}
            </p>
          </div>
        ) : (
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubscribe}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              <>Subscribe - $11.11/month</>
            )}
          </Button>
        )}
        
        <Button
          variant="outline"
          className="w-full"
          onClick={handleRestorePurchases}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
            </>
          ) : (
            <>Restore Purchases</>
          )}
        </Button>
        
        <p className="text-xs text-center text-muted-foreground pt-2">
          Your subscription includes a 7-day free trial. You won't be charged until the trial period ends.
          Subscription will auto-renew until canceled.
        </p>
      </CardFooter>
    </Card>
  );
}