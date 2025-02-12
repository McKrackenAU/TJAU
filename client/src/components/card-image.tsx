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
        return "bg-gradient-to-br from-slate-400 via-slate-600 to-slate-800";
      case "Pentacles":
        return "bg-gradient-to-br from-emerald-500 via-emerald-700 to-green-900";
      default:
        // Custom cards: Mystical patterns
        return "bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-900";
    }
  };

  // Generate decorative overlays based on card type
  const getCardOverlay = () => {
    if (card.arcana === "major") {
      return (
        <>
          {/* Celestial pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(255,255,255,0.1)_70%)] opacity-50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_1px,_transparent_1px)] bg-[size:10px_10px] opacity-30"></div>
          {/* Sacred geometry elements */}
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg_60deg,rgba(255,255,255,0.1)_60deg_120deg,transparent_120deg_180deg,rgba(255,255,255,0.1)_180deg_240deg,transparent_240deg_300deg,rgba(255,255,255,0.1)_300deg_360deg)]"></div>
        </>
      );
    }

    switch (card.suit) {
      case "Wands":
        return (
          <>
            {/* Flames and energy patterns */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_15px,rgba(255,165,0,0.1)_15px,rgba(255,165,0,0.1)_30px)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,69,0,0.2),transparent_70%)]"></div>
          </>
        );
      case "Cups":
        return (
          <>
            {/* Water ripples and flows */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(135,206,235,0.3),transparent_70%)]"></div>
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,rgba(255,255,255,0.05)_20px,rgba(255,255,255,0.05)_40px)]"></div>
          </>
        );
      case "Swords":
        return (
          <>
            {/* Sharp angles and metallic gleams */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]"></div>
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.2)_50%,transparent_55%)]"></div>
          </>
        );
      case "Pentacles":
        return (
          <>
            {/* Earth and crystal patterns */}
            <div className="absolute inset-0 bg-[repeating-conic-gradient(from_0deg,rgba(255,255,255,0.1)_0deg_30deg,transparent_30deg_60deg)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.2),transparent_30%)]"></div>
          </>
        );
      default:
        // Custom cards: Mystical and ethereal patterns
        return (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(255,255,255,0.1)_80%)]"></div>
            <div className="absolute inset-0 bg-[repeating-linear-gradient(60deg,transparent,transparent_20px,rgba(255,255,255,0.05)_20px,rgba(255,255,255,0.05)_40px)]"></div>
          </>
        );
    }
  };

  // Generate card-specific art based on name and meaning
  const getCardArt = () => {
    const getMajorArcanaArt = () => {
      const cardName = card.name.toLowerCase();
      if (cardName.includes('fool')) {
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-32 h-48">
              {/* Jester figure */}
              <div className="absolute w-16 h-24 bg-white/20 rounded-full top-0 left-1/2 -translate-x-1/2"></div>
              <div className="absolute w-8 h-12 bg-white/20 rounded-full top-24 left-1/4"></div>
              <div className="absolute w-8 h-12 bg-white/20 rounded-full top-24 right-1/4"></div>
              {/* Jester's staff */}
              <div className="absolute w-2 h-32 bg-white/30 bottom-0 left-1/2 -translate-x-1/2 rounded-full"></div>
              {/* Dancing stars */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/40 rounded-full animate-[twinkle_2s_ease-in-out_infinite]"
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
      if (cardName.includes('magician')) {
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Magic circle */}
            <div className="relative w-40 h-40">
              {/* Ritual circle */}
              <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-[spin_20s_linear_infinite]"></div>
              {/* Floating symbols */}
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-8 h-8"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 90}deg) translateY(-48px)`,
                  }}
                >
                  <div className="w-full h-full bg-white/20 animate-pulse" style={{
                    clipPath: i === 0 ? 'polygon(50% 0%, 100% 100%, 0% 100%)' : // Wand
                      i === 1 ? 'circle(50%)' : // Pentacle
                      i === 2 ? 'polygon(0% 0%, 100% 0%, 50% 100%)' : // Sword
                      'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' // Cup
                  }}></div>
                </div>
              ))}
              {/* Central floating orb */}
              <div className="absolute w-12 h-12 bg-white/30 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            </div>
          </div>
        );
      }
      if (cardName.includes('high priestess')) {
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Moon phases */}
            <div className="relative w-40 h-40">
              {/* Central crescent */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                <div className="absolute right-0 w-3/4 h-full bg-current rounded-r-full"></div>
              </div>
              {/* Stars */}
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/40"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                    transform: `rotate(${i * 51.43}deg)`,
                  }}
                ></div>
              ))}
              {/* Sacred scroll */}
              <div className="absolute w-16 h-24 bg-white/20 bottom-0 left-1/2 -translate-x-1/2 rounded-t-lg"></div>
            </div>
          </div>
        );
      }
      // Add more specific Major Arcana art patterns...
      return null;
    };

    const getMinorArcanaArt = () => {
      const rankPatterns = {
        ace: (suit: string) => (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-32 h-32">
              {/* Large central symbol */}
              <div className={`absolute inset-0 bg-white/20 ${
                suit === "Wands" ? "rounded-full" :
                suit === "Cups" ? "rounded-t-full" :
                suit === "Swords" ? "" :
                "pentagon"
              }`}></div>
              {/* Emanating energy */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-16 bg-white/10 origin-bottom"
                  style={{ transform: `rotate(${i * 45}deg)` }}
                ></div>
              ))}
            </div>
          </div>
        ),
        king: (suit: string) => (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-40 h-48">
              {/* Crown */}
              <div className="absolute top-0 w-full h-16">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute bottom-0 w-4 h-12 bg-white/30"
                    style={{
                      left: `${i * 25}%`,
                      transform: 'skew(15deg)',
                    }}
                  ></div>
                ))}
              </div>
              {/* Royal figure */}
              <div className="absolute w-24 h-32 bg-white/20 rounded-t-full bottom-0 left-1/2 -translate-x-1/2"></div>
              {/* Suit symbol */}
              <div className={`absolute w-8 h-8 bg-white/30 top-20 left-1/2 -translate-x-1/2 ${
                suit === "Wands" ? "rounded-full" :
                suit === "Cups" ? "rounded-t-full" :
                suit === "Swords" ? "rotate-45" :
                "rotate-36"
              }`}></div>
            </div>
          </div>
        ),
        queen: (suit: string) => (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-40 h-48">
              {/* Crown */}
              <div className="absolute top-0 w-full h-12">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute bottom-0 w-6 h-8 bg-white/30"
                    style={{
                      left: `${25 + i * 25}%`,
                      transform: 'skew(0deg)',
                    }}
                  ></div>
                ))}
              </div>
              {/* Queen figure */}
              <div className="absolute w-28 h-36 bg-white/20 rounded-t-full bottom-0 left-1/2 -translate-x-1/2"></div>
              {/* Flowing robes */}
              <div className="absolute w-36 h-24 bg-white/10 rounded-full bottom-0 left-1/2 -translate-x-1/2"></div>
              {/* Suit symbol */}
              <div className={`absolute w-6 h-6 bg-white/30 top-16 left-1/2 -translate-x-1/2 ${
                suit === "Wands" ? "rounded-full" :
                suit === "Cups" ? "rounded-t-full" :
                suit === "Swords" ? "rotate-45" :
                "rotate-36"
              }`}></div>
            </div>
          </div>
        )
      };

      const suitPatterns = {
        "Wands": (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Central wand */}
            <div className="relative w-48 h-48">
              <div className="absolute w-4 h-40 bg-gradient-to-b from-orange-300/30 to-red-600/30 left-1/2 -translate-x-1/2 rounded-full"></div>
              {/* Energy emanations */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-16 bg-orange-500/10 origin-bottom animate-pulse"
                  style={{
                    left: '50%',
                    transform: `translateX(-50%) rotate(${i * 30}deg)`,
                    animationDelay: `${i * 0.2}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        ),
        "Cups": (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Chalice */}
            <div className="relative w-32 h-40">
              {/* Cup bowl */}
              <div className="absolute top-0 w-full h-16 bg-blue-300/20 rounded-t-full overflow-hidden">
                {/* Water ripples */}
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full h-1 bg-white/10 animate-[ripple_2s_ease-out_infinite]"
                    style={{ top: `${50 + i * 20}%`, animationDelay: `${i * 0.3}s` }}
                  ></div>
                ))}
              </div>
              {/* Stem */}
              <div className="absolute bottom-0 w-8 h-24 bg-blue-400/20 left-1/2 -translate-x-1/2"></div>
              {/* Base */}
              <div className="absolute bottom-0 w-24 h-4 bg-blue-500/20 left-1/2 -translate-x-1/2 rounded-full"></div>
            </div>
          </div>
        ),
        "Swords": (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Crossed swords */}
            <div className="relative w-48 h-48">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="absolute inset-0 flex items-center justify-center">
                  {/* Blade */}
                  <div
                    className="w-8 h-48 bg-gradient-to-b from-slate-300/30 to-slate-600/30"
                    style={{ transform: `rotate(${i * 90 - 45}deg)` }}
                  >
                    {/* Guard */}
                    <div className="absolute top-1/4 w-16 h-2 bg-white/20 -translate-x-1/4"></div>
                    {/* Handle */}
                    <div className="absolute top-1/4 w-4 h-12 bg-white/30 translate-x-1/2"></div>
                  </div>
                </div>
              ))}
              {/* Glinting light */}
              <div className="absolute w-8 h-8 bg-white/40 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            </div>
          </div>
        ),
        "Pentacles": (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Pentagon with inner star */}
            <div className="relative w-40 h-40">
              {/* Outer pentagon */}
              <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full h-full origin-center"
                    style={{ transform: `rotate(${i * 72}deg)` }}
                  >
                    <div className="absolute top-0 left-1/2 w-1 h-1/2 bg-emerald-400/30"></div>
                  </div>
                ))}
              </div>
              {/* Inner circle */}
              <div className="absolute inset-4 border-2 border-emerald-300/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
              {/* Center point */}
              <div className="absolute w-4 h-4 bg-emerald-400/40 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              {/* Connecting lines */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1/2 h-px bg-emerald-400/20 top-1/2 left-1/2 origin-left"
                  style={{ transform: `rotate(${i * 72}deg)` }}
                ></div>
              ))}
            </div>
          </div>
        ),
      };

      const cardRank = card.name.split(' ')[0].toLowerCase();
      return (
        <>
          {card.suit && rankPatterns[cardRank as keyof typeof rankPatterns]?.(card.suit)}
          {card.suit && suitPatterns[card.suit]}
        </>
      );
    };

    return (
      <div className="absolute inset-0">
        {card.arcana === "major" ? getMajorArcanaArt() : getMinorArcanaArt()}
      </div>
    );
  };

  return (
    <div className={`relative w-full aspect-[2/3] ${getCardBackground()} rounded-lg p-4 flex flex-col items-center justify-between text-white shadow-lg overflow-hidden`}>
      {/* Background patterns and decorative elements */}
      {getCardOverlay()}

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