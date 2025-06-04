
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

interface VoiceCloneResponse {
  voice_id: string;
  name: string;
  status: string;
}

interface GenerateSpeechResponse {
  audio: Buffer;
}

class VoiceCloningService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY || '';
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not found. Voice cloning will not be available.');
    }
  }

  // Upload voice sample and create a cloned voice
  async createVoiceClone(audioFilePath: string, voiceName: string, description: string = ''): Promise<string | null> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const formData = new FormData();
      formData.append('name', voiceName);
      formData.append('description', description);
      formData.append('files', fs.createReadStream(audioFilePath));

      const response = await fetch(`${this.baseUrl}/voices/add`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorData}`);
      }

      const data: VoiceCloneResponse = await response.json();
      console.log(`Voice clone created successfully: ${data.voice_id}`);
      return data.voice_id;
    } catch (error) {
      console.error('Error creating voice clone:', error);
      throw error;
    }
  }

  // Generate speech using a cloned voice
  async generateSpeech(text: string, voiceId: string, stability: number = 0.75, similarity: number = 0.75): Promise<Buffer> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: stability,
            similarity_boost: similarity,
            style: 0.2,
            use_speaker_boost: true
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorData}`);
      }

      const audioBuffer = Buffer.from(await response.arrayBuffer());
      return audioBuffer;
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  }

  // List available voices
  async getVoices(): Promise<any[]> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const data = await response.json();
      return data.voices;
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw error;
    }
  }

  // Delete a voice
  async deleteVoice(voiceId: string): Promise<boolean> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices/${voiceId}`, {
        method: 'DELETE',
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting voice:', error);
      return false;
    }
  }
}

export const voiceCloningService = new VoiceCloningService();
