/**
 * Direct Card Generation - Simple and Reliable
 */

import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

async function generateSingleCard() {
  try {
    console.log("🎨 Generating The Fool...");
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Beautiful traditional tarot card of The Fool. Young traveler at cliff edge with white rose, small bag on stick, loyal white dog. Bright sun, mountains. Colorful medieval clothing. New beginnings.",
      n: 1,
      size: "1024x1024",
      quality: "standard"
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      console.log("❌ No image URL received");
      return;
    }

    console.log("📥 Downloading image...");
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    
    fs.mkdirSync("public/authentic-cards/major-arcana", { recursive: true });
    fs.writeFileSync("public/authentic-cards/major-arcana/00-fool.png", Buffer.from(imageBuffer));
    
    console.log("✅ The Fool card created successfully!");
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

generateSingleCard();