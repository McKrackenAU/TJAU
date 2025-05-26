/**
 * Reliable Single Card Generation - The Fool
 */
import OpenAI from "openai";
import fs from "fs";
import https from "https";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateFool(): Promise<void> {
  console.log("🎨 Creating The Fool card...");
  
  try {
    // Shorter, cleaner prompt for faster generation
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Tarot card: The Fool. Young traveler at cliff edge, white dog, colorful robes, sun above, traditional tarot style",
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (!response.data?.[0]?.url) {
      throw new Error("No image generated");
    }

    const imageUrl = response.data[0].url;
    
    // Create directory
    fs.mkdirSync("public/authentic-cards/major-arcana", { recursive: true });

    // Download with timeout
    const filename = "public/authentic-cards/major-arcana/00-fool.png";
    
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Download timeout"));
      }, 30000); // 30 second timeout
      
      const file = fs.createWriteStream(filename);
      https.get(imageUrl, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          clearTimeout(timeout);
          file.close();
          console.log(`✅ The Fool saved successfully!`);
          resolve();
        });
      }).on('error', (err) => {
        clearTimeout(timeout);
        fs.unlink(filename, () => {});
        reject(err);
      });
    });

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

generateFool();