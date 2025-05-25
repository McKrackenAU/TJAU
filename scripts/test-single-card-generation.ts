/**
 * Test Single Card Generation - The Fool
 */
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateTheFool() {
  try {
    console.log("🔮 Testing API with The Fool generation...");
    
    const prompt = `Create a beautiful, authentic tarot card artwork for The Fool (Major Arcana 0).

Traditional symbolism:
- A young person standing at the edge of a cliff, about to step into the unknown
- A small bag or knapsack containing life's experiences
- A white rose symbolizing purity and innocence
- A small dog as a faithful companion representing instinct
- The sun shining brightly behind, representing optimism
- Mountains in the distance symbolizing challenges ahead
- Bright, optimistic colors: yellows, whites, light blues
- The figure looking upward with joy and wonder

Style: Classical tarot card artwork, vibrant colors, detailed symbolic imagery. The card should convey new beginnings, innocence, and the spirit of adventure.`;

    console.log("📡 Sending request to OpenAI...");
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    console.log("✅ Response received from OpenAI");

    if (response.data?.[0]?.url) {
      const imageUrl = response.data[0].url;
      console.log("🖼️ Image URL received, downloading...");
      
      // Download and save the image
      const imageResponse = await fetch(imageUrl);
      const arrayBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const outputPath = path.join(process.cwd(), "public/authentic-cards/major-arcana/test-fool-correct.png");
      fs.writeFileSync(outputPath, buffer);
      
      console.log(`🎉 The Fool saved successfully: ${outputPath}`);
      return true;
    } else {
      console.error("❌ No image URL in response");
      return false;
    }
  } catch (error) {
    console.error("❌ Error:", error);
    return false;
  }
}

generateTheFool();