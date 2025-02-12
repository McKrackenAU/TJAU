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
    <motion.div
      className="w-full max-w-[300px] cursor-pointer"
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      <div className="w-full rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/20 to-primary/10">
        <div className="relative pt-[150%]">
          <div className="absolute inset-0 p-4 flex flex-col items-center justify-between">
            {/* Card Title */}
            <h3 className="text-lg font-semibold text-center">{card.name}</h3>

            {/* Card Type */}
            <div className="text-sm text-muted-foreground">
              {card.arcana === "major" ? "Major Arcana" : card.suit}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}