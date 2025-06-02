import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import AIInterpretation from "./ai-interpretation";
import type { TarotCard } from "@shared/tarot-data";

interface FreshSpreadAnalyzerProps {
  cards: TarotCard[];
  spreadType: string;
  positions: string[];
}

export default function FreshSpreadAnalyzer({ cards, spreadType, positions }: FreshSpreadAnalyzerProps) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  console.log("FRESH SPREAD ANALYZER: Component loaded successfully");
  console.log("FRESH SPREAD ANALYZER: Cards count:", cards.length);
  console.log("FRESH SPREAD ANALYZER: Spread type:", spreadType);

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
        className="w-full mt-4 bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100"
        onClick={() => setShowAnalysis(true)}
      >
        Generate Complete Spread Analysis
      </Button>
    );
  }

  // Create combined spread context for proper analysis
  const spreadContext = `${spreadType} spread with these cards: ${cards.map((card, i) => `${positions[i]} - ${card.name}`).join(', ')}. Please provide a comprehensive interpretation of how these cards work together in this spread.`;

  return (
    <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
      <div className="text-sm text-blue-600 mb-4 font-medium">
        ✓ Fresh component bypassing cache issues
      </div>
      <AIInterpretation 
        card={spreadCard} 
        context={spreadContext}
      />
    </div>
  );
}