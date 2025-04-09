import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import TermsAndConditions from '@/components/terms-and-conditions';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface SubscribeFormProps {
  termsAccepted: boolean;
}

const SubscribeForm = ({ termsAccepted }: SubscribeFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [_, navigate] = useLocation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: "You are now subscribed!",
        });
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || isLoading || !termsAccepted}
        title={!termsAccepted ? "You must accept the terms and conditions first" : ""}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : !termsAccepted ? (
          "Accept Terms to Continue"
        ) : (
          "Subscribe Now"
        )}
      </Button>
    </form>
  );
};

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(true);
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Create a subscription as soon as the page loads
    const fetchSubscription = async () => {
      try {
        setIsLoading(true);
        const res = await apiRequest("POST", "/api/get-or-create-subscription");
        
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Failed to create subscription");
        }
        
        const data = await res.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          toast({
            title: "Subscription Error",
            description: "Couldn't initialize the payment. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Subscription error:", error);
        toast({
          title: "Subscription Error",
          description: error instanceof Error ? error.message : "Failed to set up payment",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [user, navigate, toast]);

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Preparing your subscription...</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Subscription Error</CardTitle>
            <CardDescription>
              We couldn't set up the payment process. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/")} className="w-full">
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {showTerms ? (
        <div className="max-w-4xl">
          <TermsAndConditions 
            onAccept={() => {
              setTermsAccepted(true);
              setShowTerms(false);
              toast({
                title: "Terms Accepted",
                description: "Thank you for accepting our terms and conditions.",
              });
            }}
          />
        </div>
      ) : (
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Premium Subscription</CardTitle>
            <CardDescription>
              Subscribe to Tarot Journey Premium from JMRVBS Pty Ltd for unlimited readings, in-depth analysis, and exclusive content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between items-baseline mb-4">
                <h3 className="text-lg font-medium">Premium Plan</h3>
                <div>
                  <span className="text-2xl font-bold">$11.11</span>
                  <span className="text-sm text-muted-foreground ml-1">/month</span>
                </div>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Unlimited AI card interpretations</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Advanced spreads with detailed analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Exclusive learning content and tracks</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Priority customer support</span>
                </li>
              </ul>
            </div>
            
            <div className="text-sm mb-6 p-3 bg-muted/40 rounded-lg">
              <p>
                By subscribing, you agree to our Terms and Conditions. This app is for 
                <strong> entertainment purposes only</strong>. 
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary" 
                  onClick={() => setShowTerms(true)}
                >
                  View Terms & Conditions
                </Button>
              </p>
            </div>
            
            {/* The Elements provider is required to render the payment form */}
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <SubscribeForm termsAccepted={termsAccepted} />
            </Elements>
          </CardContent>
        </Card>
      )}
    </div>
  );
}