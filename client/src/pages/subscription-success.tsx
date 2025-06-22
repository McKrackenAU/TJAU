import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

export default function SubscriptionSuccessPage() {
  const { user, isLoading } = useAuth();
  const [countdown, setCountdown] = useState(5);
  const [_, navigate] = useLocation();

  // Start a countdown to redirect to homepage
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/");
    }
  }, [countdown, navigate]);

  // Loading state while checking if user is authenticated
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Subscription Success!</CardTitle>
          <CardDescription className="text-lg mt-2">
            Thank you for subscribing to Tarot Journey Premium
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p>
            {!user?.hasUsedFreeTrial ? 
              "Your 7-day free trial has been activated. You won't be charged until your trial ends." : 
              "Your subscription has been activated immediately."
            }
            {user?.isSubscribed ? (
              " Your account has been updated with premium access."
            ) : (
              " Please refresh the page if your subscription status hasn't updated yet."
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg mt-4">
            <h3 className="font-medium mb-2">What's next?</h3>
            <ul className="text-sm text-muted-foreground space-y-2 text-left list-disc pl-5">
              <li>Explore all premium features</li>
              <li>Access advanced learning tracks</li>
              <li>Create personalized readings</li>
              <li>Track your progress</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild className="w-full">
            <Link to="/">
              Start Exploring Now
            </Link>
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Redirecting to home page in {countdown} seconds...
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}