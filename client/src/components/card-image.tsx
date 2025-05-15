import { useState, useEffect } from "react";
import { TarotCard } from "@shared/tarot-data";
import { Loader2, ImageIcon, SparklesIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CardImageProps {
  card: TarotCard;
  isRevealed: boolean;
}

// This session storage key is used to avoid showing rate limit toasts multiple times
const RATE_LIMIT_TOAST_KEY = 'oracle_illusion_rate_limit_notified';

// Check if we're in a rate limited state globally
let globalRateLimitDetected = false;
// Session storage isn't available during server-side rendering
if (typeof window !== 'undefined') {
  globalRateLimitDetected = sessionStorage.getItem(RATE_LIMIT_TOAST_KEY) === 'true';
}

export default function CardImage({ card, isRevealed }: CardImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(globalRateLimitDetected);
  const { toast } = useToast();
  
  // Enhanced background colors that match the Oracle of Illusion color scheme
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

  // Get a unique, mystical symbol for each card to use in fallback display
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

    if (card.arcana === "major") {
      return majorSymbols[card.name] || "✧";
    } else if (card.suit) {
      return suitSymbols[card.suit.toLowerCase()] || "✧";
    }
    
    return "✧"; // Default fallback
  };

  // Load the card image
  // Reduced delay to speed up loading while still avoiding overwhelming the API
  useEffect(() => {
    if (!isRevealed) return; // Don't load image if card is not revealed
    if (imageUrl) return; // Don't refetch if we already have the image
    if (loadFailed && isRateLimited) return; // Don't retry if we've hit rate limits
    
    // Don't even try if we know we're globally rate limited
    if (globalRateLimitDetected) {
      setIsRateLimited(true);
      setLoadFailed(true);
      return;
    }
    
    // Calculate delay based on card ID for more predictable staggering
    // Reduced delay to improve loading speed
    const idNum = parseInt(card.id.replace(/\D/g, '') || '0');
    const delay = (idNum % 8) * 250; // Up to 1.75 seconds delay (reduced from 7.5s)
    
    const fetchCardImage = async () => {
      try {
        setIsLoading(true);
        setLoadFailed(false); // Reset load failed state when we start loading
        
        // Try to get the image with a timeout for better error handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // Reduced timeout (from 10s)
        
        try {
          // Use fetch directly with a timeout since apiRequest doesn't support signal yet
          const response = await fetch(
            `/api/cards/${card.id}/image`, 
            {
              method: 'GET',
              credentials: 'include',
              signal: controller.signal,
              cache: 'force-cache' // Enable browser caching
            }
          );
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            if (response.status === 429) {
              console.log(`Rate limit hit for card ${card.id}`);
              
              // Set both local and global rate limit flags
              setIsRateLimited(true);
              globalRateLimitDetected = true;
              
              // Try to get detailed error message
              const errorData = await response.json().catch(() => ({}));
              const limitMessage = errorData.message || "Please try again later";
              
              if (typeof window !== 'undefined' && !sessionStorage.getItem(RATE_LIMIT_TOAST_KEY)) {
                sessionStorage.setItem(RATE_LIMIT_TOAST_KEY, 'true');
                
                // Use server-provided message if available
                toast({
                  title: "Image Generation Limit Reached",
                  description: `Using Oracle of Illusion themed backgrounds instead. ${limitMessage}`,
                  variant: "default",
                  duration: 10000, // Show for longer
                });
              }
              
              setLoadFailed(true);
              return;
            }
            
            const errorData = await response.json().catch(() => ({}));
            console.log("Image fetch error:", errorData);
            throw new Error(errorData.message || 'Failed to fetch card image');
          }
          
          const data = await response.json();
          if (data.imageUrl) {
            setImageUrl(data.imageUrl);
            setLoadFailed(false); // Ensure loadFailed is false when we have an image
          } else {
            setLoadFailed(true);
          }
        } catch (error: unknown) {
          // Silently fail if it was an abort error
          if (error instanceof Error && error.name === 'AbortError') {
            console.log(`Request for card ${card.id} image timed out`);
            setLoadFailed(true);
            return;
          }
          throw error;
        }
      } catch (error: unknown) {
        console.error('Error fetching card image:', error);
        setLoadFailed(true);
        
        // Check if this is a rate limit error
        const errorMessage = String(error);
        if (errorMessage.indexOf('429') !== -1 || 
            errorMessage.toLowerCase().indexOf('rate limit') !== -1) {
          
          // Set both local and global rate limit flags
          setIsRateLimited(true);
          globalRateLimitDetected = true;
          
          // Extract the specific message if possible
          let limitMessage = "Please try again later";
          if (error instanceof Error && error.message) {
            limitMessage = error.message;
          }
          
          if (typeof window !== 'undefined' && !sessionStorage.getItem(RATE_LIMIT_TOAST_KEY)) {
            sessionStorage.setItem(RATE_LIMIT_TOAST_KEY, 'true');
            toast({
              title: "Image Generation Limit Reached",
              description: `Using Oracle of Illusion themed backgrounds instead. ${limitMessage}`,
              variant: "default",
              duration: 10000, // Show for longer
            });
          }
        } else {
          // Only show toast for non-rate limit errors
          toast({
            title: "Image Loading Issue",
            description: "Using themed background instead of AI-generated image",
            variant: "default",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Use delay to stagger requests
    const timeoutId = setTimeout(fetchCardImage, delay);
    return () => clearTimeout(timeoutId);
  }, [card.id, isRevealed, toast, imageUrl, loadFailed, isRateLimited]);

  return (
    <div className={getCardBackground()}>
      {/* If we have an image, display it */}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={card.name}
          className="absolute inset-0 w-full h-full object-cover"
          onLoad={() => setLoadFailed(false)} // Ensure loadFailed is false when image loads
        />
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      )}
      
      {/* Enhanced fallback placeholder with mystical symbols when load failed AND we have no image */}
      {loadFailed && !isLoading && !imageUrl && (
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
      
      {/* Card Info */}
      <div className="absolute inset-x-0 bottom-0 p-4 text-center bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-lg font-bold text-white mb-1">{card.name}</h3>
        <p className="text-sm text-white/90">
          {card.arcana === "major" ? "Major Arcana" : card.suit}
        </p>
      </div>
    </div>
  );
}