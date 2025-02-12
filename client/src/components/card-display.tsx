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
  const getSymbol = () => {
    if (card.arcana === "major") {
      return <Sun className="h-8 w-8 text-white/90 animate-spin-slow" />;
    }

    switch (card.suit) {
      case "Wands":
        return <FlameKindling className="h-8 w-8 text-white/90 animate-flame" />;
      case "Cups":
        return <GlassWater className="h-8 w-8 text-white/90 animate-wave" />;
      case "Swords":
        return <Sword className="h-8 w-8 text-white/90 animate-balance" />;
      case "Pentacles":
        return <Coins className="h-8 w-8 text-white/90 animate-spin-slow" />;
      default:
        return null;
    }
  };

  const getBackground = () => {
    if (card.arcana === "major") {
      return "bg-gradient-to-br from-purple-700 via-purple-900 to-indigo-900 border-yellow-300/50";
    }

    switch (card.suit) {
      case "Wands":
        return "bg-gradient-to-br from-orange-500 via-red-600 to-rose-700 border-orange-300/50";
      case "Cups":
        return "bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-800 border-blue-300/50";
      case "Swords":
        return "bg-gradient-to-br from-zinc-400 via-slate-600 to-slate-800 border-slate-300/50";
      case "Pentacles":
        return "bg-gradient-to-br from-emerald-500 via-emerald-700 to-green-900 border-emerald-300/50";
      default:
        return "bg-gradient-to-br from-gray-700 to-gray-900 border-gray-300/50";
    }
  };

  const CardFace = ({ isBack = false }: { isBack?: boolean }) => (
    <div 
      className={`absolute w-full h-full rounded-xl border-2 ${getBackground()} overflow-hidden`}
      style={{ 
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: isBack ? "rotateY(180deg)" : "none"
      }}
    >
      <div className="w-full h-full p-4 flex flex-col justify-between">
        {!isBack && (
          <h3 className="text-lg font-bold text-white text-center">
            {card.name}
          </h3>
        )}
        <div className="flex-1 flex items-center justify-center">
          {getSymbol()}
        </div>
        {!isBack && (
          <p className="text-sm text-white/90 text-center">
            {card.arcana === "major" ? "Major Arcana" : card.suit}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      className="w-48 aspect-[2/3] perspective-1000 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ 
          rotateY: isRevealed ? 0 : 180,
          rotateZ: isReversed ? 180 : 0
        }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <CardFace />
        <CardFace isBack />
      </motion.div>
    </motion.div>
  );
}