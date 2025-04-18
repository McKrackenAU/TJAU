import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Redirect, useLocation } from "wouter";

// Initialize Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.error("Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY");
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Pricing card with features list
function PricingCard() {
  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Tarot Journey Premium</CardTitle>
        <CardDescription className="text-lg">
          <div className="flex justify-center items-center mt-2 mb-1">
            <span className="text-3xl font-bold text-primary">$11.11</span>
            <span className="text-muted-foreground ml-2">/month</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className="mb-4" />
        <ul className="space-y-3 text-sm">
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 shrink-0" />
            <span>Unlimited access to all Tarot Journey features</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 shrink-0" />
            <span>Fully customizable journey with personalized insights</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 shrink-0" />
            <span>Advanced learning tracks with interactive exercises</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 shrink-0" />
            <span>Premium daily readings and interpretations</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 shrink-0" />
            <span>Exclusive subscriber-only content and updates</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 shrink-0" />
            <span>Cancel anytime</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

// Subscription form with Stripe integration
function SubscriptionForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [_, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: "Error",
        description: "Stripe has not been properly initialized",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/subscription/success`,
        },
      });

      if (error) {
        // Show error to customer
        toast({
          title: "Payment Failed",
          description: error.message || "An unknown error occurred",
          variant: "destructive",
        });
        setProcessing(false);
      }
      // On success, the user is redirected to the return_url
    } catch (err) {
      console.error("Subscription error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  const applyCouponMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiRequest("POST", "/api/verify-coupon", { code });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Invalid coupon code");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Coupon Applied",
        description: `Discount: ${data.discount}`,
      });
      setCouponApplied(true);
      // Refresh the subscription creation to include the coupon
      queryClient.invalidateQueries({ queryKey: ['/api/create-subscription'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Invalid Coupon",
        description: error.message,
        variant: "destructive",
      });
      setCouponApplied(false);
    },
  });

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Empty Coupon",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }
    applyCouponMutation.mutate(couponCode.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Payment Information</h3>
        <div className="border rounded-lg p-4">
          <PaymentElement />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="coupon">Have a coupon?</Label>
          {couponApplied && <Badge variant="outline" className="text-green-600">Applied</Badge>}
        </div>
        <div className="flex gap-2">
          <Input
            id="coupon"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={couponApplied || applyCouponMutation.isPending}
            className="max-w-[240px]"
          />
          <Button
            type="button"
            variant="outline"
            onClick={applyCoupon}
            disabled={couponApplied || !couponCode || applyCouponMutation.isPending}
          >
            {applyCouponMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Applying...
              </>
            ) : (
              "Apply"
            )}
          </Button>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" disabled={!stripe || !elements || processing} className="w-full">
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Subscribe Now
            </>
          )}
        </Button>
        <p className="text-sm text-muted-foreground text-center mt-2">
          Your subscription will begin immediately
        </p>
      </div>

      <div className="border-t pt-4 mt-6">
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 mr-1" />
          <span>Secure payment processing by Stripe</span>
        </div>
      </div>
    </form>
  );
}

export default function SubscribePage() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  
  // Create subscription session query
  const { 
    data: sessionData, 
    isLoading: isLoadingSession, 
    error
  } = useQuery({
    queryKey: ['/api/create-subscription', user?.id, window.location.search],
    queryFn: async () => {
      // Get coupon from URL if present
      const params = new URLSearchParams(window.location.search);
      const couponFromUrl = params.get('coupon');
      
      const response = await apiRequest('POST', '/api/create-subscription', {
        couponCode: couponFromUrl
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create subscription');
      }
      
      return response.json();
    },
    enabled: !!user,
    retry: 1,
  });
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect to={`/auth?redirect=${encodeURIComponent('/subscribe')}`} />;
  }
  
  // Already subscribed
  if (user.isSubscribed) {
    return <Redirect to="/account" />;
  }
  
  // Error creating subscription session
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Subscription Error</CardTitle>
            <CardDescription>
              We encountered a problem setting up your subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              {error instanceof Error ? error.message : "Unknown error occurred"}
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/create-subscription'] })}
              className="w-full"
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Show subscription form when we have the client secret
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Subscribe to Tarot Journey</h1>
        <p className="text-muted-foreground text-center mb-8">
          Unlock all features with a premium subscription
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="order-2 md:order-1">
            <PricingCard />
          </div>
          
          <div className="order-1 md:order-2">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Subscription</CardTitle>
                <CardDescription>
                  Start your premium subscription today
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingSession ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : sessionData?.clientSecret ? (
                  <Elements 
                    stripe={stripePromise} 
                    options={{ 
                      clientSecret: sessionData.clientSecret,
                      appearance: {
                        theme: 'stripe',
                      },
                    }}
                  >
                    <SubscriptionForm />
                  </Elements>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-destructive">
                      Unable to initialize payment form
                    </p>
                    <Button 
                      onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/create-subscription'] })}
                      className="mt-4"
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}