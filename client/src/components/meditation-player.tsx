import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Play, Pause, Volume2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { TarotCard } from "@shared/tarot-data";

interface MeditationPlayerProps {
  card: TarotCard;
}

export default function MeditationPlayer({ card }: MeditationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isRequested, setIsRequested] = useState(false);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [`/api/meditate/${card.id}`],
    queryFn: async () => {
      try {
        const res = await apiRequest("POST", "/api/meditate", {
          cardId: card.id
        });
        const data = await res.json();
        return data;
      } catch (error) {
        console.error("Error fetching meditation:", error);
        throw error;
      }
    },
    enabled: isRequested,
    retry: 1
  });

  useEffect(() => {
    return () => {
      // Cleanup audio context and oscillator when component unmounts
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const setupThetaWaves = (frequency: number) => {
    try {
      // Initialize audio context if not already created
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const audioContext = audioContextRef.current;

      // Create and configure oscillator for theta waves
      oscillatorRef.current = audioContext.createOscillator();
      oscillatorRef.current.type = 'sine';
      oscillatorRef.current.frequency.setValueAtTime(frequency, audioContext.currentTime);

      // Create and configure gain node for volume control
      gainNodeRef.current = audioContext.createGain();
      gainNodeRef.current.gain.setValueAtTime(0.1, audioContext.currentTime); // Set low volume for background waves

      // Connect nodes
      oscillatorRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContext.destination);

      // Start the oscillator
      oscillatorRef.current.start();
    } catch (error) {
      console.error("Error setting up theta waves:", error);
    }
  };

  const handlePlay = () => {
    try {
      if (!audio && data?.audioUrl) {
        console.log("Creating new audio instance");
        const newAudio = new Audio(data.audioUrl);

        newAudio.addEventListener('ended', () => {
          console.log("Audio playback ended");
          setIsPlaying(false);
          if (oscillatorRef.current) {
            oscillatorRef.current.stop();
            oscillatorRef.current.disconnect();
          }
        });

        newAudio.addEventListener('error', (e) => {
          console.error("Audio playback error:", e);
          toast({
            title: "Playback Error",
            description: "There was an error playing the meditation audio. Please try again.",
            variant: "destructive"
          });
          setIsPlaying(false);
        });

        setAudio(newAudio);

        // Start both the meditation audio and theta waves
        newAudio.play()
          .then(() => {
            console.log("Audio playback started");
            setIsPlaying(true);
            if (data.thetaFrequency) {
              setupThetaWaves(data.thetaFrequency);
            }
          })
          .catch((error) => {
            console.error("Error starting playback:", error);
            toast({
              title: "Playback Error",
              description: "Could not start audio playback. Please try again.",
              variant: "destructive"
            });
          });
      } else if (audio) {
        if (isPlaying) {
          console.log("Pausing audio");
          audio.pause();
          if (oscillatorRef.current) {
            oscillatorRef.current.stop();
            oscillatorRef.current.disconnect();
          }
          setIsPlaying(false);
        } else {
          console.log("Resuming audio");
          audio.play()
            .then(() => {
              setIsPlaying(true);
              if (data?.thetaFrequency) {
                setupThetaWaves(data.thetaFrequency);
              }
            })
            .catch((error) => {
              console.error("Error resuming playback:", error);
              toast({
                title: "Playback Error",
                description: "Could not resume audio playback. Please try again.",
                variant: "destructive"
              });
            });
        }
      }
    } catch (error) {
      console.error("Error in handlePlay:", error);
      toast({
        title: "Playback Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!isRequested) {
    return (
      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={() => {
          console.log("Requesting meditation");
          setIsRequested(true);
        }}
      >
        <Volume2 className="w-4 h-4 mr-2" />
        Get Guided Meditation
      </Button>
    );
  }

  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error("Meditation error:", error);
    return (
      <Card className="mt-4 border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">Failed to load meditation. Please try again.</p>
          <Button 
            variant="outline" 
            className="w-full mt-2"
            onClick={() => {
              console.log("Retrying meditation request");
              void refetch();
            }}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">Guided Meditation</h4>
            {data?.thetaFrequency && (
              <span className="text-sm text-muted-foreground">
                Theta Frequency: {data.thetaFrequency.toFixed(1)}Hz
              </span>
            )}
          </div>

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
        </div>
      </CardContent>
    </Card>
  );
}