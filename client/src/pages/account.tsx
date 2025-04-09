import AccountSettings from '@/components/account-settings';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { Redirect } from 'wouter';

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
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscription" className="mt-4">
          <AccountSettings />
        </TabsContent>
        
        <TabsContent value="profile" className="mt-4">
          <div className="text-center p-8">
            <p className="text-muted-foreground">
              Profile settings coming soon
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}