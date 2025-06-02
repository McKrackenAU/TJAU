import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import type { TarotCard } from "@shared/tarot-data";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface SpreadInterpretationProps {
  cards: TarotCard[];
  spreadType: string;
  positions: string[];
}

export default function SpreadInterpretation({ cards, spreadType, positions }: SpreadInterpretationProps) {
  const [isRequested, setIsRequested] = useState(false);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchInterpretation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("=== MOBILE: Starting spread interpretation request ===");
      console.log("Cards:", cards.map(c => c.id));
      console.log("Spread type:", spreadType);
      console.log("User ID:", user?.id);
      
      const response = await fetch("/api/interpret-spread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          cardIds: cards.map(c => c.id),
          spreadType,
          positions,
          userId: user?.id
        })
      });
      
      console.log("MOBILE response status:", response.status);
      console.log("MOBILE response ok:", response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("MOBILE API error:", response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("MOBILE raw data:", data);
      console.log("MOBILE interpretation exists:", !!data.interpretation);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!data.interpretation) {
        throw new Error("No interpretation received from AI service");
      }
      
      setInterpretation(data.interpretation);
      console.log("MOBILE interpretation set successfully");
    } catch (err) {
      console.error("MOBILE error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate interpretation";
      setError(errorMessage);
      
      if (errorMessage.includes("OpenAI API") || errorMessage.includes("rate limit")) {
        toast({
          title: "AI Service Temporarily Unavailable",
          description: "The AI interpretation service is experiencing high demand. Please try again in a few moments.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to trigger fetch when requested
  useEffect(() => {
    if (isRequested && !interpretation) {
      fetchInterpretation();
    }
  }, [isRequested]);

  const handleRetry = () => {
    setError(null);
    setInterpretation(null);
    fetchInterpretation();
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

  if (error && !interpretation) {
    console.log("Showing error state:", error);
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

  if (interpretation) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6 prose prose-primary dark:prose-invert">
          <h3 className="text-xl font-semibold mb-2 text-foreground">Spread Interpretation</h3>
          <div className="text-sm whitespace-pre-line text-foreground">{interpretation}</div>
        </CardContent>
      </Card>
    );
  }

  return null;
}