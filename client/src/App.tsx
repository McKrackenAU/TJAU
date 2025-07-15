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
import PendulumPage from "@/pages/pendulum";
import BackToLearningPage from "@/pages/back-to-learning";
import DynamicRedirectPage from "@/pages/dynamic-redirect";
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
import UploadCards from "@/pages/upload-cards";
import ResetPasswordPage from "@/pages/reset-password";
import MobileTest from "@/pages/mobile-test";
// Importing only our new FixedBottomNav, disabling old nav components
// import { BottomNav, SideNav } from "@/components/bottom-nav";
// import { SimpleNav } from "@/components/simple-nav";
// import { NavBottom } from "@/components/nav-bottom";
import { FixedBottomNav } from "@/components/fixed-bottom-nav";
import InstallBanner from "@/components/install-banner";
import ServiceWorkerUpdate from "@/components/service-worker-update";
import UpdateNotification from "@/components/update-notification";
import IosReinstallPrompt from "@/components/ios-reinstall-prompt";
import IosTestControls from "@/components/ios-test-controls";
import { SafeComponent } from "@/components/safe-component";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// Loading fallback to prevent black screens
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading Tarot Journey...</p>
      </div>
    </div>
  );
}

// AuthAwareComponents renders components that depend on auth state
function AuthAwareComponents() {
  const { user, isLoading } = useAuth();
  
  // Show loading fallback while auth is loading
  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <>
      <main className="pb-16 w-full mx-auto">
        <Switch>
          {/* Authentication route */}
          <Route path="/auth" component={AuthPage} />
          
          {/* Public routes */}
          <Route path="/reset-password" component={() => <ResetPasswordPage />} />
          <Route path="/mobile-test" component={MobileTest} />
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
          <ProtectedRoute path="/pendulum" component={PendulumPage} />
          <ProtectedRoute path="/learning/:trackId/:lessonId" component={LessonPage} />
          <ProtectedRoute path="/back-to-learning" component={BackToLearningPage} />
          <ProtectedRoute path="/redirect" component={DynamicRedirectPage} />
          <ProtectedRoute path="/test-images" component={TestImages} />
          <ProtectedRoute path="/subscribe" component={Subscribe} />
          <ProtectedRoute path="/subscribe-native" component={SubscribeNative} />
          <ProtectedRoute path="/subscription/success" component={SubscriptionSuccess} />
          <ProtectedRoute path="/voice-guided" component={VoiceGuidedPage} />
          <ProtectedRoute path="/account" component={AccountPage} />
          <ProtectedRoute path="/angel-numbers" component={AngelNumbersPage} />
          <ProtectedRoute path="/angel-numbers/:number" component={AngelNumberDetailPage} />
          <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} />
          <ProtectedRoute path="/upload-cards" component={UploadCards} />
          
          <Route component={NotFound} />
        </Switch>
      </main>
      
      {/* Only show navigation when user is authenticated */}
      {user && <FixedBottomNav />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background w-full mx-auto">
          <AuthAwareComponents />
          <SafeComponent component={() => <InstallBanner />} />
          {/* Disabled service worker updates to prevent loops */}
          {/* <SafeComponent component={() => <ServiceWorkerUpdate />} /> */}
          {/* Disabled update notifications to prevent loops */}
          {/* <SafeComponent component={() => <UpdateNotification />} /> */}
          <SafeComponent component={() => <IosReinstallPrompt />} />
          <SafeComponent component={() => <IosTestControls />} />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;