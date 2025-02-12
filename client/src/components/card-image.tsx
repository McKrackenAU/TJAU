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
              {/* Enhanced wooden staff */}
              <rect x="11" y="2" width="2" height="20" rx="1" />
              {/* Ornate top */}
              <circle cx="12" cy="4" r="2.5" />
              {/* Dynamic flames */}
              <path className="animate-flicker" d="M12 2c0.5-1.5 2-2.5 3.5-2.5s3 1 3.5 2.5c0.5 1.5 0.5 3-0.5 4s-2.5 1.5-3.5 1.5-2.5-0.5-3.5-1.5-1-2.5-0.5-4z" />
              <path className="animate-flicker-delayed" d="M12 2c-0.5-1.5-2-2.5-3.5-2.5s-3 1-3.5 2.5c-0.5 1.5-0.5 3 0.5 4s2.5 1.5 3.5 1.5 2.5-0.5 3.5-1.5 1-2.5 0.5-4z" />
            </svg>
            {/* Enhanced glowing effect */}
            <div className="absolute inset-0 bg-yellow-500/20 animate-pulse rounded-full blur-xl"></div>
          </div>
        );
      case "Cups":
        return (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <svg className="w-48 h-64 text-blue-300" viewBox="0 0 24 24" fill="currentColor">
              {/* Enhanced chalice */}
              <path d="M6 4h12l2 3v2c0 4-3 7-6 8v3h4v2H6v-2h4v-3c-3-1-6-4-6-8V7l2-3z" />
              {/* Shimmering liquid */}
              <path d="M7 9c0 3 2.5 5 5 5s5-2 5-5H7z" fillOpacity="0.8" className="text-blue-500 animate-wave" />
              {/* Mystical highlights */}
              <path d="M8 6l-1 2h10l-1-2H8z" fillOpacity="0.9" className="text-blue-200" />
            </svg>
            {/* Enhanced water ripples */}
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
              {/* Enhanced crossed swords */}
              <path d="M12 2l1.5 1.5-7 7 1.5 1.5-3 3-1.5-1.5 3-3 1.5 1.5 7-7L16.5 2H12z" className="animate-swing" />
              <path d="M12 22l-1.5-1.5 7-7-1.5-1.5 3-3 1.5 1.5-3 3-1.5-1.5-7 7L7.5 22H12z" className="animate-swing-delayed" />
              {/* Dynamic metallic shine */}
              <path d="M12 12l-4 4 1 1 4-4-1-1z" className="text-white animate-shine" fillOpacity="0.9" />
            </svg>
            {/* Enhanced metallic gleam */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent animate-pulse"></div>
          </div>
        );
      case "Pentacles":
        return (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <svg className="w-48 h-48 text-emerald-300 animate-[spin_20s_linear_infinite]" viewBox="0 0 24 24">
              {/* Enhanced pentacle design */}
              <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1" className="animate-pulse" />
              {/* Dynamic inner pentagon */}
              <path
                d="M12 2l7.8 5.6-3 9.2H7.2l-3-9.2L12 2z"
                fill="currentColor"
                fillOpacity="0.3"
                className="animate-spin-slow"
              />
              {/* Glowing star points */}
              <path
                d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6L12 2z"
                fill="currentColor"
                fillOpacity="0.8"
                className="animate-glow"
              />
            </svg>
            {/* Enhanced magical glow */}
            <div className="absolute inset-0 bg-emerald-500/20 animate-pulse rounded-full blur-xl"></div>
          </div>
        );
      default:
        return null;
    }
  };

  const getMajorArcanaSymbol = () => {
    const name = card.name.toLowerCase();

    // Enhanced symbol mapping for Major Arcana
    if (name.includes('fool')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-yellow-200" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" className="animate-spin-slow" />
            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" className="animate-bounce-slow" />
          </svg>
        </div>
      );
    }

    if (name.includes('magician')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-purple-300" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" className="animate-float" />
            <path d="M12 4v16M4 8l16 8M4 16l16-8" className="animate-pulse" stroke="currentColor" fill="none" />
          </svg>
        </div>
      );
    }

    if (name.includes('priestess')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-blue-200" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" className="animate-pulse-slow" fill="none" stroke="currentColor" />
            <path d="M12 2v20M2 12h20" className="animate-glow" stroke="currentColor" fill="none" />
          </svg>
        </div>
      );
    }

    if (name.includes('empress')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-green-300" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" className="animate-growth" />
            <path d="M12 4c2 4 4 6 8 8-4 2-6 4-8 8-2-4-4-6-8-8 4-2 6-4 8-8z" className="animate-pulse" />
          </svg>
        </div>
      );
    }

    if (name.includes('emperor')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-red-400" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" className="animate-rotate" />
            <path d="M12 2l8 4-8 4-8-4 8-4z" className="animate-pulse" />
          </svg>
        </div>
      );
    }

    if (name.includes('hierophant')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-yellow-600" viewBox="0 0 24 24">
            <path d="M12 2v20M7 4l10 16M17 4L7 20" className="animate-draw" stroke="currentColor" fill="none" />
          </svg>
        </div>
      );
    }

    if (name.includes('lovers')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-pink-300" viewBox="0 0 24 24">
            <path d="M12 6l-2-2-2 2-2-2v4l6 6 6-6V4l-2 2-2-2-2 2z" className="animate-beat" />
          </svg>
        </div>
      );
    }

    if (name.includes('chariot')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-orange-400" viewBox="0 0 24 24">
            <path d="M4 12h16M12 4v16" className="animate-move" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="8" className="animate-spin-slow" fill="none" stroke="currentColor" />
          </svg>
        </div>
      );
    }

    if (name.includes('strength')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-yellow-500" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" className="animate-pulse" />
            <path d="M15 9l-6 6M9 9l6 6" className="animate-flash" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      );
    }

    if (name.includes('hermit')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-gray-300" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4" className="animate-glow" />
            <path d="M12 4v16" stroke="currentColor" strokeWidth="2" className="animate-pulse" />
          </svg>
        </div>
      );
    }

    if (name.includes('wheel')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-amber-400 animate-spin-slow" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" />
            <path d="M12 2v20M2 12h20M12 12l8-8M12 12l-8 8" stroke="currentColor" />
          </svg>
        </div>
      );
    }

    if (name.includes('justice')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-blue-400" viewBox="0 0 24 24">
            <path d="M12 2v20M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" className="animate-balance" />
          </svg>
        </div>
      );
    }

    if (name.includes('hanged')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-purple-400 rotate-180" viewBox="0 0 24 24">
            <path d="M12 2v20M8 12h8" stroke="currentColor" strokeWidth="2" className="animate-swing" />
            <circle cx="12" cy="8" r="4" className="animate-pulse" />
          </svg>
        </div>
      );
    }

    if (name.includes('death')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-gray-800" viewBox="0 0 24 24">
            <path d="M12 2l10 20H2L12 2z" className="animate-transform" />
            <circle cx="12" cy="12" r="4" className="animate-pulse text-white" />
          </svg>
        </div>
      );
    }

    if (name.includes('temperance')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-cyan-300" viewBox="0 0 24 24">
            <path d="M6 2v20M18 2v20" stroke="currentColor" strokeWidth="2" className="animate-flow" />
            <path d="M6 12h12" stroke="currentColor" strokeWidth="2" className="animate-wave" />
          </svg>
        </div>
      );
    }

    if (name.includes('devil')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-red-600" viewBox="0 0 24 24">
            <path d="M12 2l8 4-8 4-8-4 8-4z" className="animate-flame" />
            <path d="M4 6l8 4v12" stroke="currentColor" strokeWidth="2" />
            <path d="M20 6l-8 4v12" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      );
    }

    if (name.includes('tower')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-gray-700" viewBox="0 0 24 24">
            <rect x="8" y="4" width="8" height="16" className="animate-shake" />
            <path d="M4 20h16" stroke="currentColor" strokeWidth="2" />
            <path d="M12 2v4M8 8l8-4M16 8l-8-4" stroke="currentColor" className="animate-lightning" />
          </svg>
        </div>
      );
    }

    if (name.includes('star')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-yellow-200" viewBox="0 0 24 24">
            <path d="M12 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" className="animate-twinkle" />
            {[...Array(8)].map((_, i) => (
              <circle
                key={i}
                cx={12 + Math.cos(i * Math.PI / 4) * 8}
                cy={12 + Math.sin(i * Math.PI / 4) * 8}
                r="1"
                className="animate-twinkle"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </svg>
        </div>
      );
    }

    if (name.includes('moon')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-blue-200" viewBox="0 0 24 24">
            <path d="M12 3c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm0 16c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z" className="animate-glow" />
            {/* Stars */}
            {[...Array(12)].map((_, i) => (
              <circle
                key={i}
                cx={4 + Math.random() * 16}
                cy={4 + Math.random() * 16}
                r="0.5"
                className="animate-twinkle"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </svg>
          {/* Twinkling stars */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-transparent"></div>
        </div>
      );
    }

    if (name.includes('sun')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-yellow-400" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" fill="currentColor" className="animate-pulse" />
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
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
            <circle cx="12" cy="12" r="8" fill="currentColor" fillOpacity="0.3" className="animate-pulse" />
          </svg>
          {/* Radiant glow */}
          <div className="absolute inset-0 bg-yellow-500/30 animate-pulse rounded-full blur-xl"></div>
        </div>
      );
    }

    if (name.includes('judgement')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-gold-400" viewBox="0 0 24 24">
            <path d="M12 2v20M4 12h16" stroke="currentColor" strokeWidth="2" className="animate-trumpet" />
            <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" className="animate-pulse" />
          </svg>
        </div>
      );
    }

    if (name.includes('world')) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-56 h-56 text-emerald-400 animate-spin-slow" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" />
            <path d="M12 2v20M2 12h20" stroke="currentColor" />
            <circle cx="12" cy="12" r="4" className="animate-pulse" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 animate-pulse rounded-full blur-xl"></div>
        </div>
      );
    }

    // Default sacred geometry pattern for other Major Arcana
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <svg className="w-56 h-56 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="1" className="animate-spin-slow" />
          <circle cx="12" cy="12" r="6" strokeWidth="1" className="animate-spin-reverse" />
          {[...Array(6)].map((_, i) => (
            <line
              key={i}
              x1="12"
              y1="2"
              x2="12"
              y2="22"
              strokeWidth="1"
              transform={`rotate(${i * 30} 12 12)`}
              className="animate-pulse"
            />
          ))}
          <circle cx="12" cy="12" r="2" fill="currentColor" className="animate-pulse" />
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