import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import type { TarotCard } from "@shared/tarot-data";
import { apiRequest } from "@/lib/queryClient";

interface AIInterpretationProps {
  card: TarotCard;
  context?: string;
}

export default function AIInterpretation({ card, context }: AIInterpretationProps) {
  const [isRequested, setIsRequested] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [`/api/interpret/${card.id}`, context],
    queryFn: async () => {
      try {
        console.log("Requesting AI interpretation for card:", card.id);
        const res = await apiRequest("POST", "/api/interpret", {
          cardId: card.id,
          context
        });
        
        if (!res.ok) {
          const errorData = await res.text();
          console.error("AI interpretation API error:", res.status, errorData);
          
          if (res.status === 401) {
            throw new Error("Please log in to access AI interpretations");
          } else if (res.status === 500) {
            throw new Error("AI service temporarily unavailable. Please try again in a moment.");
          } else {
            throw new Error(`Server error: ${res.status}`);
          }
        }
        
        const data = await res.json();
        if (!data.interpretation) {
          throw new Error("No interpretation received from AI service");
        }
        
        console.log("AI interpretation received successfully");
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
        Get AI Interpretation
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
    <Card className="mt-4">
      <CardContent className="pt-6 prose prose-primary dark:prose-invert">
        <h4 className="text-lg font-semibold mb-2 text-foreground">AI Interpretation</h4>
        <p className="text-sm whitespace-pre-line text-foreground">{data}</p>
      </CardContent>
    </Card>
  );
}