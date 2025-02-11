import OpenAI from "openai";
import { TarotCard } from "@shared/tarot-data";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateCardInterpretation(
  card: TarotCard,
  context?: string
): Promise<string> {
  const prompt = `As an expert Tarot reader, provide a personalized interpretation for the ${card.name} card.
${context ? `Consider this context: ${context}` : ""}
Include insights about:
- The card's general meaning
- How it relates to the querent's situation
- Advice or guidance based on this card
Keep the response concise but insightful, around 2-3 paragraphs.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a wise and experienced Tarot reader who provides insightful, compassionate interpretations."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 300
  });

  return response.choices[0].message.content || "Unable to generate interpretation.";
}

function generateThetaWave(frequency: number, durationSecs: number, sampleRate: number = 44100): Float32Array {
  const samples = durationSecs * sampleRate;
  const wave = new Float32Array(samples);

  for (let i = 0; i < samples; i++) {
    // Generate sine wave at theta frequency with higher amplitude
    wave[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.5; // Increased from 0.3 to 0.5
  }

  return wave;
}

function getCardFrequency(card: TarotCard): number {
  if (card.arcana === 'major') {
    // Major Arcana: Higher theta frequencies for spiritual insight
    return 6 + (card.number || 0) / 22; // Range: 6-7 Hz
  } else {
    // Minor Arcana: Lower theta frequencies for emotional processing
    const suitFrequencies: { [key: string]: number } = {
      'Wands': 5.5,    // Energy and passion
      'Cups': 4.5,     // Emotions and intuition
      'Swords': 5.0,   // Mental clarity
      'Pentacles': 4.0 // Material concerns
    };
    return suitFrequencies[card.suit || 'Wands'];
  }
}

export async function generateMeditation(card: TarotCard): Promise<{
  text: string;
  audioUrl: string;
  thetaFrequency: number;
}> {
  try {
    console.log(`Generating meditation for card: ${card.name}`);

    // Generate meditation script
    const meditationPrompt = `Create a short guided meditation script based on the ${card.name} Tarot card.
The meditation should:
- Be 2-3 minutes when read aloud
- Include breathing guidance
- Connect to the card's core meanings: ${card.meanings.upright.join(", ")}
- Guide the listener to reflect on these themes
- End with a gentle return to awareness

Keep the tone calming and peaceful. Use longer pauses between sentences.`;

    const scriptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a meditation guide who creates calming, insightful guided meditations. Use longer pauses between instructions."
        },
        {
          role: "user",
          content: meditationPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    console.log("Meditation script generated successfully");
    const meditationText = scriptResponse.choices[0].message.content || "";

    // Generate voice audio with slower, softer settings
    console.log("Generating audio from meditation script");
    const audioResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: meditationText,
      response_format: "mp3",
      speed: 0.85, // Slower speed
      voice_settings: {
        stability: 0.7,  // More stable voice
        similarity_boost: 0.3  // Softer tone
      }
    });

    console.log("Voice audio generated successfully");
    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

    // Generate theta wave frequency based on the card
    const thetaFreq = getCardFrequency(card);
    console.log(`Using theta frequency: ${thetaFreq}Hz for ${card.name}`);

    // Convert to base64
    const audioBase64 = audioBuffer.toString('base64');

    return {
      text: meditationText,
      audioUrl: `data:audio/mpeg;base64,${audioBase64}`,
      thetaFrequency: thetaFreq
    };
  } catch (error) {
    console.error("Error generating meditation:", error);
    throw error;
  }
}