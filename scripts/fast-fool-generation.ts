/**
 * Fast Generation - The Fool Card
 */
import OpenAI from "openai";
import fs from "fs";
import https from "https";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateFoolCard(): Promise<void> {
  console.log("🎨 Generating The Fool card...");
  
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Traditional tarot card: The Fool. Young person in colorful robes stepping toward cliff edge, white dog beside feet, white rose in hand, mountains behind, bright sun above, ornate tarot border, mystical atmosphere, rich colors",
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) throw new Error("No image URL");

    // Ensure directory exists
    fs.mkdirSync("public/authentic-cards/major-arcana", { recursive: true });

    // Download image
    const filename = "public/authentic-cards/major-arcana/00-fool.png";
    await new Promise<void>((resolve, reject) => {
      const file = fs.createWriteStream(filename);
      https.get(imageUrl, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ The Fool saved: ${filename}`);
          resolve();
        });
      }).on('error', reject);
    });

  } catch (error) {
    console.error("❌ Generation failed:", error);
  }
}

generateFoolCard();