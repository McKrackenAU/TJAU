import { useState } from "react";
import { spreads, tarotCards } from "@shared/tarot-data";
import CardDisplay from "@/components/card-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Spreads() {
  const [selectedSpread, setSelectedSpread] = useState<keyof typeof spreads>("threeCard");
  const [isRevealed, setIsRevealed] = useState(false);
  
  const spread = spreads[selectedSpread];
  const spreadCards = Array.from({ length: spread.positions.length }, 
    () => tarotCards[Math.floor(Math.random() * tarotCards.length)]);

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Tarot Spreads</h1>

      <div className="max-w-md mx-auto mb-8">
        <Select
          value={selectedSpread}
          onValueChange={(value: keyof typeof spreads) => {
            setSelectedSpread(value);
            setIsRevealed(false);
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
