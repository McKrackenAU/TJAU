import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/use-auth';
import { Redirect, Link } from 'wouter';
import { Loader2, Upload, Image, Settings } from 'lucide-react';
import ApiUsageDashboard from '@/components/api-usage-dashboard';
import { toast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const [tabValue, setTabValue] = useState('api-usage');

  // If user is not an admin, redirect to home page
  useEffect(() => {
    if (user && !user.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access the admin dashboard.",
        variant: "destructive"
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if not logged in or not an admin
  if (!user) {
    return <Redirect to="/auth" />;
  }

  if (!user.isAdmin) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Quick Actions Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="h-5 w-5" />
                Upload Card Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Upload missing tarot card images to complete your deck
              </p>
              <Link href="/upload-cards">
                <Button className="w-full">
                  <Image className="h-4 w-4 mr-2" />
                  Upload Cards
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5" />
                API Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Monitor API usage and costs across all services
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setTabValue('api-usage')}
              >
                View API Stats
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={tabValue} onValueChange={setTabValue}>
        <TabsList className="mb-6">
          <TabsTrigger value="api-usage">API Usage & Costs</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api-usage">
          <ApiUsageDashboard />
        </TabsContent>
        
        <TabsContent value="users">
          <div className="p-12 text-center">
            <h2 className="text-xl font-semibold">User Management Coming Soon</h2>
            <p className="text-muted-foreground mt-2">
              This section will allow you to manage user accounts, subscriptions, and permissions.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="system">
          <div className="p-12 text-center">
            <h2 className="text-xl font-semibold">System Status Coming Soon</h2>
            <p className="text-muted-foreground mt-2">
              This section will display system health metrics, database status, and cache information.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}