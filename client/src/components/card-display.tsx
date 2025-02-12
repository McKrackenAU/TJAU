import { motion } from "framer-motion";
import type { TarotCard } from "@shared/tarot-data";
import CardImage from "./card-image";

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
      className="aspect-[2/3] w-full max-w-[300px] cursor-pointer perspective-1000"
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
        {/* Front of card */}
        <div 
          className={`absolute w-full h-full ${isRevealed ? "backface-hidden" : ""}`}
        >
          <CardImage card={card} isRevealed={true} />
        </div>

        {/* Back of card */}
        <div 
          className={`absolute w-full h-full ${!isRevealed ? "backface-hidden" : ""} rotateY-180`}
        >
          <div className="w-full h-full rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary to-primary/80" />
        </div>
      </motion.div>
    </motion.div>
  );
}