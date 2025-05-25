/**
 * Generate Single Fool Card - Direct Test
 */
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateSingleFool() {
  console.log("🎨 Generating The Fool card...");
  
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Create a beautiful tarot card artwork for The Fool. A young person standing at cliff's edge with a small dog, white rose, knapsack, and bright sun. Traditional tarot card style with vibrant colors.",
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    console.log("Response received:", !!response.data);
    
    if (response.data?.[0]?.url) {
      console.log("Image URL found, downloading...");
      const imageUrl = response.data[0].url;
      
      const imageResponse = await fetch(imageUrl);
      const buffer = Buffer.from(await imageResponse.arrayBuffer());
      
      const outputPath = "public/authentic-cards/major-arcana/new-fool-test.png";
      fs.writeFileSync(outputPath, buffer);
      
      console.log("✅ Fool card saved successfully!");
      return true;
    }
    
    console.log("❌ No image URL in response");
    return false;
  } catch (error) {
    console.error("❌ Generation error:", error.message);
    return false;
  }
}

generateSingleFool().then(success => {
  console.log(success ? "🎉 Test successful!" : "⚠️ Test failed");
});