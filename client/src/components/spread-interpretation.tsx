import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import type { TarotCard } from "@shared/tarot-data";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import AIInterpretation from "./ai-interpretation";

interface SpreadInterpretationProps {
  cards: TarotCard[];
  spreadType: string;
  positions: string[];
}

export default function SpreadInterpretation({ cards, spreadType, positions }: SpreadInterpretationProps) {
  const [showSpreadAnalysis, setShowSpreadAnalysis] = useState(false);
  const [forceMobileMode, setForceMobileMode] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Use the first card's ID but with spread context
  const spreadCard = {
    ...cards[0],
    name: `${spreadType} Spread Analysis`,
    description: `Complete interpretation of this ${spreadType} spread: ${cards.map((card, i) => `${positions[i]}: ${card.name}`).join(', ')}`
  };

  if (!showSpreadAnalysis) {
    return (
      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={() => setShowSpreadAnalysis(true)}
      >
        Get Complete Analysis
      </Button>
    );
  }

  // Temporarily force individual card approach for all devices to test reliability
  console.log("Using individual card approach for all devices (temporary fix)");
  
  if (true) {
    // Mobile: Show individual card interpretations for better reliability
    return (
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Complete Spread Analysis</h3>
        {cards.map((card, index) => (
          <div key={card.id} className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">{positions[index]}: {card.name}</h4>
            <AIInterpretation 
              card={card} 
              context={`This card represents ${positions[index]} in a ${spreadType} spread.`}
            />
          </div>
        ))}
      </div>
    );
  }

  // Desktop: Use combined spread analysis
  const spreadContext = `${spreadType} spread with these cards: ${cards.map((card, i) => `${positions[i]} - ${card.name}`).join(', ')}. Please provide a comprehensive interpretation of how these cards work together in this spread.`;

  return (
    <div className="mt-6">
      <AIInterpretation 
        card={spreadCard} 
        context={spreadContext}
      />
    </div>
  );
}