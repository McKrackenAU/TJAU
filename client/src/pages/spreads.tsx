import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { spreads, tarotCards } from "@shared/tarot-data";
import CardDisplay from "@/components/card-display";
import AIInterpretation from "@/components/ai-interpretation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MeditationPlayer from "@/components/meditation-player";
import { Loader2 } from "lucide-react";

export default function Spreads() {
  const [selectedSpread, setSelectedSpread] = useState<keyof typeof spreads>("threeCard");
  const [isRevealed, setIsRevealed] = useState(false);
  const [notes, setNotes] = useState("");
  const [spreadCards, setSpreadCards] = useState<typeof tarotCards>([]);
  const { toast } = useToast();

  const { data: cards = tarotCards } = useQuery({
    queryKey: ["/api/cards"],
    initialData: tarotCards,
    staleTime: 0,
  });

  // Generate spread cards only when spread changes or cards data updates
  useEffect(() => {
    const spread = spreads[selectedSpread];
    const newSpreadCards = Array.from(
      { length: spread.positions.length },
      () => cards[Math.floor(Math.random() * cards.length)]
    );
    setSpreadCards(newSpreadCards);
    setIsRevealed(false);
    setNotes("");
  }, [selectedSpread, cards]);

  const mutation = useMutation({
    mutationFn: async (reading: { cards: string[], notes: string, spreadType: string }) => {
      return apiRequest("POST", "/api/readings", {
        ...reading,
        type: "spread"
      });
    },
    onSuccess: () => {
      toast({
        title: "Reading saved",
        description: "Your spread reading has been saved successfully."
      });
      setNotes("");
    }
  });

  const handleSave = () => {
    mutation.mutate({
      cards: spreadCards.map(card => card.id),
      notes,
      spreadType: spreads[selectedSpread].name
    });
  };

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Tarot Spreads</h1>

      <div className="max-w-md mx-auto mb-8">
        <Select
          value={selectedSpread}
          onValueChange={(value: keyof typeof spreads) => {
            setSelectedSpread(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a spread" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(spreads).map(([id, s]) => (
              <SelectItem key={id} value={id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="max-w-7xl mx-auto">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-xl text-foreground font-bold">
              {spreads[selectedSpread].name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground text-base font-medium mb-6">
              {spreads[selectedSpread].description}
            </p>

            <Button
              className="w-full mb-8"
              onClick={() => setIsRevealed(true)}
              disabled={isRevealed || spreadCards.length === 0}
            >
              Reveal Cards
            </Button>

            <div className={`grid gap-8 ${
              selectedSpread === "threeCard" 
                ? "grid-cols-1 md:grid-cols-3" 
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            }`}>
              {spreadCards.map((card, i) => (
                <div key={`${card.id}-${i}`} className="flex flex-col items-center">
                  <div className="mb-4">
                    <CardDisplay
                      card={card}
                      isRevealed={isRevealed}
                    />
                  </div>
                  <span className="text-sm font-bold bg-foreground/10 text-foreground px-4 py-1.5 rounded-full mb-4">
                    {spreads[selectedSpread].positions[i]}
                  </span>
                  {isRevealed && card && (
                    <div className="space-y-4 w-full">
                      <AIInterpretation 
                        card={card}
                        context={`This card represents ${spreads[selectedSpread].positions[i]} in a ${spreads[selectedSpread].name} spread.`}
                      />
                      {card && card.id && <MeditationPlayer card={card} />}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isRevealed && (
              <div className="mt-8">
                <Textarea
                  placeholder="Add your reflections on this spread..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mb-4"
                />
                <Button 
                  onClick={handleSave}
                  disabled={mutation.isPending}
                  className="w-full"
                >
                  Save Reading
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}