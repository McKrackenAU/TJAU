import { motion } from "framer-motion";
import { memo, useState } from "react";
import type { TarotCard } from "@shared/tarot-data";
import CardBack from "./card-back";
import CardSymbolismTooltip from "./card-symbolism-tooltip";
import CardImage from "./card-image";
import { Info } from "lucide-react";

interface CardDisplayProps {
  card: TarotCard & { imageUrl?: string };
  isRevealed?: boolean;
  isReversed?: boolean;
  onClick?: () => void;
}

const CardDisplay = memo(function CardDisplay({ 
  card, 
  isRevealed = true, 
  isReversed = false,
  onClick 
}: CardDisplayProps) {
  const [showSymbolism, setShowSymbolism] = useState(false);

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    setShowSymbolism(true);
  };

  return (
    <>
      <div 
        className="w-48 h-72 relative cursor-pointer group"
        style={{ perspective: "1000px" }}
        onClick={onClick}
      >
        <motion.div
          className="w-full h-full absolute"
          initial={false}
          animate={{ 
            rotateY: isRevealed ? 0 : 180,
            rotateZ: 0 // Remove automatic card reversal to prevent upside-down display
          }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front of card */}
          <div
            className="absolute w-full h-full rounded-xl overflow-hidden border-2 border-white/10 bg-card"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {/* Use unified CardImage component for all cards */}
            <CardImage card={card} isRevealed={isRevealed} />
          </div>

          {/* Back of card */}
          <div
            className="absolute w-full h-full"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <CardBack />
          </div>
        </motion.div>
        
        {/* Info button that appears on hover */}
        {isRevealed && (
          <div 
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={handleInfoClick}
          >
            <button 
              className="bg-black/70 hover:bg-black/90 text-white rounded-full p-1.5"
              aria-label="View card symbolism"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Symbolism tooltip */}
      <CardSymbolismTooltip 
        card={card} 
        isOpen={showSymbolism} 
        onClose={() => setShowSymbolism(false)} 
      />
    </>
  );
});

export default CardDisplay;