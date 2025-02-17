import { motion } from "framer-motion";
import { memo } from "react";
import type { TarotCard } from "@shared/tarot-data";

interface CardDisplayProps {
  card: TarotCard;
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
  return (
    <div 
      className="w-48 h-72 relative cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={onClick}
    >
      <motion.div
        className="w-full h-full absolute"
        initial={false}
        animate={{ 
          rotateY: isRevealed ? 0 : 180,
          rotateZ: isReversed ? 180 : 0
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
          <div className="p-4 h-full flex flex-col">
            <h3 className="text-lg font-bold text-center mb-2">
              {card.name}
            </h3>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-foreground/20 flex items-center justify-center">
                <span className="text-xl font-semibold">
                  {card.arcana === "major" ? "★" : card.suit?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>
            <p className="text-sm text-center">
              {card.arcana === "major" ? "Major Arcana" : card.suit}
            </p>
          </div>
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
          <div 
            className="w-full h-full rounded-xl overflow-hidden border-2 border-white/10"
            style={{
              backgroundColor: "#2a0845",
              backgroundImage: "linear-gradient(135deg, #2a0845 0%, #6441A5 74%)",
              boxShadow: "inset 0 0 50px rgba(255,255,255,0.1)"
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <span className="text-4xl">★</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

export default CardDisplay;