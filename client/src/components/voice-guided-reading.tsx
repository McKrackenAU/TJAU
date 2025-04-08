import { useState, useEffect, useRef } from 'react';
import { TarotCard } from '@shared/tarot-data';
import { audioService } from '@/lib/audio-service';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Play,
  Pause,
  SkipForward,
  Volume2,
  Music,
  Mic,
  SkipBack,
  RefreshCw,
  VolumeX
} from 'lucide-react';
import CardDisplay from './card-display';

// Types of available meditation music
export type MeditationMusicType = 'calm' | 'nature' | 'crystal' | 'none';

// Mapping of music types to their URLs
const MEDITATION_MUSIC = {
  calm: '/audio/calm-meditation.mp3',
  nature: '/audio/nature-sounds.mp3',
  crystal: '/audio/crystal-bowls.mp3',
  none: '',
};

// Music descriptions to help users choose
const MUSIC_DESCRIPTIONS = {
  calm: 'Soothing ambient meditation music with gentle piano and calming tones',
  nature: 'Forest ambience with gentle bird songs and natural sounds',
  crystal: 'Tibetan singing bowls for deep meditation and chakra healing',
  none: 'No background music, voice narration only',
};

interface VoiceGuidedReadingProps {
  cards: (TarotCard & { isReversed?: boolean })[];
  spreadType?: string;
  onComplete?: () => void;
}

export default function VoiceGuidedReading({
  cards,
  spreadType = 'general',
  onComplete,
}: VoiceGuidedReadingProps) {
  const [activeCardIndex, setActiveCardIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [musicType, setMusicType] = useState<MeditationMusicType>('calm');
  const [musicVolume, setMusicVolume] = useState(30);
  const [voiceVolume, setVoiceVolume] = useState(80);
  const [voiceRate, setVoiceRate] = useState(0.9);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [musicDescription, setMusicDescription] = useState(MUSIC_DESCRIPTIONS.calm);
  const scriptRef = useRef<string[]>([]);
  const isCompletedRef = useRef(false);

  // Generate reading script based on cards
  useEffect(() => {
    const generateScript = () => {
      const intro = `Welcome to your ${spreadType} tarot reading. Take a deep breath and center yourself as we explore the messages these cards have for you.`;
      
      const cardReadings = cards.map((card, index) => {
        const position = getPositionName(index, spreadType);
        const orientation = card.isReversed ? 'reversed' : 'upright';
        const meanings = card.isReversed ? card.meanings.reversed : card.meanings.upright;
        const meaningText = meanings.length > 0 ? meanings[0] : '';
        
        return `Card ${index + 1}, ${position}: The ${card.name}, ${orientation}. 
                ${card.description}. 
                In this position, it suggests ${meaningText}.`;
      });
      
      const conclusion = `Take a moment to reflect on these cards and their message for you. When you're ready, we'll conclude this reading.`;
      
      return [intro, ...cardReadings, conclusion];
    };
    
    scriptRef.current = generateScript();
  }, [cards, spreadType]);

  // Handle playing the current part of the script
  useEffect(() => {
    if (!isPlaying || activeCardIndex < 0 || !isVoiceEnabled) return;
    
    const currentText = scriptRef.current[activeCardIndex];
    
    audioService.setSpeechVolume(voiceVolume / 100);
    audioService.setSpeechRate(voiceRate);
    
    // Temporarily lower music volume while speaking
    const currentMusicVolume = audioService.getMusicVolume();
    if (isMusicEnabled && musicType !== 'none') {
      audioService.setMusicVolume(Math.max(0.05, currentMusicVolume * 0.3)); // Reduce to 30% but never below 0.05
    }
    
    audioService.speak(currentText, () => {
      // Restore music volume when speech ends
      if (isMusicEnabled && musicType !== 'none') {
        audioService.setMusicVolume(currentMusicVolume);
      }
      
      // Move to the next card after speech is complete
      if (activeCardIndex < scriptRef.current.length - 1) {
        setActiveCardIndex(prevIndex => prevIndex + 1);
      } else {
        // Finished the reading
        setIsPlaying(false);
        isCompletedRef.current = true;
        // Pause the background music when the reading is complete
        audioService.pauseBackgroundMusic();
        if (onComplete) onComplete();
      }
    });
    
    return () => {
      // Clean up on unmount or when dependency changes
      audioService.stopSpeech();
      // Restore music volume on cleanup
      if (isMusicEnabled && musicType !== 'none') {
        audioService.setMusicVolume(currentMusicVolume);
      }
    };
  }, [activeCardIndex, isPlaying, voiceVolume, voiceRate, isVoiceEnabled, isMusicEnabled, musicType, onComplete]);

  // Handle background music
  useEffect(() => {
    if (!isMusicEnabled || musicType === 'none') {
      audioService.pauseBackgroundMusic();
      return;
    }
    
    const musicUrl = MEDITATION_MUSIC[musicType];
    if (musicUrl) {
      audioService.setMusicVolume(musicVolume / 100);
      // Play or update the music
      audioService.playBackgroundMusic(musicUrl);
    }
    
    return () => {
      audioService.pauseBackgroundMusic();
    };
  }, [musicType, isMusicEnabled]);
  
  // Update music volume when slider changes
  useEffect(() => {
    if (isMusicEnabled && musicType !== 'none') {
      audioService.setMusicVolume(musicVolume / 100);
    }
  }, [musicVolume, isMusicEnabled, musicType]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      audioService.cleanUp();
    };
  }, []);
  
  // Update music description when type changes
  useEffect(() => {
    setMusicDescription(MUSIC_DESCRIPTIONS[musicType]);
  }, [musicType]);

  const startReading = () => {
    setHasStarted(true);
    setActiveCardIndex(0);
    setIsPlaying(true);
  };

  const pauseReading = () => {
    // Pause both voice and music at the same time
    audioService.pauseAll();
    setIsPlaying(false);
  };

  const resumeReading = () => {
    // Resume both voice and music at the same time
    audioService.resumeAll();
    setIsPlaying(true);
  };

  const nextCard = () => {
    if (activeCardIndex < scriptRef.current.length - 1) {
      audioService.stopSpeech();
      setActiveCardIndex(prevIndex => prevIndex + 1);
      setIsPlaying(true);
    }
  };

  const previousCard = () => {
    if (activeCardIndex > 0) {
      audioService.stopSpeech();
      setActiveCardIndex(prevIndex => prevIndex - 1);
      setIsPlaying(true);
    }
  };

  const restartReading = () => {
    audioService.stopSpeech();
    setActiveCardIndex(0);
    setIsPlaying(true);
    isCompletedRef.current = false;
  };

  const toggleMusic = (enabled: boolean) => {
    setIsMusicEnabled(enabled);
    if (!enabled) {
      audioService.pauseBackgroundMusic();
    } else if (musicType !== 'none') {
      audioService.playBackgroundMusic(MEDITATION_MUSIC[musicType]);
    }
  };

  const toggleVoice = (enabled: boolean) => {
    setIsVoiceEnabled(enabled);
    if (!enabled) {
      audioService.stopSpeech();
    } else if (isPlaying) {
      const currentText = scriptRef.current[activeCardIndex];
      audioService.speak(currentText);
    }
  };
  
  const handleMusicTypeChange = (type: MeditationMusicType) => {
    // Smoothly transition between music types
    if (isMusicEnabled) {
      if (type === 'none') {
        audioService.pauseBackgroundMusic();
      } else {
        // Fade out current music before changing
        const currentVolume = audioService.getMusicVolume();
        audioService.setMusicVolume(0.01); // Almost silent
        
        // After a short delay, change the music and restore volume
        setTimeout(() => {
          setMusicType(type);
          setMusicDescription(MUSIC_DESCRIPTIONS[type]);
          
          // Gradually restore the volume
          setTimeout(() => {
            audioService.setMusicVolume(musicVolume / 100);
          }, 300);
        }, 300);
        return;
      }
    }
    
    // If music is disabled or type is none, just update the state
    setMusicType(type);
    setMusicDescription(MUSIC_DESCRIPTIONS[type]);
  };

  const getPositionName = (index: number, type: string): string => {
    if (type === 'past-present-future' && index < 3) {
      return ['representing your past', 'representing your present', 'representing your future'][index];
    } else if (type === 'celtic-cross' && index < 10) {
      return [
        'representing the present situation',
        'representing the challenge or obstacle',
        'representing the root cause',
        'representing the recent past',
        'representing the best outcome',
        'representing the immediate future',
        'representing factors affecting the situation',
        'representing external influences',
        'representing hopes or fears',
        'representing the final outcome'
      ][index];
    } else {
      return `in position ${index + 1}`;
    }
  };

  return (
    <div className="voice-guided-reading space-y-6 py-4">
      {!hasStarted ? (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Voice-Guided Tarot Reading</h2>
          <p className="text-muted-foreground">
            Experience a guided meditation and tarot reading with soothing voice narration and background music.
          </p>
          <Button size="lg" onClick={startReading} className="mt-4">
            <Play className="mr-2 h-4 w-4" /> Begin Voice-Guided Reading
          </Button>
        </div>
      ) : (
        <>
          {/* Active Card Display */}
          <div className="flex justify-center mb-6">
            {activeCardIndex >= 0 && activeCardIndex < cards.length ? (
              <div className="text-center">
                <CardDisplay 
                  card={cards[activeCardIndex]} 
                  isRevealed={true}
                  isReversed={cards[activeCardIndex].isReversed}
                />
                <h3 className="mt-3 text-lg font-medium">{cards[activeCardIndex].name}</h3>
                <p className="text-sm text-muted-foreground">
                  {cards[activeCardIndex].isReversed ? 'Reversed' : 'Upright'}
                </p>
              </div>
            ) : (
              <div className="h-64 w-48 flex items-center justify-center bg-muted rounded-md border border-border">
                {activeCardIndex === scriptRef.current.length - 1 ? (
                  <p className="text-center text-muted-foreground px-4">Reflection</p>
                ) : (
                  <p className="text-center text-muted-foreground px-4">Ready to begin</p>
                )}
              </div>
            )}
          </div>

          {/* Playback Controls */}
          <div className="flex justify-center space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={previousCard}
              disabled={activeCardIndex <= 0}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            {isPlaying ? (
              <Button variant="default" onClick={pauseReading}>
                <Pause className="mr-2 h-4 w-4" /> Pause
              </Button>
            ) : (
              <Button variant="default" onClick={resumeReading}>
                <Play className="mr-2 h-4 w-4" /> {isCompletedRef.current ? 'Replay' : 'Resume'}
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextCard}
              disabled={activeCardIndex >= scriptRef.current.length - 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={restartReading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Audio Settings */}
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Voice Settings */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="font-medium flex items-center">
                      <Mic className="mr-2 h-4 w-4" /> Voice Narration
                    </Label>
                    <Switch 
                      checked={isVoiceEnabled} 
                      onCheckedChange={toggleVoice}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="voice-volume" className="text-sm">Volume</Label>
                      <span className="text-xs text-muted-foreground">{voiceVolume}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                      <Slider 
                        id="voice-volume"
                        disabled={!isVoiceEnabled}
                        min={0} 
                        max={100} 
                        step={1}
                        value={[voiceVolume]}
                        onValueChange={(value) => {
                          setVoiceVolume(value[0]);
                          audioService.setSpeechVolume(value[0] / 100);
                        }}
                      />
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="voice-speed" className="text-sm">Speed</Label>
                      <span className="text-xs text-muted-foreground">{voiceRate.toFixed(1)}x</span>
                    </div>
                    <Slider 
                      id="voice-speed"
                      disabled={!isVoiceEnabled}
                      min={0.5} 
                      max={1.5} 
                      step={0.1}
                      value={[voiceRate]}
                      onValueChange={(value) => {
                        setVoiceRate(value[0]);
                        audioService.setSpeechRate(value[0]);
                      }}
                    />
                  </div>
                </div>

                {/* Music Settings */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="font-medium flex items-center">
                      <Music className="mr-2 h-4 w-4" /> Background Music
                    </Label>
                    <Switch 
                      checked={isMusicEnabled} 
                      onCheckedChange={toggleMusic}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="music-type" className="text-sm">Music Style</Label>
                    <select
                      id="music-type"
                      disabled={!isMusicEnabled}
                      value={musicType}
                      onChange={(e) => handleMusicTypeChange(e.target.value as MeditationMusicType)}
                      className="w-full px-3 py-2 bg-background border border-input rounded-md"
                    >
                      <option value="calm">Calm Meditation</option>
                      <option value="nature">Nature Sounds</option>
                      <option value="crystal">Crystal Bowls</option>
                      <option value="none">No Music</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">{musicDescription}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="music-volume" className="text-sm">Volume</Label>
                      <span className="text-xs text-muted-foreground">{musicVolume}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                      <Slider 
                        id="music-volume"
                        disabled={!isMusicEnabled || musicType === 'none'}
                        min={0} 
                        max={100} 
                        step={1}
                        value={[musicVolume]}
                        onValueChange={(value) => {
                          setMusicVolume(value[0]);
                          audioService.setMusicVolume(value[0] / 100);
                        }}
                      />
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}