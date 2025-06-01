/**
 * Generate Missing Cards with Stability AI
 * Creates cards matching the ultra-ethereal style using Stability AI API
 */

import fs from "fs";
import path from "path";

interface CardToGenerate {
  id: string;
  name: string;
  directory: string;
  filename: string;
  prompt: string;
}

const missingCards: CardToGenerate[] = [
  {
    id: "c3",
    name: "Three of Cups",
    directory: "public/authentic-cards/minor-arcana/cups",
    filename: "three-of-cups.png",
    prompt: "Three ornate golden chalices floating in ethereal space, liquid starlight flowing between them, three celestial figures with flowing translucent hair celebrating friendship, ultra-ethereal 3D style, musky pink and purple color palette, translucent dreamlike qualities, soft dimensional depth, gentle glowing effects, professional tarot card artwork, high detail, mystical atmosphere"
  },
  {
    id: "c4", 
    name: "Four of Cups",
    directory: "public/authentic-cards/minor-arcana/cups",
    filename: "four-of-cups.png",
    prompt: "Four mystical chalices arranged in ethereal formation, one offered by cosmic hand from clouds, contemplative figure with liquid starlight hair in meditation, ultra-ethereal 3D style, musky pink and purple color palette, translucent dreamlike qualities, soft dimensional depth, gentle glowing effects, professional tarot card artwork, high detail, mystical atmosphere"
  }
];

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateWithStability(prompt: string): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1
            },
            {
              text: "blurry, low quality, distorted, cartoon, anime, sketch, poor quality, text, watermark, signature",
              weight: -1
            }
          ],
          cfg_scale: 8,
          height: 1024,
          width: 1024,
          steps: 50,
          samples: 1,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Stability AI error (${response.status}):`, errorText);
      return null;
    }

    const responseJSON = await response.json();
    
    if (responseJSON.artifacts && responseJSON.artifacts[0]) {
      const base64Image = responseJSON.artifacts[0].base64;
      return Buffer.from(base64Image, 'base64');
    }

    console.error("No image artifact returned from Stability AI");
    return null;
  } catch (error) {
    console.error("Stability AI generation error:", error);
    return null;
  }
}

async function generateCard(card: CardToGenerate): Promise<boolean> {
  console.log(`Generating ${card.name}...`);
  
  const imageBuffer = await generateWithStability(card.prompt);
  
  if (imageBuffer) {
    ensureDirectoryExists(card.directory);
    const fullPath = path.join(card.directory, card.filename);
    fs.writeFileSync(fullPath, Buffer.from(imageBuffer));
    console.log(`Generated ${card.name} -> ${fullPath}`);
    return true;
  }
  
  console.error(`Failed to generate ${card.name}`);
  return false;
}

async function generateMissingCards() {
  console.log("Starting Stability AI card generation...");
  
  let successCount = 0;
  
  for (const card of missingCards) {
    const success = await generateCard(card);
    if (success) {
      successCount++;
      // Wait between cards to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log(`Generation complete: ${successCount}/${missingCards.length} cards created`);
}

generateMissingCards().catch(console.error);