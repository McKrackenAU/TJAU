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
    if (card.arcana === "major") {
      return "bg-gradient-to-br from-purple-600 to-purple-800";
    }
    switch (card.suit) {
      case "Wands": return "bg-gradient-to-br from-orange-500 to-red-600";
      case "Cups": return "bg-gradient-to-br from-blue-400 to-blue-600";
      case "Swords": return "bg-gradient-to-br from-slate-400 to-slate-600";
      case "Pentacles": return "bg-gradient-to-br from-emerald-500 to-emerald-700";
      default: return "bg-gradient-to-br from-indigo-500 to-indigo-700";
    }
  };

  // Generate a suitable icon or symbol based on the card's name and meanings
  const getCardSymbol = () => {
    // Major Arcana specific symbols
    if (card.arcana === "major") {
      if (card.name.includes("Fool")) return "🎭";
      if (card.name.includes("Magician")) return "🎯";
      if (card.name.includes("Priestess")) return "🌙";
      if (card.name.includes("Empress")) return "👑";
      if (card.name.includes("Emperor")) return "⚔️";
      if (card.name.includes("Hierophant")) return "🏛️";
      if (card.name.includes("Lovers")) return "💕";
      if (card.name.includes("Chariot")) return "🏃";
      if (card.name.includes("Strength")) return "🦁";
      if (card.name.includes("Hermit")) return "🏮";
      if (card.name.includes("Wheel")) return "🎡";
      if (card.name.includes("Justice")) return "⚖️";
      if (card.name.includes("Hanged")) return "🎗️";
      if (card.name.includes("Death")) return "🦋";
      if (card.name.includes("Temperance")) return "⚱️";
      if (card.name.includes("Devil")) return "⛓️";
      if (card.name.includes("Tower")) return "🗼";
      if (card.name.includes("Star")) return "⭐";
      if (card.name.includes("Moon")) return "🌕";
      if (card.name.includes("Sun")) return "☀️";
      if (card.name.includes("Judgement")) return "📯";
      if (card.name.includes("World")) return "🌍";
      return "✨";
    }

    // Minor Arcana symbols based on suit
    switch (card.suit) {
      case "Wands":
        return card.name.toLowerCase().includes("ace") ? "🔥" :
          card.name.toLowerCase().includes("king") ? "👑" :
          card.name.toLowerCase().includes("queen") ? "👸" :
          card.name.toLowerCase().includes("knight") ? "🏇" :
          card.name.toLowerCase().includes("page") ? "🎭" :
          "🌟";
      case "Cups":
        return card.name.toLowerCase().includes("ace") ? "🌊" :
          card.name.toLowerCase().includes("king") ? "👑" :
          card.name.toLowerCase().includes("queen") ? "👸" :
          card.name.toLowerCase().includes("knight") ? "🏇" :
          card.name.toLowerCase().includes("page") ? "🎭" :
          "💧";
      case "Swords":
        return card.name.toLowerCase().includes("ace") ? "⚔️" :
          card.name.toLowerCase().includes("king") ? "👑" :
          card.name.toLowerCase().includes("queen") ? "👸" :
          card.name.toLowerCase().includes("knight") ? "🏇" :
          card.name.toLowerCase().includes("page") ? "🎭" :
          "🗡️";
      case "Pentacles":
        return card.name.toLowerCase().includes("ace") ? "💎" :
          card.name.toLowerCase().includes("king") ? "👑" :
          card.name.toLowerCase().includes("queen") ? "👸" :
          card.name.toLowerCase().includes("knight") ? "🏇" :
          card.name.toLowerCase().includes("page") ? "🎭" :
          "🌟";
      default:
        // Custom cards get special symbols based on their names
        if (card.name.toLowerCase().includes("element")) {
          if (card.name.includes("Air")) return "💨";
          if (card.name.includes("Earth")) return "🌱";
          if (card.name.includes("Fire")) return "🔥";
          if (card.name.includes("Water")) return "💧";
        }
        if (card.name.includes("Divine")) return "🕊️";
        if (card.name.includes("Cosmic")) return "🌌";
        if (card.name.includes("Spirit")) return "👻";
        if (card.name.includes("Sacred")) return "🔮";
        return "✨";
    }
  };

  // Get decorative elements based on the card type
  const getDecorations = () => {
    if (card.arcana === "major") {
      return "border-4 border-yellow-300/30";
    }
    return "border-2 border-white/20";
  };

  return (
    <div className={`w-full aspect-[2/3] ${getCardColor()} ${getDecorations()} rounded-lg p-4 flex flex-col items-center justify-between text-white shadow-lg`}>
      <div className="text-3xl">{getCardSymbol()}</div>
      <div className="text-center">
        <h3 className="font-bold text-lg mb-2 drop-shadow-md">{card.name}</h3>
        <div className="text-sm opacity-90 bg-black/20 px-3 py-1 rounded-full">
          {card.arcana === "major" ? "Major Arcana" : 
           card.suit ? card.suit : "Special Card"}
        </div>
      </div>
      <div className="text-3xl transform rotate-180">{getCardSymbol()}</div>
    </div>
  );
}