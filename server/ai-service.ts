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

// Generate theta wave frequencies for meditation background
function generateThetaWave(frequency: number, durationSecs: number, sampleRate: number = 44100): Float32Array {
  const samples = durationSecs * sampleRate;
  const wave = new Float32Array(samples);

  for (let i = 0; i < samples; i++) {
    // Generate sine wave at theta frequency with higher amplitude
    wave[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.5; // Increased amplitude for better audibility
  }

  return wave;
}

function getCardFrequency(card: TarotCard): number {
  if (card.arcana === 'major') {
    // Major Arcana: Higher theta frequencies for spiritual insight (6-7 Hz)
    return 6 + (card.number || 0) / 22;
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

// Enhanced meditation generation with improved prompts and audio
export async function generateMeditation(card: TarotCard): Promise<{
  text: string;
  audioUrl: string;
  thetaFrequency: number;
}> {
  try {
    console.log(`Generating meditation for card: ${card.name}`);

    // Generate meditation script with more pauses and detailed guidance
    const meditationPrompt = `Create a short guided meditation script based on the ${card.name} Tarot card.
The meditation should:
- Be 2-3 minutes when read aloud at a moderate pace
- Include breathing guidance with long pauses (use ... for pauses)
- Connect to the card's core meanings: ${card.meanings.upright.join(", ")}
- Guide the listener to reflect on these themes
- End with a gentle return to awareness

Keep the tone calming and peaceful. Add explicit pause markers (...) between each instruction to ensure proper pacing.`;

    const scriptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a meditation guide who creates calming, insightful guided meditations. Use many pauses between instructions, marked with ..."
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

    // Generate voice audio with slower settings for better meditation pacing
    console.log("Generating audio from meditation script");
    const audioResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", // Using a calming voice
      input: meditationText,
      response_format: "mp3",
      speed: 0.85, // Slowed down for more meditative pacing
    });

    console.log("Voice audio generated successfully");
    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
    const audioBase64 = audioBuffer.toString('base64');

    // Calculate appropriate theta frequency for this card
    const thetaFrequency = getCardFrequency(card);

    return {
      text: meditationText,
      audioUrl: `data:audio/mpeg;base64,${audioBase64}`,
      thetaFrequency
    };
  } catch (error) {
    console.error("Error generating meditation:", error);
    throw error;
  }
}

export async function generateDailyAffirmation(card: TarotCard): Promise<string> {
  const prompt = `Create an inspiring daily affirmation based on the ${card.name} tarot card.
Consider these upright meanings: ${card.meanings.upright.join(", ")}
The affirmation should:
- Be positive and empowering
- Be in first person ("I am...", "I embrace...", etc.)
- Connect to the card's core themes
- Be concise (1-2 sentences)
Keep the tone uplifting and motivational.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an inspiring spiritual guide who creates powerful, positive affirmations."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 100
  });

  return response.choices[0].message.content || "I embrace the wisdom of the cards and trust in my journey.";
}

// Add this new function after the existing ones
export async function analyzeCardCombination(
  cards: TarotCard[],
  context?: string
): Promise<string> {
  const cardDescriptions = cards.map(card =>
    `${card.name}: ${card.meanings.upright.join(", ")}`
  ).join("\n");

  const prompt = `As an expert Tarot reader, analyze the combination of these cards:
${cardDescriptions}

${context ? `Consider this context: ${context}` : ""}

Please provide:
1. The overall energy and theme of this combination
2. How the cards interact with and influence each other
3. Key insights and guidance based on this specific combination

Keep the response concise but insightful, focusing on the unique synergy between these cards.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a wise and experienced Tarot reader who excels at understanding the complex interactions between multiple cards."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  return response.choices[0].message.content || "Unable to generate combination analysis.";
}