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

  if (!showAnalysis) {
    return (
      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={() => setShowAnalysis(true)}
      >
        Get Complete Analysis (Mobile Compatible)
      </Button>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold mb-4">Complete Spread Analysis</h3>
      <div className="text-sm text-green-600 mb-4 font-medium bg-green-50 p-2 rounded">
        ✓ Using mobile-compatible individual card analysis
      </div>
      <div className="space-y-4">
        {cards.map((card, index) => (
          <div key={`mobile-card-${card.id}-${index}`} className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
            <h4 className="font-semibold mb-2 text-green-800">{positions[index]}: {card.name}</h4>
            <AIInterpretation 
              card={card} 
              context={`This card represents ${positions[index]} in a ${spreadType} spread.`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}