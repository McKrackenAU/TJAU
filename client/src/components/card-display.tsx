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
  console.log("CardDisplay rendering with card:", {
    id: card.id,
    name: card.name,
    arcana: card.arcana,
    suit: card.suit
  });

  const getSymbol = () => {
    const symbolClasses = "w-12 h-12 transition-all duration-300";
    console.log("Getting symbol for card type:", card.arcana, "suit:", card.suit);

    // For Major Arcana
    if (card.arcana === "major") {
      return (
        <div className="relative">
          <Sun 
            className={`${symbolClasses} text-yellow-300 animate-glow`}
          />
        </div>
      );
    }

    // For Minor Arcana
    if (card.arcana === "minor" && card.suit) {
      switch (card.suit.toLowerCase()) {
        case "wands":
          return (
            <div className="relative">
              <FlameKindling 
                className={`${symbolClasses} text-orange-400 animate-flame`}
              />
            </div>
          );
        case "cups":
          return (
            <div className="relative">
              <GlassWater 
                className={`${symbolClasses} text-blue-400 animate-wave`}
              />
            </div>
          );
        case "swords":
          return (
            <div className="relative">
              <Sword 
                className={`${symbolClasses} text-slate-300 animate-balance`}
              />
            </div>
          );
        case "pentacles":
          return (
            <div className="relative">
              <Coins 
                className={`${symbolClasses} text-emerald-400 animate-spin-slow`}
              />
            </div>
          );
      }
    }

    // Fallback
    return (
      <div className="relative">
        <Moon className={`${symbolClasses} text-gray-400 animate-pulse`} />
      </div>
    );
  };

  const getCardClasses = () => {
    const baseClasses = "w-full h-full rounded-xl border-2 overflow-hidden transition-all duration-300";

    if (card.arcana === "major") {
      return `${baseClasses} bg-gradient-to-br from-purple-700 via-purple-900 to-indigo-900 border-yellow-300/50`;
    }

    if (card.arcana === "minor" && card.suit) {
      switch (card.suit.toLowerCase()) {
        case "wands":
          return `${baseClasses} bg-gradient-to-br from-orange-500 via-red-600 to-rose-700 border-orange-300/50`;
        case "cups":
          return `${baseClasses} bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-800 border-blue-300/50`;
        case "swords":
          return `${baseClasses} bg-gradient-to-br from-zinc-400 via-slate-600 to-slate-800 border-slate-300/50`;
        case "pentacles":
          return `${baseClasses} bg-gradient-to-br from-emerald-500 via-emerald-700 to-green-900 border-emerald-300/50`;
      }
    }

    return `${baseClasses} bg-gradient-to-br from-gray-700 to-gray-900 border-gray-300/50`;
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
              {getSymbol()}
            </div>
            <p className="text-sm text-white/80 text-center">
              {card.arcana === "major" ? "Major Arcana" : card.suit}
            </p>
          </div>
        </div>

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
            {getSymbol()}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}