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
  '5': '/authentic-cards/major-arcana/05-hierophant.png',
  '6': '/authentic-cards/major-arcana/06-lovers.png',
  '7': '/authentic-cards/major-arcana/07-chariot.png',
  '8': '/authentic-cards/major-arcana/08-strength.png',
  '9': '/authentic-cards/major-arcana/09-hermit.png',
  '10': '/authentic-cards/major-arcana/10-wheel.png',
  '11': '/authentic-cards/major-arcana/11-justice.png',
  '12': '/authentic-cards/major-arcana/12-hanged-man.png',
  '13': '/authentic-cards/major-arcana/13-death.png',
  '14': '/authentic-cards/major-arcana/14-temperance.png',
  '15': '/authentic-cards/major-arcana/15-devil.png',
  '16': '/authentic-cards/major-arcana/16-tower.png',
  '17': '/authentic-cards/major-arcana/17-star.png',
  '18': '/authentic-cards/major-arcana/18-moon.png',
  '19': '/authentic-cards/major-arcana/19-sun.png',
  '20': '/authentic-cards/major-arcana/20-judgement.png',
  '21': '/authentic-cards/major-arcana/21-world.png',
  
  // Wands - Will be updated to authentic cards
  'w1': '/authentic-cards/minor-arcana/wands/ace-of-wands.png',
  'w2': '/authentic-cards/minor-arcana/wands/two-of-wands.png',
  'w3': '/authentic-cards/minor-arcana/wands/three-of-wands.png',
  'w4': '/authentic-cards/minor-arcana/wands/four-of-wands.png',
  'w5': '/authentic-cards/minor-arcana/wands/five-of-wands.png',
  'w6': '/authentic-cards/minor-arcana/wands/six-of-wands.png',
  'w7': '/authentic-cards/minor-arcana/wands/seven-of-wands.png',
  'w8': '/authentic-cards/minor-arcana/wands/eight-of-wands.png',
  'w9': '/authentic-cards/minor-arcana/wands/nine-of-wands.png',
  'w10': '/authentic-cards/minor-arcana/wands/ten-of-wands.png',
  'wp': '/authentic-cards/minor-arcana/wands/page-of-wands.png',
  'wn': '/authentic-cards/minor-arcana/wands/knight-of-wands.png',
  'wq': '/authentic-cards/minor-arcana/wands/queen-of-wands.png',
  'wk': '/authentic-cards/minor-arcana/wands/king-of-wands.png',
  
  // Cups - New authentic ethereal cards with 3D quality
  'c1': '/authentic-cards/minor-arcana/cups/ace-of-cups.png',
  'c2': '/authentic-cards/minor-arcana/cups/two-of-cups.png',
  'c3': '/authentic-cards/minor-arcana/cups/three-of-cups.png',
  'c4': '/authentic-cards/minor-arcana/cups/four-of-cups.png',
  'c5': '/authentic-cards/minor-arcana/cups/five-of-cups.png',
  'c6': '/authentic-cards/minor-arcana/cups/six-of-cups.png',
  'c7': '/authentic-cards/minor-arcana/cups/seven-of-cups.png',
  'c8': '/authentic-cards/minor-arcana/cups/eight-of-cups.png',
  'c9': '/authentic-cards/minor-arcana/cups/nine-of-cups.png',
  'c10': '/authentic-cards/minor-arcana/cups/ten-of-cups.png',
  'cp': '/authentic-cards/minor-arcana/cups/page-of-cups.png',
  'cn': '/authentic-cards/minor-arcana/cups/knight-of-cups.png',
  'cq': '/authentic-cards/minor-arcana/cups/queen-of-cups.png',
  'ck': '/authentic-cards/minor-arcana/cups/king-of-cups.png',
  
  // Swords - Will be updated to authentic cards
  's1': '/authentic-cards/minor-arcana/swords/ace-of-swords.png',
  's2': '/authentic-cards/minor-arcana/swords/two-of-swords.png',
  's3': '/authentic-cards/minor-arcana/swords/three-of-swords.png',
  's4': '/authentic-cards/minor-arcana/swords/four-of-swords.png',
  's5': '/authentic-cards/minor-arcana/swords/five-of-swords.png',
  's6': '/authentic-cards/minor-arcana/swords/six-of-swords.png',
  's7': '/authentic-cards/minor-arcana/swords/seven-of-swords.png',
  's8': '/authentic-cards/minor-arcana/swords/eight-of-swords.png',
  's9': '/authentic-cards/minor-arcana/swords/nine-of-swords.png',
  's10': '/authentic-cards/minor-arcana/swords/ten-of-swords.png',
  'sp': '/authentic-cards/minor-arcana/swords/page-of-swords.png',
  'sn': '/authentic-cards/minor-arcana/swords/knight-of-swords.png',
  'sq': '/authentic-cards/minor-arcana/swords/queen-of-swords.png',
  'sk': '/authentic-cards/minor-arcana/swords/king-of-swords.png',
  
  // Pentacles - Will be updated to authentic cards
  'p1': '/authentic-cards/minor-arcana/pentacles/ace-of-pentacles.png',
  'p2': '/authentic-cards/minor-arcana/pentacles/two-of-pentacles.png',
  'p3': '/authentic-cards/minor-arcana/pentacles/three-of-pentacles.png',
  'p4': '/authentic-cards/minor-arcana/pentacles/four-of-pentacles.png',
  'p5': '/authentic-cards/minor-arcana/pentacles/five-of-pentacles.png',
  'p6': '/authentic-cards/minor-arcana/pentacles/six-of-pentacles.png',
  'p7': '/authentic-cards/minor-arcana/pentacles/seven-of-pentacles.png',
  'p8': '/authentic-cards/minor-arcana/pentacles/eight-of-pentacles.png',
  'p9': '/authentic-cards/minor-arcana/pentacles/nine-of-pentacles.png',
  'p10': '/authentic-cards/minor-arcana/pentacles/ten-of-pentacles.png',
  'pp': '/authentic-cards/minor-arcana/pentacles/page-of-pentacles.png',
  'pn': '/authentic-cards/minor-arcana/pentacles/knight-of-pentacles.png',
  'pq': '/authentic-cards/minor-arcana/pentacles/queen-of-pentacles.png',
  'pk': '/authentic-cards/minor-arcana/pentacles/king-of-pentacles.png',
  
  // Oracle Cards - Will be updated to authentic cards
  'imported_300': '/authentic-cards/oracle/element-of-air.png',
  'imported_301': '/authentic-cards/oracle/element-of-earth.png',
  'imported_302': '/authentic-cards/oracle/element-of-water.png',
  'imported_303': '/authentic-cards/oracle/divine-guidance.png',
  'imported_304': '/authentic-cards/oracle/sacred-geometry.png',
  'imported_305': '/authentic-cards/oracle/elemental-allies.png',
  'imported_328': '/authentic-cards/oracle/lunar-phases.png',
  'imported_329': '/authentic-cards/oracle/solar-energies.png',
  'imported_332': '/authentic-cards/oracle/natures-wisdom.png',
  'imported_333': '/authentic-cards/oracle/dream-exploration.png',
  'imported_334': '/authentic-cards/oracle/astral-travel.png',
  'imported_335': '/authentic-cards/oracle/soul-contracts.png',
  'imported_336': '/authentic-cards/oracle/akashic-records.png',
  'imported_337': '/authentic-cards/oracle/spirit-guides.png',
  'imported_338': '/authentic-cards/oracle/divine-feminine.png',
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
      '5': '/authentic-cards/major-arcana/05-hierophant.png',
      '6': '/authentic-cards/major-arcana/06-lovers.png',
      '7': '/authentic-cards/major-arcana/07-chariot.png',
      '8': '/authentic-cards/major-arcana/08-strength.png',
      '9': '/authentic-cards/major-arcana/09-hermit.png',
      '10': '/authentic-cards/major-arcana/10-wheel.png',
      '11': '/authentic-cards/major-arcana/11-justice.png',
      '12': '/authentic-cards/major-arcana/12-hanged-man.png',
      '13': '/authentic-cards/major-arcana/13-death.png',
      '14': '/authentic-cards/major-arcana/14-temperance.png',
      '15': '/authentic-cards/major-arcana/15-devil.png',
      '16': '/authentic-cards/major-arcana/16-tower.png',
      '17': '/authentic-cards/major-arcana/17-star.png',
      '18': '/authentic-cards/major-arcana/18-moon.png',
      '19': '/authentic-cards/major-arcana/19-sun.png',
      '20': '/authentic-cards/major-arcana/20-judgement.png',
      '21': '/authentic-cards/major-arcana/21-world.png',
      

      
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
      
      // Minor Arcana - Cups (Complete ultra-ethereal authentic suit)
      'c1': '/authentic-cards/minor-arcana/cups/ace-of-cups.png',
      'c2': '/authentic-cards/minor-arcana/cups/two-of-cups.png',
      'c3': '/authentic-cards/minor-arcana/cups/three-of-cups.png',
      'c4': '/authentic-cards/minor-arcana/cups/four-of-cups.png',
      'c5': '/authentic-cards/minor-arcana/cups/five-of-cups.png',
      'c6': '/authentic-cards/minor-arcana/cups/six-of-cups.png',
      'c7': '/authentic-cards/minor-arcana/cups/seven-of-cups.png',
      'c8': '/authentic-cards/minor-arcana/cups/eight-of-cups.png',
      'c9': '/authentic-cards/minor-arcana/cups/nine-of-cups.png',
      'c10': '/authentic-cards/minor-arcana/cups/ten-of-cups.png',
      'cp': '/authentic-cards/minor-arcana/cups/page-of-cups.png',
      'cn': '/authentic-cards/minor-arcana/cups/knight-of-cups.png',
      'cq': '/authentic-cards/minor-arcana/cups/queen-of-cups.png',
      'ck': '/authentic-cards/minor-arcana/cups/king-of-cups.png',
      
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
    
    // Direct paths for your authentic Major Arcana cards 0-4
    // Try fresh versions first, fallback to original authentic versions
    const directPaths: Record<string, string> = {
      '0': '/authentic-cards/major-arcana/00-fool-fresh.png',
      '1': '/authentic-cards/major-arcana/01-magician-fresh.png',
      '2': '/authentic-cards/major-arcana/02-high-priestess-fresh.png', 
      '3': '/authentic-cards/major-arcana/03-empress-fresh.png',
      '4': '/authentic-cards/major-arcana/04-emperor-fresh.png'
    };
    
    // Complete authentic tarot deck being generated with traditional filenames
    const fallbackPaths: Record<string, string> = {
      '0': '/authentic-cards/major-arcana/00-fool.png',
      '1': '/authentic-cards/major-arcana/01-magician.png',
      '2': '/authentic-cards/major-arcana/02-high-priestess.png', 
      '3': '/authentic-cards/major-arcana/03-empress.png',
      '4': '/authentic-cards/major-arcana/04-emperor.png',
      '5': '/authentic-cards/major-arcana/05-hierophant.png',
      '6': '/authentic-cards/major-arcana/06-lovers.png',
      '7': '/authentic-cards/major-arcana/07-chariot.png',
      '8': '/authentic-cards/major-arcana/08-strength.png',
      '9': '/authentic-cards/major-arcana/09-hermit.png',
      '10': '/authentic-cards/major-arcana/10-wheel.png',
      '11': '/authentic-cards/major-arcana/11-justice.png',
      '12': '/authentic-cards/major-arcana/12-hanged-man.png',
      '13': '/authentic-cards/major-arcana/13-death.png',
      '14': '/authentic-cards/major-arcana/14-temperance.png',
      '15': '/authentic-cards/major-arcana/15-devil.png',
      '16': '/authentic-cards/major-arcana/16-tower.png',
      '17': '/authentic-cards/major-arcana/17-star.png',
      '18': '/authentic-cards/major-arcana/18-moon.png',
      '19': '/authentic-cards/major-arcana/19-sun.png',
      '20': '/authentic-cards/major-arcana/20-judgement.png',
      '21': '/authentic-cards/major-arcana/21-world.png'
    };
    
    // Use authentic cards for 0-4 (your existing working cards)
    if (fallbackPaths[card.id]) {
      return fallbackPaths[card.id];
    }
    
    const imagePath = allCardPaths[card.id];
    
    // For missing cards, return null so symbolic display is used
    if (!imagePath || imagePath.includes('/assets/cards/')) {
      return null;
    }
    
    return imagePath;
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
            src={`${imagePath}?refresh=${Math.random()}&t=${Date.now()}`}
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