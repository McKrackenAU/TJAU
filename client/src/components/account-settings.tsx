import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function AccountSettings() {
  const { user, loginMutation } = useAuth();
  const { toast } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);

  if (!user) {
    return null;
  }

  const handleCancelSubscription = async () => {
    try {
      setIsCancelling(true);

      const response = await apiRequest('POST', '/api/cancel-subscription');
      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Subscription Cancelled',
          description: 'Your subscription has been successfully cancelled.',
        });
        
        // Reload user data to reflect the new subscription status
        loginMutation.mutate({
          username: user.username,
          password: '', // This won't be used since we're just refreshing
        });
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to cancel subscription',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while cancelling your subscription',
        variant: 'destructive',
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Account Settings</CardTitle>
        <CardDescription>Manage your subscription and account</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium">Username</h3>
          <p className="text-sm">{user.username}</p>
        </div>
        
        <div className="space-y-1">
          <h3 className="text-sm font-medium">Email</h3>
          <p className="text-sm">{user.email}</p>
        </div>
        
        <div className="space-y-1">
          <h3 className="text-sm font-medium">Subscription Status</h3>
          <p className="text-sm">
            {user.isSubscribed 
              ? 'Active' 
              : 'Inactive'}
          </p>
        </div>
        
        <div className="space-y-1">
          <h3 className="text-sm font-medium">Subscription Price</h3>
          <p className="text-sm">$11.11 AUD per month</p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        {user.isSubscribed && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Cancel Subscription</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will cancel your subscription. You'll continue to have access until the end of your current billing period, but won't be charged again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Nevermind</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancelSubscription}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Yes, Cancel Subscription'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        
        {!user.isSubscribed && (
          <Button variant="default" onClick={() => window.location.href = '/subscribe'}>
            Subscribe
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}