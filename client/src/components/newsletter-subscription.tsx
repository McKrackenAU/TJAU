import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Mail, AlertTriangle, CheckCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export default function NewsletterSubscription() {
  const { user, loginMutation } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [subscribed, setSubscribed] = useState(user?.newsletterSubscribed ?? true);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'info',
    content: string
  } | null>(null);

  const handleSubscriptionChange = async (value: boolean) => {
    try {
      setIsUpdating(true);
      setMessage(null);

      const response = await apiRequest('POST', '/api/newsletter/subscription', {
        subscribe: value
      });

      const data = await response.json();

      if (data.success) {
        setSubscribed(data.subscribed);
        setMessage({
          type: 'success',
          content: data.message || 'Your newsletter preference has been updated.'
        });

        // We don't need to update the user in session here
        // The next page load will get the updated user data
      } else {
        setMessage({
          type: 'error',
          content: data.error || 'Failed to update newsletter subscription.'
        });
      }
    } catch (error) {
      console.error('Error updating newsletter subscription:', error);
      setMessage({
        type: 'error',
        content: 'An error occurred while updating your newsletter subscription. Please try again.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Newsletter Subscription</CardTitle>
          <CardDescription>
            Sign in to manage your newsletter preferences.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Weekly Astrology Newsletter
        </CardTitle>
        <CardDescription>
          Receive insights into the weekly astrology and what to expect for the coming week.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Newsletter</p>
              <p className="text-sm text-muted-foreground">
                {subscribed 
                  ? 'You are currently subscribed to our weekly astrology newsletter.' 
                  : 'You are not currently receiving our weekly astrology newsletter.'}
              </p>
            </div>
            <Switch 
              checked={subscribed} 
              onCheckedChange={handleSubscriptionChange}
              disabled={isUpdating}
            />
          </div>

          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : message.type === 'error' ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              <AlertTitle>
                {message.type === 'success' ? 'Success' : message.type === 'error' ? 'Error' : 'Information'}
              </AlertTitle>
              <AlertDescription>{message.content}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          You can unsubscribe at any time by clicking the unsubscribe link in the newsletter or toggling the switch above.
        </p>
      </CardFooter>
    </Card>
  );
}