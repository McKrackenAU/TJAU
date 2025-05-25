/**
 * Generate Correct Card Images - Fresh 2025
 * Create new authentic artwork to replace cached old images
 */
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const cardsToFix = [
  { 
    id: "0", 
    name: "The Fool", 
    filename: "fool-2025.png",
    prompt: "The Fool tarot card: young person in colorful clothes standing at cliff edge with small white dog, white rose in hand, knapsack on stick, bright sun above, mountains in background, traditional Rider-Waite style, mystical and hopeful atmosphere"
  },
  { 
    id: "1", 
    name: "The Magician", 
    filename: "magician-2025.png",
    prompt: "The Magician tarot card: robed figure with one hand pointing up and one down, infinity symbol above head, altar table with wand cup sword pentacle, red roses and white lilies, traditional Rider-Waite style, powerful and focused energy"
  },
  { 
    id: "2", 
    name: "The High Priestess", 
    filename: "high-priestess-2025.png",
    prompt: "The High Priestess tarot card: mysterious woman seated between black and white pillars, crescent moon crown, blue robes, pomegranate tapestry behind, scroll in lap, traditional Rider-Waite style, serene and wise"
  },
  { 
    id: "3", 
    name: "The Empress", 
    filename: "empress-2025.png",
    prompt: "The Empress tarot card: pregnant woman on throne in lush garden, crown of twelve stars, flowing gown, Venus symbol shield, wheat field, waterfall, traditional Rider-Waite style, abundant and nurturing"
  },
  { 
    id: "4", 
    name: "The Emperor", 
    filename: "emperor-2025.png",
    prompt: "The Emperor tarot card: bearded man on stone throne, red robes, golden crown, ankh scepter, ram head throne decorations, barren mountains, traditional Rider-Waite style, authoritative and structured"
  }
];

async function generateCard(card: any): Promise<boolean> {
  console.log(`🎨 Generating fresh ${card.name}...`);
  
  try {
    const response = await openai.images.generate({
      model: "dall-e-3", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      prompt: card.prompt,
      size: "1024x1024",
      quality: "standard"
    });

    if (response.data?.[0]?.url) {
      console.log(`📥 Downloading ${card.name}...`);
      const imageResponse = await fetch(response.data[0].url);
      const buffer = Buffer.from(await imageResponse.arrayBuffer());
      
      // Save to fresh directory
      fs.writeFileSync(`public/cards-fresh-2025/${card.filename}`, buffer);
      
      console.log(`✅ ${card.name} completed: ${card.filename}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error generating ${card.name}:`, error.message);
    return false;
  }
}

async function generateAllCorrectCards() {
  console.log("🚀 Starting fresh card generation with new API key...");
  
  for (const card of cardsToFix) {
    const success = await generateCard(card);
    if (success) {
      console.log(`🎉 ${card.name} generation successful!`);
    }
    // Small delay between generations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log("🎯 Fresh card generation completed!");
}

generateAllCorrectCards();