/**
 * Save Generated Cards - Direct API Call and Save
 */

import fs from 'fs';
import path from 'path';

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

async function generateAndSaveCard(cardName: string, filename: string, prompt: string) {
  try {
    console.log(`Generating ${cardName}...`);
    
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STABILITY_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text_prompts: [{ text: prompt, weight: 1 }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1,
        style_preset: "fantasy-art"
      })
    });

    if (!response.ok) {
      console.error(`Failed to generate ${cardName}:`, response.status);
      return false;
    }

    const result = await response.json();
    
    if (result.artifacts && result.artifacts.length > 0) {
      const imageData = result.artifacts[0].base64;
      const outputDir = 'public/authentic-cards/minor-arcana/cups';
      
      // Ensure directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      const outputPath = path.join(outputDir, filename);
      fs.writeFileSync(outputPath, Buffer.from(imageData, 'base64'));
      
      console.log(`✓ Saved ${cardName} -> ${outputPath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error with ${cardName}:`, error);
    return false;
  }
}

async function main() {
  // Generate Three of Cups
  await generateAndSaveCard(
    "Three of Cups",
    "three-of-cups.png",
    "Ultra-ethereal Three of Cups tarot card with translucent, dreamlike qualities. Three celestial figures with liquid starlight hair in flowing robes, raising glowing chalices in celebration. Musky pink and purple color palette with cosmic background. Luminous, 3D lifelike appearance with divine radiance and mystical atmosphere. Professional tarot card design with ornate border."
  );

  // Small delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate Four of Cups
  await generateAndSaveCard(
    "Four of Cups", 
    "four-of-cups.png",
    "Ultra-ethereal Four of Cups tarot card with translucent, dreamlike qualities. Contemplative celestial figure with liquid starlight hair sitting beneath a tree, three cups before them, fourth cup offered by ethereal hand from clouds. Musky pink and purple color palette with cosmic background. Luminous, 3D lifelike appearance with divine radiance and mystical atmosphere. Professional tarot card design with ornate border."
  );

  console.log('Generation complete!');
}

main().catch(console.error);