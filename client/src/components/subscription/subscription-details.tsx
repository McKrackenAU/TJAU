import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CalendarDays, Check, Clock, CreditCard, HelpCircle, Loader2, Ticket, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SubscriptionDetailsData {
  active: boolean;
  status: string;
  trialStatus: {
    inTrial: boolean;
    trialEnd: string;
    daysRemaining: number;
  } | null;
  renewalDate: string;
  canceledAt: string | null;
  cancelAtPeriodEnd: boolean;
  hasPaymentMethod: boolean;
}

export function SubscriptionDetails() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");

  // Fetch subscription details
  const { 
    data: subscription, 
    isLoading, 
    error,
    isError 
  } = useQuery<SubscriptionDetailsData>({
    queryKey: ['/api/subscription-details'],
    enabled: !!user?.isSubscribed && !!user?.stripeSubscriptionId,
    retry: false,
  });

  // Mutation for canceling subscription
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/cancel-subscription', { cancelAtEnd: true });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel subscription');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subscription-details'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: "Subscription Canceled",
        description: "Your subscription will remain active until the end of the current billing period.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Cancel",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Mutation for applying coupon code
  const applyCouponMutation = useMutation({
    mutationFn: async (couponCode: string) => {
      const response = await apiRequest('POST', '/api/apply-coupon', { 
        couponCode,
        subscriptionId: user?.stripeSubscriptionId
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to apply coupon');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/subscription-details'] });
      setAppliedCouponCode(couponCode);
      setCouponCode("");
      toast({
        title: "Coupon Applied",
        description: "Your coupon code has been applied to your subscription",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Apply Coupon",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle coupon code application
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        variant: "destructive",
        title: "Empty coupon code",
        description: "Please enter a coupon code first",
      });
      return;
    }
    
    applyCouponMutation.mutate(couponCode);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // No subscription found
  if (!user?.isSubscribed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>
            You currently don't have an active subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Subscription Found</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to get full access to all features and content
            </p>
            <Button onClick={() => navigate("/subscribe")}>
              Subscribe Now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-40 mb-2" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-28" />
        </CardFooter>
      </Card>
    );
  }

  // Error state
  if (isError || !subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>
            There was a problem loading your subscription details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <X className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">Error Loading Subscription</h3>
            <p className="text-muted-foreground mb-6">
              {error instanceof Error ? error.message : "Unknown error occurred"}
            </p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/subscription-details'] })}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Subscription</CardTitle>
            <CardDescription>
              Manage your subscription details
            </CardDescription>
          </div>
          <Badge 
            variant={
              subscription.status === 'trialing' ? 'outline' :
              subscription.active ? 'default' : 'destructive'
            }
            className="ml-2"
          >
            {subscription.status === 'trialing' ? 'Trial' :
             subscription.active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trial status */}
        {subscription.trialStatus && subscription.trialStatus.inTrial && (
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5 mr-2" />
              <div>
                <h3 className="font-medium mb-1">Free Trial Period</h3>
                <p className="text-sm text-muted-foreground">
                  Your free trial ends on {formatDate(subscription.trialStatus.trialEnd)}.
                  {subscription.trialStatus.daysRemaining > 0 && (
                    <> You have <span className="font-medium">{subscription.trialStatus.daysRemaining} days</span> remaining.</>
                  )}
                </p>
                {!subscription.cancelAtPeriodEnd && (
                  <p className="text-sm mt-2">
                    Your subscription will automatically continue after the trial period.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Subscription details */}
        <div className="space-y-4">
          <div className="flex items-start">
            <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5 mr-2" />
            <div>
              <h3 className="font-medium">Subscription Plan</h3>
              <p className="text-sm text-muted-foreground">
                Tarot Journey Premium
              </p>
            </div>
          </div>
          
          {/* Coupon code application */}
          <div className="flex items-start">
            <Ticket className="h-5 w-5 text-muted-foreground mt-0.5 mr-2" />
            <div className="w-full space-y-2">
              <h3 className="font-medium">Coupon Code</h3>
              {appliedCouponCode ? (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                    {appliedCouponCode}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setAppliedCouponCode("")}
                    className="h-7 px-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter coupon code" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="max-w-[200px]"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={!couponCode.trim() || applyCouponMutation.isPending}
                    onClick={handleApplyCoupon}
                  >
                    {applyCouponMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5 mr-2" />
            <div>
              <h3 className="font-medium">
                {subscription.cancelAtPeriodEnd ? 'Access Until' : 'Next Billing Date'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(subscription.renewalDate)}
              </p>
              {subscription.cancelAtPeriodEnd && (
                <p className="text-sm mt-0.5 text-muted-foreground">
                  Your subscription will not renew after this date
                </p>
              )}
            </div>
          </div>

          {!subscription.hasPaymentMethod && !subscription.trialStatus?.inTrial && (
            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg">
              <div className="flex items-start">
                <HelpCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-2" />
                <div>
                  <h3 className="font-medium text-amber-800 dark:text-amber-300">Payment Method Required</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Please add a payment method to continue your subscription after the trial period.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => navigate("/subscribe")}
                  >
                    Add Payment Method
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row justify-between gap-3">
        {!subscription.cancelAtPeriodEnd ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Cancel Subscription</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your subscription will remain active until {formatDate(subscription.renewalDate)}, 
                  after which you will lose access to premium features.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => cancelSubscriptionMutation.mutate()}
                  disabled={cancelSubscriptionMutation.isPending}
                >
                  {cancelSubscriptionMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Canceling...
                    </>
                  ) : (
                    "Yes, Cancel"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <div className="bg-muted p-3 rounded-lg w-full">
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-2" />
              <div>
                <h3 className="font-medium">Cancellation Confirmed</h3>
                <p className="text-sm text-muted-foreground">
                  Your subscription will end on {formatDate(subscription.renewalDate)}
                </p>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={() => navigate("/subscribe")}
          disabled={!subscription.cancelAtPeriodEnd}
        >
          {subscription.cancelAtPeriodEnd ? "Reactivate Subscription" : "Manage Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}