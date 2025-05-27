/**
 * Fix Three of Cups - Proper Celebration Scene
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function fixThreeOfCups(): Promise<void> {
  try {
    console.log("🎨 Creating improved Three of Cups with proper celebration...");
    
    const prompt = `Ultra-ethereal 3D Three of Cups tarot card. Three friends celebrating together in joyful harmony, each holding an ornate chalice raised in toast. Translucent, dreamlike figures with liquid starlight hair flowing in cosmic winds. Celestial features glowing with inner light. Background of swirling pink and purple nebulae, with exactly THREE ornate golden cups prominently displayed. The scene radiates friendship, celebration, and community. Musky pink and purple color palette with golden accents. Ultra-realistic 3D depth, cinematic lighting, mystical atmosphere. The card should clearly show the number 3 and depict celebration and togetherness.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    if (!response.data?.[0]?.url) {
      throw new Error("No image URL in response");
    }

    // Download the image
    const imageResponse = await fetch(response.data[0].url);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const outputPath = path.join("public", "authentic-cards", "minor-arcana", "cups", "three-of-cups.png");
    
    // Save the image
    fs.writeFileSync(outputPath, new Uint8Array(imageBuffer));
    
    console.log(`✅ Fixed Three of Cups with proper celebration scene -> ${outputPath}`);
    
  } catch (error) {
    console.error("❌ Failed to fix Three of Cups:", error);
  }
}

fixThreeOfCups().catch(console.error);