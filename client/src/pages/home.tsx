import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Sun, Layout, Book, Sparkles, Star, Compass, Calendar, Shield } from "lucide-react";
import DailyAffirmation from "@/components/daily-affirmation";
import { useAuth } from "@/hooks/use-auth";

// Home page for authenticated users
function AuthenticatedHome() {
  const [_, setLocation] = useLocation();

  return (
    <div className="container max-w-lg px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Tarot Journey</h1>

      <DailyAffirmation />

      <div className="grid gap-4">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setLocation("/daily")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Daily Draw
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Start your day with guidance from the cards
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setLocation("/spreads")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5" />
              Spreads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Explore different tarot spreads for deeper insights
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Landing page for non-authenticated users
function LandingPage() {
  const [_, navigate] = useLocation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container px-4 py-16 md:py-24 lg:py-32 mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Begin Your Tarot Journey
        </h1>
        <p className="text-xl mb-10 max-w-3xl mx-auto text-muted-foreground">
          Explore the mysteries of tarot with personalized readings, AI-powered interpretations, 
          and a comprehensive learning system.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="text-lg px-8"
            onClick={() => navigate("/auth")}
          >
            Get Started
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8"
            onClick={() => navigate("/auth")}
          >
            Sign In
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Discover the Power of Tarot</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Sparkles className="h-10 w-10 text-primary mb-2" />
              <CardTitle>AI-Powered Interpretations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get personalized card readings enhanced by advanced AI assistance, providing deeper insights tailored to your journey.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Book className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Spaced Repetition Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Master the tarot with our scientifically-designed learning system that helps you internalize card meanings at your own pace.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Compass className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Guided Readings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Follow our structured spreads to answer specific questions and get guidance on your path forward.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Calendar className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track your readings and spiritual journey over time with our detailed journal system.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Star className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Angel Numbers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Discover the meaning behind recurring number patterns in your life with our angel number interpretations.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Offline Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Install as a Progressive Web App and access your readings and learning materials even without an internet connection.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-16">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Start Your 7-Day Free Trial</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Unlock all features with our premium subscription, including unlimited readings, advanced learning tracks, and AI interpretations.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8"
            onClick={() => navigate("/auth")}
          >
            Try Now for Free
          </Button>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const { user, isLoading } = useAuth();

  // Show loading indicator while checking auth state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Show different content based on authentication status
  return user ? <AuthenticatedHome /> : <LandingPage />;
}