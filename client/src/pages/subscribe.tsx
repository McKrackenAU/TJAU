import { useEffect } from 'react';
import { SubscriptionForm } from '@/components/subscription';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';

export default function SubscribePage() {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    // Redirect to subscription details if the user is already subscribed
    if (!isLoading && user?.isSubscribed) {
      setLocation('/account');
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    // Redirect to auth page if not logged in
    setLocation('/auth');
    return null;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Upgrade Your Experience</h1>
      
      <div className="max-w-3xl mx-auto mb-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Premium Benefits</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Unlimited tarot card readings</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Advanced AI-powered interpretations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>All premium learning tracks included</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Custom tarot cards import</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Priority customer support</span>
              </li>
            </ul>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium text-blue-700">7-Day Free Trial</h3>
              <p className="text-sm text-blue-600">
                Try all premium features free for 7 days. Cancel anytime before the trial ends and you won't be charged.
              </p>
            </div>
          </div>
          
          <div>
            <SubscriptionForm />
          </div>
        </div>
      </div>
    </div>
  );
}