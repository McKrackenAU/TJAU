import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Play, Pause, Volume2, Music, VolumeX } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { TarotCard } from "@shared/tarot-data";
import { audioService } from "@/lib/audio-service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import YouTube from 'react-youtube';

// Types of available meditation music
type MeditationMusicType = 'calm' | 'nature' | 'crystal' | 'none';

// Mapping of music types to their URLs
const MEDITATION_MUSIC = {
  calm: '/audio/calm-meditation.mp3',
  nature: '/audio/nature-sounds.mp3', // Kept for fallback
  crystal: '/audio/crystal-bowls.mp3', // Kept for fallback
  none: ''
};

// YouTube video IDs for nature and crystal bowl meditation
const YOUTUBE_VIDEOS = {
  nature: 'vBi8FxvoYvo', // Nature sounds
  crystal: '4GcW45gETv8', // Crystal bowls
};

// Music descriptions to help users choose
const MUSIC_DESCRIPTIONS = {
  calm: 'Soothing ambient meditation music with gentle piano and calming tones',
  nature: 'Forest ambience with gentle bird songs and natural sounds',
  crystal: 'Tibetan singing bowls for deep meditation and chakra healing',
  none: 'No background music, voice narration only',
};

interface MeditationPlayerProps {
  card: TarotCard;
}

export default function MeditationPlayer({ card }: MeditationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isRequested, setIsRequested] = useState(false);
  const [musicType, setMusicType] = useState<MeditationMusicType>('calm');
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [voiceVolume, setVoiceVolume] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [voiceRate, setVoiceRate] = useState(0.8); // Slower default rate
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const youtubePlayerRef = useRef<any>(null);
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
    // Set voice rate to be slower (for meditation)
    audioService.setSpeechRate(voiceRate);
    
    // Apply current voice volume setting
    audioService.setSpeechVolume(voiceVolume);
    
    // Apply current music volume setting
    audioService.setMusicVolume(musicVolume);
    
    return () => {
      // Cleanup audio context and oscillator when component unmounts
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch (err) {
          console.error("Error stopping oscillator:", err);
        }
        oscillatorRef.current = null;
      }
      
      // Check if the audio context exists and is not already closed
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch (err) {
          console.error("Error closing audio context:", err);
        }
      }
      audioContextRef.current = null;
      
      // Make sure to stop any running audio
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      
      // Clean up audio service
      audioService.cleanUp();
      
      // Clean up YouTube player if active
      if (youtubePlayerRef.current && 
          ['nature', 'crystal'].includes(musicType)) {
        try {
          youtubePlayerRef.current.pauseVideo();
        } catch (err) {
          console.error("Error stopping YouTube player:", err);
        }
      }
    };
  }, [voiceRate, voiceVolume, musicVolume]);

  const handleMusicTypeChange = (type: MeditationMusicType) => {
    setMusicType(type);
    
    // Stop current YouTube player if active
    if (youtubePlayerRef.current && 
        ['nature', 'crystal'].includes(musicType)) {
      try {
        youtubePlayerRef.current.pauseVideo();
      } catch (err) {
        console.error("Error stopping YouTube player:", err);
      }
    }
    
    // Stop current audio service background music
    audioService.stopBackgroundMusic();
    
    // Start new music based on type if currently playing
    if (isPlaying) {
      if (type === 'calm') {
        audioService.playBackgroundMusic(MEDITATION_MUSIC.calm);
      } else if (type === 'nature' || type === 'crystal') {
        // Start YouTube player if it's ready
        if (youtubePlayerRef.current) {
          try {
            youtubePlayerRef.current.setVolume(musicVolume * 100);
            youtubePlayerRef.current.playVideo();
          } catch (err) {
            console.error("Error with YouTube player in handleMusicTypeChange:", err);
          }
        }
      }
    }
  };

  const handleYouTubeReady = (event: any) => {
    youtubePlayerRef.current = event.target;
    
    // Set volume and play if this is the active music type and meditation is playing
    if (isPlaying && ['nature', 'crystal'].includes(musicType)) {
      event.target.setVolume(musicVolume * 100);
      event.target.playVideo();
    } else {
      event.target.setVolume(0);
    }
  };

  const setupThetaWaves = (frequency: number) => {
    try {
      // Initialize audio context if not already created
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const audioContext = audioContextRef.current;

      // Create and configure oscillator for theta waves
      oscillatorRef.current = audioContext.createOscillator();
      oscillatorRef.current.type = 'triangle'; // Changed to triangle wave for better audibility
      oscillatorRef.current.frequency.setValueAtTime(frequency, audioContext.currentTime);

      // Create a low-pass filter
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = frequency * 2; // Set cutoff frequency
      filter.Q.value = 1; // Quality factor

      // Create and configure gain node for volume control
      gainNodeRef.current = audioContext.createGain();
      // Start with zero volume and gradually increase it
      gainNodeRef.current.gain.setValueAtTime(0, audioContext.currentTime);
      gainNodeRef.current.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 2);

      // Connect nodes: oscillator -> filter -> gain -> output
      oscillatorRef.current.connect(filter);
      filter.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContext.destination);

      // Start the oscillator
      oscillatorRef.current.start();
    } catch (error) {
      console.error("Error setting up theta waves:", error);
      toast({
        title: "Audio Setup Error",
        description: "Could not initialize meditation tones. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePlay = () => {
    try {
      if (isPlaying) {
        // Pause meditation
        if (audio) {
          audio.pause();
        }
        
        // Stop theta waves
        if (oscillatorRef.current) {
          try {
            oscillatorRef.current.stop();
            oscillatorRef.current.disconnect();
          } catch (err) {
            console.error("Error stopping oscillator in handlePlay:", err);
          }
          oscillatorRef.current = null;
        }
        
        // Clean up audio context if needed
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          try {
            audioContextRef.current.close();
          } catch (err) {
            console.error("Error closing audio context in handlePlay:", err);
          }
          audioContextRef.current = null;
        }
        
        // Pause background music
        audioService.pauseBackgroundMusic();
        
        // Pause YouTube player if active
        if (youtubePlayerRef.current && 
            ['nature', 'crystal'].includes(musicType)) {
          try {
            youtubePlayerRef.current.pauseVideo();
          } catch (err) {
            console.error("Error pausing YouTube player:", err);
          }
        }
        
        setIsPlaying(false);
        return;
      }

      if (!data?.audioUrl) {
        toast({
          title: "Error",
          description: "No meditation audio available",
          variant: "destructive"
        });
        return;
      }

      // Start background music based on selected type
      if (musicType === 'calm') {
        audioService.playBackgroundMusic(MEDITATION_MUSIC.calm);
      } else if (musicType === 'nature' || musicType === 'crystal') {
        // Start YouTube player if it's ready
        if (youtubePlayerRef.current) {
          try {
            youtubePlayerRef.current.setVolume(musicVolume * 100);
            youtubePlayerRef.current.playVideo();
          } catch (err) {
            console.error("Error with YouTube player in handlePlay:", err);
          }
        }
      }
      
      // Lower music volume during narration
      audioService.setMusicVolume(musicVolume * 0.3);
      
      if (!audio && data?.audioUrl) {
        console.log("Creating new audio instance");
        console.log("Audio URL:", data.audioUrl);
        // Add cache busting to ensure fresh audio
        const cacheBustedUrl = `${data.audioUrl}?t=${Date.now()}`;
        console.log("Cache-busted URL:", cacheBustedUrl);
        const newAudio = new Audio(cacheBustedUrl);
        newAudio.volume = voiceVolume; 

        newAudio.addEventListener('ended', () => {
          console.log("Audio playback ended");
          setIsPlaying(false);
          
          // Fade out theta waves
          if (oscillatorRef.current && gainNodeRef.current && audioContextRef.current) {
            try {
              // Make sure audioContext is still valid before accessing currentTime
              if (audioContextRef.current.state !== 'closed') {
                gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 1);
                
                setTimeout(() => {
                  if (oscillatorRef.current) {
                    try {
                      oscillatorRef.current.stop();
                      oscillatorRef.current.disconnect();
                    } catch (err) {
                      console.error("Error stopping oscillator on audio end:", err);
                    }
                    oscillatorRef.current = null;
                  }
                }, 1000);
              }
            } catch (err) {
              console.error("Error with audio context when fading out:", err);
              // Clean up anyway
              if (oscillatorRef.current) {
                try {
                  oscillatorRef.current.stop();
                  oscillatorRef.current.disconnect();
                } catch (innerErr) {
                  console.error("Failed cleanup attempt:", innerErr);
                }
                oscillatorRef.current = null;
              }
            }
          }
          
          // Restore normal music volume when narration ends
          audioService.setMusicVolume(musicVolume);
        });

        newAudio.addEventListener('error', (e) => {
          console.error("Audio playback error:", e);
          toast({
            title: "Playback Error",
            description: "There was an error playing the meditation audio. Please try again.",
            variant: "destructive"
          });
          setIsPlaying(false);
          
          // Restore normal music volume on error
          audioService.setMusicVolume(musicVolume);
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
            
            // Restore normal music volume on error
            audioService.setMusicVolume(musicVolume);
          });
      } else if (audio) {
        // If audio already exists, just resume it
        if (audio.paused) {
          console.log("Resuming existing audio");
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
              
              // Restore normal music volume on error
              audioService.setMusicVolume(musicVolume);
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
      
      // Make sure music volume is restored
      audioService.setMusicVolume(musicVolume);
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
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Music className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>

          {showSettings && (
            <div className="space-y-4 mb-4 p-4 bg-muted/40 rounded-lg">
              {/* Music selection */}
              <div className="space-y-2">
                <Label htmlFor="music-type">Background Music</Label>
                <Select 
                  value={musicType} 
                  onValueChange={(value) => handleMusicTypeChange(value as MeditationMusicType)}
                >
                  <SelectTrigger id="music-type">
                    <SelectValue placeholder="Select background music" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calm">Calm Meditation</SelectItem>
                    <SelectItem value="nature">Nature Sounds</SelectItem>
                    <SelectItem value="crystal">Crystal Bowls</SelectItem>
                    <SelectItem value="none">No Music</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {MUSIC_DESCRIPTIONS[musicType]}
                </p>
              </div>
              
              {/* Music volume */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="music-volume">Music Volume</Label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(musicVolume * 100)}%
                  </span>
                </div>
                <Slider 
                  id="music-volume"
                  min={0} 
                  max={1} 
                  step={0.01} 
                  value={[musicVolume]} 
                  onValueChange={(values) => {
                    const newVolume = values[0];
                    setMusicVolume(newVolume);
                    audioService.setMusicVolume(newVolume);
                    
                    // Update YouTube volume if active
                    if (youtubePlayerRef.current && 
                        ['nature', 'crystal'].includes(musicType)) {
                      try {
                        youtubePlayerRef.current.setVolume(newVolume * 100);
                      } catch (err) {
                        console.error("Error setting YouTube volume:", err);
                      }
                    }
                  }}
                />
              </div>
              
              {/* Voice volume */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="voice-volume">Voice Volume</Label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(voiceVolume * 100)}%
                  </span>
                </div>
                <Slider 
                  id="voice-volume"
                  min={0} 
                  max={1} 
                  step={0.01} 
                  value={[voiceVolume]} 
                  onValueChange={(values) => {
                    const newVolume = values[0];
                    setVoiceVolume(newVolume);
                    audioService.setSpeechVolume(newVolume);
                    
                    // Update current audio if playing
                    if (audio) {
                      audio.volume = newVolume;
                    }
                  }}
                />
              </div>
              
              {/* Voice speed */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="voice-speed">Voice Speed</Label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(voiceRate * 100)}%
                  </span>
                </div>
                <Slider 
                  id="voice-speed"
                  min={0.5} 
                  max={1.5} 
                  step={0.05} 
                  value={[voiceRate]} 
                  onValueChange={(values) => {
                    const newRate = values[0];
                    setVoiceRate(newRate);
                    audioService.setSpeechRate(newRate);
                  }}
                />
              </div>
            </div>
          )}

          {/* YouTube embedding - hidden until needed */}
          <div className="youtube-container" style={{ height: 0, overflow: 'hidden', position: 'absolute' }}>
            {musicType === 'nature' && (
              <YouTube
                videoId={YOUTUBE_VIDEOS.nature}
                opts={{
                  height: '1',
                  width: '1',
                  playerVars: {
                    autoplay: 0,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    loop: 1,
                    modestbranding: 1,
                  },
                }}
                onReady={handleYouTubeReady}
              />
            )}
            
            {musicType === 'crystal' && (
              <YouTube
                videoId={YOUTUBE_VIDEOS.crystal}
                opts={{
                  height: '1',
                  width: '1',
                  playerVars: {
                    autoplay: 0,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    loop: 1,
                    modestbranding: 1,
                  },
                }}
                onReady={handleYouTubeReady}
              />
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

          {data?.thetaFrequency && (
            <p className="text-xs text-center text-muted-foreground">
              This meditation includes theta wave frequency ({data.thetaFrequency.toFixed(1)}Hz) for enhanced relaxation
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}