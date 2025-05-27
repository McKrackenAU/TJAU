/**
 * Fix Seven of Cups - Exactly 7 Cups with Choices and Illusions
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function fixSevenOfCups(): Promise<void> {
  try {
    console.log("🎨 Creating improved Seven of Cups with exactly 7 cups...");
    
    const prompt = `Ultra-ethereal 3D Seven of Cups tarot card. A translucent figure with liquid starlight hair contemplating EXACTLY SEVEN floating chalices arranged in clouds, each containing different mystical visions: a castle, a serpent, a jeweled crown, a dragon, a laurel wreath, a shadowy figure, and scattered treasure. The seven cups hover in ethereal mist showing illusions and multiple choices. Dreamlike quality with cosmic pink and purple nebulae background. Each of the SEVEN cups is clearly visible, ornate, and distinct. The scene represents fantasy, illusion, wishful thinking, and too many options. Ultra-realistic 3D depth, musky pink/purple palette, celestial lighting. Exactly seven cups must be prominently displayed and easily counted.`;

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

    const imageResponse = await fetch(response.data[0].url);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const outputPath = path.join("public", "authentic-cards", "minor-arcana", "cups", "seven-of-cups.png");
    
    fs.writeFileSync(outputPath, new Uint8Array(imageBuffer));
    
    console.log(`✅ Fixed Seven of Cups with exactly 7 cups and proper symbolism -> ${outputPath}`);
    
  } catch (error) {
    console.error("❌ Failed to fix Seven of Cups:", error);
  }
}

fixSevenOfCups().catch(console.error);