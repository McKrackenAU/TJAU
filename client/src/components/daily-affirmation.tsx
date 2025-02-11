import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { tarotCards } from "@shared/tarot-data";
import { apiRequest } from "@/lib/queryClient";
import CardDisplay from "@/components/card-display";

export default function DailyAffirmation() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [cardId] = useState(() => {
    // Pick a random card for the day, but keep it consistent for 24 hours
    const today = new Date().toISOString().split('T')[0];
    const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return tarotCards[seed % tarotCards.length].id;
  });

  const card = tarotCards.find(c => c.id === cardId);

  const { data: affirmation, isLoading, error } = useQuery({
    queryKey: [`/api/affirmation/${cardId}`],
    queryFn: async () => {
      const res = await apiRequest("POST", "/api/affirmation", { cardId });
      const data = await res.json();
      return data.affirmation;
    },
    enabled: isRevealed
  });

  if (!card) return null;

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Daily Affirmation</h2>
          <p className="text-muted-foreground">
            Draw wisdom from the cards to guide your day
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-48">
            <CardDisplay
              card={card}
              isRevealed={isRevealed}
              onClick={() => setIsRevealed(true)}
            />
          </div>

          {!isRevealed ? (
            <Button 
              className="w-full max-w-xs"
              onClick={() => setIsRevealed(true)}
            >
              Reveal Your Daily Affirmation
            </Button>
          ) : (
            <div className="text-center max-w-md">
              {isLoading ? (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : error ? (
                <p className="text-destructive">
                  Failed to generate affirmation. Please try again.
                </p>
              ) : (
                <p className="text-lg italic">{affirmation}</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
