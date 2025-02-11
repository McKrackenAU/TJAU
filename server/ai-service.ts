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

export async function generateMeditation(card: TarotCard): Promise<{
  text: string;
  audioUrl: string;
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

Keep the tone calming and peaceful.`;

    const scriptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a meditation guide who creates calming, insightful guided meditations."
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

    // Generate audio from the meditation script
    console.log("Generating audio from meditation script");
    const audioResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", // Using a calming voice
      input: meditationText,
      response_format: "mp3",
    });

    console.log("Audio generated successfully");
    // Get the binary audio data
    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
    const audioBase64 = audioBuffer.toString('base64');

    return {
      text: meditationText,
      audioUrl: `data:audio/mpeg;base64,${audioBase64}`
    };
  } catch (error) {
    console.error("Error generating meditation:", error);
    throw error;
  }
}