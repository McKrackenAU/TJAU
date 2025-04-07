import { motion } from "framer-motion";
import { memo } from "react";
import type { TarotCard } from "@shared/tarot-data";

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
          {card.imageUrl ? (
            // Show uploaded image if available
            <div className="w-full h-full relative">
              <img 
                src={card.imageUrl} 
                alt={card.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50">
                <h3 className="text-lg font-bold text-center text-white">
                  {card.name}
                </h3>
              </div>
            </div>
          ) : (
            // Default display if no image
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
          )}
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
          >
            <img 
              src="/uploads/Oracle of Illusion.png"
              alt="Card Back" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
});

export default CardDisplay;