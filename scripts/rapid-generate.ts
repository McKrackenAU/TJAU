/**
 * Rapid Card Generation - Multiple Cards Quick
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Simplified prompts for faster generation
const quickCards = [
  { id: "5", name: "The Hierophant", prompt: "Tarot card The Hierophant: religious figure blessing, spiritual teacher" },
  { id: "6", name: "The Lovers", prompt: "Tarot card The Lovers: couple with angel above, divine love" },
  { id: "7", name: "The Chariot", prompt: "Tarot card The Chariot: warrior in chariot, victory" },
  { id: "8", name: "Strength", prompt: "Tarot card Strength: woman with lion, inner strength" },
  { id: "9", name: "The Hermit", prompt: "Tarot card The Hermit: old man with lantern, wisdom" }
];

async function rapidGenerate() {
  console.log("🚀 Rapid generation starting...");
  
  for (const card of quickCards) {
    try {
      console.log(`⚡ Generating ${card.name}...`);
      
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: card.prompt,
        n: 1,
        size: "1024x1024", // Standard tarot card size
        quality: "standard",
      });

      const imageUrl = response.data?.[0]?.url;
      if (imageUrl) {
        const imageResponse = await fetch(imageUrl);
        const buffer = Buffer.from(await imageResponse.arrayBuffer());
        
        const filepath = path.join("public", "assets", "cards", `${card.id}.png`);
        fs.writeFileSync(filepath, buffer);
        
        console.log(`✅ ${card.name} saved!`);
      }
    } catch (error) {
      console.log(`❌ ${card.name} failed:`, error.message);
    }
  }
  
  console.log("🎉 Rapid generation complete!");
}

rapidGenerate();