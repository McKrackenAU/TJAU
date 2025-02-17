import { motion } from "framer-motion";
import type { TarotCard } from "@shared/tarot-data";

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
  // Get gradient colors based on card type
  const getCardGradient = () => {
    if (card.arcana === "major") {
      return "from-purple-600 to-purple-900 border-yellow-300/50";
    }
    switch (card.suit?.toLowerCase()) {
      case "wands":
        return "from-orange-500 to-red-700 border-orange-300/50";
      case "cups":
        return "from-blue-400 to-blue-800 border-blue-300/50";
      case "swords":
        return "from-slate-400 to-slate-800 border-slate-300/50";
      case "pentacles":
        return "from-emerald-500 to-emerald-900 border-emerald-300/50";
      default:
        return "from-purple-600 to-purple-900 border-purple-300/50";
    }
  };

  return (
    <div 
      className="w-48 aspect-[2/3] relative cursor-pointer perspective-1000"
      onClick={onClick}
    >
      <motion.div
        className="w-full h-full preserve-3d"
        initial={false}
        animate={{ 
          rotateY: isRevealed ? 0 : 180,
          rotateZ: isReversed ? 180 : 0
        }}
        transition={{ duration: 0.6 }}
      >
        {/* Front of card */}
        <div
          className={`absolute w-full h-full rounded-xl border-2 bg-gradient-to-br ${getCardGradient()}`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="p-4 h-full flex flex-col">
            <h3 className="text-lg font-bold text-white/90 text-center mb-2">
              {card.name}
            </h3>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
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

        {/* Back of card */}
        <div
          className="absolute w-full h-full rounded-xl border-2 border-purple-300/50"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundImage: "url('/card-back.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#2D1B69", // Fallback color if image fails to load
          }}
        />
      </motion.div>
    </div>
  );
}