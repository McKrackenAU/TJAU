/**
 * Fast Authentic Card Generation for App Launch
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

async function generateCard(name: string, filename: string, prompt: string): Promise<void> {
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
    if (!imageUrl) throw new Error("No image URL received");

    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    
    const outputPath = path.join("public", "authentic-cards", "major-arcana", filename);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✅ ${name} complete`);
  } catch (error) {
    console.error(`❌ ${name} failed:`, error);
  }
}

async function generateEssentialCards() {
  console.log("🎨 Generating essential cards for launch...");
  
  const cards = [
    { name: "The Fool", filename: "00-fool.png", prompt: "Traditional tarot Fool card. Young traveler at cliff edge with white rose, small bag, loyal dog. Bright sun, mountains. New beginnings." },
    { name: "The Magician", filename: "01-magician.png", prompt: "Traditional tarot Magician. Figure at altar with four suits, one hand up, one down. Infinity symbol. Manifestation power." },
    { name: "The High Priestess", filename: "02-high-priestess.png", prompt: "Traditional High Priestess between pillars. Blue robes, crescent crown, scroll. Intuition and wisdom." },
    { name: "The Empress", filename: "03-empress.png", prompt: "Traditional Empress on throne in garden. Star crown, flowing robes, wheat field. Motherhood and abundance." },
    { name: "The Emperor", filename: "04-emperor.png", prompt: "Traditional Emperor on stone throne. Red robes, scepter, ram symbols. Authority and structure." }
  ];

  for (const card of cards) {
    await generateCard(card.name, card.filename, card.prompt);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("🌟 Essential cards generated!");
}

generateEssentialCards().catch(console.error);