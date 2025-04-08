import React, { useState, useEffect } from 'react';
import { TarotCard } from '@shared/tarot-data';
import { Loader2, BookOpen, X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface CardSymbolismTooltipProps {
  card: TarotCard & { imageUrl?: string };
  isOpen: boolean;
  onClose: () => void;
}

export default function CardSymbolismTooltip({ 
  card, 
  isOpen, 
  onClose 
}: CardSymbolismTooltipProps) {
  const [symbolism, setSymbolism] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch symbolism data when card changes or tooltip opens
  useEffect(() => {
    if (isOpen && card) {
      fetchSymbolism();
    }
    
    // Reset state when tooltip is closed
    if (!isOpen) {
      setSymbolism(null);
    }
  }, [card?.id, isOpen]);

  const fetchSymbolism = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest('GET', `/api/cards/${card.id}/symbolism`);
      if (!response.ok) {
        throw new Error('Failed to fetch symbolism data');
      }

      const data = await response.json();
      setSymbolism(data.symbolism);
    } catch (err) {
      console.error('Error fetching symbolism:', err);
      setError('Unable to load symbolism information');
      toast({
        title: 'Error',
        description: 'Failed to load symbolism details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative max-w-2xl w-full max-h-[80vh] bg-card rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">{card.name} Symbolism</h2>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-1 hover:bg-muted"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-64px)]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <p className="text-muted-foreground">Analyzing card symbolism...</p>
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-8">
              <p>{error}</p>
              <button 
                onClick={fetchSymbolism}
                className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              {/* Card image and basic info section */}
              <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
                <div className="w-32 h-48 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                  {card.imageUrl ? (
                    <img 
                      src={card.imageUrl} 
                      alt={card.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground border">
                      <span className="text-lg">{card.name}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">{card.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {card.arcana === 'major' ? 'Major Arcana' : `Minor Arcana - ${card.suit}`}
                    {card.number !== undefined && ` • ${card.number}`}
                    {card.element && ` • Element: ${card.element}`}
                  </p>
                  <p className="text-sm">{card.description}</p>
                </div>
              </div>
              
              {/* Symbolism content */}
              <div>
                {symbolism ? (
                  <div dangerouslySetInnerHTML={{ __html: symbolism.replace(/\n/g, '<br />') }} />
                ) : (
                  <p className="text-muted-foreground">No symbolism information available</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}