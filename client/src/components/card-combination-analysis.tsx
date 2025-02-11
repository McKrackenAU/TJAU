import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TarotCard } from "@shared/tarot-data";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CardDisplay from "@/components/card-display";

interface CardCombinationAnalysisProps {
  initialCardIds?: string[];
  context?: string;
}

export default function CardCombinationAnalysis({ 
  initialCardIds = [], 
  context 
}: CardCombinationAnalysisProps) {
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>(initialCardIds);
  const [isAnalysisRequested, setIsAnalysisRequested] = useState(false);
  const { toast } = useToast();

  // Fetch all cards including imported ones
  const { data: cards, isLoading: isLoadingCards } = useQuery<TarotCard[]>({
    queryKey: ["/api/cards"],
  });

  const { data: analysis, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/analyze-combination", selectedCardIds, context],
    queryFn: async () => {
      try {
        const res = await apiRequest("POST", "/api/analyze-combination", {
          cardIds: selectedCardIds,
          context
        });
        const data = await res.json();
        if (!data.analysis) {
          throw new Error("No analysis received");
        }
        return data.analysis;
      } catch (err) {
        console.error("Error fetching analysis:", err);
        throw new Error(err instanceof Error ? err.message : "Failed to generate analysis");
      }
    },
    enabled: isAnalysisRequested && selectedCardIds.length >= 2
  });

  const handleRetry = () => {
    refetch();
    toast({
      title: "Retrying",
      description: "Generating a new analysis...",
    });
  };

  const addCard = (cardId: string) => {
    if (!selectedCardIds.includes(cardId)) {
      setSelectedCardIds([...selectedCardIds, cardId]);
    }
  };

  const removeCard = (index: number) => {
    setSelectedCardIds(selectedCardIds.filter((_, i) => i !== index));
    setIsAnalysisRequested(false);
  };

  if (isLoadingCards) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {selectedCardIds.map((cardId, index) => {
              const card = cards?.find(c => c.id === cardId);
              if (!card) return null;
              return (
                <div key={index} className="relative">
                  <CardDisplay card={card} isRevealed={true} />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-0 right-0 p-1"
                    onClick={() => removeCard(index)}
                  >
                    ×
                  </Button>
                </div>
              );
            })}
            {selectedCardIds.length < 5 && (
              <div className="flex items-center justify-center min-h-[200px]">
                <Select
                  value=""
                  onValueChange={addCard}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add a card" />
                  </SelectTrigger>
                  <SelectContent>
                    {cards
                      ?.filter(card => !selectedCardIds.includes(card.id))
                      .map(card => (
                        <SelectItem key={card.id} value={card.id}>
                          {card.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {selectedCardIds.length >= 2 ? (
            isAnalysisRequested ? (
              <div className="mt-4">
                {isLoading ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : error ? (
                  <div className="space-y-2">
                    <p className="text-destructive">
                      Failed to generate analysis. Please try again.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleRetry}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert">
                    <h4 className="text-lg font-semibold mb-2">Card Combination Analysis</h4>
                    <p className="whitespace-pre-line">{analysis}</p>
                  </div>
                )}
              </div>
            ) : (
              <Button 
                className="w-full mt-4"
                onClick={() => setIsAnalysisRequested(true)}
              >
                Analyze Combination
              </Button>
            )
          ) : (
            <p className="text-sm text-muted-foreground text-center mt-4">
              Select at least two cards to analyze their combination
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}