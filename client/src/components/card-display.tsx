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
    console.log('Card in display:', card); // Debug log

    const suitLower = (card.suit || '').toLowerCase().trim();
    console.log('Normalized suit:', suitLower); // Debug log

    // Handle cards based on suit first, regardless of arcana type
    switch (suitLower) {
      case "wands":
        return "from-orange-500 to-red-700";
      case "cups":
        return "from-blue-400 to-blue-800";
      case "swords":
        return "from-zinc-400 to-slate-800";
      case "pentacles":
        return "from-emerald-500 to-green-900";
      default:
        // If no suit or unrecognized suit, use arcana-based coloring
        return card.arcana === "major" || card.arcana === "custom"
          ? "from-violet-500 to-purple-900"
          : "from-gray-400 to-gray-800";
    }
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
}