import { useState } from "react";
import { TarotCard } from "@shared/tarot-data";

interface CardImageProps {
  card: TarotCard;
  isRevealed: boolean;
}

export default function CardImage({ card, isRevealed }: CardImageProps) {
  const [imageError, setImageError] = useState(false);
  
  // Direct mapping to your authentic cards
  const getAuthenticPath = () => {
    if (card.arcana === 'major' && ['0', '1', '2', '3', '4'].includes(card.id)) {
      const cardMap: Record<string, string> = {
        '0': '/authentic-cards/major-arcana/00-fool.png',
        '1': '/authentic-cards/major-arcana/01-magician.png',
        '2': '/authentic-cards/major-arcana/02-high-priestess.png',
        '3': '/authentic-cards/major-arcana/03-empress.png',
        '4': '/authentic-cards/major-arcana/04-emperor.png'
      };
      return cardMap[card.id];
    }
    return null;
  };

  const imagePath = getAuthenticPath();
  
  if (!isRevealed) {
    return (
      <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 border-2 border-purple-300/30 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white text-2xl">✨</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-xl relative overflow-hidden border-2 bg-gradient-to-br from-pink-400 via-purple-600 to-indigo-800 border-pink-300/50">
      {imagePath ? (
        <>
          <img
            src={`${imagePath}?bypass=${Date.now()}&fresh=true`}
            alt={card.name}
            className="w-full h-full object-cover rounded-xl"
            onLoad={() => console.log(`✅ LOADED: ${imagePath} for ${card.name}`)}
            onError={() => {
              console.log(`❌ FAILED: ${imagePath} for ${card.name}`);
              setImageError(true);
            }}
          />
          <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs p-1 rounded backdrop-blur-sm">
            {card.name}
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="text-4xl mb-2">🃏</div>
          <div className="text-center text-sm font-medium">{card.name}</div>
          <div className="text-xs opacity-70 mt-1">Major Arcana</div>
        </div>
      )}
      {imageError && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          Image Error
        </div>
      )}
    </div>
  );
}