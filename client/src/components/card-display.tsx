import { motion } from "framer-motion";
import type { TarotCard } from "@shared/tarot-data";
import { Sun, Moon, Sword, Coins, FlameKindling, GlassWater } from "lucide-react";

interface CardDisplayProps {
  card: TarotCard;
  isRevealed?: boolean;
  isReversed?: boolean;
  onClick?: () => void;
}

export default function CardDisplay({ 
  card, 
  isRevealed = true, 
  isReversed = false,
  onClick 
}: CardDisplayProps) {
  const getCardClasses = () => {
    const baseClasses = "w-full h-full rounded-xl border-2 overflow-hidden transition-all duration-300";

    // Major Arcana cards - Purple/Gold theme
    if (card.arcana === "major") {
      return `${baseClasses} bg-gradient-to-br from-purple-600 via-purple-800 to-purple-900 border-yellow-300/50`;
    }

    // Minor Arcana cards - Suit-specific colors
    switch (card.suit?.toLowerCase()) {
      case "wands":
        return `${baseClasses} bg-gradient-to-br from-orange-500 via-red-600 to-rose-700 border-orange-300/50`;
      case "cups":
        return `${baseClasses} bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-800 border-blue-300/50`;
      case "swords":
        return `${baseClasses} bg-gradient-to-br from-zinc-400 via-slate-600 to-slate-800 border-slate-300/50`;
      case "pentacles":
        return `${baseClasses} bg-gradient-to-br from-emerald-500 via-emerald-700 to-green-900 border-emerald-300/50`;
      default:
        // Default theme for custom or unknown cards
        return `${baseClasses} bg-gradient-to-br from-indigo-500 via-indigo-700 to-indigo-900 border-indigo-300/50`;
    }
  };

  return (
    <motion.div
      className="w-48 aspect-[2/3] perspective-1000 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        initial={false}
        animate={{ 
          rotateY: isRevealed ? 0 : 180,
          rotateZ: isReversed ? 180 : 0
        }}
        transition={{ duration: 0.6 }}
      >
        {/* Front face */}
        <div 
          className={getCardClasses()}
          style={{ 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
            position: "absolute",
            width: "100%",
            height: "100%"
          }}
        >
          <div className="w-full h-full p-4 flex flex-col justify-between items-center">
            <h3 className="text-lg font-bold text-white/90 text-center">
              {card.name}
            </h3>
            <div className="flex-1 flex items-center justify-center">
              {/* Placeholder for future card image */}
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-white/80 text-xl">
                  {card.arcana === "major" ? "★" : card.suit?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>
            <p className="text-sm text-white/80 text-center">
              {card.arcana === "major" ? "Major Arcana" : card.suit}
            </p>
          </div>
        </div>

        {/* Back face - Temporary until we get the custom image */}
        <div 
          className={getCardClasses()}
          style={{ 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            position: "absolute",
            width: "100%",
            height: "100%"
          }}
        >
          <div className="w-full h-full p-4 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-white/80 text-2xl">★</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}