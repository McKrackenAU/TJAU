/**
 * Quick Card Generation for Essential Cards 0-4
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

async function generateCard(name: string, filename: string, prompt: string): Promise<boolean> {
  try {
    console.log(`Creating ${name}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard"
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) return false;

    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    
    const outputDir = path.join("public", "authentic-cards", "major-arcana");
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, filename), Buffer.from(imageBuffer));
    
    console.log(`✅ ${name} complete`);
    return true;
  } catch (error) {
    console.error(`❌ ${name} failed:`, error);
    return false;
  }
}

async function generateEssentialCards() {
  console.log("🎨 Generating essential cards 0-4...");
  
  const cards = [
    { name: "The Fool", filename: "00-fool.png", prompt: "Traditional tarot Fool card with young traveler at cliff edge, white rose, small bag, loyal dog, bright sun" },
    { name: "The Magician", filename: "01-magician.png", prompt: "Traditional tarot Magician with altar, four suits, one hand up one down, infinity symbol" },
    { name: "High Priestess", filename: "02-high-priestess.png", prompt: "Traditional High Priestess between pillars, blue robes, crescent crown, scroll" },
    { name: "The Empress", filename: "03-empress.png", prompt: "Traditional Empress on throne in garden, star crown, flowing robes, wheat field" },
    { name: "The Emperor", filename: "04-emperor.png", prompt: "Traditional Emperor on stone throne, red robes, scepter, ram symbols" }
  ];

  let count = 0;
  for (const card of cards) {
    if (await generateCard(card.name, card.filename, card.prompt)) {
      count++;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`🌟 Generated ${count}/5 essential cards`);
}

generateEssentialCards().catch(console.error);