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
      return (
        <div className="relative w-12 h-12">
          <Sun 
            className="absolute inset-0 w-full h-full text-yellow-300"
            style={{ animation: "glow 2s ease-in-out infinite" }}
          />
        </div>
      );
    }

    if (card.arcana === "minor" && card.suit) {
      const symbolClasses = "absolute inset-0 w-full h-full";

      switch (card.suit) {
        case "Wands":
          return (
            <div className="relative w-12 h-12">
              <FlameKindling 
                className={`${symbolClasses} text-orange-300`}
                style={{ animation: "flame 1.5s ease-in-out infinite" }}
              />
            </div>
          );
        case "Cups":
          return (
            <div className="relative w-12 h-12">
              <GlassWater 
                className={`${symbolClasses} text-blue-300`}
                style={{ animation: "wave 2s ease-in-out infinite" }}
              />
            </div>
          );
        case "Swords":
          return (
            <div className="relative w-12 h-12">
              <Sword 
                className={`${symbolClasses} text-slate-300`}
                style={{ animation: "balance 2s ease-in-out infinite" }}
              />
            </div>
          );
        case "Pentacles":
          return (
            <div className="relative w-12 h-12">
              <Coins 
                className={`${symbolClasses} text-emerald-300`}
                style={{ animation: "spin 4s linear infinite" }}
              />
            </div>
          );
      }
    }

    return (
      <div className="relative w-12 h-12">
        <Moon 
          className="absolute inset-0 w-full h-full text-gray-300"
          style={{ animation: "pulse 2s ease-in-out infinite" }}
        />
      </div>
    );
  };

  const getCardBackground = () => {
    const baseClasses = "w-full h-full rounded-xl border-2 overflow-hidden";

    if (card.arcana === "major") {
      return `${baseClasses} bg-gradient-to-br from-purple-700 via-purple-900 to-indigo-900 border-yellow-300/50`;
    }

    if (card.arcana === "minor" && card.suit) {
      switch (card.suit) {
        case "Wands":
          return `${baseClasses} bg-gradient-to-br from-orange-500 via-red-600 to-rose-700 border-orange-300/50`;
        case "Cups":
          return `${baseClasses} bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-800 border-blue-300/50`;
        case "Swords":
          return `${baseClasses} bg-gradient-to-br from-zinc-400 via-slate-600 to-slate-800 border-slate-300/50`;
        case "Pentacles":
          return `${baseClasses} bg-gradient-to-br from-emerald-500 via-emerald-700 to-green-900 border-emerald-300/50`;
      }
    }

    return `${baseClasses} bg-gradient-to-br from-gray-700 to-gray-900 border-gray-300/50`;
  };

  const CardFace = ({ isBack = false }: { isBack?: boolean }) => (
    <div 
      className={getCardBackground()}
      style={{ 
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: `${isBack ? "rotateY(180deg)" : "none"}`,
        position: "absolute",
        width: "100%",
        height: "100%"
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