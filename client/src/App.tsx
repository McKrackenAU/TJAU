import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
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
import SubscriptionSuccess from "@/pages/subscription-success";
import VoiceGuidedPage from "@/pages/voice-guided";
import CreateAdminPage from "@/pages/create-admin";
import AdminDashboard from "@/pages/admin-dashboard";
import AccountPage from "@/pages/account";
import UnsubscribePage from "@/pages/unsubscribe";
import AngelNumbersPage from "@/pages/angel-numbers";
import AngelNumberDetailPage from "@/pages/angel-number-detail";
import BottomNav from "@/components/bottom-nav";
import InstallBanner from "@/components/install-banner";
import ServiceWorkerUpdate from "@/components/service-worker-update";
import UpdateNotification from "@/components/update-notification";
import IosReinstallPrompt from "@/components/ios-reinstall-prompt";
import IosTestControls from "@/components/ios-test-controls";
import { SafeComponent } from "@/components/safe-component";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// AuthAwareComponents renders components that depend on auth state
function AuthAwareComponents() {
  const { user } = useAuth();
  
  return (
    <>
      {user && <BottomNav />}
      <main className={user ? "pb-16" : ""}>
        <Switch>
          {/* Public routes */}
          <Route path="/" component={Home} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/admin/create" component={CreateAdminPage} />
          <Route path="/unsubscribe" component={UnsubscribePage} />
          
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