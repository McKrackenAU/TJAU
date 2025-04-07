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
  
  private constructor() {
    if (typeof window !== 'undefined') {
      this.speechSynthesis = window.speechSynthesis;
      // Create the background music element
      this.backgroundMusic = new Audio();
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = 0.3; // Lower volume for background music
    }
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public setMusicVolume(volume: number): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = Math.max(0, Math.min(1, volume));
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
      if (this.backgroundMusic.src !== url) {
        this.backgroundMusic.src = url;
        this.backgroundMusic.load();
      }
      
      // Play the music
      await this.backgroundMusic.play();
    } catch (error) {
      console.error("Error playing background music:", error);
    }
  }

  public pauseBackgroundMusic(): void {
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      this.backgroundMusic.pause();
    }
  }

  public stopBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
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
      this.speechSynthesis.pause();
      this.isPlaying = false;
    }
  }

  public resumeSpeech(): void {
    if (this.speechSynthesis && !this.isPlaying) {
      this.speechSynthesis.resume();
      this.isPlaying = true;
    }
  }

  public stopSpeech(): void {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
      this.isPlaying = false;
    }
  }

  public cleanUp(): void {
    this.stopSpeech();
    this.stopBackgroundMusic();
  }
}

// Singleton export
export const audioService = AudioService.getInstance();