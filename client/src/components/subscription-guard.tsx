import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Clock, CreditCard } from "lucide-react";
import { useLocation } from "wouter";

interface SubscriptionStatus {
  active: boolean;
  status: string;
  trialStatus: {
    inTrial: boolean;
    trialEnd: string;
    daysRemaining: number;
  } | null;
  hasPaymentMethod: boolean;
}

interface SubscriptionGuardProps {
  children: React.ReactNode;
  feature?: string;
  showUpgrade?: boolean;
}

export function SubscriptionGuard({ children, feature = "this feature", showUpgrade = true }: SubscriptionGuardProps) {
  const { user } = useAuth();
  const [_, navigate] = useLocation();

  // Special override for Jo BB - always allow access
  if (user?.email === 'jo@jmvirtualbusinessservices.com.au') {
    return <>{children}</>;
  }

  // Check subscription status
  const { data: subscriptionStatus } = useQuery<SubscriptionStatus>({
    queryKey: ['/api/subscription-details'],
    enabled: !!user?.isSubscribed && !!user?.stripeSubscriptionId,
    retry: false,
  });

  // Allow access if user is subscribed and subscription is active
  if (user?.isSubscribed && subscriptionStatus?.active) {
    return <>{children}</>;
  }

  // Allow access if user is in trial period
  if (subscriptionStatus?.trialStatus?.inTrial) {
    return (
      <>
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Trial active: {subscriptionStatus.trialStatus.daysRemaining} days remaining. 
            {!subscriptionStatus.hasPaymentMethod && (
              <Button 
                variant="link" 
                className="p-0 h-auto ml-1"
                onClick={() => navigate("/subscribe")}
              >
                Add payment method to continue after trial.
              </Button>
            )}
          </AlertDescription>
        </Alert>
        {children}
      </>
    );
  }

  // Block access and show upgrade prompt
  if (!showUpgrade) {
    return null;
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Lock className="h-16 w-16 text-muted-foreground" />
        </div>
        <CardTitle>Premium Feature</CardTitle>
        <CardDescription>
          Upgrade to Premium to access {feature}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">Premium Benefits:</h3>
          <ul className="text-sm space-y-1 list-disc pl-5">
            <li>Unlimited daily readings</li>
            <li>Advanced AI interpretations</li>
            <li>Personalized insights</li>
            <li>Complete learning library</li>
            <li>Progress tracking</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={() => navigate("/subscribe")} 
            className="w-full"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Start 7-Day Free Trial
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            No commitment • Cancel anytime
          </p>
        </div>
      </CardContent>
    </Card>
  );
}