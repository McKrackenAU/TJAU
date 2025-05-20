import { useState, useEffect } from "react";
import { TarotCard } from "@shared/tarot-data";
import { Loader2, SparklesIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CardImageProps {
  card: TarotCard;
  isRevealed: boolean;
}

export default function CardImage({ card, isRevealed }: CardImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const { toast } = useToast();
  
  // Card background gradient
  const getCardBackground = () => {
    const baseClasses = "w-full h-full rounded-xl relative overflow-hidden border-2";

    if (card.arcana === "major") {
      return `${baseClasses} bg-gradient-to-br from-pink-400 via-purple-600 to-indigo-800 border-pink-300/50`;
    }

    switch (card.suit?.toLowerCase()) {
      case "wands":
        return `${baseClasses} bg-gradient-to-br from-pink-500 via-rose-600 to-purple-700 border-pink-300/50`;
      case "cups":
        return `${baseClasses} bg-gradient-to-br from-indigo-400 via-purple-600 to-fuchsia-800 border-indigo-300/50`;
      case "swords":
        return `${baseClasses} bg-gradient-to-br from-purple-400 via-indigo-600 to-violet-800 border-purple-300/50`;
      case "pentacles":
        return `${baseClasses} bg-gradient-to-br from-fuchsia-500 via-purple-600 to-pink-800 border-fuchsia-300/50`;
      default:
        return `${baseClasses} bg-gradient-to-br from-pink-400 via-purple-600 to-fuchsia-800 border-pink-300/50`;
    }
  };

  // Card symbol with proper type handling
  const getCardSymbol = () => {
    const majorSymbols: Record<string, string> = {
      "The Fool": "✧",
      "The Magician": "∞",
      "The High Priestess": "☽",
      "The Empress": "♀",
      "The Emperor": "♂",
      "The Hierophant": "⋆",
      "The Lovers": "♡",
      "The Chariot": "⚜",
      "Strength": "∞",
      "The Hermit": "✦",
      "Wheel of Fortune": "⊛",
      "Justice": "⚖",
      "The Hanged Man": "⋈",
      "Death": "♱",
      "Temperance": "⟳",
      "The Devil": "⛧",
      "The Tower": "⚡",
      "The Star": "★",
      "The Moon": "☾",
      "The Sun": "☀",
      "Judgement": "⚶",
      "The World": "◯"
    };

    const suitSymbols: Record<string, string> = {
      "wands": "🔥",
      "cups": "💧",
      "swords": "💨",
      "pentacles": "⭐"
    };

    if (card.arcana === "major" && card.name in majorSymbols) {
      return majorSymbols[card.name];
    } else if (card.suit && card.suit.toLowerCase() in suitSymbols) {
      return suitSymbols[card.suit.toLowerCase()];
    }
    
    return "✧"; // Default fallback
  };

  // Load card image from cache directory
  useEffect(() => {
    if (!isRevealed) return;
    
    // Use the cache path directly
    const cachePath = `/cache/images/image_${card.id}.png`;
    
    setIsLoading(true);
    
    // Test if the image is available in the cache
    fetch(cachePath, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          setImageUrl(cachePath);
          setLoadFailed(false);
        } else {
          throw new Error('Image not available in cache');
        }
      })
      .catch(() => {
        // Fall back to API request if cache fails
        fetch(`/api/cards/${card.id}/image`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch image from API');
            }
            return response.json();
          })
          .then(data => {
            if (data && data.imageUrl) {
              setImageUrl(data.imageUrl);
              setLoadFailed(false);
            } else {
              setLoadFailed(true);
            }
          })
          .catch(() => {
            console.log(`Failed to load image for card: ${card.id}`);
            setLoadFailed(true);
          });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [card.id, isRevealed]);

  return (
    <div className={getCardBackground()}>
      {/* Card image */}
      {imageUrl && isRevealed && (
        <img 
          src={imageUrl} 
          alt={card.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setLoadFailed(true)}
        />
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      )}
      
      {/* Fallback display */}
      {(loadFailed || !imageUrl || !isRevealed) && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-white bg-purple-800/40 p-4 rounded-lg backdrop-blur-sm flex flex-col items-center">
            <div className="text-5xl mb-2">{getCardSymbol()}</div>
            <span className="text-sm font-medium">{card.name}</span>
          </div>
        </div>
      )}
      
      {/* Card info */}
      <div className="absolute inset-x-0 bottom-0 p-4 text-center bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-lg font-bold text-white mb-1">{card.name}</h3>
        <p className="text-sm text-white/90">
          {card.arcana === "major" ? "Major Arcana" : card.suit}
        </p>
      </div>
    </div>
  );
}