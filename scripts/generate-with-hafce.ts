/**
 * Generate Missing Cards with HAFCE API
 * Creates cards matching the ultra-ethereal style
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

async function generateWithHAFCE(prompt: string): Promise<ArrayBuffer | null> {
  try {
    // Try Hugging Face API with the new token
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: {
          Authorization: `Bearer ${process.env.HAFCE_API_TOKEN_FIVE}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: "blurry, low quality, distorted, cartoon, anime, sketch, poor quality, text, watermark, signature",
            num_inference_steps: 50,
            guidance_scale: 8.5,
            width: 1024,
            height: 1024
          }
        }),
      }
    );

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      return null;
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error("Generation error:", error);
    return null;
  }
}

async function generateCard(card: CardToGenerate): Promise<boolean> {
  console.log(`🎨 Generating ${card.name}...`);
  
  const imageBuffer = await generateWithHAFCE(card.prompt);
  
  if (imageBuffer) {
    ensureDirectoryExists(card.directory);
    const fullPath = path.join(card.directory, card.filename);
    fs.writeFileSync(fullPath, Buffer.from(imageBuffer));
    console.log(`✅ Generated ${card.name} -> ${fullPath}`);
    return true;
  }
  
  console.error(`❌ Failed to generate ${card.name}`);
  return false;
}

async function generateMissingCards() {
  console.log("🌟 Starting HAFCE card generation...");
  
  let successCount = 0;
  
  for (const card of missingCards) {
    const success = await generateCard(card);
    if (success) {
      successCount++;
      // Wait between cards to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log(`\n✨ Generation complete: ${successCount}/${missingCards.length} cards created`);
}

generateMissingCards().catch(console.error);