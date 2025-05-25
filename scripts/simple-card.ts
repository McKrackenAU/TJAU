import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

console.log("🎨 Starting card generation...");

openai.images.generate({
  model: "dall-e-3", 
  prompt: "The Fool tarot card",
  size: "1024x1024"
}).then(async (response) => {
  if (response.data?.[0]?.url) {
    console.log("📥 Downloading image...");
    const img = await fetch(response.data[0].url);
    const buffer = Buffer.from(await img.arrayBuffer());
    fs.writeFileSync("public/authentic-cards/major-arcana/simple-fool.png", buffer);
    console.log("✅ CARD COMPLETED: simple-fool.png");
  }
}).catch(err => console.error("❌ Error:", err.message));