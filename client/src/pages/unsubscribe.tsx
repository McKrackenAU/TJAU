import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

export default function UnsubscribePage() {
  const [location, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your unsubscribe request...');

  useEffect(() => {
    async function processUnsubscribe() {
      try {
        // Get token from URL query parameter
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
          setStatus('error');
          setMessage('Invalid or missing unsubscribe token. Please check your link or contact support.');
          return;
        }

        // Call the unsubscribe API
        const response = await fetch(`/api/newsletter/unsubscribe?token=${token}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('success');
          setMessage(data.message || 'You have been successfully unsubscribed from our newsletter.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to process your unsubscribe request. Please try again or contact support.');
        }
      } catch (error) {
        console.error('Error processing unsubscribe:', error);
        setStatus('error');
        setMessage('An unexpected error occurred while processing your request. Please try again later.');
      }
    }

    processUnsubscribe();
  }, []);

  return (
    <div className="container max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle>Newsletter Unsubscribe</CardTitle>
          <CardDescription>
            Manage your newsletter subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'loading' ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>{message}</p>
            </div>
          ) : (
            <Alert variant={status === 'success' ? 'default' : 'destructive'}>
              {status === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertTitle>
                {status === 'success' ? 'Unsubscribed' : 'Error'}
              </AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={() => setLocation('/')}>
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}