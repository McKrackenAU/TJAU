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
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <svg className="w-48 h-64 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
              {/* Wooden staff */}
              <rect x="11" y="2" width="2" height="20" rx="1" />
              {/* Top ornament */}
              <circle cx="12" cy="4" r="2.5" />
              {/* Flames */}
              <path d="M12 2c0.5-1.5 2-2.5 3.5-2.5s3 1 3.5 2.5c0.5 1.5 0.5 3-0.5 4s-2.5 1.5-3.5 1.5-2.5-0.5-3.5-1.5-1-2.5-0.5-4z" />
              <path d="M12 2c-0.5-1.5-2-2.5-3.5-2.5s-3 1-3.5 2.5c-0.5 1.5-0.5 3 0.5 4s2.5 1.5 3.5 1.5 2.5-0.5 3.5-1.5 1-2.5 0.5-4z" />
            </svg>
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-yellow-500/20 animate-pulse rounded-full blur-xl"></div>
          </div>
        );
      case "Cups":
        return (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <svg className="w-48 h-64 text-blue-300" viewBox="0 0 24 24" fill="currentColor">
              {/* Cup bowl */}
              <path d="M6 4h12l2 3v2c0 4-3 7-6 8v3h4v2H6v-2h4v-3c-3-1-6-4-6-8V7l2-3z" />
              {/* Liquid */}
              <path d="M7 9c0 3 2.5 5 5 5s5-2 5-5H7z" fillOpacity="0.8" className="text-blue-500" />
              {/* Highlights */}
              <path d="M8 6l-1 2h10l-1-2H8z" fillOpacity="0.9" className="text-blue-200" />
            </svg>
            {/* Water ripples */}
            <div className="absolute top-1/3 inset-x-0 flex flex-col items-center">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-24 h-24 border-4 border-blue-300/40 rounded-full absolute animate-ripple"
                  style={{ animationDelay: `${i * 0.5}s` }}
                ></div>
              ))}
            </div>
          </div>
        );
      case "Swords":
        return (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <svg className="w-48 h-64 text-slate-200" viewBox="0 0 24 24" fill="currentColor">
              {/* First sword */}
              <path d="M12 2l1.5 1.5-7 7 1.5 1.5-3 3-1.5-1.5 3-3 1.5 1.5 7-7L16.5 2H12z" />
              {/* Second sword */}
              <path d="M12 22l-1.5-1.5 7-7-1.5-1.5 3-3 1.5 1.5-3 3-1.5-1.5-7 7L7.5 22H12z" />
              {/* Metallic shine */}
              <path d="M12 12l-4 4 1 1 4-4-1-1z" className="text-white" fillOpacity="0.9" />
            </svg>
            {/* Metallic gleam */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          </div>
        );
      case "Pentacles":
        return (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <svg className="w-48 h-48 text-emerald-300 animate-[spin_20s_linear_infinite]" viewBox="0 0 24 24">
              {/* Outer circle */}
              <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1" />
              {/* Inner pentagon */}
              <path
                d="M12 2l7.8 5.6-3 9.2H7.2l-3-9.2L12 2z"
                fill="currentColor"
                fillOpacity="0.3"
              />
              {/* Star points */}
              <path
                d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6L12 2z"
                fill="currentColor"
                fillOpacity="0.8"
              />
            </svg>
            {/* Magical glow */}
            <div className="absolute inset-0 bg-emerald-500/20 animate-pulse rounded-full blur-xl"></div>
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
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-yellow-400" viewBox="0 0 24 24">
            {/* Central sun */}
            <circle cx="12" cy="12" r="5" fill="currentColor" />
            {/* Sun rays */}
            {[...Array(12)].map((_, i) => (
              <rect
                key={i}
                x="11"
                y="1"
                width="2"
                height="22"
                fill="currentColor"
                transform={`rotate(${i * 30} 12 12)`}
              />
            ))}
            {/* Outer glow */}
            <circle cx="12" cy="12" r="8" fill="currentColor" fillOpacity="0.3" />
          </svg>
          {/* Radiant glow */}
          <div className="absolute inset-0 bg-yellow-500/30 animate-pulse rounded-full blur-xl"></div>
        </div>
      );
    }

    if (name.includes('moon')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-blue-200" viewBox="0 0 24 24">
            {/* Moon crescent */}
            <path
              d="M12 3c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm0 16c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z"
              fill="currentColor"
            />
            {/* Stars */}
            <circle cx="8" cy="8" r="1" fill="currentColor" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
            <circle cx="16" cy="16" r="1" fill="currentColor" />
          </svg>
          {/* Twinkling stars */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
              }}
            >
              <div className="w-full h-full bg-white rounded-full animate-[twinkle_2s_ease-in-out_infinite]"></div>
              <div className="absolute inset-0 bg-white/50 rounded-full animate-ping"></div>
            </div>
          ))}
        </div>
      );
    }

    // Default sacred geometry pattern for other Major Arcana
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <svg className="w-56 h-56 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          {/* Sacred geometry circles */}
          <circle cx="12" cy="12" r="10" strokeWidth="1" />
          <circle cx="12" cy="12" r="6" strokeWidth="1" />
          {/* Intersecting lines */}
          {[...Array(6)].map((_, i) => (
            <line
              key={i}
              x1="12"
              y1="2"
              x2="12"
              y2="22"
              strokeWidth="1"
              transform={`rotate(${i * 30} 12 12)`}
            />
          ))}
          {/* Center point */}
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
        {/* Mystical glow */}
        <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
      </div>
    );
  };

  return (
    <div className={getCardBorderAndBackground()}>
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-white/20"
            style={{ top: `${i * 10}%`, transform: 'rotate(45deg)' }}
          />
        ))}
      </div>

      {/* Main card symbol with increased size and opacity */}
      {card.arcana === "major" ? getMajorArcanaSymbol() : getSuitSymbol()}

      {/* Card name and type */}
      <div className="absolute inset-x-4 bottom-4 text-center z-20">
        <h3 className="font-bold text-lg mb-2 text-white drop-shadow-lg">{card.name}</h3>
        <div className="text-sm text-white/90 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
          {card.arcana === "major" ? "Major Arcana" : card.suit}
        </div>
      </div>
    </div>
  );
}