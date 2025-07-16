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
  
  // Wands - Using authentic cards from existing collection
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
  
  // Cups - Authentic ethereal cards from collection
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
  
  // Swords - Using authentic cards from collection
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
  
  // Pentacles - Using authentic cards from collection
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
  
  // Custom/Oracle Cards from Oracle of Illusion deck
  'imported_300': '/authentic-cards/oracle/element-of-air.png',
  'imported_301': '/authentic-cards/oracle/element-of-earth.png',
  'imported_302': '/authentic-cards/oracle/element-of-water.png',
  'imported_303': '/authentic-cards/oracle/divine-guidance.png',
  'imported_304': '/authentic-cards/oracle/sacred-geometry.png',
  'imported_305': '/authentic-cards/oracle/elemental-allies.png',
  'imported_328': '/authentic-cards/oracle/lunar-phases.png',
  'imported_329': '/authentic-cards/oracle/solar-energies.png',
  'imported_330': '/authentic-cards/oracle/chakra-activation.png',
  'imported_331': '/authentic-cards/oracle/crystals-gemstones.png',
  'imported_332': '/authentic-cards/oracle/natures-wisdom.png',
  'imported_333': '/authentic-cards/oracle/dream-exploration.png',
  'imported_334': '/authentic-cards/oracle/astral-travel.png',
  'imported_335': '/authentic-cards/oracle/soul-contracts.png',
  'imported_336': '/authentic-cards/oracle/akashic-records.png',
  'imported_337': '/authentic-cards/oracle/spirit-guides.png',
  'imported_338': '/authentic-cards/oracle/divine-feminine.png',
  'imported_339': '/authentic-cards/oracle/divine-masculine.png',
  'imported_340': '/authentic-cards/oracle/universal-love.png',
  'imported_341': '/authentic-cards/oracle/synchronicity.png',
  'imported_342': '/authentic-cards/oracle/sacred-rituals.png',
  'imported_343': '/authentic-cards/oracle/inner-alchemy.png',
  'imported_344': '/authentic-cards/oracle/soulmates-twin-flames.png',
  'imported_345': '/authentic-cards/oracle/ascended-masters.png',
  'imported_346': '/authentic-cards/oracle/divine-timing.png',
  'imported_347': '/authentic-cards/oracle/inner-healing.png',
  'imported_348': '/authentic-cards/oracle/ancestral-wisdom.png',
  'imported_349': '/authentic-cards/oracle/soulful-expression.png',
  'imported_350': '/authentic-cards/oracle/divine-protection.png',
  'imported_351': '/authentic-cards/oracle/gratitude-abundance.png',
  'imported_352': '/authentic-cards/oracle/inner-child-healing.png',
  'imported_353': '/authentic-cards/oracle/infinite-possibilities.png',
  'imported_354': '/authentic-cards/oracle/cosmic-balance.png',
  'imported_355': '/authentic-cards/oracle/soulful-relationships.png',
  'imported_356': '/authentic-cards/oracle/cosmic-connections.png',
  'imported_357': '/authentic-cards/oracle/divine-purpose.png',
  'imported_358': '/authentic-cards/oracle/energy-clearing.png',
  'imported_359': '/authentic-cards/oracle/element-of-fire.png',
  'imported_360': '/authentic-cards/oracle/meditation-mindfulness.png',
  'imported_361': '/authentic-cards/oracle/spiritual-awakening.png',
};

export default function CardImage({ card, isRevealed }: CardImageProps) {
  const [imageError, setImageError] = useState(false);
  
  // Early validation to prevent errors
  if (!card || !card.arcana || !card.id || !card.name) {
    console.warn("⚠️ Invalid card data:", card);
    return <div className="w-full h-full bg-red-500/20 rounded-xl flex items-center justify-center text-red-400 text-xs">Invalid Card Data</div>;
  }
  
  // Get the actual image path for this specific card
  const imagePath = cardImagePaths[card.id];
  
  console.log(`🔍 CARD IMAGE: ${card.name} (ID: ${card.id}) -> ${imagePath || 'NO PATH'}`);
  console.log(`🔍 Card revealed status: ${isRevealed} | Arcana: ${card.arcana}`);
  console.log(`🔍 Available paths for debugging:`, Object.keys(cardImagePaths).slice(0, 15));
  
  if (!imagePath) {
    console.log(`⚠️ No image path found for card ${card.name} (ID: ${card.id})`);
    console.log('All available card IDs:', Object.keys(cardImagePaths));
  } else {
    console.log(`✅ Found image path for card ${card.name}: ${imagePath}`);
  }

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
          return `${baseClasses} bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 border-green-300/50`;
        default:
          return `${baseClasses} bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-600 border-purple-300/50`;
      }
    }
    
    // Custom/Oracle cards - mystical purple theme  
    return `${baseClasses} bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 border-violet-300/50`;
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
    } else if (card.arcana === "custom") {
      return "🔮"; // Crystal ball for oracle cards
    }
    
    return "✧"; // Default fallback
  };

  if (!isRevealed) {
    // Card back
    return (
      <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 border-2 border-purple-300/30 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: 'url(/oracle-of-illusion.png)' }}
        />
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
            key={`card-${card.id}-${card.name.replace(/\s+/g, '-')}-${Date.now()}`}
            src={`${imagePath}?v=${card.id}&t=${Date.now()}`}
            alt={card.name}
            className="w-full h-full object-cover rounded-xl"
            onLoad={() => {
              console.log(`✅ Image loaded successfully: ${imagePath} for card ${card.name} (ID: ${card.id})`);
              setImageError(false);
            }}
            onError={(e) => {
              console.log(`🚨 Image failed to load: ${imagePath} for card ${card.name} (ID: ${card.id})`);
              console.log(`🚨 Error details:`, e);
              console.log(`🚨 Testing direct access to: http://localhost:5000${imagePath}`);
              setImageError(true);
            }}
          />
          <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs p-1 rounded backdrop-blur-sm">
            {card.name}
          </div>
        </>
      ) : (
        // Symbolic representation for cards without images
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
      )}
    </div>
  );
}