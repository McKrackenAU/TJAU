import { useState } from "react";
import { TarotCard } from "@shared/tarot-data";
import { SparklesIcon } from "lucide-react";

interface CardImageProps {
  card: TarotCard;
  isRevealed: boolean;
}

// Master card image mappings - authentic artwork
const cardImagePaths: Record<string, string> = {
  // Major Arcana - Using authentic cards from your collection
  '0': '/authentic-cards/major-arcana/00-fool.png',
  '1': '/authentic-cards/major-arcana/01-magician.png', 
  '2': '/authentic-cards/major-arcana/02-high-priestess.png',
  '3': '/authentic-cards/major-arcana/03-empress.png',
  '4': '/authentic-cards/major-arcana/04-emperor.png',
  '5': '/assets/cards/5.png',
  '6': '/assets/cards/6.png',
  '7': '/assets/cards/7.png',
  '8': '/assets/cards/8.png',
  '9': '/assets/cards/9.png',
  '10': '/assets/cards/10.png',
  '11': '/assets/cards/11.png',
  '12': '/assets/cards/12.png',
  '13': '/assets/cards/13.png',
  '14': '/assets/cards/14.png',
  '15': '/assets/cards/15.png',
  '16': '/assets/cards/16.png',
  '17': '/assets/cards/17.png',
  '18': '/assets/cards/18.png',
  '19': '/assets/cards/19.png',
  '20': '/assets/cards/20.png',
  '21': '/assets/cards/21.png',
  
  // Wands
  'w1': '/assets/cards/ace-of-wands.png',
  'w2': '/assets/cards/two-of-wands.png',
  'w3': '/assets/cards/three-of-wands.png',
  'w4': '/assets/cards/four-of-wands.png',
  'w5': '/assets/cards/five-of-wands.png',
  'w6': '/assets/cards/six-of-wands.png',
  'w7': '/assets/cards/seven-of-wands.png',
  'w8': '/assets/cards/eight-of-wands.png',
  'w9': '/assets/cards/nine-of-wands.png',
  'w10': '/assets/cards/ten-of-wands.png',
  'wp': '/assets/cards/page-of-wands.png',
  'wn': '/assets/cards/knight-of-wands.png',
  'wq': '/assets/cards/queen-of-wands.png',
  'wk': '/assets/cards/king-of-wands.png',
  
  // Cups
  'c1': '/assets/cards/ace-of-cups.png',
  'c2': '/assets/cards/two-of-cups.png',
  'c3': '/assets/cards/three-of-cups.png',
  'c4': '/assets/cards/four-of-cups.png',
  'c5': '/assets/cards/five-of-cups.png',
  'c6': '/assets/cards/six-of-cups.png',
  'c7': '/assets/cards/seven-of-cups.png',
  'c8': '/assets/cards/eight-of-cups.png',
  'c9': '/assets/cards/nine-of-cups.png',
  'c10': '/assets/cards/ten-of-cups.png',
  'cp': '/assets/cards/page-of-cups.png',
  'cn': '/assets/cards/knight-of-cups.png',
  'cq': '/assets/cards/queen-of-cups.png',
  'ck': '/assets/cards/king-of-cups.png',
  
  // Swords
  's1': '/assets/cards/ace-of-swords.png',
  's2': '/assets/cards/two-of-swords.png',
  's3': '/assets/cards/three-of-swords.png',
  's4': '/assets/cards/four-of-swords.png',
  's5': '/assets/cards/five-of-swords.png',
  's6': '/assets/cards/six-of-swords.png',
  's7': '/assets/cards/seven-of-swords.png',
  's8': '/assets/cards/eight-of-swords.png',
  's9': '/assets/cards/nine-of-swords.png',
  's10': '/assets/cards/ten-of-swords.png',
  'sp': '/assets/cards/page-of-swords.png',
  'sn': '/assets/cards/knight-of-swords.png',
  'sq': '/assets/cards/queen-of-swords.png',
  'sk': '/assets/cards/king-of-swords.png',
  
  // Pentacles
  'p1': '/assets/cards/ace-of-pentacles.png',
  'p2': '/assets/cards/two-of-pentacles.png',
  'p3': '/assets/cards/three-of-pentacles.png',
  'p4': '/assets/cards/four-of-pentacles.png',
  'p5': '/assets/cards/five-of-pentacles.png',
  'p6': '/assets/cards/six-of-pentacles.png',
  'p7': '/assets/cards/seven-of-pentacles.png',
  'p8': '/assets/cards/eight-of-pentacles.png',
  'p9': '/assets/cards/nine-of-pentacles.png',
  'p10': '/assets/cards/ten-of-pentacles.png',
  'pp': '/assets/cards/page-of-pentacles.png',
  'pn': '/assets/cards/knight-of-pentacles.png',
  'pq': '/assets/cards/queen-of-pentacles.png',
  'pk': '/assets/cards/king-of-pentacles.png',
  
  // Oracle Cards - using our consolidated images
  'imported_300': '/assets/cards/element-of-air.png',
  'imported_301': '/assets/cards/element-of-earth.png',
  'imported_302': '/assets/cards/element-of-water.png',
  'imported_303': '/assets/cards/divine-guidance.png',
  'imported_304': '/assets/cards/sacred-geometry.png',
  'imported_305': '/assets/cards/elemental-allies.png',
  'imported_328': '/assets/cards/lunar-phases.png',
  'imported_329': '/assets/cards/solar-energies.png',
  'imported_332': '/assets/cards/natures-wisdom.png',
  'imported_333': '/assets/cards/dream-exploration.png',
  'imported_334': '/assets/cards/astral-travel.png',
  'imported_335': '/assets/cards/soul-contracts.png',
  'imported_336': '/assets/cards/akashic-records.png',
  'imported_337': '/assets/cards/spirit-guides.png',
  'imported_338': '/assets/cards/divine-feminine.png',
  'imported_339': '/assets/cards/divine-masculine.png',
  'imported_340': '/assets/cards/universal-love.png',
  'imported_341': '/assets/cards/synchronicity.png',
  'imported_342': '/assets/cards/sacred-rituals.png',
  'imported_343': '/assets/cards/inner-alchemy.png',
  'imported_344': '/assets/cards/soulmates-twin-flames.png',
  'imported_345': '/assets/cards/ascended-masters.png',
  'imported_346': '/assets/cards/divine-timing.png',
  'imported_347': '/assets/cards/inner-healing.png',
  'imported_348': '/assets/cards/ancestral-wisdom.png',
  'imported_349': '/assets/cards/soulful-expression.png',
  'imported_350': '/assets/cards/divine-protection.png',
  'imported_351': '/assets/cards/gratitude-abundance.png',
  'imported_352': '/assets/cards/inner-child-healing.png',
  'imported_353': '/assets/cards/soulful-relationships.png',
  'imported_354': '/assets/cards/meditation-mindfulness.png',
  'imported_355': '/assets/cards/cosmic-balance.png',
  'imported_356': '/assets/cards/infinite-possibilities.png'
};

export default function CardImage({ card, isRevealed }: CardImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageKey, setImageKey] = useState(0); // Force re-render key
  
  // Complete card path mapping
  const getImagePath = () => {
    // Ensure card and card.id exist
    if (!card || !card.id) {
      console.log('⚠️ Invalid card or missing ID');
      return null;
    }
    
    // All card paths in one place
    const allCardPaths: Record<string, string> = {
      // Major Arcana - use your authentic cards
      '0': '/authentic-cards/major-arcana/00-fool.png',
      '1': '/authentic-cards/major-arcana/01-magician.png',
      '2': '/authentic-cards/major-arcana/02-high-priestess.png',
      '3': '/authentic-cards/major-arcana/03-empress.png',
      '4': '/authentic-cards/major-arcana/04-emperor.png',
      '5': '/assets/cards/5.png',
      '6': '/assets/cards/6.png',
      '7': '/assets/cards/7.png',
      '8': '/assets/cards/8.png',
      '9': '/assets/cards/9.png',
      '10': '/assets/cards/10.png',
      '11': '/assets/cards/11.png',
      '12': '/assets/cards/12.png',
      '13': '/assets/cards/13.png',
      '14': '/assets/cards/14.png',
      '15': '/assets/cards/15.png',
      '16': '/assets/cards/16.png',
      '17': '/assets/cards/17.png',
      '18': '/assets/cards/18.png',
      '19': '/assets/cards/19.png',
      '20': '/assets/cards/20.png',
      '21': '/assets/cards/21.png',
      
      // Minor Arcana - Wands
      'w1': '/assets/cards/ace-of-wands.png',
      'w2': '/assets/cards/two-of-wands.png',
      'w3': '/assets/cards/three-of-wands.png',
      'w4': '/assets/cards/four-of-wands.png',
      'w5': '/assets/cards/five-of-wands.png',
      'w6': '/assets/cards/six-of-wands.png',
      'w7': '/assets/cards/seven-of-wands.png',
      'w8': '/assets/cards/eight-of-wands.png',
      'w9': '/assets/cards/nine-of-wands.png',
      'w10': '/assets/cards/ten-of-wands.png',
      'wp': '/assets/cards/page-of-wands.png',
      'wn': '/assets/cards/knight-of-wands.png',
      'wq': '/assets/cards/queen-of-wands.png',
      'wk': '/assets/cards/king-of-wands.png',
      
      // Minor Arcana - Cups
      'c1': '/assets/cards/ace-of-cups.png',
      'c2': '/assets/cards/two-of-cups.png',
      'c3': '/assets/cards/three-of-cups.png',
      'c4': '/assets/cards/four-of-cups.png',
      'c5': '/assets/cards/five-of-cups.png',
      'c6': '/assets/cards/six-of-cups.png',
      'c7': '/assets/cards/seven-of-cups.png',
      'c8': '/assets/cards/eight-of-cups.png',
      'c9': '/assets/cards/nine-of-cups.png',
      'c10': '/assets/cards/ten-of-cups.png',
      'cp': '/assets/cards/page-of-cups.png',
      'cn': '/assets/cards/knight-of-cups.png',
      'cq': '/assets/cards/queen-of-cups.png',
      'ck': '/assets/cards/king-of-cups.png',
      
      // Minor Arcana - Swords
      's1': '/assets/cards/ace-of-swords.png',
      's2': '/assets/cards/two-of-swords.png',
      's3': '/assets/cards/three-of-swords.png',
      's4': '/assets/cards/four-of-swords.png',
      's5': '/assets/cards/five-of-swords.png',
      's6': '/assets/cards/six-of-swords.png',
      's7': '/assets/cards/seven-of-swords.png',
      's8': '/assets/cards/eight-of-swords.png',
      's9': '/assets/cards/nine-of-swords.png',
      's10': '/assets/cards/ten-of-swords.png',
      'sp': '/assets/cards/page-of-swords.png',
      'sn': '/assets/cards/knight-of-swords.png',
      'sq': '/assets/cards/queen-of-swords.png',
      'sk': '/assets/cards/king-of-swords.png',
      
      // Minor Arcana - Pentacles
      'p1': '/assets/cards/ace-of-pentacles.png',
      'p2': '/assets/cards/two-of-pentacles.png',
      'p3': '/assets/cards/three-of-pentacles.png',
      'p4': '/assets/cards/four-of-pentacles.png',
      'p5': '/assets/cards/five-of-pentacles.png',
      'p6': '/assets/cards/six-of-pentacles.png',
      'p7': '/assets/cards/seven-of-pentacles.png',
      'p8': '/assets/cards/eight-of-pentacles.png',
      'p9': '/assets/cards/nine-of-pentacles.png',
      'p10': '/assets/cards/ten-of-pentacles.png',
      'pp': '/assets/cards/page-of-pentacles.png',
      'pn': '/assets/cards/knight-of-pentacles.png',
      'pq': '/assets/cards/queen-of-pentacles.png',
      'pk': '/assets/cards/king-of-pentacles.png'
    };
    
    return allCardPaths[card.id] || null;
  };

  // Card background gradient
  const getCardBackground = () => {
    const baseClasses = "w-full h-full rounded-xl relative overflow-hidden border-2";

    if (card.arcana === "major") {
      return `${baseClasses} bg-gradient-to-br from-pink-400 via-purple-600 to-indigo-800 border-pink-300/50`;
    }
    
    // Minor arcana suit colors
    if (card.suit && typeof card.suit === 'string') {
      switch (card.suit.toLowerCase()) {
        case "wands":
          return `${baseClasses} bg-gradient-to-br from-red-400 via-orange-500 to-yellow-600 border-orange-300/50`;
        case "cups":
          return `${baseClasses} bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600 border-blue-300/50`;
        case "swords":
          return `${baseClasses} bg-gradient-to-br from-gray-400 via-slate-500 to-zinc-600 border-gray-300/50`;
        case "pentacles":
          return `${baseClasses} bg-gradient-to-br from-green-400 via-emerald-500 to-forest-600 border-green-300/50`;
        default:
          return `${baseClasses} bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-600 border-purple-300/50`;
      }
    }
    
    // Custom/Oracle cards
    return `${baseClasses} bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-600 border-amber-300/50`;
  };

  // Get symbolic representation based on card type
  const getCardSymbol = () => {
    // Major arcana symbols
    const majorSymbols: { [key: string]: string } = {
      "The Fool": "🃏",
      "The Magician": "🎩",
      "The High Priestess": "🌙",
      "The Empress": "👑",
      "The Emperor": "⚡",
      "The Hierophant": "🔑",
      "The Lovers": "💕",
      "The Chariot": "🏇",
      "Strength": "🦁",
      "The Hermit": "🕯️",
      "Wheel of Fortune": "🎡",
      "Justice": "⚖️",
      "The Hanged Man": "🙃",
      "Death": "🦴",
      "Temperance": "⚗️",
      "The Devil": "😈",
      "The Tower": "🗼",
      "The Star": "⭐",
      "The Moon": "🌙",
      "The Sun": "☀️",
      "Judgement": "📯",
      "The World": "🌍"
    };

    // Suit symbols
    const suitSymbols: { [key: string]: string } = {
      "wands": "🔥",
      "cups": "🏆",
      "swords": "⚔️",
      "pentacles": "💰"
    };

    if (card.arcana === "major" && card.name in majorSymbols) {
      return majorSymbols[card.name];
    } else if (card.suit && card.suit.toLowerCase() in suitSymbols) {
      return suitSymbols[card.suit.toLowerCase()];
    }
    
    return "✧"; // Default fallback
  };

  const imagePath = getImagePath();
  const hasStaticImage = imagePath !== null;

  if (!isRevealed) {
    // Card back
    return (
      <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 border-2 border-purple-300/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/card-back.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-indigo-900/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <SparklesIcon className="w-8 h-8 text-white/70" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={getCardBackground()}>
      {imagePath ? (
        <>
          <img
            key={`authentic-${card.id}-${Date.now()}-${Math.random()}`}
            src={imagePath}
            alt={card.name}
            className="w-full h-full object-cover rounded-xl"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            onLoad={() => {
              console.log(`✅ Image loaded successfully: ${imagePath} for card ${card.name}`);
              setImageError(false);
            }}
            onError={(e) => {
              console.log(`🚨 Image failed to load: ${imagePath} for card ${card.name}`);
              // Don't set error state for authentic Major Arcana cards (0-4) - keep trying to load
              if (!(card.arcana === 'major' && ['0', '1', '2', '3', '4'].includes(card.id))) {
                setImageError(true);
              }
            }}
          />
          <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs p-1 rounded backdrop-blur-sm">
            {card.name}
          </div>
        </>
      ) : imageError ? (
        // Symbolic representation for cards without images or on error (but not for authentic Major Arcana 0-4)
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="text-4xl mb-2 opacity-90">
            {getCardSymbol()}
          </div>
          <div className="text-center text-sm font-medium px-2 leading-tight">
            {card.name}
          </div>
          <div className="text-xs opacity-70 mt-1 capitalize">
            {card.arcana} {card.suit && `of ${card.suit}`}
          </div>
        </div>
      ) : (
        // Loading state for authentic Major Arcana cards
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="text-2xl mb-2 opacity-50">✨</div>
          <div className="text-center text-sm font-medium px-2 leading-tight">
            {card.name}
          </div>
          <div className="text-xs opacity-50 mt-1">Loading authentic artwork...</div>
        </div>
      )}
    </div>
  );
}