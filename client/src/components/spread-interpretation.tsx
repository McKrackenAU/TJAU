import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import type { TarotCard } from "@shared/tarot-data";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface SpreadInterpretationProps {
  cards: TarotCard[];
  spreadType: string;
  positions: string[];
}

export default function SpreadInterpretation({ cards, spreadType, positions }: SpreadInterpretationProps) {
  const [isRequested, setIsRequested] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [`/api/interpret-spread`, cards.map(c => c.id), spreadType],
    queryFn: async () => {
      try {
        console.log("=== CLIENT: Starting spread interpretation request ===");
        console.log("Cards:", cards.map(c => c.id));
        console.log("Spread type:", spreadType);
        console.log("User ID:", user?.id);
        
        // Direct fetch approach for better PWA compatibility
        const response = await fetch("/api/interpret-spread", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Important for session cookies
          body: JSON.stringify({
            cardIds: cards.map(c => c.id),
            spreadType,
            positions,
            userId: user?.id
          })
        });
        
        console.log("Spread response status:", response.status);
        console.log("Spread response ok:", response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Spread interpretation API error:", response.status, errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log("Raw response data:", data);
        console.log("Data keys:", Object.keys(data));
        console.log("Data interpretation exists:", !!data.interpretation);
        
        if (data.error) {
          console.error("Server returned error:", data.error);
          throw new Error(data.error);
        }
        
        if (!data.interpretation) {
          console.error("Missing interpretation in response. Full data:", JSON.stringify(data, null, 2));
          throw new Error("No interpretation received from AI service");
        }
        
        console.log("Spread interpretation received successfully");
        return data.interpretation;
      } catch (err) {
        console.error("Error fetching spread interpretation:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to generate interpretation";
        
        // Provide more user-friendly error message
        if (errorMessage.includes("OpenAI API") || errorMessage.includes("rate limit")) {
          toast({
            title: "AI Service Temporarily Unavailable",
            description: "The AI interpretation service is experiencing high demand. Please try again in a few moments.",
            variant: "destructive"
          });
        }
        
        throw new Error(errorMessage);
      }
    },
    enabled: isRequested,
    retry: 1
  });

  const handleRetry = () => {
    void refetch();
  };

  if (!isRequested) {
    return (
      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={() => setIsRequested(true)}
      >
        Get Spread Interpretation
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

  return (
    <Card className="mt-6">
      <CardContent className="pt-6 prose prose-primary dark:prose-invert">
        <h3 className="text-xl font-semibold mb-2 text-foreground">Spread Interpretation</h3>
        <div className="text-sm whitespace-pre-line text-foreground">{data}</div>
      </CardContent>
    </Card>
  );
}