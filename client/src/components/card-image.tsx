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

  // Get base background gradient
  const getBaseBackground = () => {
    if (card.arcana === "major") {
      return "bg-gradient-to-br from-purple-700 via-purple-900 to-indigo-900";
    }
    switch (card.suit) {
      case "Wands":
        return "bg-gradient-to-br from-orange-500 via-red-600 to-rose-700";
      case "Cups":
        return "bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-800";
      case "Swords":
        return "bg-gradient-to-br from-zinc-400 via-slate-600 to-slate-800";
      case "Pentacles":
        return "bg-gradient-to-br from-emerald-500 via-emerald-700 to-green-900";
      default:
        return "bg-gradient-to-br from-fuchsia-500 via-purple-600 to-purple-900";
    }
  };

  // Get card-specific imagery
  const getCardImagery = () => {
    // Major Arcana imagery
    if (card.arcana === "major") {
      const name = card.name.toLowerCase();

      // Sun imagery
      if (name.includes('sun')) {
        return (
          <div className="absolute inset-4 flex items-center justify-center">
            {/* Central sun orb */}
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-yellow-500/80 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-yellow-300/90 rounded-full"></div>
              {/* Sun rays */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-4 h-48 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-t from-yellow-400/80 to-transparent"
                  style={{ transform: `rotate(${i * 30}deg)` }}
                ></div>
              ))}
            </div>
          </div>
        );
      }

      // Moon imagery
      if (name.includes('moon')) {
        return (
          <div className="absolute inset-4 flex items-center justify-center overflow-hidden">
            {/* Moon */}
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-blue-200/80 rounded-full"></div>
              <div className="absolute -right-1/4 inset-y-0 w-full bg-blue-900/90 rounded-full"></div>
              {/* Stars */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 75}%`,
                  }}
                >
                  <div className="w-full h-full bg-white/90 rounded-full animate-[twinkle_2s_ease-in-out_infinite]"></div>
                  <div className="absolute inset-0 bg-white/50 rounded-full animate-ping"></div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // Default Major Arcana imagery
      return (
        <div className="absolute inset-4 flex items-center justify-center overflow-hidden">
          {/* Sacred geometry pattern */}
          <div className="relative w-full h-full">
            <div className="absolute inset-0 border-8 border-white/40 rounded-full animate-[spin_30s_linear_infinite]"></div>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 border-4 border-white/30"
                style={{
                  transform: `rotate(${i * 60}deg)`,
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                }}
              ></div>
            ))}
            {/* Center point */}
            <div className="absolute w-8 h-8 bg-white/80 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      );
    }

    // Minor Arcana imagery
    switch (card.suit) {
      case "Wands":
        return (
          <div className="absolute inset-4 flex items-center justify-center">
            {/* Central wand */}
            <div className="relative w-8 h-64 bg-gradient-to-b from-orange-300/90 to-red-600/90 rounded-full shadow-[0_0_30px_rgba(255,165,0,0.5)]">
              {/* Magic sparkles */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-16 h-16"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className="w-full h-full bg-yellow-400/70 rounded-full animate-ping"></div>
                </div>
              ))}
            </div>
            {/* Energy aura */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/50 to-transparent rounded-full animate-pulse"></div>
          </div>
        );

      case "Cups":
        return (
          <div className="absolute inset-4 flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Cup */}
              <div className="absolute top-1/4 inset-x-4">
                <div className="w-full h-24 bg-gradient-to-b from-blue-300/90 to-blue-500/90 rounded-t-full overflow-hidden">
                  {/* Water surface */}
                  <div className="absolute inset-x-0 top-1/4 h-3/4 bg-gradient-to-b from-blue-200/80 to-transparent">
                    {/* Ripples */}
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-full h-1 bg-white/60 animate-[ripple_3s_ease-out_infinite]"
                        style={{ top: `${20 + i * 20}%`, animationDelay: `${i * 0.5}s` }}
                      ></div>
                    ))}
                  </div>
                </div>
                {/* Stem */}
                <div className="absolute bottom-0 w-1/4 h-32 bg-gradient-to-b from-blue-400/90 to-blue-600/90 left-1/2 -translate-x-1/2"></div>
                {/* Base */}
                <div className="absolute -bottom-8 w-3/4 h-8 bg-gradient-to-b from-blue-500/90 to-blue-700/90 left-1/2 -translate-x-1/2 rounded-full"></div>
              </div>
            </div>
          </div>
        );

      case "Swords":
        return (
          <div className="absolute inset-4 flex items-center justify-center">
            {/* Crossed swords */}
            {[45, -45].map((rotation, i) => (
              <div
                key={i}
                className="absolute inset-0 flex items-center justify-center"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {/* Blade */}
                <div className="relative w-8 h-64">
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-300/90 to-slate-500/90"></div>
                  {/* Edge highlight */}
                  <div className="absolute inset-y-0 w-1 bg-white/80"></div>
                  {/* Guard */}
                  <div className="absolute top-1/4 -left-6 w-20 h-4 bg-slate-400/90"></div>
                  {/* Handle */}
                  <div className="absolute top-1/4 -inset-x-1 h-20 bg-slate-700/90"></div>
                </div>
              </div>
            ))}
            {/* Glinting effect */}
            <div className="absolute w-12 h-12 bg-white/90 rounded-full animate-pulse"></div>
          </div>
        );

      case "Pentacles":
        return (
          <div className="absolute inset-4 flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Pentagram */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0"
                  style={{ transform: `rotate(${i * 72}deg)` }}
                >
                  <div className="absolute h-1/2 w-2 bg-emerald-400/90 left-1/2 -translate-x-1/2"></div>
                </div>
              ))}
              {/* Outer circle */}
              <div className="absolute inset-4 border-8 border-emerald-300/90 rounded-full animate-[spin_20s_linear_infinite]"></div>
              {/* Inner circle */}
              <div className="absolute inset-12 border-8 border-emerald-400/90 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              {/* Center point */}
              <div className="absolute w-8 h-8 bg-emerald-500/90 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative w-full aspect-[2/3] ${getBaseBackground()} rounded-lg shadow-xl overflow-hidden`}>
      {/* Card artwork */}
      {getCardImagery()}

      {/* Card title */}
      <div className="absolute inset-x-4 bottom-4 text-center z-10">
        <h3 className="font-bold text-lg mb-2 text-white drop-shadow-lg">{card.name}</h3>
        {(card.arcana === "major" || card.suit) && (
          <div className="text-sm text-white/90 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
            {card.arcana === "major" ? "Major Arcana" : card.suit}
          </div>
        )}
      </div>
    </div>
  );
}