// Audio service for handling background music and speech synthesis
export class AudioService {
  private static instance: AudioService;
  private backgroundMusic: HTMLAudioElement | null = null;
  private speechSynthesis: SpeechSynthesis | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.5;
  private rate: number = 0.9; // Slightly slower than normal for meditation
  private pitch: number = 0.9; // Slightly lower pitch for calming effect
  private musicVolume: number = 0.3; // Default music volume
  private currentMusicUrl: string = "";
  
  private constructor() {
    if (typeof window !== 'undefined') {
      this.speechSynthesis = window.speechSynthesis;
      // Create the background music element but don't set source yet
      this.backgroundMusic = new Audio();
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = this.musicVolume;
      
      // Add event listeners for error handling and logging
      this.backgroundMusic.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
      });
      
      // Preload all meditation music when service initializes
      this.preloadAudioFiles();
    }
  }
  
  private preloadAudioFiles(): void {
    // Create hidden audio elements to preload files
    const musicUrls = [
      '/audio/calm-meditation.mp3',
      '/audio/nature-sounds.mp3',
      '/audio/crystal-bowls.mp3'
    ];
    
    musicUrls.forEach(url => {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = url;
      // Just load enough to ensure browser has the file ready
      audio.load();
    });
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public setMusicVolume(volume: number): void {
    if (this.backgroundMusic) {
      this.musicVolume = Math.max(0, Math.min(1, volume));
      this.backgroundMusic.volume = this.musicVolume;
      console.log(`Setting music volume to ${this.musicVolume}`);
    }
  }

  public setSpeechVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.utterance) {
      this.utterance.volume = this.volume;
    }
  }

  public setSpeechRate(rate: number): void {
    this.rate = Math.max(0.1, Math.min(2, rate));
    if (this.utterance) {
      this.utterance.rate = this.rate;
    }
  }

  public setSpeechPitch(pitch: number): void {
    this.pitch = Math.max(0, Math.min(2, pitch));
    if (this.utterance) {
      this.utterance.pitch = this.pitch;
    }
  }

  public async playBackgroundMusic(url: string): Promise<void> {
    if (!this.backgroundMusic) return;
    
    try {
      // Keep track of the current music URL
      this.currentMusicUrl = url;
      
      // Only load and restart if it's a different track
      if (this.backgroundMusic.src !== url || this.backgroundMusic.paused) {
        console.log(`Starting background music: ${url}`);
        this.backgroundMusic.src = url;
        this.backgroundMusic.load();
        this.backgroundMusic.volume = this.musicVolume;
        
        // Add a small delay to ensure audio context is ready
        setTimeout(async () => {
          try {
            await this.backgroundMusic?.play();
          } catch (err) {
            console.error("Delayed play attempt failed:", err);
          }
        }, 300);
      }
    } catch (error) {
      console.error("Error playing background music:", error);
    }
  }

  public pauseBackgroundMusic(): void {
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      console.log("Pausing background music");
      this.backgroundMusic.pause();
    }
  }
  
  public resumeBackgroundMusic(): void {
    if (this.backgroundMusic && this.backgroundMusic.paused && this.currentMusicUrl) {
      console.log("Resuming background music");
      this.backgroundMusic.play().catch(err => {
        console.error("Error resuming background music:", err);
      });
    }
  }

  public stopBackgroundMusic(): void {
    if (this.backgroundMusic) {
      console.log("Stopping background music");
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.currentMusicUrl = "";
    }
  }

  public speak(text: string, onEnd?: () => void): void {
    if (!this.speechSynthesis) return;
    
    // Clear any ongoing speech
    this.speechSynthesis.cancel();
    
    // Create a new utterance
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.volume = this.volume;
    this.utterance.rate = this.rate;
    this.utterance.pitch = this.pitch;
    
    // Select a voice if available (preferably a calm, soothing female voice)
    const voices = this.speechSynthesis.getVoices();
    const preferredVoices = voices.filter(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') || 
      voice.name.includes('Google UK English Female')
    );
    
    if (preferredVoices.length > 0) {
      this.utterance.voice = preferredVoices[0];
    }
    
    // Set the end callback
    if (onEnd) {
      this.utterance.onend = onEnd;
    }
    
    // Start speaking
    this.speechSynthesis.speak(this.utterance);
    this.isPlaying = true;
  }

  public pauseSpeech(): void {
    if (this.speechSynthesis && this.isPlaying) {
      console.log("Pausing speech");
      this.speechSynthesis.pause();
      this.isPlaying = false;
    }
  }

  public resumeSpeech(): void {
    if (this.speechSynthesis && !this.isPlaying) {
      console.log("Resuming speech");
      this.speechSynthesis.resume();
      this.isPlaying = true;
    }
  }

  public stopSpeech(): void {
    if (this.speechSynthesis) {
      console.log("Stopping speech");
      this.speechSynthesis.cancel();
      this.isPlaying = false;
    }
  }

  public pauseAll(): void {
    this.pauseSpeech();
    this.pauseBackgroundMusic();
  }
  
  public resumeAll(): void {
    this.resumeSpeech();
    this.resumeBackgroundMusic();
  }

  public cleanUp(): void {
    this.stopSpeech();
    this.stopBackgroundMusic();
  }
  
  public getMusicVolume(): number {
    return this.musicVolume;
  }
  
  public getSpeechVolume(): number {
    return this.volume;
  }
}

// Singleton export
export const audioService = AudioService.getInstance();