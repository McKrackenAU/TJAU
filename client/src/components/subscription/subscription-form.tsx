import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// The subscription form that appears inside the Elements provider
function SubscriptionFormContent() {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/subscription/success`,
      },
    });

    if (error) {
      // Show error message to customer
      setErrorMessage(error.message || 'Something went wrong with your payment');
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: error.message || 'Something went wrong with your payment',
      });
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription>
          Your card will not be charged until after your 7-day free trial ends. You can cancel anytime.
        </AlertDescription>
      </Alert>
      
      <PaymentElement />
      
      <Button 
        type="submit" 
        disabled={!stripe || isLoading} 
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
          </>
        ) : (
          'Start Free Trial'
        )}
      </Button>
      
      {errorMessage && (
        <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
      )}
    </form>
  );
}

// The main component that sets up the subscription
export default function SubscriptionForm() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingSecret, setIsLoadingSecret] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [secretError, setSecretError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPaymentIntent = async (couponToApply?: string) => {
    setIsLoadingSecret(true);
    setSecretError(null);
    
    try {
      const response = await apiRequest("POST", "/api/create-subscription", {
        couponCode: couponToApply || couponCode
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create subscription');
      }
      
      if (!data.clientSecret) {
        throw new Error('No client secret returned');
      }
      
      setClientSecret(data.clientSecret);
      
      if (couponToApply) {
        setCouponApplied(true);
        toast({
          title: "Coupon applied",
          description: "Your coupon code has been applied to this subscription",
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSecretError(error instanceof Error ? error.message : 'Error setting up payment');
      toast({
        variant: "destructive",
        title: "Subscription Error",
        description: error instanceof Error ? error.message : 'Error setting up payment',
      });
    } finally {
      setIsLoadingSecret(false);
    }
  };
  
  // Fetch the payment intent when the component mounts
  useEffect(() => {
    fetchPaymentIntent();
  }, []);
  
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast({
        variant: "destructive",
        title: "Empty coupon code",
        description: "Please enter a coupon code first",
      });
      return;
    }
    
    fetchPaymentIntent(couponCode);
  };

  if (isLoadingSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (secretError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Error</CardTitle>
          <CardDescription>
            We encountered a problem setting up your subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{secretError}</p>
          <Button
            onClick={() => fetchPaymentIntent()}
            className="mt-4"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Subscribe to Tarot Journey</CardTitle>
        <CardDescription>
          Unlock premium features with a subscription
        </CardDescription>
        <Badge className="mt-2 bg-purple-500 hover:bg-purple-600">7-Day Free Trial</Badge>
      </CardHeader>
      
      <CardContent>
        {!couponApplied && (
          <div className="mb-6 space-y-2">
            <Label htmlFor="coupon">Have a coupon?</Label>
            <div className="flex space-x-2">
              <Input
                id="coupon"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponApplied}
              />
              <Button type="button" variant="outline" onClick={handleApplyCoupon} disabled={couponApplied}>
                Apply
              </Button>
            </div>
          </div>
        )}
        
        {couponApplied && (
          <div className="mb-6">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
              Coupon Applied: {couponCode}
            </Badge>
          </div>
        )}
        
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <SubscriptionFormContent />
          </Elements>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        <p className="text-xs text-muted-foreground">
          Your subscription will automatically renew. You can cancel anytime from your account settings.
        </p>
      </CardFooter>
    </Card>
  );
}