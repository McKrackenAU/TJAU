/**
 * Quick Test - Generate One Card (The Hierophant)
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

async function generateHierophant() {
  try {
    console.log("🎨 Testing card generation with The Hierophant...");
    
    const directory = "public/authentic-cards/major-arcana";
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "A magnificent spiritual teacher seated on an ornate throne between two stone pillars, wearing elaborate religious robes and a triple crown. He holds golden keys in one hand and raises the other in blessing. Before him kneel two devoted students. Rich burgundy and gold colors, stained glass windows in background, sacred symbols of spiritual wisdom and divine knowledge. Traditional tarot art style, mystical and reverent atmosphere.",
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    });

    if (response.data?.[0]?.url) {
      const imageResponse = await fetch(response.data[0].url);
      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
      const fullPath = path.join(directory, "05-hierophant.png");
      
      fs.writeFileSync(fullPath, imageBuffer);
      
      console.log("✅ SUCCESS: The Hierophant generated!");
      console.log(`📁 Saved to: ${fullPath}`);
      return true;
    }
    
    return false;
    
  } catch (error) {
    console.error("❌ Generation failed:", error);
    return false;
  }
}

generateHierophant();