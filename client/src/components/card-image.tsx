import { TarotCard } from "@shared/tarot-data";

interface CardImageProps {
  card: TarotCard;
  isRevealed: boolean;
}

export default function CardImage({ card, isRevealed }: CardImageProps) {
  if (!isRevealed) {
    return (
      <div className="w-full aspect-[2/3] bg-primary/10 rounded-lg flex items-center justify-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full"></div>
      </div>
    );
  }

  // Generate a consistent background color based on the card's properties
  const getCardColor = () => {
    if (card.arcana === "major") return "bg-purple-500";
    switch (card.suit) {
      case "Wands": return "bg-red-500";
      case "Cups": return "bg-blue-500";
      case "Swords": return "bg-yellow-500";
      case "Pentacles": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  // Generate a suitable icon or symbol based on the card's properties
  const getCardSymbol = () => {
    if (card.arcana === "major") {
      return "★"; // Star for major arcana
    }
    switch (card.suit) {
      case "Wands": return "🔥"; // Fire for wands
      case "Cups": return "💧"; // Water for cups
      case "Swords": return "⚔️"; // Crossed swords
      case "Pentacles": return "🌟"; // Star for pentacles
      default: return "✨"; // Sparkles for custom cards
    }
  };

  return (
    <div className={`w-full aspect-[2/3] ${getCardColor()} rounded-lg p-4 flex flex-col items-center justify-between text-white`}>
      <div className="text-2xl">{getCardSymbol()}</div>
      <div className="text-center">
        <h3 className="font-bold text-lg mb-2">{card.name}</h3>
        <div className="text-sm opacity-90">
          {card.arcana === "major" ? "Major Arcana" : card.suit}
        </div>
      </div>
      <div className="text-2xl transform rotate-180">{getCardSymbol()}</div>
    </div>
  );
}
