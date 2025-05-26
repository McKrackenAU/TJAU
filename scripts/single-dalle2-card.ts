/**
 * Single DALL-E 2 Card Generation - Quick Test
 */
import OpenAI from "openai";
import fs from "fs";
import https from "https";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateSingleCard(): Promise<void> {
  console.log("🎨 Generating The Fool with DALL-E 2...");
  
  try {
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: "Traditional tarot card The Fool, young person in colorful robes stepping toward cliff, white dog beside feet, mountains background, ornate tarot border",
      n: 1,
      size: "1024x1024",
    });

    if (!response.data?.[0]?.url) {
      throw new Error("No image generated");
    }

    // Create directory
    fs.mkdirSync("public/authentic-cards/major-arcana", { recursive: true });

    // Download image
    const filename = "public/authentic-cards/major-arcana/00-fool.png";
    await new Promise<void>((resolve, reject) => {
      const file = fs.createWriteStream(filename);
      https.get(response.data[0].url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ The Fool saved to: ${filename}`);
          resolve();
        });
      }).on('error', reject);
    });

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

generateSingleCard();