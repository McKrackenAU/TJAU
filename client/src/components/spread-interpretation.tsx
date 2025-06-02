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

  // Mobile debugging version - direct state management
  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchInterpretation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("=== MOBILE SPREAD DEBUG ===");
      console.log("Window location:", window.location.href);
      console.log("User agent:", navigator.userAgent);
      console.log("First card:", cards[0]?.name);
      console.log("User ID:", user?.id);
      console.log("Cards array:", cards.map(c => c.name));
      
      const requestBody = {
        cardId: cards[0].id,
        context: `${spreadType} spread analysis`,
        userId: user?.id
      };
      
      console.log("Request body:", JSON.stringify(requestBody));
      
      const response = await fetch("/api/interpret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody)
      });
      
      console.log("Response received - Status:", response.status);
      console.log("Response headers:", Array.from(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log("Response data keys:", Object.keys(responseData));
      console.log("Has interpretation:", !!responseData.interpretation);
      
      if (!responseData.interpretation) {
        throw new Error("No interpretation in response");
      }
      
      setData(responseData.interpretation);
      console.log("SUCCESS: Interpretation set");
      
    } catch (err) {
      console.error("=== MOBILE ERROR DETAILS ===");
      console.error("Error object:", err);
      console.error("Error type:", typeof err);
      console.error("Error constructor:", err?.constructor?.name);
      console.error("Error message:", err instanceof Error ? err.message : String(err));
      console.error("Error stack:", err instanceof Error ? err.stack : "No stack");
      
      if (err instanceof TypeError) {
        console.error("This is a TypeError - likely network issue");
        console.error("Caused by:", err.cause);
      }
      
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    fetchInterpretation();
  };

  if (!isRequested) {
    return (
      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={() => {
          setIsRequested(true);
          fetchInterpretation();
        }}
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