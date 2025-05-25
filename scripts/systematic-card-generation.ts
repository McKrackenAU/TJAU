/**
 * Systematic Card Generation - All 5 Major Arcana Cards 0-4
 */
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const cards = [
  { id: "0", name: "The Fool", prompt: "The Fool tarot card: young person at cliff edge with small dog, white rose, knapsack, bright sun, traditional Rider-Waite style" },
  { id: "1", name: "The Magician", prompt: "The Magician tarot card: robed figure with one hand up, one down, infinity symbol, altar with wand cup sword pentacle, traditional style" },
  { id: "2", name: "The High Priestess", prompt: "The High Priestess tarot card: woman between black and white pillars, crescent moon, pomegranate veil, blue robes, traditional style" },
  { id: "3", name: "The Empress", prompt: "The Empress tarot card: pregnant woman on throne in nature, crown of stars, Venus shield, wheat field, flowing stream, traditional style" },
  { id: "4", name: "The Emperor", prompt: "The Emperor tarot card: bearded man on stone throne, crown, red robes, scepter, ram heads, mountains behind, traditional style" }
];

async function generateCard(card: any) {
  console.log(`🎨 Generating ${card.name}...`);
  
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: card.prompt,
      size: "1024x1024",
      quality: "standard"
    });

    if (response.data?.[0]?.url) {
      const imageResponse = await fetch(response.data[0].url);
      const buffer = Buffer.from(await imageResponse.arrayBuffer());
      
      const filename = `card-${card.id}-${card.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      fs.writeFileSync(`public/authentic-cards/major-arcana/${filename}`, buffer);
      
      console.log(`✅ ${card.name} completed: ${filename}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error generating ${card.name}:`, error.message);
    return false;
  }
}

async function generateAllCards() {
  console.log("🚀 Starting systematic generation of Major Arcana 0-4...");
  
  for (const card of cards) {
    const success = await generateCard(card);
    if (success) {
      console.log(`🎉 ${card.name} generation successful!`);
    }
  }
  
  console.log("🎯 Generation process completed!");
}

generateAllCards();