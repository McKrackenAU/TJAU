/**
 * Test Single Card Generation - The Hierophant
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function testCardGeneration() {
  try {
    console.log("🎨 Testing image generation for The Hierophant...");
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Beautiful traditional tarot card The Hierophant: religious figure in robes seated on throne, blessing pose, spiritual wisdom, sacred knowledge, traditional Rider-Waite style, vertical format",
      n: 1,
      size: "1024x1024",
      quality: "standard", // Using standard quality for faster generation
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL in response");
    }

    console.log("✅ Image generated successfully! URL:", imageUrl.substring(0, 50) + "...");

    // Download and save
    const imageResponse = await fetch(imageUrl);
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    
    const filepath = path.join("public", "assets", "cards", "5.png");
    fs.writeFileSync(filepath, buffer);
    
    console.log("✅ The Hierophant saved as 5.png");
    return true;
    
  } catch (error) {
    console.error("❌ Error:", error);
    return false;
  }
}

testCardGeneration();