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
        <div className="animate-glow">
          <Sun className="h-8 w-8 text-yellow-300" />
        </div>
      );
    }

    switch (card.suit) {
      case "Wands":
        return (
          <div className="animate-flame">
            <FlameKindling className="h-8 w-8 text-orange-300" />
          </div>
        );
      case "Cups":
        return (
          <div className="animate-wave">
            <GlassWater className="h-8 w-8 text-blue-300" />
          </div>
        );
      case "Swords":
        return (
          <div className="animate-balance">
            <Sword className="h-8 w-8 text-slate-300" />
          </div>
        );
      case "Pentacles":
        return (
          <div className="animate-spin-slow">
            <Coins className="h-8 w-8 text-emerald-300" />
          </div>
        );
      default:
        return null;
    }
  };

  const CardFace = ({ isBack = false }: { isBack?: boolean }) => {
    const baseClasses = "absolute w-full h-full rounded-xl border-2";
    let bgClasses = "";
    let borderClass = "";

    if (card.arcana === "major") {
      bgClasses = "bg-gradient-to-br from-purple-700 via-purple-900 to-indigo-900";
      borderClass = "border-yellow-300/50";
    } else {
      switch (card.suit) {
        case "Wands":
          bgClasses = "bg-gradient-to-br from-orange-500 via-red-600 to-rose-700";
          borderClass = "border-orange-300/50";
          break;
        case "Cups":
          bgClasses = "bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-800";
          borderClass = "border-blue-300/50";
          break;
        case "Swords":
          bgClasses = "bg-gradient-to-br from-zinc-400 via-slate-600 to-slate-800";
          borderClass = "border-slate-300/50";
          break;
        case "Pentacles":
          bgClasses = "bg-gradient-to-br from-emerald-500 via-emerald-700 to-green-900";
          borderClass = "border-emerald-300/50";
          break;
        default:
          bgClasses = "bg-gradient-to-br from-gray-700 to-gray-900";
          borderClass = "border-gray-300/50";
      }
    }

    return (
      <div 
        className={`${baseClasses} ${bgClasses} ${borderClass} overflow-hidden`}
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
  };

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