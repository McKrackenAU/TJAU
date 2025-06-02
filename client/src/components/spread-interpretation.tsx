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
  
  // Force cache clear on mobile browsers
  useState(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister();
        }
      });
    }
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
  });

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

  // Force individual card approach for all devices due to mobile reliability issues
  console.log("SPREAD COMPONENT: Using individual card approach for all devices - v4 CACHE CLEARED");
  console.log("SPREAD COMPONENT: User agent:", navigator.userAgent);
  console.log("SPREAD COMPONENT: Window width:", window.innerWidth);
  console.log("SPREAD COMPONENT: Timestamp:", Date.now());
  
  return (
    <div className="mt-6 space-y-4" key="individual-cards-v3">
      <h3 className="text-lg font-semibold mb-4">Complete Spread Analysis</h3>
      <div className="text-sm text-blue-600 mb-4 font-medium">
        ✓ Using individual card analysis (v3) - Mobile compatible
      </div>
      <div className="space-y-4">
        {cards.map((card, index) => (
          <div key={`card-analysis-${card.id}-${index}-v3`} className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <h4 className="font-semibold mb-2 text-blue-800">{positions[index]}: {card.name}</h4>
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