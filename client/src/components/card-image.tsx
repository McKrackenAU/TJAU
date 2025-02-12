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

  // Generate main background based on card type
  const getCardBackground = () => {
    if (card.arcana === "major") {
      // Major Arcana: Rich, celestial patterns
      return "bg-gradient-to-br from-purple-700 via-purple-900 to-indigo-900";
    }

    // Minor Arcana: Suit-specific backgrounds
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
        // Custom cards: Mystical patterns
        return "bg-gradient-to-br from-fuchsia-500 via-purple-600 to-purple-900";
    }
  };

  // Generate card-specific art based on name and meaning
  const getCardArt = () => {
    // Major Arcana specific art
    if (card.arcana === "major") {
      const cardName = card.name.toLowerCase();

      // The Sun
      if (cardName.includes('sun')) {
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-32 h-32">
              {/* Central sun */}
              <div className="absolute inset-0 bg-yellow-400/50 rounded-full animate-pulse"></div>
              {/* Sun rays */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-20 bg-yellow-300/40"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        );
      }

      // The Moon
      if (cardName.includes('moon')) {
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-40 h-40">
              {/* Moon */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-blue-200/40 rounded-full"></div>
                <div className="absolute right-0 w-3/4 h-full bg-blue-900/90 rounded-r-full"></div>
              </div>
              {/* Stars */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/60 rounded-full animate-[twinkle_2s_ease-out_infinite]"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.3}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        );
      }

      // The Star
      if (cardName.includes('star')) {
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-40 h-40">
              {/* Central star */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-16 bg-yellow-200/50"
                    style={{
                      transform: `rotate(${i * 45}deg)`,
                    }}
                  ></div>
                ))}
              </div>
              {/* Surrounding stars */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-white/70 rounded-full animate-[twinkle_3s_ease-in-out_infinite]"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.2}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        );
      }
    }

    // Minor Arcana art based on suit
    if (card.suit === "Wands") {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-32 h-48">
            {/* Central wand */}
            <div className="absolute w-6 h-full bg-gradient-to-b from-orange-300/70 to-red-600/70 left-1/2 -translate-x-1/2 rounded-full shadow-[0_0_15px_rgba(255,165,0,0.5)]"></div>
            {/* Magical energy */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-24 bg-orange-500/30 origin-bottom animate-pulse"
                style={{
                  left: '50%',
                  transform: `translateX(-50%) rotate(${i * 45}deg)`,
                  animationDelay: `${i * 0.2}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      );
    }

    if (card.suit === "Cups") {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-32 h-40">
            {/* Chalice */}
            <div className="absolute top-0 w-full h-20 bg-gradient-to-b from-blue-300/70 to-blue-500/70 rounded-t-full overflow-hidden">
              {/* Water ripples */}
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-1 bg-blue-200/50 animate-[ripple_3s_ease-out_infinite]"
                  style={{
                    top: `${50 + i * 20}%`,
                    animationDelay: `${i * 0.4}s`
                  }}
                ></div>
              ))}
            </div>
            {/* Stem */}
            <div className="absolute bottom-0 w-8 h-20 bg-gradient-to-b from-blue-400/70 to-blue-600/70 left-1/2 -translate-x-1/2"></div>
            {/* Base */}
            <div className="absolute bottom-0 w-24 h-6 bg-gradient-to-b from-blue-500/70 to-blue-700/70 left-1/2 -translate-x-1/2 rounded-full"></div>
          </div>
        </div>
      );
    }

    if (card.suit === "Swords") {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-48 h-48">
            {/* Crossed swords */}
            {[0, 1].map((i) => (
              <div
                key={i}
                className="absolute w-8 h-48 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ transform: `rotate(${i * 90 - 45}deg)` }}
              >
                {/* Blade */}
                <div className="absolute w-full h-3/4 bg-gradient-to-b from-slate-300/70 to-slate-500/70"></div>
                {/* Guard */}
                <div className="absolute top-3/4 w-16 h-3 bg-slate-400/70 -translate-x-1/4"></div>
                {/* Handle */}
                <div className="absolute top-3/4 w-4 h-12 bg-slate-600/70 translate-x-1/2"></div>
              </div>
            ))}
            {/* Metallic glint */}
            <div className="absolute w-8 h-8 bg-white/50 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          </div>
        </div>
      );
    }

    if (card.suit === "Pentacles") {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-40 h-40">
            {/* Pentacle star */}
            <div className="absolute inset-0">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-full origin-center"
                  style={{ transform: `rotate(${i * 72}deg)` }}
                >
                  <div className="absolute top-0 left-1/2 w-2 h-1/2 bg-emerald-400/70"></div>
                </div>
              ))}
            </div>
            {/* Rotating circles */}
            <div className="absolute inset-4 border-4 border-emerald-300/70 rounded-full animate-[spin_20s_linear_infinite]"></div>
            <div className="absolute inset-8 border-4 border-emerald-400/70 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
            {/* Center point */}
            <div className="absolute w-6 h-6 bg-emerald-500/70 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          </div>
        </div>
      );
    }

    // Default art for custom cards
    return null;
  };

  return (
    <div className={`relative w-full aspect-[2/3] ${getCardBackground()} rounded-lg p-4 flex flex-col items-center justify-between text-white shadow-lg overflow-hidden`}>
      {/* Card-specific art */}
      {getCardArt()}

      {/* Card title and type */}
      <div className="text-center z-10">
        <h3 className="font-bold text-lg mb-2 drop-shadow-md">{card.name}</h3>
        {(card.arcana === "major" || card.suit) && (
          <div className="text-sm opacity-90 bg-black/20 px-3 py-1 rounded-full">
            {card.arcana === "major" ? "Major Arcana" : card.suit}
          </div>
        )}
      </div>
    </div>
  );
}