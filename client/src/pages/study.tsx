import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { tarotCards } from "@shared/tarot-data";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CardDisplay from "@/components/card-display";
import type { StudyProgress } from "@shared/schema";

export default function Study() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: dueCards } = useQuery<StudyProgress[]>({
    queryKey: ["/api/study/due-cards"],
  });

  const currentCard = tarotCards[currentCardIndex];

  const mutation = useMutation({
    mutationFn: async ({ cardId, confidenceLevel }: { cardId: string; confidenceLevel: number }) => {
      return apiRequest("POST", "/api/study/progress", {
        cardId,
        confidenceLevel,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/study/due-cards"] });
      toast({
        title: "Progress saved",
        description: "Your study progress has been updated."
      });
    }
  });

  const handleConfidenceRating = (level: number) => {
    mutation.mutate({
      cardId: currentCard.id,
      confidenceLevel: level,
    });
    
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % tarotCards.length);
  };

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Study Cards</h1>

      <div className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-8"
          >
            <div className="flex justify-center mb-4">
              <CardDisplay
                card={currentCard}
                isRevealed={isFlipped}
                onClick={() => setIsFlipped(!isFlipped)}
              />
            </div>

            {isFlipped ? (
              <Card>
                <CardHeader>
                  <CardTitle>{currentCard.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{currentCard.description}</p>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Upright Meanings:</h4>
                    <ul className="list-disc list-inside mb-4">
                      {currentCard.meanings.upright.map((meaning, i) => (
                        <li key={i}>{meaning}</li>
                      ))}
                    </ul>

                    <h4 className="font-semibold">Reversed Meanings:</h4>
                    <ul className="list-disc list-inside">
                      {currentCard.meanings.reversed.map((meaning, i) => (
                        <li key={i}>{meaning}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 space-y-2">
                    <p className="text-sm text-muted-foreground mb-2">
                      How well did you know this card?
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleConfidenceRating(1)}
                      >
                        Still Learning
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleConfidenceRating(3)}
                      >
                        Getting There
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleConfidenceRating(5)}
                      >
                        Confident
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button
                className="w-full"
                onClick={() => setIsFlipped(true)}
              >
                Reveal Card
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
