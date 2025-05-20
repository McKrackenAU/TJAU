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
    
    const cardId = card.id;
    const cardName = card.name;
    
    // Try different possible cache paths
    const cachePaths = [
      `/cache/images/image_${cardId}.png`,  // Primary cache path
      `/images/tarot/image_${cardId}.png`,  // Backup cache path
      `/cache/images/image_${cardId.toLowerCase()}.png`, // Lowercase variation
      `/images/tarot/image_${cardId.toLowerCase()}.png`  // Lowercase backup
    ];
    
    setIsLoading(true);
    
    // Function to check if an image exists
    const checkImageExists = (url: string): Promise<boolean> => {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    };
    
    // Function to try generate image via API
    const generateImageViaApi = async () => {
      console.log(`Attempting to generate image via API for ${cardName} (${cardId})`);
      
      try {
        const response = await fetch(`/api/cards/${cardId}/image`, {
          credentials: 'include', // Include cookies for authentication
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          // Handle rate limiting
          if (response.status === 429) {
            console.log(`Rate limited for ${cardId}`);
            // Try again in 5 seconds (once) for rate limited requests
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // One retry attempt for rate limited requests
            const retryResponse = await fetch(`/api/cards/${cardId}/image`, {
              credentials: 'include'
            });
            
            if (!retryResponse.ok) {
              throw new Error(`Failed on retry: ${retryResponse.status}`);
            }
            
            const data = await retryResponse.json();
            if (data && data.imageUrl) {
              console.log(`Successfully generated image on retry for ${cardId}: ${data.imageUrl}`);
              setImageUrl(data.imageUrl);
              setLoadFailed(false);
              return true;
            }
          }
          
          // Auth-related failures or other errors
          console.error(`Error generating image. Status: ${response.status}`);
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        if (data && data.imageUrl) {
          console.log(`Successfully generated image for ${cardName} (${cardId}): ${data.imageUrl}`);
          setImageUrl(data.imageUrl);
          setLoadFailed(false);
          return true;
        } else {
          throw new Error('No image URL in response');
        }
      } catch (error) {
        console.error(`Error generating image for ${cardId}:`, error);
        setLoadFailed(true);
        return false;
      }
    };
    
    // Try each cache path in sequence
    async function tryAllPaths() {
      // First try all cache paths
      for (const path of cachePaths) {
        const exists = await checkImageExists(path);
        if (exists) {
          console.log(`Found image at path: ${path}`);
          setImageUrl(path);
          setLoadFailed(false);
          return true;
        }
      }
      
      // If no cache paths work, try API generation for imported cards
      if (cardId.startsWith('imported_')) {
        return await generateImageViaApi();
      } else if (!cardId.startsWith('imported_') && cardId !== '0' && cardId !== '1') {
        // For standard tarot cards (except Fool and Magician which already work),
        // also try API generation as a fallback
        return await generateImageViaApi();
      }
      
      // If all attempts fail
      setLoadFailed(true);
      return false;
    }
    
    tryAllPaths().finally(() => {
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