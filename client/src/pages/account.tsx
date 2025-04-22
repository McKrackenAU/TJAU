import AccountSettings from '@/components/account-settings';
import NewsletterSubscription from '@/components/newsletter-subscription';
import { SubscriptionDetails } from '@/components/subscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { LogOut, Loader2 } from 'lucide-react';
import { useLocation, Redirect } from 'wouter';

// Logout Button Component
function LogoutButton() {
  const { logoutMutation } = useAuth();
  const [_, navigate] = useLocation();
  
  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate('/auth');
  };
  
  return (
    <Button 
      variant="outline" 
      className="w-full flex items-center gap-2" 
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
    >
      {logoutMutation.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      Sign Out
    </Button>
  );
}

export default function AccountPage() {
  const { user, isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Redirect to auth page if not logged in
  if (!user) {
    return <Redirect to="/auth" />;
  }
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <PageHeader
        heading="Account Settings"
        text="Manage your account and subscription"
      />
      
      <Tabs defaultValue="subscription" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscription" className="mt-4">
          <SubscriptionDetails />
        </TabsContent>
        
        <TabsContent value="newsletter" className="mt-4">
          <NewsletterSubscription />
        </TabsContent>
        
        <TabsContent value="profile" className="mt-4">
          <div className="space-y-6 p-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
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
                  <h3 className="text-sm font-medium">Account Status</h3>
                  <p className="text-sm flex items-center gap-2">
                    {user.isAdmin ? 
                      <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded text-xs">Admin</span> : 
                      null
                    }
                    {user.isSubscribed ?
                      <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded text-xs">Premium</span> :
                      <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 px-2 py-0.5 rounded text-xs">Free</span>
                    }
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button variant="outline" asChild className="w-full">
                  <a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    Privacy Policy
                  </a>
                </Button>
                <LogoutButton />
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}