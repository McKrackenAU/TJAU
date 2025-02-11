import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Play, Pause, Volume2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { TarotCard } from "@shared/tarot-data";

interface MeditationPlayerProps {
  card: TarotCard;
}

export default function MeditationPlayer({ card }: MeditationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/meditate/${card.id}`],
    queryFn: async () => {
      const res = await apiRequest("POST", "/api/meditate", {
        cardId: card.id
      });
      return res.json();
    },
    enabled: false // Don't load automatically
  });

  const handlePlay = () => {
    if (!audio && data?.audioUrl) {
      const newAudio = new Audio(data.audioUrl);
      newAudio.addEventListener('ended', () => setIsPlaying(false));
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);
    } else if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    }
  };

  if (!data && !isLoading) {
    return (
      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={() => void data?.refetch()}
      >
        <Volume2 className="w-4 h-4 mr-2" />
        Get Guided Meditation
      </Button>
    );
  }

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Guided Meditation</h4>
          
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <p className="text-destructive">Failed to load meditation. Please try again.</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {data?.text}
              </p>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={handlePlay}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {isPlaying ? "Pause" : "Play"} Meditation
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
