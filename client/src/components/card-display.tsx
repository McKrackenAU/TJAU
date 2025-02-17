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
  // Get gradient colors based on card type
  const getCardGradient = () => {
    // Normalize suit name to handle different formats
    const suitName = (card.suit || '').toLowerCase().trim();

    // If it's a major arcana card, use purple gradient
    if (card.arcana === "major") {
      return "from-violet-500 to-purple-900";
    }

    // Check for suit name variants
    if (suitName.includes("wand")) {
      return "from-orange-500 to-red-700";
    }
    if (suitName.includes("cup")) {
      return "from-blue-400 to-blue-800";
    }
    if (suitName.includes("sword")) {
      return "from-zinc-400 to-slate-800";
    }
    if (suitName.includes("pentacle")) {
      return "from-emerald-500 to-green-900";
    }

    // Default gradient for unknown suits
    return "from-gray-400 to-gray-800";
  };

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
          className={`absolute w-full h-full rounded-xl overflow-hidden border-2 border-white/10 bg-gradient-to-br ${getCardGradient()}`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="p-4 h-full flex flex-col">
            <h3 className="text-lg font-bold text-white text-center mb-2">
              {card.name}
            </h3>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white text-xl font-semibold">
                  {card.arcana === "major" ? "★" : card.suit?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>
            <p className="text-sm text-white text-center">
              {card.arcana === "major" ? "Major Arcana" : card.suit}
            </p>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute w-full h-full rounded-xl border-2 border-white/10"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundColor: "#2D1B69", // Deep purple
          }}
        />
      </motion.div>
    </div>
  );
});

export default CardDisplay;