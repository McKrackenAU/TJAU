import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { spreads, tarotCards } from "@shared/tarot-data";
import CardDisplay from "@/components/card-display";
import AIInterpretation from "@/components/ai-interpretation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MeditationPlayer from "@/components/meditation-player";
import FreshSpreadAnalyzer from "@/components/fresh-spread-analyzer";
import SpreadMeditationPlayer from "@/components/spread-meditation-player";
import { Loader2, Sparkles } from "lucide-react";
import { format } from "date-fns";
import type { Reading } from "@shared/schema";

export default function Spreads() {
  const [selectedSpread, setSelectedSpread] = useState<keyof typeof spreads>("threeCard");
  const [isRevealed, setIsRevealed] = useState(false);
  const [notes, setNotes] = useState("");
  const [mood, setMood] = useState<string>("");
  const [spreadCards, setSpreadCards] = useState<typeof tarotCards>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cards = tarotCards } = useQuery({
    queryKey: ["/api/cards"],
    initialData: tarotCards,
    staleTime: 0,
  });

  const { data: previousReadings = [] } = useQuery({
    queryKey: ["/api/readings/spreads"],
  });

  // Generate spread cards only when spread changes or cards data updates
  useEffect(() => {
    const spread = spreads[selectedSpread];
    
    // Mobile-compatible Fisher-Yates shuffle with temp variable
    const shuffledCards = [...cards];
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffledCards[i];
      shuffledCards[i] = shuffledCards[j];
      shuffledCards[j] = temp;
    }
    
    // Extra validation: ensure no duplicates
    const newSpreadCards = shuffledCards.slice(0, spread.positions.length);
    const uniqueCards = newSpreadCards.filter((card, index, arr) => 
      arr.findIndex(c => c.id === card.id) === index
    );
    
    // If we somehow got duplicates, reshuffle
    if (uniqueCards.length !== newSpreadCards.length) {
      console.warn("Duplicate cards detected, reshuffling...");
      const extraShuffle = [...cards].sort(() => Math.random() - 0.5);
      const finalCards = extraShuffle.slice(0, spread.positions.length);
      console.log("Generated spread cards:", finalCards.map(c => c.name));
      setSpreadCards(finalCards);
    } else {
      console.log("Generated spread cards:", newSpreadCards.map(c => c.name));
      setSpreadCards(newSpreadCards);
    }
    
    setIsRevealed(false);
    setNotes("");
    setMood("");
  }, [selectedSpread, cards]);

  const mutation = useMutation({
    mutationFn: async (reading: { cards: string[], notes: string, spreadType: string, mood?: string }) => {
      return apiRequest("POST", "/api/readings", {
        ...reading,
        type: "spread"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/readings/spreads"] });
      toast({
        title: "Reading saved",
        description: "Your spread reading has been saved successfully."
      });
      setNotes("");
      setMood("");
    }
  });

  const handleSave = () => {
    mutation.mutate({
      cards: spreadCards.map(card => card.id),
      notes,
      spreadType: spreads[selectedSpread].name,
      mood: mood || undefined
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

      <div className="max-w-7xl mx-auto space-y-8">
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
                </div>
              ))}
            </div>
            
            {isRevealed && (
              <div className="mt-8 space-y-6">
                {/* Unified Spread Interpretation */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-primary">
                      <Sparkles className="h-5 w-5" />
                      <span>Complete Spread Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AIInterpretation 
                      card={{
                        ...spreadCards[0],
                        name: `${spreads[selectedSpread].name} Spread Analysis`,
                        description: `Complete interpretation of this ${spreads[selectedSpread].name} spread: ${spreadCards.map((card, i) => `${spreads[selectedSpread].positions[i]}: ${card.name}`).join(', ')}`
                      }}
                      context={`${spreads[selectedSpread].name} spread with these cards: ${spreadCards.map((card, i) => `${spreads[selectedSpread].positions[i]} - ${card.name}`).join(', ')}. Please provide a comprehensive interpretation of how these cards work together in this spread.`}
                    />
                    
                    <div className="mt-6">
                      <SpreadMeditationPlayer
                        cards={spreadCards}
                        spreadType={spreads[selectedSpread].name}
                        positions={spreads[selectedSpread].positions}
                      />
                    </div>
                    
                    <h3 className="font-medium text-lg mt-8 mb-4">Individual Card Interpretations</h3>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {spreadCards.map((card, i) => (
                        <Card key={`interpretation-${card.id}-${i}`} className="overflow-hidden">
                          <CardHeader className="bg-card/80 p-2 sm:p-3">
                            <CardTitle className="text-xs sm:text-sm font-medium line-clamp-1">
                              {card.name} ({spreads[selectedSpread].positions[i]})
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 text-xs sm:text-sm max-h-48 overflow-y-auto">
                            <AIInterpretation 
                              card={card}
                              context={`This card represents ${spreads[selectedSpread].positions[i]} in a ${spreads[selectedSpread].name} spread.`}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Mood (optional)</label>
                    <Select
                      value={mood}
                      onValueChange={setMood}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select mood (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="peaceful">Peaceful</SelectItem>
                        <SelectItem value="inspired">Inspired</SelectItem>
                        <SelectItem value="confused">Confused</SelectItem>
                        <SelectItem value="anxious">Anxious</SelectItem>
                        <SelectItem value="grateful">Grateful</SelectItem>
                        <SelectItem value="joyful">Joyful</SelectItem>
                        <SelectItem value="melancholic">Melancholic</SelectItem>
                        <SelectItem value="energetic">Energetic</SelectItem>
                        <SelectItem value="contemplative">Contemplative</SelectItem>
                        <SelectItem value="hopeful">Hopeful</SelectItem>
                        <SelectItem value="frustrated">Frustrated</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="determined">Determined</SelectItem>
                        <SelectItem value="reflective">Reflective</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Textarea
                    placeholder="Add your reflections on this spread..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  
                  <Button 
                    onClick={handleSave}
                    disabled={mutation.isPending}
                    className="w-full"
                  >
                    Save Reading
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Previous Spreads Section */}
        <Card>
          <CardHeader>
            <CardTitle>Previous Spreads</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {previousReadings?.map((reading: Reading) => (
                  <Card key={reading.id} className="border-muted">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{reading.spreadType || 'Tarot Spread'}</span>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(reading.date), 'PPP')}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {reading.cards && reading.cards.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Cards:</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {reading.cards.map((cardId, index) => {
                              const card = [...tarotCards, ...cards.filter(c => c.id.startsWith('imported_'))].find(c => c.id === cardId);
                              return card ? (
                                <div key={`${cardId}-${index}`} className="text-xs p-2 bg-muted rounded">
                                  {card.name}
                                </div>
                              ) : (
                                <div key={`${cardId}-${index}`} className="text-xs p-2 bg-muted rounded text-muted-foreground">
                                  Unknown Card
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {reading.notes && reading.notes.trim() && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Notes:</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">{reading.notes}</p>
                        </div>
                      )}
                      
                      {reading.mood && (
                        <p className="text-sm text-muted-foreground">
                          Mood: <span className="capitalize">{reading.mood}</span>
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {(!previousReadings || previousReadings.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No saved spreads yet.</p>
                    <p className="text-sm mt-2">Your spread readings will appear here after you save them.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}