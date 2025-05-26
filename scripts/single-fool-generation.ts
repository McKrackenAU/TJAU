/**
 * Simple Single Card Generation - The Fool
 */
import OpenAI from "openai";
import fs from "fs";
import https from "https";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateTheFool(): Promise<void> {
  console.log("🎨 Starting generation of The Fool card...");
  
  const prompt = `Create a beautiful, traditional tarot card image for "The Fool" (Major Arcana 0). 

Key symbolic elements to include:
- A young person in colorful clothing stepping toward a cliff edge
- A small white dog at their feet (representing loyalty and protection)
- A white rose in hand (representing purity and innocence)
- A bag or bundle on a stick over shoulder (life's experiences)
- Mountains in the background (challenges ahead)
- Bright sun shining (optimism and new beginnings)
- The number "0" or "THE FOOL" text at bottom

Art style: Traditional tarot aesthetic with rich colors, ornate borders, symbolic imagery. Renaissance-inspired artwork with mystical, spiritual atmosphere. High detail and beautiful composition.`;

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error("No image URL received");
    }

    console.log("✅ Image generated successfully, downloading...");

    // Create directory if it doesn't exist
    const dir = "public/authentic-cards/major-arcana";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Download and save the image
    const filename = `${dir}/00-fool.png`;
    await downloadImage(imageUrl, filename);
    
    console.log(`🎉 The Fool card saved to: ${filename}`);
    
  } catch (error) {
    console.error("❌ Error generating The Fool:", error);
  }
}

function downloadImage(url: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Run the generation
generateTheFool();