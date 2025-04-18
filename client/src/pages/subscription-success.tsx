import { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';

export default function SubscriptionSuccessPage() {
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  const [trialEndDate, setTrialEndDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get subscription details to show the trial end date
    const fetchSubscriptionDetails = async () => {
      try {
        const response = await apiRequest("GET", "/api/subscription-details");
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.trialStatus?.trialEnd) {
            // Format the date
            const date = new Date(data.trialStatus.trialEnd);
            setTrialEndDate(date.toLocaleDateString('en-US', {
              year: 'numeric', 
              month: 'long', 
              day: 'numeric'
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching subscription details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionDetails();
  }, []);

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 w-16 h-16 flex items-center justify-center rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Subscription Activated!</CardTitle>
          <CardDescription>
            Your free trial has been successfully started
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>
            Thank you for subscribing to Tarot Journey Premium. Your 7-day free trial has been activated.
          </p>
          
          {trialEndDate && (
            <p className="text-sm bg-blue-50 p-3 rounded-md">
              Your free trial will end on <span className="font-medium">{trialEndDate}</span>, 
              after which your card will be charged automatically. You can cancel anytime before then.
            </p>
          )}
          
          <p className="font-medium mt-4">
            You now have full access to all premium features!
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button 
            onClick={() => setLocation('/account')}
            variant="outline"
          >
            Manage Subscription
          </Button>
          <Button onClick={() => setLocation('/')}>
            Start Exploring <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}