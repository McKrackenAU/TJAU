import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { spreads } from "@shared/tarot-data";
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
  const { toast } = useToast();

  // Fetch all cards including imported ones
  const { data: cards, isLoading } = useQuery({
    queryKey: ["/api/cards"],
  });

  const spread = spreads[selectedSpread];
  const spreadCards = cards ? Array.from(
    { length: spread.positions.length },
    () => cards[Math.floor(Math.random() * cards.length)]
  ) : [];

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
      spreadType: spread.name
    });
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Tarot Spreads</h1>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Tarot Spreads</h1>

      <div className="max-w-md mx-auto mb-8">
        <Select
          value={selectedSpread}
          onValueChange={(value: keyof typeof spreads) => {
            setSelectedSpread(value);
            setIsRevealed(false);
            setNotes("");
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

      <div className="grid gap-8">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">{spread.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground opacity-90 mb-4">{spread.description}</p>

            <div className={`grid gap-6 ${
              selectedSpread === "threeCard" ? "grid-cols-3" : "grid-cols-2 md:grid-cols-5"
            }`}>
              {spreadCards.map((card, i) => (
                <div key={i} className="flex flex-col items-center gap-4">
                  <CardDisplay
                    card={card}
                    isRevealed={isRevealed}
                    onClick={() => setIsRevealed(true)}
                  />
                  <span className="text-sm font-semibold text-card-foreground">
                    {spread.positions[i]}
                  </span>
                  {isRevealed && card && (
                    <>
                      <AIInterpretation 
                        card={card}
                        context={`This card represents ${spread.positions[i]} in a ${spread.name} spread.`}
                      />
                      <MeditationPlayer card={card} />
                    </>
                  )}
                </div>
              ))}
            </div>

            <Button
              className="w-full mt-8"
              onClick={() => setIsRevealed(true)}
              disabled={isRevealed || spreadCards.length === 0}
            >
              Reveal Cards
            </Button>

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