/**
 * Test Single Card Fix - Three of Cups
 * Generate one card to verify the process is working correctly
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function testThreeOfCups(): Promise<void> {
  try {
    console.log("🎨 Testing Three of Cups generation...");
    
    const prompt = `Ultra-ethereal 3D Three of Cups tarot card. Three joyful friends celebrating together, each holding ornate chalices raised in a toast. Translucent figures with liquid starlight hair flowing like cosmic waterfalls, celestial features glowing with inner light. EXACTLY THREE ornate golden cups prominently displayed - one in each person's hand. Scene radiates friendship, celebration, community spirit. Background of swirling pink and purple nebulae with golden light particles. Ultra-realistic 3D depth with translucent, dreamlike qualities. Musky pink/purple palette with golden accents. Commercial use, no copyright issues.`;

    const response = await openai.images.generate({
      model: "dall-e-3", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd"
    });

    if (!response.data[0]?.url) {
      throw new Error("No image URL returned");
    }

    const imageResponse = await fetch(response.data[0].url);
    const imageBuffer = await imageResponse.arrayBuffer();
    const outputPath = path.join("public", "authentic-cards", "minor-arcana", "cups", "three-of-cups.png");
    
    fs.writeFileSync(outputPath, new Uint8Array(imageBuffer));
    console.log("✅ Three of Cups generated successfully!");
    console.log(`File size: ${fs.statSync(outputPath).size} bytes`);
    
  } catch (error) {
    console.error("❌ Failed to generate Three of Cups:", error);
  }
}

testThreeOfCups().catch(console.error);