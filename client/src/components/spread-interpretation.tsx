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
  const { toast } = useToast();
  const { user } = useAuth();

  // Use the working individual card system but with spread context
  const spreadCard = {
    ...cards[0],
    id: `spread-${cards.map(c => c.id).join('-')}`,
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

  // Use the exact same AI interpretation component that works for individual cards
  return (
    <div className="mt-6">
      <AIInterpretation 
        card={spreadCard} 
        context={`${spreadType} spread with these cards: ${cards.map((card, i) => `${positions[i]} - ${card.name}`).join(', ')}. Please provide a comprehensive interpretation of how these cards work together in this spread.`}
      />
    </div>
  );
}