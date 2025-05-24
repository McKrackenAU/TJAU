/**
 * Generate Just The Hierophant (Card 5)
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
      prompt: "Traditional tarot card The Hierophant: religious figure in ornate robes seated on throne, raising hand in blessing, holding staff with triple cross, two students kneeling below, spiritual teacher and sacred wisdom, traditional Rider-Waite style, vertical format",
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      console.error("No image URL returned");
      return false;
    }

    console.log("✅ Image generated, downloading...");

    const imageResponse = await fetch(imageUrl);
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    
    const filepath = path.join("public", "assets", "cards", "5.png");
    fs.writeFileSync(filepath, buffer);
    
    console.log("✅ The Hierophant saved successfully as 5.png!");
    return true;
    
  } catch (error) {
    console.error("❌ Error generating The Hierophant:", error);
    return false;
  }
}

generateHierophant().then(success => {
  if (success) {
    console.log("🌟 The Hierophant is ready!");
  } else {
    console.log("❌ Generation failed");
  }
}).catch(console.error);