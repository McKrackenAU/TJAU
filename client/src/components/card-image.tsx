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

  // Get card-specific art elements
  const getCardArt = () => {
    // Add SVG art elements based on card type and name
    return (
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        {/* Major Arcana specific art */}
        {card.arcana === "major" && (
          <>
            {/* Central mandala pattern */}
            <div className="absolute inset-0 [mask-image:radial-gradient(circle_at_center,white,transparent)]">
              <div className="absolute inset-0 animate-[spin_60s_linear_infinite]">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 origin-center"
                    style={{
                      transform: `rotate(${i * 45}deg)`,
                    }}
                  >
                    <div className="absolute top-1/2 left-1/2 h-1/2 w-[1px] bg-white/30 origin-top"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional geometric elements based on card meaning */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-32 h-32 border-2 border-white/20 rounded-full 
                ${card.name.includes('Sun') ? 'bg-yellow-500/10' : 
                  card.name.includes('Moon') ? 'bg-blue-500/10' : 
                  card.name.includes('Star') ? 'bg-purple-500/10' : 
                  'bg-white/5'}`}>
              </div>
            </div>
          </>
        )}

        {/* Minor Arcana art based on suit */}
        {card.suit === "Wands" && (
          <div className="absolute inset-0 overflow-hidden">
            {/* Flame-like patterns */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-16 h-24 bg-orange-500/10"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                }}
              />
            ))}
          </div>
        )}

        {card.suit === "Cups" && (
          <div className="absolute inset-0 overflow-hidden">
            {/* Water ripple effects */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-blue-300/20 animate-[ripple_4s_ease-out_infinite]"
                style={{
                  width: `${(i + 1) * 20}%`,
                  height: `${(i + 1) * 20}%`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}

        {card.suit === "Swords" && (
          <div className="absolute inset-0">
            {/* Crossed swords pattern */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-48 w-[2px] bg-white/20"
                  style={{
                    transform: `rotate(${i * 45}deg)`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {card.suit === "Pentacles" && (
          <div className="absolute inset-0">
            {/* Sacred geometry pentacle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-32 h-32">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full h-full origin-center"
                    style={{
                      transform: `rotate(${i * 72}deg)`,
                    }}
                  >
                    <div className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-white/20" />
                  </div>
                ))}
                <div className="absolute inset-0 border-2 border-white/20 rounded-full" />
              </div>
            </div>
          </div>
        )}
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