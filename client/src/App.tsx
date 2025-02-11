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
import BottomNav from "@/components/bottom-nav";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/daily" component={DailyDraw} />
      <Route path="/spreads" component={Spreads} />
      <Route path="/history" component={History} />
      <Route path="/library" component={Library} />
      <Route path="/study" component={Study} />
      <Route path="/journal" component={Journal} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <main className="pb-16">
          <Router />
        </main>
        <BottomNav />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;