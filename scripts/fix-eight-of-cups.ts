/**
 * Fix Eight of Cups - Walking Away Journey
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function fixEightOfCups(): Promise<void> {
  try {
    console.log("🎨 Creating improved Eight of Cups with walking away symbolism...");
    
    const prompt = `Ultra-ethereal 3D Eight of Cups tarot card. A cloaked figure with flowing liquid starlight hair walking away under moonlight, leaving behind EXACTLY EIGHT ornate chalices arranged neatly in the foreground. The figure moves toward distant mountains, symbolizing abandoning what no longer serves them. Translucent, dreamlike quality with cosmic winds. Background of mystical pink and purple starscape with crescent moon. The eight cups are clearly visible and prominently arranged, showing what is being left behind for spiritual growth. Ultra-realistic 3D depth, musky pink/purple palette, melancholic yet hopeful atmosphere. The card depicts spiritual journey and moving on to higher purpose.`;

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
    const imageBuffer = await imageResponse.arrayBuffer();
    const outputPath = path.join("public", "authentic-cards", "minor-arcana", "cups", "eight-of-cups.png");
    
    fs.writeFileSync(outputPath, new Uint8Array(imageBuffer));
    console.log(`✅ Fixed Eight of Cups with walking away symbolism -> ${outputPath}`);
    
  } catch (error) {
    console.error("❌ Failed to fix Eight of Cups:", error);
  }
}

fixEightOfCups().catch(console.error);