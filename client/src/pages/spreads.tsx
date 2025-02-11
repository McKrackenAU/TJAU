import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
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

export default function Spreads() {
  const [selectedSpread, setSelectedSpread] = useState<keyof typeof spreads>("threeCard");
  const [isRevealed, setIsRevealed] = useState(false);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const spread = spreads[selectedSpread];
  const spreadCards = Array.from({ length: spread.positions.length }, 
    () => tarotCards[Math.floor(Math.random() * tarotCards.length)]);

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
        <Card>
          <CardHeader>
            <CardTitle>{spread.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{spread.description}</p>

            <div className={`grid gap-4 ${
              selectedSpread === "threeCard" ? "grid-cols-3" : "grid-cols-2 md:grid-cols-5"
            }`}>
              {spreadCards.map((card, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <CardDisplay
                    card={card}
                    isRevealed={isRevealed}
                    onClick={() => setIsRevealed(true)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {spread.positions[i]}
                  </span>
                  {isRevealed && (
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
              disabled={isRevealed}
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