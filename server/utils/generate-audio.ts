import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current filename and directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to generate a sine wave audio file
function generateSineWave(
  frequency: number,
  durationSeconds: number,
  sampleRate: number = 44100,
  fadeInOutSeconds: number = 0.5
): Float32Array {
  const audioBuffer = new Float32Array(Math.floor(durationSeconds * sampleRate));
  const fadeInSamples = Math.floor(fadeInOutSeconds * sampleRate);
  const fadeOutSamples = Math.floor(fadeInOutSeconds * sampleRate);
  
  // Generate the sine wave with fade in/out
  for (let i = 0; i < audioBuffer.length; i++) {
    // Basic sine wave
    const value = Math.sin(2 * Math.PI * frequency * i / sampleRate);
    
    // Apply fade-in
    let amplitude = 1.0;
    if (i < fadeInSamples) {
      amplitude = i / fadeInSamples;
    }
    // Apply fade-out
    else if (i > audioBuffer.length - fadeOutSamples) {
      amplitude = (audioBuffer.length - i) / fadeOutSamples;
    }
    
    audioBuffer[i] = value * amplitude * 0.8; // 0.8 to avoid clipping
  }
  
  return audioBuffer;
}

// Function to generate a meditation music sample
function generateMeditationMusic(
  baseFrequency: number,
  durationSeconds: number,
  fileName: string
): void {
  const sampleRate = 44100;
  const channels = 2; // Stereo
  const bitDepth = 16;
  
  // Generate primary sine wave
  const primaryWave = generateSineWave(baseFrequency, durationSeconds, sampleRate);
  
  // Generate harmony wave (different frequency for interest)
  const harmonyWave = generateSineWave(baseFrequency * 1.5, durationSeconds, sampleRate);
  
  // Mix the two waves with different volumes in left and right channels
  const stereoBuffer = new Float32Array(primaryWave.length * channels);
  for (let i = 0; i < primaryWave.length; i++) {
    // Left channel (primary + quiet harmony)
    stereoBuffer[i * 2] = primaryWave[i] * 0.7 + harmonyWave[i] * 0.3;
    // Right channel (harmony + quiet primary)
    stereoBuffer[i * 2 + 1] = harmonyWave[i] * 0.7 + primaryWave[i] * 0.3;
  }
  
  // Convert to WAV file format
  const wavBuffer = generateWavFile(stereoBuffer, sampleRate, channels, bitDepth);
  
  // Write the file
  const outputDir = path.resolve(process.cwd(), 'public/audio');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(path.join(outputDir, fileName), wavBuffer);
  
  console.log(`Generated meditation audio: ${fileName}`);
}

// Helper function to create a WAV file header and concatenate with audio data
function generateWavFile(
  audioBuffer: Float32Array,
  sampleRate: number,
  channels: number,
  bitDepth: number
): Buffer {
  const dataLength = audioBuffer.length * (bitDepth / 8);
  const buffer = Buffer.alloc(44 + dataLength);
  
  // WAV header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(buffer.length - 8, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // fmt chunk size
  buffer.writeUInt16LE(1, 20); // audio format (PCM)
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * channels * (bitDepth / 8), 28); // byte rate
  buffer.writeUInt16LE(channels * (bitDepth / 8), 32); // block align
  buffer.writeUInt16LE(bitDepth, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength, 40);
  
  // Convert Float32Array to 16-bit PCM
  if (bitDepth === 16) {
    let offset = 44;
    for (let i = 0; i < audioBuffer.length; i++) {
      const sample = Math.max(-1, Math.min(1, audioBuffer[i]));
      const value = Math.floor(sample < 0 ? sample * 32768 : sample * 32767);
      buffer.writeInt16LE(value, offset);
      offset += 2;
    }
  }
  
  return buffer;
}

// Generate the meditation audio files
export function generateMeditationAudioFiles(): void {
  // Generate calm meditation music with 432Hz (healing frequency)
  generateMeditationMusic(432, 30, 'calm-meditation.mp3');
  
  // Generate nature-inspired sounds with 396Hz (grounding frequency)
  generateMeditationMusic(396, 30, 'nature-sounds.mp3');
  
  // Generate crystal bowl sounds with 528Hz (transformation frequency)
  generateMeditationMusic(528, 30, 'crystal-bowls.mp3');
  
  console.log('Generated all meditation audio files');
}

// Run the function if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  generateMeditationAudioFiles();
}