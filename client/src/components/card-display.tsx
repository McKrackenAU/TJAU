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
      className="w-full max-w-[300px] cursor-pointer"
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      <div className="relative w-full" style={{ paddingBottom: "150%" }}>
        <motion.div
          className="absolute inset-0"
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
            className={`absolute inset-0 ${isRevealed ? "backface-hidden" : ""}`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <CardImage card={card} isRevealed={true} />
          </div>

          {/* Back of card */}
          <div 
            className={`absolute inset-0 ${!isRevealed ? "backface-hidden" : ""}`}
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            <div className="w-full h-full rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary to-primary/80" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}