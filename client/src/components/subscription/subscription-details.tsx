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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, CheckCircle, Calendar, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

interface SubscriptionStatus {
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

export default function SubscriptionDetails() {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchSubscriptionDetails();
  }, []);

  const fetchSubscriptionDetails = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest("GET", "/api/subscription-details");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch subscription details');
      }
      
      const data = await response.json();
      setSubscriptionStatus(data);
    } catch (error) {
      console.error('Error fetching subscription details:', error);
      setError(error instanceof Error ? error.message : 'Error fetching subscription details');
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Error fetching subscription details',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async (cancelAtEnd: boolean = true) => {
    setIsCanceling(true);
    
    try {
      const response = await apiRequest("POST", "/api/cancel-subscription", {
        cancelAtEnd
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel subscription');
      }
      
      const data = await response.json();
      
      toast({
        title: "Subscription Canceled",
        description: data.message,
      });
      
      // Refresh subscription details
      fetchSubscriptionDetails();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Error canceling subscription',
      });
    } finally {
      setIsCanceling(false);
      setConfirmCancelOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
          <Button
            onClick={fetchSubscriptionDetails}
            className="mt-4"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!subscriptionStatus?.active) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>
            You don't have an active subscription at the moment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Subscribe to access premium features of Tarot Journey.</p>
          <Button
            onClick={() => window.location.href = '/subscribe'}
            className="mt-4"
          >
            Subscribe Now
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  const renewalDate = formatDate(subscriptionStatus.renewalDate);
  const cancelDate = subscriptionStatus.canceledAt ? formatDate(subscriptionStatus.canceledAt) : null;
  const trialEndDate = subscriptionStatus.trialStatus?.trialEnd ? 
    formatDate(subscriptionStatus.trialStatus.trialEnd) : null;

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Your Subscription</CardTitle>
          <CardDescription>
            Manage your Tarot Journey subscription
          </CardDescription>
          {subscriptionStatus.status === 'trialing' && (
            <Badge className="mt-2 bg-blue-500 hover:bg-blue-600">
              Free Trial
            </Badge>
          )}
          {subscriptionStatus.cancelAtPeriodEnd && (
            <Badge variant="outline" className="mt-2 border-orange-300 text-orange-700 bg-orange-50">
              Canceling Soon
            </Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-4">
            {subscriptionStatus.trialStatus?.inTrial && (
              <div className="flex items-start space-x-2">
                <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Free Trial Period</p>
                  <p className="text-sm text-muted-foreground">
                    Your free trial ends on {trialEndDate} 
                    ({subscriptionStatus.trialStatus.daysRemaining} days remaining)
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-2">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">
                  {subscriptionStatus.cancelAtPeriodEnd 
                    ? 'Access Until' 
                    : 'Next Billing Date'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {renewalDate}
                </p>
              </div>
            </div>

            {subscriptionStatus.cancelAtPeriodEnd && (
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium">Subscription Ending</p>
                  <p className="text-sm text-muted-foreground">
                    Your subscription will end on {renewalDate}
                  </p>
                </div>
              </div>
            )}

            {!subscriptionStatus.cancelAtPeriodEnd && (
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-sm text-muted-foreground">
                    Your subscription is active
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          {!subscriptionStatus.cancelAtPeriodEnd && (
            <Button 
              variant="outline" 
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => setConfirmCancelOpen(true)}
              disabled={isCanceling}
            >
              {isCanceling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                'Cancel Subscription'
              )}
            </Button>
          )}

          {subscriptionStatus.cancelAtPeriodEnd && (
            <Button
              variant="outline"
              className="w-full border-green-300 text-green-600 hover:bg-green-50"
              onClick={() => window.location.href = '/subscribe'}
            >
              Resubscribe
            </Button>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <p className="text-xs text-muted-foreground">
            For billing questions, please contact support@tarotjourney.com
          </p>
        </CardFooter>
      </Card>

      <AlertDialog open={confirmCancelOpen} onOpenChange={setConfirmCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel your subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Your subscription will remain active until the end of your current billing period on {renewalDate}.
              You will not be charged again after this date.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => cancelSubscription(true)}
              className="bg-red-500 hover:bg-red-600"
            >
              {isCanceling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                'Cancel Subscription'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}