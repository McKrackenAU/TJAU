import { motion } from "framer-motion";
import type { TarotCard } from "@shared/tarot-data";
import { Sun, Moon, Sword, Coins, FlameKindling, GlassWater } from "lucide-react";

interface CardDisplayProps {
  card: TarotCard;
  isRevealed?: boolean;
  isReversed?: boolean;
  onClick?: () => void;
}

const getCardSymbol = (card: TarotCard) => {
  if (card.arcana === "major") {
    return <Sun className="h-8 w-8 text-primary-foreground/70" />;
  }

  switch (card.suit) {
    case "Wands":
      return <FlameKindling className="h-8 w-8 text-primary-foreground/70 animate-flame" />;
    case "Cups":
      return <GlassWater className="h-8 w-8 text-primary-foreground/70 animate-wave" />;
    case "Swords":
      return <Sword className="h-8 w-8 text-primary-foreground/70 animate-balance" />;
    case "Pentacles":
      return <Coins className="h-8 w-8 text-primary-foreground/70 animate-spin-slow" />;
    default:
      return <Moon className="h-8 w-8 text-primary-foreground/70" />;
  }
};

const getCardAnimation = (card: TarotCard) => {
  // Animation classes based on card meanings or attributes
  const baseClasses = "absolute inset-0 opacity-30 pointer-events-none";

  if (card.arcana === "major") {
    return `${baseClasses} animate-glow`;
  }

  switch (card.suit) {
    case "Wands":
      return `${baseClasses} animate-flame`;
    case "Cups":
      return `${baseClasses} animate-wave`;
    case "Swords":
      return `${baseClasses} animate-balance`;
    case "Pentacles":
      return `${baseClasses} animate-spin-slow`;
    default:
      return baseClasses;
  }
};

const getCardBackground = (card: TarotCard) => {
  const baseClasses = "w-full h-full rounded-xl border-2 border-primary/20 overflow-hidden";

  if (card.arcana === "major") {
    return `${baseClasses} bg-gradient-to-br from-purple-700 via-purple-900 to-indigo-900 border-yellow-300/50`;
  }

  switch (card.suit) {
    case "Wands":
      return `${baseClasses} bg-gradient-to-br from-orange-500 via-red-600 to-rose-700 border-orange-300/50`;
    case "Cups":
      return `${baseClasses} bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-800 border-blue-300/50`;
    case "Swords":
      return `${baseClasses} bg-gradient-to-br from-zinc-400 via-slate-600 to-slate-800 border-slate-300/50`;
    case "Pentacles":
      return `${baseClasses} bg-gradient-to-br from-emerald-500 via-emerald-700 to-green-900 border-emerald-300/50`;
    default:
      return `${baseClasses} bg-gradient-to-br from-primary/20 to-primary/10`;
  }
};

export default function CardDisplay({ 
  card, 
  isRevealed = true, 
  isReversed = false,
  onClick 
}: CardDisplayProps) {
  return (
    <motion.div
      className="w-48 aspect-[2/3] relative cursor-pointer"
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{ 
          rotateY: isRevealed ? 0 : 180
        }}
        transition={{ duration: 0.6 }}
        style={{ 
          transformStyle: "preserve-3d",
          perspective: "1000px"
        }}
      >
        {/* Front of card */}
        <div 
          className="absolute w-full h-full"
          style={{ 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden"
          }}
        >
          <div className={getCardBackground(card)}>
            <div className="flex flex-col h-full justify-between p-4 relative">
              <div className={getCardAnimation(card)} />
              <h3 className="text-lg font-semibold text-center text-primary-foreground">{card.name}</h3>
              <div className="flex-1 flex items-center justify-center">
                {getCardSymbol(card)}
              </div>
              <div className="text-sm text-center text-primary-foreground/80">
                {card.arcana === "major" ? "Major Arcana" : card.suit}
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className="absolute w-full h-full"
          style={{ 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <div className={getCardBackground(card)}>
            <div className="w-full h-full flex items-center justify-center p-4 relative">
              <div className={getCardAnimation(card)} />
              {getCardSymbol(card)}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}