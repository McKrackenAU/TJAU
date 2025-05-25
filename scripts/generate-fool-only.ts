/**
 * Generate The Fool Card - Quick Single Generation
 */
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateFoolCard() {
  try {
    console.log("🔮 Generating The Fool with authentic symbolism...");
    
    const prompt = `Create a beautiful, authentic tarot card artwork for The Fool (Major Arcana 0).

Traditional symbolism to include:
- A young person at the edge of a cliff, stepping forward with confidence
- A small knapsack containing worldly possessions
- A white rose in hand symbolizing purity and new beginnings
- A loyal small dog at their feet representing instinct and protection
- Bright sun shining in a clear sky representing optimism
- Mountains in the distance showing the journey ahead
- Vibrant colors: bright blues, yellows, whites
- Joyful, optimistic expression looking toward the future

Style: Traditional tarot card artwork, rich symbolic detail, classical composition. The image should convey innocence, new beginnings, and fearless adventure into the unknown.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (response.data && response.data[0]?.url) {
      const imageUrl = response.data[0].url;
      console.log("✨ The Fool generated successfully, saving...");
      
      const imageResponse = await fetch(imageUrl);
      const arrayBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const outputPath = path.join(process.cwd(), "public/authentic-cards/major-arcana/fresh-fool-final.png");
      fs.writeFileSync(outputPath, buffer);
      
      console.log(`🎉 The Fool saved: ${outputPath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("❌ Error:", error);
    return false;
  }
}

generateFoolCard();