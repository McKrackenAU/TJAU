import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import type { TarotCard } from "@shared/tarot-data";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

interface SpreadInterpretationProps {
  cards: TarotCard[];
  spreadType: string;
  positions: string[];
}

export default function SpreadInterpretation({ cards, spreadType, positions }: SpreadInterpretationProps) {
  const [isRequested, setIsRequested] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Use the exact same pattern as individual card interpretations
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [`/api/interpret/${cards[0]?.id}`, `${spreadType} spread analysis`],
    queryFn: async () => {
      try {
        console.log("=== SPREAD: Using working React Query pattern ===");
        console.log("First card:", cards[0]?.name);
        console.log("User ID:", user?.id);
        
        const response = await fetch("/api/interpret", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            cardId: cards[0].id,
            context: `${spreadType} spread analysis`,
            userId: user?.id
          })
        });
        
        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API error response:", errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log("AI interpretation received:", !!data.interpretation);
        
        if (!data.interpretation) {
          throw new Error("No interpretation received from AI service");
        }
        
        return data.interpretation;
      } catch (err) {
        console.error("Error fetching interpretation:", err);
        throw new Error(err instanceof Error ? err.message : "Failed to generate interpretation");
      }
    },
    enabled: isRequested,
    retry: 1
  });

  const handleRetry = () => {
    refetch();
  };

  if (!isRequested) {
    return (
      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={() => setIsRequested(true)}
      >
        Get Complete Analysis
      </Button>
    );
  }

  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-4 border-destructive">
        <CardContent className="pt-6 text-destructive space-y-2">
          <p>Failed to generate interpretation. Please try again.</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRetry}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (data) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6 prose prose-primary dark:prose-invert">
          <h3 className="text-xl font-semibold mb-2 text-foreground">Spread Interpretation</h3>
          <div className="text-sm whitespace-pre-line text-foreground">{data}</div>
        </CardContent>
      </Card>
    );
  }

  return null;
}