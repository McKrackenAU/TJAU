import { useState, useEffect } from "react";
import { TarotCard } from "@shared/tarot-data";
import { Loader2, ImageIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
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

  // Load the card image
  useEffect(() => {
    if (!isRevealed) return; // Don't load image if card is not revealed
    if (imageUrl) return; // Don't refetch if we already have the image
    if (loadFailed) return; // Don't retry if we've already failed
    
    const fetchCardImage = async () => {
      try {
        setIsLoading(true);
        
        const response = await apiRequest('GET', `/api/cards/${card.id}/image`);
        if (!response.ok) {
          const errorData = await response.json();
          console.log("Image fetch error:", errorData);
          
          if (response.status === 429) {
            // Rate limit error - fail silently and use the fallback
            setLoadFailed(true);
            return;
          }
          
          throw new Error('Failed to fetch card image');
        }
        
        const data = await response.json();
        if (data.imageUrl) {
          setImageUrl(data.imageUrl);
        } else {
          setLoadFailed(true);
        }
      } catch (error: unknown) {
        console.error('Error fetching card image:', error);
        setLoadFailed(true);
        
        // Only show toast for non-rate limit errors
        const errorMessage = String(error);
        if (errorMessage.indexOf('429') === -1) {
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

    fetchCardImage();
  }, [card.id, isRevealed, toast, imageUrl, loadFailed]);

  return (
    <div className={getCardBackground()}>
      {/* If we have an image, display it */}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={card.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      )}
      
      {/* Fallback placeholder when load failed */}
      {loadFailed && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-white bg-purple-800/40 p-4 rounded-lg backdrop-blur-sm flex flex-col items-center">
            <ImageIcon className="w-10 h-10 mb-2 opacity-70" />
            <span className="text-sm font-medium">{card.name}</span>
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