// Emergency Voice Service Fallback for Production
// Bypasses deployment caching issues

export async function emergencyVoiceService(text: string): Promise<Buffer> {
  // Direct ElevenLabs API call with hardcoded working configuration
  const JOSIE_VOICE_ID = "YIWKjkOTvYsv48VTI6gT";
  const API_KEY = process.env.ELEVENLABS_API_KEY;
  
  if (!API_KEY) {
    throw new Error("Emergency voice service: API key missing");
  }
  
  console.log("=== EMERGENCY VOICE SERVICE ACTIVATED ===");
  console.log("Using Josie voice ID:", JOSIE_VOICE_ID);
  console.log("Text length:", text.length);
  console.log("API key length:", API_KEY.length);
  
  const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + JOSIE_VOICE_ID, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': API_KEY,
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_turbo_v2',
      voice_settings: {
        stability: 0.8,
        similarity_boost: 0.9,
        style: 0.2,
        use_speaker_boost: true
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Emergency voice service failed: ${response.status} - ${errorData}`);
  }

  console.log("=== EMERGENCY VOICE SERVICE SUCCESS ===");
  const audioBuffer = Buffer.from(await response.arrayBuffer());
  console.log("Audio buffer size:", audioBuffer.length);
  
  return audioBuffer;
}