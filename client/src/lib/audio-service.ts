// Audio service for handling background music and speech synthesis
export class AudioService {
  private static instance: AudioService;
  private backgroundMusic: HTMLAudioElement | null = null;
  private speechSynthesis: SpeechSynthesis | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private currentSpeechAudio: HTMLAudioElement | null = null;
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
      '/audio/calm-meditation.wav',
      '/audio/nature-sounds.wav',
      '/audio/crystal-bowls.wav'
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

  public async speak(text: string, onEnd?: () => void): Promise<void> {
    try {
      // Stop any ongoing speech and wait a moment for cleanup
      this.stopSpeech();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log("=== VOICE SERVICE: Generating speech with Josie voice ===");
      console.log("Text preview:", text.substring(0, 100) + "...");
      
      // Mobile app specific routing - use production server for API calls
      const isMobileApp = window.location.protocol === 'capacitor:' || 
                         window.location.hostname === 'localhost' ||
                         navigator.userAgent.includes('Tarot Journey App') ||
                         window.location.origin.includes('capacitor');
      
      const baseUrl = isMobileApp ? 'https://www.tarotjourney.au' : window.location.origin;
      const apiUrl = `${baseUrl}/api/generate-speech`;
      
      console.log(`Mobile app: ${isMobileApp} | API URL: ${apiUrl}`);
      
      // Generate speech using server endpoint with Josie voice
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          text: text,
          speed: this.rate
        })
      });
      
      if (!response.ok) {
        console.error(`Server speech generation failed with status ${response.status}, falling back to browser synthesis`);
        this.fallbackToSpeechSynthesis(text, onEnd);
        return;
      }
      
      const audioBuffer = await response.arrayBuffer();
      console.log(`=== VOICE SERVICE: Josie voice audio received ===`);
      console.log(`Audio buffer size: ${audioBuffer.byteLength} bytes`);
      
      if (audioBuffer.byteLength === 0) {
        console.error("=== VOICE SERVICE ERROR: Empty audio buffer ===");
        this.fallbackToSpeechSynthesis(text, onEnd);
        return;
      }
      
      const audioUrl = URL.createObjectURL(new Blob([audioBuffer], { type: 'audio/mpeg' }));
      
      // Create audio element and play
      const audio = new Audio(audioUrl);
      audio.volume = this.volume;
      
      // Store reference to current speech audio for pause/resume control
      this.currentSpeechAudio = audio;
      
      audio.onended = () => {
        console.log("=== VOICE SERVICE: Josie voice playback completed ===");
        URL.revokeObjectURL(audioUrl);
        this.isPlaying = false;
        this.currentSpeechAudio = null;
        if (onEnd) onEnd();
      };
      
      audio.onerror = (error) => {
        console.error("=== VOICE SERVICE ERROR: Audio playback failed ===", error);
        URL.revokeObjectURL(audioUrl);
        this.currentSpeechAudio = null;
        this.fallbackToSpeechSynthesis(text, onEnd);
      };
      
      await audio.play();
      this.isPlaying = true;
      console.log("=== VOICE SERVICE: Josie voice playback started successfully ===");
      
    } catch (error) {
      console.error("=== VOICE SERVICE ERROR: Server speech generation failed ===", error);
      this.fallbackToSpeechSynthesis(text, onEnd);
    }
  }
  
  private fallbackToSpeechSynthesis(text: string, onEnd?: () => void): void {
    if (!this.speechSynthesis) {
      console.warn("=== VOICE SERVICE: Speech synthesis not available ===");
      if (onEnd) onEnd();
      return;
    }
    
    console.log("=== VOICE SERVICE: Using fallback browser speech synthesis ===");
    
    // Clear any ongoing speech
    this.speechSynthesis.cancel();
    
    // Wait for voices to load if they haven't already
    const setupSpeech = () => {
      // Create a new utterance
      this.utterance = new SpeechSynthesisUtterance(text);
      this.utterance.volume = this.volume;
      this.utterance.rate = this.rate;
      this.utterance.pitch = this.pitch;
      
      // Select a voice (preferably a calm, soothing female voice that sounds like Josie)
      const voices = this.speechSynthesis!.getVoices();
      console.log(`Available voices: ${voices.length}`);
      
      // Priority order for voice selection to maintain consistency
      const preferredVoiceNames = [
        'Samantha', // macOS
        'Google UK English Female', // Chrome
        'Microsoft Zira - English (United States)', // Windows
        'Karen', // macOS alternative
        'Fiona', // macOS alternative
        'Female', // Generic fallback
      ];
      
      let selectedVoice = null;
      for (const voiceName of preferredVoiceNames) {
        selectedVoice = voices.find(voice => voice.name.includes(voiceName));
        if (selectedVoice) break;
      }
      
      // If no preferred voice found, try to find any female voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('woman')
        );
      }
      
      if (selectedVoice) {
        this.utterance.voice = selectedVoice;
        console.log(`=== VOICE SERVICE: Selected fallback voice: ${selectedVoice.name} ===`);
      } else {
        console.log("=== VOICE SERVICE: Using default system voice ===");
      }
      
      // Set the end callback
      if (onEnd) {
        this.utterance.onend = () => {
          console.log("=== VOICE SERVICE: Fallback speech completed ===");
          this.isPlaying = false;
          onEnd();
        };
      }
      
      this.utterance.onerror = (event) => {
        console.error("=== VOICE SERVICE ERROR: Speech synthesis failed ===", event);
        this.isPlaying = false;
        if (onEnd) onEnd();
      };
      
      // Start speaking
      this.speechSynthesis!.speak(this.utterance);
      this.isPlaying = true;
    };
    
    // Handle browsers that load voices asynchronously
    const voices = this.speechSynthesis.getVoices();
    if (voices.length === 0) {
      console.log("=== VOICE SERVICE: Waiting for voices to load ===");
      this.speechSynthesis.addEventListener('voiceschanged', setupSpeech, { once: true });
      // Fallback timeout in case voiceschanged never fires
      setTimeout(setupSpeech, 1000);
    } else {
      setupSpeech();
    }
  }

  public pauseSpeech(): void {
    console.log("Pausing speech");
    
    // Handle server-generated audio
    if (this.currentSpeechAudio && this.isPlaying) {
      this.currentSpeechAudio.pause();
      this.isPlaying = false;
      return;
    }
    
    // Fallback to speech synthesis
    if (this.speechSynthesis && this.isPlaying) {
      this.speechSynthesis.pause();
      this.isPlaying = false;
    }
  }

  public resumeSpeech(): void {
    console.log("Resuming speech");
    
    // Handle server-generated audio
    if (this.currentSpeechAudio && !this.isPlaying) {
      this.currentSpeechAudio.play();
      this.isPlaying = true;
      return;
    }
    
    // Fallback to speech synthesis
    if (this.speechSynthesis && !this.isPlaying) {
      this.speechSynthesis.resume();
      this.isPlaying = true;
    }
  }

  public stopSpeech(): void {
    console.log("Stopping speech");
    
    // Handle server-generated audio
    if (this.currentSpeechAudio) {
      this.currentSpeechAudio.pause();
      this.currentSpeechAudio.currentTime = 0;
      this.currentSpeechAudio.onended = null; // Clear event listener to prevent callback
      this.currentSpeechAudio = null;
      this.isPlaying = false;
      return;
    }
    
    // Fallback to speech synthesis
    if (this.speechSynthesis) {
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