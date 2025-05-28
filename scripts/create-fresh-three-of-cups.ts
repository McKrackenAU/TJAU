/**
 * Create Fresh Three of Cups - Ultra-Ethereal 3D Style
 */
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function createFreshThreeOfCups(): Promise<void> {
  try {
    console.log("🎨 Creating fresh Three of Cups with ultra-ethereal 3D style...");
    
    const prompt = `Ultra-ethereal 3D Three of Cups tarot card with breathtaking lifelike quality. Three joyful friends celebrating together in perfect harmony, each holding ornate chalices raised in toast. Translucent, dreamlike figures with liquid starlight hair flowing in cosmic winds. Celestial features glowing with inner light, musky pink and purple aurora skin tones. Background of swirling pink and purple nebulae with golden starlight. EXACTLY THREE ornate golden cups prominently displayed - each cup detailed with intricate celestial engravings. The scene radiates friendship, celebration, and community joy. Ultra-realistic 3D depth with cinematic lighting, mystical atmosphere. Photographic realism with magical pink purple color palette. Completely original artistic interpretation. No text or numbers on card.`;

    const response = await openai.images.generate({
      model: "dall-e-3", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd"
    });

    if (!response.data[0]?.url) {
      throw new Error("No image URL received from OpenAI");
    }

    const imageResponse = await fetch(response.data[0].url);
    const imageBuffer = await imageResponse.arrayBuffer();
    const outputPath = path.join("public", "authentic-cards", "minor-arcana", "cups", "three-of-cups.png");
    
    fs.writeFileSync(outputPath, new Uint8Array(imageBuffer));
    console.log(`✅ Created fresh Three of Cups -> ${outputPath}`);
    
  } catch (error) {
    console.error("❌ Failed to create Three of Cups:", error);
  }
}

createFreshThreeOfCups().catch(console.error);