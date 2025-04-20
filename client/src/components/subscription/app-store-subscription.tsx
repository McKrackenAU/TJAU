import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PaymentService } from '@/services/app-store-payments';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';

// Create a singleton instance of the payment service
const paymentService = new PaymentService();

interface AppStoreSubscriptionProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function AppStoreSubscription({ onComplete, onCancel }: AppStoreSubscriptionProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  
  // Initialize the payment service
  useEffect(() => {
    async function initPaymentService() {
      try {
        await paymentService.initialize();
        const isNativeSupported = paymentService.isNativePaymentSupported();
        setIsSupported(isNativeSupported);
        
        // Check if user already has an active subscription
        if (isNativeSupported) {
          const hasSubscription = await paymentService.hasActiveSubscription();
          setIsSubscribed(hasSubscription);
          
          if (hasSubscription) {
            const expiry = await paymentService.getSubscriptionExpiryDate();
            setExpiryDate(expiry);
          }
        }
      } catch (error) {
        console.error('Failed to initialize payment service:', error);
        setIsSupported(false);
      }
    }
    
    initPaymentService();
  }, []);
  
  // Handle subscription purchase
  const handleSubscribe = async () => {
    if (!isSupported) {
      toast({
        title: 'Not Supported',
        description: 'In-app purchases are not supported on this device.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await paymentService.purchaseSubscription();
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Your subscription has been activated!',
        });
        
        // Update subscription status
        setIsSubscribed(true);
        const expiry = await paymentService.getSubscriptionExpiryDate();
        setExpiryDate(expiry);
        
        // Invalidate queries to refresh user data
        queryClient.invalidateQueries('/api/user');
        
        if (onComplete) {
          onComplete();
        }
      } else {
        toast({
          title: 'Subscription Failed',
          description: 'Unable to complete the subscription purchase.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Subscription Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle restore purchases
  const handleRestore = async () => {
    setIsLoading(true);
    
    try {
      const success = await paymentService.restorePurchases();
      
      if (success) {
        toast({
          title: 'Purchases Restored',
          description: 'Your subscription has been restored!',
        });
        
        // Update subscription status
        setIsSubscribed(true);
        const expiry = await paymentService.getSubscriptionExpiryDate();
        setExpiryDate(expiry);
        
        // Invalidate queries to refresh user data
        queryClient.invalidateQueries('/api/user');
        
        if (onComplete) {
          onComplete();
        }
      } else {
        toast({
          title: 'Restore Failed',
          description: 'No previous purchases found or restore failed.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Restore error:', error);
      toast({
        title: 'Restore Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isSupported) {
    return (
      <div className="text-center p-4">
        <p className="text-base mb-4">
          In-app purchases are not supported on this device.
        </p>
        <Button
          onClick={onCancel}
          variant="outline"
          className="w-full"
        >
          Go Back
        </Button>
      </div>
    );
  }
  
  if (isSubscribed) {
    return (
      <div className="text-center p-4">
        <h3 className="text-lg font-semibold mb-2">Subscription Active</h3>
        <p className="text-base mb-2">
          You already have an active subscription.
        </p>
        {expiryDate && (
          <p className="text-sm text-muted-foreground mb-4">
            Expires: {expiryDate.toLocaleDateString()}
          </p>
        )}
        <Button
          onClick={onComplete}
          className="w-full"
        >
          Continue
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Unlock Premium Access
        </h3>
        <p className="text-base mb-2">
          Get unlimited access to all premium features:
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Unlimited daily card readings</li>
          <li>Personalized tarot interpretations</li>
          <li>Advanced spread analysis</li>
          <li>AI-powered insights</li>
          <li>Meditation audio for each card</li>
        </ul>
        <p className="text-sm text-muted-foreground mb-2">
          Subscription includes a 7-day free trial
        </p>
      </div>
      
      <div className="space-y-3">
        <Button
          onClick={handleSubscribe}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Subscribe Now'
          )}
        </Button>
        
        <Button
          onClick={handleRestore}
          variant="outline"
          className="w-full"
          disabled={isLoading}
        >
          Restore Purchases
        </Button>
        
        {onCancel && (
          <Button
            onClick={onCancel}
            variant="ghost"
            className="w-full"
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}