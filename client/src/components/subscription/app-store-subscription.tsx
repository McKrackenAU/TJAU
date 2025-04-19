import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PaymentService, isIOSApp, isAndroidApp } from "@/services/app-store-payments";
import { useState } from "react";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";

/**
 * Component for handling in-app purchases in iOS/Android app
 */
export function AppStoreSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Create payment service instance
  const paymentService = new PaymentService();
  
  // Handle subscription purchase
  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Initialize payment processor
      await paymentService.initialize();
      
      // Purchase subscription
      const success = await paymentService.purchaseSubscription();
      
      if (success) {
        setSuccess(true);
        toast({
          title: "Subscription Successful",
          description: "You now have access to all premium features!",
        });
        
        // Refresh user data
        queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      } else {
        // Subscription failed or was cancelled
        setError("Subscription purchase failed or was cancelled");
      }
    } catch (err) {
      console.error("Error purchasing subscription:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      
      toast({
        title: "Subscription Failed",
        description: "There was a problem processing your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle restoring purchases
  const handleRestorePurchases = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Initialize payment processor
      await paymentService.initialize();
      
      // Restore purchases
      const success = await paymentService.restorePurchases();
      
      if (success) {
        setSuccess(true);
        toast({
          title: "Purchases Restored",
          description: "Your subscription has been restored successfully!",
        });
        
        // Refresh user data
        queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      } else {
        // No purchases to restore
        setError("No active subscriptions found to restore");
        
        toast({
          title: "No Subscriptions Found",
          description: "We couldn't find any active subscriptions linked to your account.",
        });
      }
    } catch (err) {
      console.error("Error restoring purchases:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      
      toast({
        title: "Restore Failed",
        description: "There was a problem restoring your purchases. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Determine which app store we're using
  const appStoreName = isIOSApp() ? "App Store" : isAndroidApp() ? "Google Play" : "app store";
  
  // If user already has an active subscription
  if (user?.isSubscribed) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Subscription Active</CardTitle>
          <CardDescription>
            You already have an active subscription to Tarot Journey Premium.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Your subscription is managed through {appStoreName}.
            To manage or cancel your subscription, please visit your {appStoreName} account settings.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Subscribe to Tarot Journey</CardTitle>
        <CardDescription>
          Unlock all premium features and begin your spiritual journey.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-accent/50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Premium Features</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Unlimited daily readings</li>
              <li>Access to all premium spreads</li>
              <li>Personalized card interpretations</li>
              <li>Meditation audio for each card</li>
              <li>Advanced learning tracks and lessons</li>
            </ul>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold">$11.11 AUD</div>
            <div className="text-sm text-muted-foreground">per month</div>
          </div>
          
          {/* Display success message */}
          {success && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Subscription Successful</AlertTitle>
              <AlertDescription>
                Thank you for subscribing to Tarot Journey Premium!
              </AlertDescription>
            </Alert>
          )}
          
          {/* Display error message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Subscription Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          className="w-full" 
          onClick={handleSubscribe} 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>Subscribe Now</>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleRestorePurchases}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Restore Purchases"
          )}
        </Button>
        
        <p className="text-xs text-center text-muted-foreground mt-4">
          Payment will be charged to your {appStoreName} account at confirmation of purchase. 
          Subscription automatically renews unless it is canceled at least 24 hours before the 
          end of the current period. Your account will be charged for renewal within 24 hours 
          prior to the end of the current period. You can manage and cancel your subscriptions 
          by going to your account settings in the {appStoreName} after purchase.
        </p>
      </CardFooter>
    </Card>
  );
}