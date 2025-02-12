import { TarotCard } from "@shared/tarot-data";

interface CardImageProps {
  card: TarotCard;
  isRevealed: boolean;
}

export default function CardImage({ card, isRevealed }: CardImageProps) {
  const getCardBackground = () => {
    const baseClasses = "w-full h-full rounded-xl relative overflow-hidden";

    if (card.arcana === "major") {
      return `${baseClasses} bg-gradient-to-br from-purple-700 via-purple-900 to-indigo-900 border-2 border-yellow-300/50`;
    }

    switch (card.suit) {
      case "Wands":
        return `${baseClasses} bg-gradient-to-br from-orange-500 via-red-600 to-rose-700`;
      case "Cups":
        return `${baseClasses} bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-800`;
      case "Swords":
        return `${baseClasses} bg-gradient-to-br from-zinc-400 via-slate-600 to-slate-800`;
      case "Pentacles":
        return `${baseClasses} bg-gradient-to-br from-emerald-500 via-emerald-700 to-green-900`;
      default:
        return baseClasses;
    }
  };

  const renderSuitSymbol = () => {
    const commonClasses = "absolute inset-0 flex items-center justify-center";

    switch (card.suit) {
      case "Wands":
        return (
          <div className={commonClasses}>
            <div className="w-6 h-32 bg-yellow-400 rounded-full animate-pulse" />
          </div>
        );
      case "Cups":
        return (
          <div className={commonClasses}>
            <div className="w-24 h-24 bg-blue-400 rounded-t-full animate-float" />
          </div>
        );
      case "Swords":
        return (
          <div className={commonClasses}>
            <div className="w-4 h-32 bg-slate-200 rotate-45 animate-shine" />
          </div>
        );
      case "Pentacles":
        return (
          <div className={commonClasses}>
            <div className="w-24 h-24 border-4 border-emerald-400 rounded-full animate-spin-slow" />
          </div>
        );
      default:
        return null;
    }
  };

  const renderMajorArcanaSymbol = () => {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 border-4 border-white rounded-full animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/20 rounded-full animate-glow" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={getCardBackground()}>
      {/* Card Symbol */}
      {card.arcana === "major" ? renderMajorArcanaSymbol() : renderSuitSymbol()}

      {/* Card Info */}
      <div className="absolute inset-x-0 bottom-0 p-4 text-center bg-gradient-to-t from-black/50 to-transparent">
        <h3 className="text-lg font-bold text-white mb-1">{card.name}</h3>
        <p className="text-sm text-white/90">
          {card.arcana === "major" ? "Major Arcana" : card.suit}
        </p>
      </div>
    </div>
  );
}