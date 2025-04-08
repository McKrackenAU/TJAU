import { useState, useEffect } from "react";
import { TarotCard } from "@shared/tarot-data";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CardImageProps {
  card: TarotCard;
  isRevealed: boolean;
}

export default function CardImage({ card, isRevealed }: CardImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load the card image
  useEffect(() => {
    if (!isRevealed) return; // Don't load image if card is not revealed
    
    const fetchCardImage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Don't refetch if we already have the image
        if (imageUrl) return;
        
        const response = await apiRequest('GET', `/api/cards/${card.id}/image`);
        if (!response.ok) {
          throw new Error('Failed to fetch card image');
        }
        
        const data = await response.json();
        setImageUrl(data.imageUrl);
      } catch (err) {
        console.error('Error fetching card image:', err);
        setError('Failed to load card image');
        toast({
          title: "Error",
          description: "Failed to load card image",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardImage();
  }, [card.id, isRevealed, toast, imageUrl]);

  const getCardBackground = () => {
    const baseClasses = "w-full h-full rounded-xl relative overflow-hidden border-2";

    if (card.arcana === "major") {
      return `${baseClasses} bg-gradient-to-br from-purple-700 via-purple-900 to-indigo-900 border-yellow-300/50`;
    }

    switch (card.suit) {
      case "Wands":
        return `${baseClasses} bg-gradient-to-br from-orange-500 via-red-600 to-rose-700 border-orange-300/50`;
      case "Cups":
        return `${baseClasses} bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-800 border-blue-300/50`;
      case "Swords":
        return `${baseClasses} bg-gradient-to-br from-zinc-400 via-slate-600 to-slate-800 border-slate-300/50`;
      case "Pentacles":
        return `${baseClasses} bg-gradient-to-br from-emerald-500 via-emerald-700 to-green-900 border-emerald-300/50`;
      default:
        return baseClasses;
    }
  };

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