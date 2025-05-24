/**
 * Direct Single Card Generation - Simple and Reliable
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateHierophant() {
  try {
    console.log("🎨 Generating The Hierophant with Tier 2 limits...");
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Beautiful traditional tarot card The Hierophant: religious figure in ornate robes seated on throne, raising hand in blessing, spiritual teacher and sacred wisdom, authentic Rider-Waite style, vertical card format",
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL received");
    }

    console.log("✅ Image generated successfully, downloading...");

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Download failed: ${imageResponse.status}`);
    }

    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    const filepath = path.join("public", "assets", "cards", "5.png");
    
    fs.writeFileSync(filepath, buffer);
    console.log("✅ The Hierophant saved successfully as 5.png!");
    
    // Verify the file was created
    const stats = fs.statSync(filepath);
    console.log(`📁 File size: ${Math.round(stats.size / 1024)}KB`);
    
    return true;
    
  } catch (error) {
    console.error("❌ Generation failed:", error);
    return false;
  }
}

generateHierophant().then(success => {
  if (success) {
    console.log("🌟 The Hierophant is ready! One card down, 16 to go.");
  } else {
    console.log("❌ Failed to generate The Hierophant");
  }
});