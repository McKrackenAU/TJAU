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
      className="aspect-[2/3] w-full max-w-[200px] cursor-pointer perspective-1000"
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
        <div className={`absolute w-full h-full rounded-xl border-2 border-primary/20 
          ${isRevealed ? "backface-hidden" : ""} bg-gradient-to-br from-primary/20 to-primary/10
          p-4 flex flex-col items-center justify-between text-center`}
        >
          <h3 className="text-lg font-semibold">{card.name}</h3>
          {card.arcana === "minor" && (
            <p className="text-sm text-muted-foreground">{card.suit}</p>
          )}
        </div>
        
        <div className={`absolute w-full h-full rounded-xl border-2 border-primary/20 
          ${!isRevealed ? "backface-hidden" : ""} bg-gradient-to-br from-primary to-primary/80
          rotateY-180`}
        />
      </motion.div>
    </motion.div>
  );
}
