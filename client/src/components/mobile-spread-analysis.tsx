import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import type { TarotCard } from "@shared/tarot-data";
import AIInterpretation from "@/components/ai-interpretation";

interface MobileSpreadAnalysisProps {
  cards: TarotCard[];
  spreadType: string;
  positions: string[];
}

export default function MobileSpreadAnalysis({ cards, spreadType, positions }: MobileSpreadAnalysisProps) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  console.log("MOBILE SPREAD ANALYSIS: New component loaded successfully");
  console.log("MOBILE SPREAD ANALYSIS: Cards count:", cards.length);
  console.log("MOBILE SPREAD ANALYSIS: Spread type:", spreadType);

  // Use the first card's ID but with spread context for combined analysis
  const spreadCard = {
    ...cards[0],
    name: `${spreadType} Spread Analysis`,
    description: `Complete interpretation of this ${spreadType} spread: ${cards.map((card, i) => `${positions[i]}: ${card.name}`).join(', ')}`
  };

  if (!showAnalysis) {
    return (
      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={() => setShowAnalysis(true)}
      >
        Get Complete Analysis
      </Button>
    );
  }

  // Create combined spread context for proper analysis
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