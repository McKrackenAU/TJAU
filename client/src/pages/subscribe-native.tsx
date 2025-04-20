import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/hooks/use-toast";
import { PaymentService } from '@/services/app-store-payments';
import { AppLayout } from '@/components/app-layout';
import { useAuth } from '@/hooks/use-auth';
import { queryClient } from '@/lib/queryClient';

export default function SubscribeNativePage() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [paymentService] = useState(() => new PaymentService());
  
  // Check if native payments are supported (iOS/Android)
  const isNativePaymentSupported = paymentService.isNativePaymentSupported();
  
  useEffect(() => {
    // If not on a native platform, redirect to web subscription page
    if (!isNativePaymentSupported) {
      navigate('/subscribe');
      return;
    }
    
    // Initialize the payment service
    const initPayments = async () => {
      try {
        await paymentService.initialize();
        
        // Check if user already has an active subscription
        const hasSubscription = await paymentService.hasActiveSubscription();
        setHasActiveSubscription(hasSubscription);
        
        if (hasSubscription) {
          const expiry = await paymentService.getSubscriptionExpiryDate();
          setExpiryDate(expiry);
        }
      } catch (error) {
        console.error('Error initializing payments:', error);
        toast({
          title: "Payment initialization failed",
          description: "There was a problem setting up in-app purchases. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    initPayments();
  }, [isNativePaymentSupported, navigate, paymentService, toast]);
  
  // If the user is not logged in, we need to redirect to login
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);
  
  // Handle the subscription purchase
  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const success = await paymentService.purchaseSubscription();
      
      if (success) {
        // Invalidate user data to refresh subscription status
        queryClient.invalidateQueries({ queryKey: ['/api/user'] });
        
        toast({
          title: "Subscription successful!",
          description: "Thank you for subscribing to Tarot Journey Premium.",
        });
        
        // Update local state
        setHasActiveSubscription(true);
        const expiry = await paymentService.getSubscriptionExpiryDate();
        setExpiryDate(expiry);
      } else {
        toast({
          title: "Subscription failed",
          description: "The subscription process was cancelled or failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error during subscription purchase:', error);
      toast({
        title: "Subscription error",
        description: "There was a problem processing your subscription. Please try again later.",
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
        // Invalidate user data to refresh subscription status
        queryClient.invalidateQueries({ queryKey: ['/api/user'] });
        
        // Check subscription status again
        const hasSubscription = await paymentService.hasActiveSubscription();
        setHasActiveSubscription(hasSubscription);
        
        if (hasSubscription) {
          const expiry = await paymentService.getSubscriptionExpiryDate();
          setExpiryDate(expiry);
          
          toast({
            title: "Purchases restored",
            description: "Your subscription has been successfully restored.",
          });
        } else {
          toast({
            title: "No active subscription found",
            description: "We couldn't find any active subscription to restore.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Restore failed",
          description: "No purchases were found to restore.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error restoring purchases:', error);
      toast({
        title: "Restore error",
        description: "There was a problem restoring your purchases. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format the expiry date for display
  const formatExpiryDate = (date: Date | null) => {
    if (!date) return 'Unknown';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Tarot Journey Premium</h1>
        
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Premium Subscription</CardTitle>
              <CardDescription>
                Unlock the full potential of your tarot journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasActiveSubscription ? (
                <div className="space-y-4">
                  <div className="bg-green-100 dark:bg-green-900 p-4 rounded-md">
                    <h3 className="font-medium text-green-800 dark:text-green-300">
                      Active Subscription
                    </h3>
                    <p className="text-green-700 dark:text-green-400 text-sm">
                      Your subscription is active until {formatExpiryDate(expiryDate)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Benefits you're enjoying:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Full access to all tarot card interpretations</li>
                      <li>Advanced AI readings and insights</li>
                      <li>Personalized learning tracks</li>
                      <li>Ad-free experience</li>
                      <li>Priority customer support</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Subscription includes:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Full access to all tarot card interpretations</li>
                      <li>Advanced AI readings and insights</li>
                      <li>Personalized learning tracks</li>
                      <li>Ad-free experience</li>
                      <li>Priority customer support</li>
                    </ul>
                  </div>
                  <div className="border-t border-b py-4 my-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Monthly Subscription</p>
                        <p className="text-sm text-muted-foreground">7-day free trial, then $11.11/month</p>
                      </div>
                      <span className="text-xl font-bold">$11.11</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>Your subscription will automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period.</p>
                    <p className="mt-1">You can manage your subscription in your App Store account settings after purchase.</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              {!hasActiveSubscription && (
                <Button 
                  className="w-full" 
                  disabled={isLoading}
                  onClick={handleSubscribe}
                >
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Subscribe Now'
                  )}
                </Button>
              )}
              <Button 
                variant="outline" 
                className="w-full" 
                disabled={isLoading}
                onClick={handleRestorePurchases}
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Restore Purchases'
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}