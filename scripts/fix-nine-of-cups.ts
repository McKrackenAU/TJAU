/**
 * Fix Nine of Cups - 3D Emotional Satisfaction and Wish Fulfillment
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function fixNineOfCups(): Promise<void> {
  try {
    console.log("🎨 Creating improved Nine of Cups with 3D satisfaction...");
    
    const prompt = `Ultra-ethereal 3D Nine of Cups tarot card. A deeply satisfied figure with liquid starlight hair sitting contentedly with arms crossed, radiating pure joy and fulfillment. Behind them, EXACTLY NINE ornate golden chalices are arranged in a perfect arc, each glowing with inner light. The figure's translucent features beam with happiness and accomplishment. Background of swirling pink and purple cosmic nebulae with golden starlight. The nine cups are prominently displayed in perfect symmetrical arrangement. Ultra-realistic 3D depth with cosmic lighting, musky pink/purple palette with brilliant golden accents. The card embodies emotional satisfaction, contentment, wish fulfillment, and the "wish card" energy. Exactly nine cups must be clearly visible and perfectly arranged.`;

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
    const outputPath = path.join("public", "authentic-cards", "minor-arcana", "cups", "nine-of-cups.png");
    
    fs.writeFileSync(outputPath, new Uint8Array(imageBuffer));
    console.log(`✅ Fixed Nine of Cups with 3D satisfaction and wish fulfillment -> ${outputPath}`);
    
  } catch (error) {
    console.error("❌ Failed to fix Nine of Cups:", error);
  }
}

fixNineOfCups().catch(console.error);