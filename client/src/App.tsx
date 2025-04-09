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
import VoiceGuidedPage from "@/pages/voice-guided";
import CreateAdminPage from "@/pages/create-admin";
import AdminDashboard from "@/pages/admin-dashboard";
import AccountPage from "@/pages/account";
import BottomNav from "@/components/bottom-nav";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Home} />
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
      <ProtectedRoute path="/voice-guided" component={VoiceGuidedPage} />
      <ProtectedRoute path="/account" component={AccountPage} />
      <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/admin/create" component={CreateAdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <main className="pb-16">
            <Router />
          </main>
          <BottomNav />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;