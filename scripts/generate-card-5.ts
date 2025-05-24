/**
 * Generate The Hierophant (Card 5)
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateHierophant() {
  try {
    console.log("🎨 Generating The Hierophant...");
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Traditional tarot card The Hierophant: seated religious figure in ornate robes on throne, raising hand in blessing, holding staff with triple cross, two kneeling students below, spiritual teacher and wisdom, sacred knowledge, traditional symbolism, vertical card format",
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error("No image generated");
    }

    const imageResponse = await fetch(imageUrl);
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    
    const filepath = path.join("public", "assets", "cards", "5.png");
    fs.writeFileSync(filepath, buffer);
    
    console.log("✅ The Hierophant saved successfully!");
    return true;
    
  } catch (error) {
    console.error("❌ Error:", error);
    return false;
  }
}

generateHierophant();