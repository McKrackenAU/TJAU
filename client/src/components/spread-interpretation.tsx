import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import type { TarotCard } from "@shared/tarot-data";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SpreadInterpretationProps {
  cards: TarotCard[];
  spreadType: string;
  positions: string[];
}

export default function SpreadInterpretation({ cards, spreadType, positions }: SpreadInterpretationProps) {
  const [isRequested, setIsRequested] = useState(false);
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [`/api/interpret-spread`, cards.map(c => c.id), spreadType],
    queryFn: async () => {
      try {
        const res = await apiRequest("POST", "/api/interpret-spread", {
          cardIds: cards.map(c => c.id),
          spreadType,
          positions
        });
        const data = await res.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        if (!data.interpretation) {
          throw new Error("No interpretation received");
        }
        return data.interpretation;
      } catch (err) {
        console.error("Error fetching spread interpretation:", err);
        throw new Error(err instanceof Error ? err.message : "Failed to generate interpretation");
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