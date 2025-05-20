import { useState, useEffect } from "react";
import { TarotCard } from "@shared/tarot-data";
import { Loader2, SparklesIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CardImageProps {
  card: TarotCard;
  isRevealed: boolean;
}

// Rate limit notification key
const RATE_LIMIT_TOAST_KEY = 'oracle_illusion_rate_limit_notified';

// Global rate limit flag
let globalRateLimitDetected = false;
if (typeof window !== 'undefined') {
  globalRateLimitDetected = sessionStorage.getItem(RATE_LIMIT_TOAST_KEY) === 'true';
}

export default function CardImage({ card, isRevealed }: CardImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(globalRateLimitDetected);
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

  // Card symbol
  const getCardSymbol = () => {
    const majorSymbols = {
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

    const suitSymbols = {
      "wands": "🔥",
      "cups": "💧",
      "swords": "💨",
      "pentacles": "⭐"
    };

    if (card.arcana === "major" && majorSymbols[card.name]) {
      return majorSymbols[card.name];
    } else if (card.suit && suitSymbols[card.suit.toLowerCase()]) {
      return suitSymbols[card.suit.toLowerCase()];
    }
    
    return "✧"; // Default fallback
  };

  // Load card image
  useEffect(() => {
    if (!isRevealed) return;
    if (imageUrl) return;
    if (loadFailed && isRateLimited) return;
    
    if (globalRateLimitDetected) {
      setIsRateLimited(true);
      setLoadFailed(true);
      return;
    }
    
    setIsLoading(true);
    
    // Try the dedicated path first (where we copied the images)
    const directPath = `/images/tarot/image_${card.id}.png`;
    
    // Create a test image
    const testImage = new Image();
    testImage.onload = () => {
      console.log(`Successfully loaded image from: ${directPath}`);
      setImageUrl(directPath);
      setLoadFailed(false);
      setIsLoading(false);
    };
    
    testImage.onerror = () => {
      console.log(`Failed to load from direct path for ${card.id}, trying cache path`);
      
      // Try cache path next
      const cachePath = `/cache/images/image_${card.id}.png`;
      const cacheImage = new Image();
      
      cacheImage.onload = () => {
        console.log(`Successfully loaded image from cache: ${cachePath}`);
        setImageUrl(cachePath);
        setLoadFailed(false);
        setIsLoading(false);
      };
      
      cacheImage.onerror = () => {
        console.log(`Failed to load from cache for ${card.id}, trying API`);
        
        // If both direct approaches fail, try the API
        fetch(`/api/cards/${card.id}/image`)
          .then(response => {
            if (!response.ok) {
              if (response.status === 429) {
                setIsRateLimited(true);
                globalRateLimitDetected = true;
                
                if (typeof window !== 'undefined' && !sessionStorage.getItem(RATE_LIMIT_TOAST_KEY)) {
                  sessionStorage.setItem(RATE_LIMIT_TOAST_KEY, 'true');
                  toast({
                    title: "Image Generation Limit Reached",
                    description: "Using themed backgrounds instead.",
                    variant: "default",
                    duration: 10000
                  });
                }
                
                throw new Error('Rate limit reached');
              }
              throw new Error('Failed to fetch image');
            }
            return response.json();
          })
          .then(data => {
            if (data && data.imageUrl) {
              console.log(`Got image URL from API: ${data.imageUrl}`);
              setImageUrl(data.imageUrl);
              setLoadFailed(false);
            } else {
              setLoadFailed(true);
            }
          })
          .catch(error => {
            console.error("Error fetching from API:", error);
            setLoadFailed(true);
          })
          .finally(() => {
            setIsLoading(false);
          });
      };
      
      // Start loading from cache path
      cacheImage.src = cachePath;
    };
    
    // Start by trying the direct path
    testImage.src = directPath;
  }, [card.id, isRevealed, imageUrl, loadFailed, isRateLimited, toast]);

  return (
    <div className={getCardBackground()}>
      {/* Card image */}
      {imageUrl && (
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
      {(loadFailed || !imageUrl) && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-white bg-purple-800/40 p-4 rounded-lg backdrop-blur-sm flex flex-col items-center">
            <div className="text-5xl mb-2">{getCardSymbol()}</div>
            <span className="text-sm font-medium">{card.name}</span>
            {isRateLimited && (
              <div className="mt-2 flex items-center text-xs">
                <SparklesIcon className="w-3 h-3 mr-1 text-pink-300" />
                <span>Oracle of Illusion theme</span>
              </div>
            )}
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