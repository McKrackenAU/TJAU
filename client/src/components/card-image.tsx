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
    const baseClasses = "w-full aspect-[2/3] rounded-lg relative overflow-hidden shadow-xl";

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

  const getSuitSymbol = () => {
    switch (card.suit) {
      case "Wands":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-32 h-48 text-yellow-400/90" viewBox="0 0 24 24" fill="currentColor">
              <rect x="11" y="2" width="2" height="20" rx="1" />
              <rect x="7" y="4" width="10" height="2" rx="1" />
              <rect x="9" y="18" width="6" height="2" rx="1" />
              {/* Flames */}
              <path d="M12 2c1-2 3-3 5-3s4 1 5 3c1 2 1 4 0 6s-3 4-5 4-4-2-5-4-1-4 0-6z" fill="currentColor" fillOpacity="0.6" />
            </svg>
          </div>
        );
      case "Cups":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-32 h-48 text-blue-400/90" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 3h10l2 4v2c0 3-2 6-5 7v3h3v2H7v-2h3v-3c-3-1-5-4-5-7V7l2-4zm1.5 2l-1.2 3h9.4l-1.2-3H8.5z" />
              {/* Liquid */}
              <path d="M8 10c0 2 1.5 4 4 4s4-2 4-4H8z" fillOpacity="0.6" />
            </svg>
          </div>
        );
      case "Swords":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-32 h-48 text-slate-300/90" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2 2-8 8 2 2-4 4-2-2 4-4 2 2 8-8 2 2V2h-6z" />
              <path d="M12 22l-2-2 8-8-2-2 4-4 2 2-4 4-2-2-8 8-2-2v6h6z" />
            </svg>
          </div>
        );
      case "Pentacles":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-32 h-32 text-emerald-300/90 animate-[spin_20s_linear_infinite]" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" fillOpacity="0.3" />
              <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getMajorArcanaSymbol = () => {
    const name = card.name.toLowerCase();
    if (name.includes('sun')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-40 h-40 text-yellow-400/90" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="5" />
            {[...Array(12)].map((_, i) => (
              <rect
                key={i}
                x="11"
                y="0"
                width="2"
                height="24"
                transform={`rotate(${i * 30} 12 12)`}
                fillOpacity="0.6"
              />
            ))}
          </svg>
        </div>
      );
    }

    if (name.includes('moon')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-40 h-40 text-blue-200/90" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm0 16c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z" />
            <circle cx="8" cy="8" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="16" cy="16" r="1" />
          </svg>
          {/* Stars */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </div>
      );
    }

    // Default sacred geometry pattern for other Major Arcana
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-40 h-40 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="0.5" />
          <circle cx="12" cy="12" r="6" strokeWidth="0.5" />
          {[...Array(6)].map((_, i) => (
            <line
              key={i}
              x1="12"
              y1="2"
              x2="12"
              y2="22"
              strokeWidth="0.5"
              transform={`rotate(${i * 30} 12 12)`}
            />
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className={getCardBorderAndBackground()}>
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-1 bg-white/40"
            style={{ top: `${i * 10}%`, transform: 'rotate(45deg)' }}
          />
        ))}
      </div>

      {/* Main symbol */}
      {card.arcana === "major" ? getMajorArcanaSymbol() : getSuitSymbol()}

      {/* Card name and type */}
      <div className="absolute inset-x-4 bottom-4 text-center">
        <h3 className="font-bold text-lg mb-2 text-white drop-shadow-lg">{card.name}</h3>
        <div className="text-sm text-white/90 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
          {card.arcana === "major" ? "Major Arcana" : card.suit}
        </div>
      </div>
    </div>
  );
}