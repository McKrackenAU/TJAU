import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Sun, Layout } from "lucide-react";

export default function Home() {
  const [_, setLocation] = useLocation();

  return (
    <div className="container max-w-lg px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Tarot Journey</h1>

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