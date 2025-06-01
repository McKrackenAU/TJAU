/**
 * Generate Missing Cards with Hugging Face
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
    prompt: "Three ornate golden chalices floating in ethereal space, liquid starlight flowing between them, three celestial figures with flowing translucent hair celebrating friendship, ultra-ethereal 3D style, musky pink and purple color palette, translucent dreamlike qualities, soft dimensional depth, gentle glowing effects, professional tarot card artwork, high detail"
  },
  {
    id: "c4", 
    name: "Four of Cups",
    directory: "public/authentic-cards/minor-arcana/cups",
    filename: "four-of-cups.png",
    prompt: "Four mystical chalices arranged in ethereal formation, one offered by cosmic hand from clouds, contemplative figure with liquid starlight hair in meditation, ultra-ethereal 3D style, musky pink and purple color palette, translucent dreamlike qualities, soft dimensional depth, gentle glowing effects, professional tarot card artwork, high detail"
  }
];

const availableTokens = [
  { name: "HUGGINGFACE_API_TOKEN", token: process.env.HUGGINGFACE_API_TOKEN },
  { name: "hf_API_TOKEN_THREE", token: process.env.hf_API_TOKEN_THREE },
  { name: "hf_API_TOKEN_FOUR", token: process.env.hf_API_TOKEN_FOUR }
];

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateWithHuggingFace(prompt: string, token: string): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: "blurry, low quality, distorted, cartoon, anime, sketch, poor quality, text, watermark",
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
      return null;
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error("Generation error:", error);
    return null;
  }
}

async function generateCard(card: CardToGenerate): Promise<boolean> {
  console.log(`Generating ${card.name}...`);
  
  for (const tokenInfo of availableTokens) {
    if (!tokenInfo.token) continue;
    
    console.log(`Trying with ${tokenInfo.name}...`);
    
    const imageBuffer = await generateWithHuggingFace(card.prompt, tokenInfo.token);
    
    if (imageBuffer) {
      ensureDirectoryExists(card.directory);
      const fullPath = path.join(card.directory, card.filename);
      fs.writeFileSync(fullPath, Buffer.from(imageBuffer));
      console.log(`✅ Generated ${card.name} with ${tokenInfo.name}`);
      return true;
    }
    
    // Wait between token attempts
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.error(`❌ Failed to generate ${card.name} with all available tokens`);
  return false;
}

async function generateMissingCards() {
  console.log("Starting Hugging Face card generation...");
  
  let successCount = 0;
  
  for (const card of missingCards) {
    const success = await generateCard(card);
    if (success) {
      successCount++;
      // Wait between cards to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  console.log(`\nGeneration complete: ${successCount}/${missingCards.length} cards created`);
}

generateMissingCards().catch(console.error);