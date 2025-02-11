import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { TarotCard } from "@shared/tarot-data";
import { apiRequest } from "@/lib/queryClient";

interface AIInterpretationProps {
  card: TarotCard;
  context?: string;
}

export default function AIInterpretation({ card, context }: AIInterpretationProps) {
  const [isRequested, setIsRequested] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/interpret/${card.id}`, context],
    queryFn: async () => {
      const res = await apiRequest("POST", "/api/interpret", {
        cardId: card.id,
        context
      });
      const data = await res.json();
      return data.interpretation;
    },
    enabled: isRequested
  });

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
        <CardContent className="pt-6 text-destructive">
          Failed to generate interpretation. Please try again later.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardContent className="pt-6 prose prose-primary dark:prose-invert">
        <h4 className="text-lg font-semibold mb-2">AI Interpretation</h4>
        <p className="text-sm whitespace-pre-line">{data}</p>
      </CardContent>
    </Card>
  );
}
