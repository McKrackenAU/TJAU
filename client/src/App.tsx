import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import DailyDraw from "@/pages/daily-draw";
import Spreads from "@/pages/spreads";
import Library from "@/pages/library";
import History from "@/pages/history";
import Study from "@/pages/study";
import Journal from "@/pages/journal";
import Learning from "@/pages/learning";
import LessonPage from "@/pages/lesson";
import TestImages from "@/pages/test-images";
import AuthPage from "@/pages/auth-page";
import Subscribe from "@/pages/subscribe";
import SubscribeNative from "@/pages/subscribe-native";
import SubscriptionSuccess from "@/pages/subscription-success";
import VoiceGuidedPage from "@/pages/voice-guided";
import CreateAdminPage from "@/pages/create-admin";
import AdminDashboard from "@/pages/admin-dashboard";
import AccountPage from "@/pages/account";
import UnsubscribePage from "@/pages/unsubscribe";
import AngelNumbersPage from "@/pages/angel-numbers";
import AngelNumberDetailPage from "@/pages/angel-number-detail";
import { BottomNav, SideNav } from "@/components/bottom-nav";
import InstallBanner from "@/components/install-banner";
import ServiceWorkerUpdate from "@/components/service-worker-update";
import UpdateNotification from "@/components/update-notification";
import IosReinstallPrompt from "@/components/ios-reinstall-prompt";
import IosTestControls from "@/components/ios-test-controls";
import { SafeComponent } from "@/components/safe-component";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// Initial redirect to ensure user starts at auth page if not authenticated
function InitialAuthRedirect() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [redirectedToAuth, setRedirectedToAuth] = useState(false);
  
  useEffect(() => {
    // Only redirect once on initial load
    if (!isLoading && !user && !redirectedToAuth) {
      setRedirectedToAuth(true);
      console.log("No user found, redirecting to auth page");
      navigate("/auth");
    }
  }, [user, isLoading, navigate, redirectedToAuth]);

  // Don't render anything, just handle redirection
  return null;
}

// AuthAwareComponents renders components that depend on auth state
function AuthAwareComponents() {
  const { user } = useAuth();
  
  return (
    <>
      <InitialAuthRedirect />
      {user && <BottomNav />}
      {user && <SideNav />}
      <main className={user ? "pb-16 sm:pl-64" : ""}>
        <Switch>
          {/* Authentication route */}
          <Route path="/auth" component={AuthPage} />
          
          {/* Public routes */}
          <Route path="/unsubscribe" component={UnsubscribePage} />
          <Route path="/admin/create" component={CreateAdminPage} />
          
          {/* Home route - protected but conditionally shows landing page if not logged in */}
          <Route path="/" component={Home} />
          
          {/* Protected routes that require authentication */}
          <ProtectedRoute path="/daily" component={DailyDraw} />
          <ProtectedRoute path="/spreads" component={Spreads} />
          <ProtectedRoute path="/history" component={History} />
          <ProtectedRoute path="/library" component={Library} />
          <ProtectedRoute path="/study" component={Study} />
          <ProtectedRoute path="/journal" component={Journal} />
          <ProtectedRoute path="/learning" component={Learning} />
          <ProtectedRoute path="/learning/:trackId/:lessonId" component={LessonPage} />
          <ProtectedRoute path="/test-images" component={TestImages} />
          <ProtectedRoute path="/subscribe" component={Subscribe} />
          <ProtectedRoute path="/subscribe-native" component={SubscribeNative} />
          <ProtectedRoute path="/subscription/success" component={SubscriptionSuccess} />
          <ProtectedRoute path="/voice-guided" component={VoiceGuidedPage} />
          <ProtectedRoute path="/account" component={AccountPage} />
          <ProtectedRoute path="/angel-numbers" component={AngelNumbersPage} />
          <ProtectedRoute path="/angel-numbers/:number" component={AngelNumberDetailPage} />
          <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} />
          
          <Route component={NotFound} />
        </Switch>
      </main>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <AuthAwareComponents />
          <SafeComponent component={() => <InstallBanner />} />
          <SafeComponent component={() => <ServiceWorkerUpdate />} />
          <SafeComponent component={() => <UpdateNotification />} />
          <SafeComponent component={() => <IosReinstallPrompt />} />
          <SafeComponent component={() => <IosTestControls />} />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;