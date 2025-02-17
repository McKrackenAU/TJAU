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
  return (
    <div 
      className="w-48 aspect-[2/3] relative cursor-pointer"
      onClick={onClick}
    >
      <motion.div
        className="w-full h-full"
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
          className="absolute w-full h-full rounded-xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: card.arcana === "major" 
              ? "linear-gradient(135deg, #9333ea 0%, #4c1d95 100%)"
              : card.suit?.toLowerCase() === "wands"
              ? "linear-gradient(135deg, #f97316 0%, #9f1239 100%)"
              : card.suit?.toLowerCase() === "cups"
              ? "linear-gradient(135deg, #60a5fa 0%, #3730a3 100%)"
              : card.suit?.toLowerCase() === "swords"
              ? "linear-gradient(135deg, #94a3b8 0%, #1e293b 100%)"
              : "linear-gradient(135deg, #10b981 0%, #065f46 100%)",
            border: "2px solid rgba(255, 255, 255, 0.1)"
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

        {/* Back of card - image only */}
        <div
          className="absolute w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundImage: "url('/card-back.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "0.75rem"
          }}
        />
      </motion.div>
    </div>
  );
}