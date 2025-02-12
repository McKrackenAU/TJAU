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

  const getCardBorderAndBackground = () => {
    const baseClasses = "w-full aspect-[2/3] rounded-lg relative overflow-hidden shadow-xl p-4";

    if (card.arcana === "major") {
      return `${baseClasses} bg-gradient-to-br from-purple-700 via-purple-900 to-indigo-900 border-2 border-yellow-300/50`;
    }

    switch (card.suit) {
      case "Wands":
        return `${baseClasses} bg-gradient-to-br from-orange-500 via-red-600 to-rose-700 border border-orange-300/50`;
      case "Cups":
        return `${baseClasses} bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-800 border border-blue-300/50`;
      case "Swords":
        return `${baseClasses} bg-gradient-to-br from-zinc-400 via-slate-600 to-slate-800 border border-slate-300/50`;
      case "Pentacles":
        return `${baseClasses} bg-gradient-to-br from-emerald-500 via-emerald-700 to-green-900 border border-emerald-300/50`;
      default:
        return `${baseClasses} bg-gradient-to-br from-fuchsia-500 via-purple-600 to-purple-900 border border-purple-300/50`;
    }
  };

  const renderSuitSymbol = () => {
    switch (card.suit) {
      case "Wands":
        return (
          <svg className="w-32 h-32 text-yellow-400" viewBox="0 0 100 100">
            <rect x="45" y="10" width="10" height="80" rx="2" className="animate-pulse" />
            <circle cx="50" cy="20" r="10" className="animate-glow" />
            <path d="M50 10 L60 30 L40 30 Z" className="animate-flame" />
          </svg>
        );
      case "Cups":
        return (
          <svg className="w-32 h-32 text-blue-300" viewBox="0 0 100 100">
            <path d="M30 30 H70 L80 50 Q80 80 50 90 Q20 80 20 50 Z" className="animate-wave" />
            <path d="M35 40 Q50 60 65 40" className="text-blue-200 animate-float" fill="none" stroke="currentColor" strokeWidth="4" />
          </svg>
        );
      case "Swords":
        return (
          <svg className="w-32 h-32 text-slate-200" viewBox="0 0 100 100">
            <path d="M50 10 L60 20 L40 80 L30 70 Z" className="animate-shine" />
            <path d="M50 10 L40 20 L60 80 L70 70 Z" className="animate-shine" style={{ animationDelay: "0.5s" }} />
          </svg>
        );
      case "Pentacles":
        return (
          <svg className="w-32 h-32 text-emerald-300" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="4" className="animate-spin-slow" />
            <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="currentColor" fillOpacity="0.5" className="animate-glow" />
            <circle cx="50" cy="50" r="10" className="animate-pulse" />
          </svg>
        );
      default:
        return null;
    }
  };

  const renderMajorArcanaSymbol = () => {
    const name = card.name.toLowerCase();

    // Basic symbol for all major arcana cards if no specific symbol is defined
    return (
      <svg className="w-32 h-32 text-white" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="4" className="animate-spin-slow" />
        <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="4" className="animate-glow" />
        <circle cx="50" cy="50" r="10" fill="currentColor" className="animate-pulse" />
      </svg>
    );
  };

  return (
    <div className={getCardBorderAndBackground()}>
      <div className="absolute inset-0 flex items-center justify-center">
        {card.arcana === "major" ? renderMajorArcanaSymbol() : renderSuitSymbol()}
      </div>

      <div className="absolute inset-x-4 bottom-4 text-center">
        <h3 className="font-bold text-lg text-white drop-shadow-lg mb-1">{card.name}</h3>
        <div className="text-sm text-white/90 bg-black/30 px-2 py-0.5 rounded-full inline-block">
          {card.arcana === "major" ? "Major Arcana" : card.suit}
        </div>
      </div>
    </div>
  );
}