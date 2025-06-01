/**
 * Generate Missing Cups Cards - Three and Four of Cups
 * Using Stability AI with ethereal style matching existing cards
 */

import fs from 'fs';
import path from 'path';

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

if (!STABILITY_API_KEY) {
  console.error('STABILITY_API_KEY environment variable is required');
  process.exit(1);
}

const missingCups = [
  {
    name: "Three of Cups",
    filename: "three-of-cups.png",
    prompt: "Ultra-ethereal Three of Cups tarot card with translucent, dreamlike qualities. Three celestial figures with liquid starlight hair in flowing robes, raising glowing chalices in celebration. Musky pink and purple color palette with cosmic background. Luminous, 3D lifelike appearance with divine radiance and mystical atmosphere. Professional tarot card design with ornate border."
  },
  {
    name: "Four of Cups",
    filename: "four-of-cups.png", 
    prompt: "Ultra-ethereal Four of Cups tarot card with translucent, dreamlike qualities. Contemplative celestial figure with liquid starlight hair sitting beneath a tree, three cups before them, fourth cup offered by ethereal hand from clouds. Musky pink and purple color palette with cosmic background. Luminous, 3D lifelike appearance with divine radiance and mystical atmosphere. Professional tarot card design with ornate border."
  }
];

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateCupCard(card: typeof missingCups[0]): Promise<boolean> {
  try {
    console.log(`Generating ${card.name}...`);
    
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STABILITY_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: card.prompt,
            weight: 1
          }
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1,
        style_preset: "fantasy-art"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to generate ${card.name}:`, response.status, errorText);
      return false;
    }

    const result = await response.json();
    
    if (result.artifacts && result.artifacts.length > 0) {
      const imageData = result.artifacts[0].base64;
      const outputDir = 'public/authentic-cards/minor-arcana/cups';
      ensureDirectoryExists(outputDir);
      
      const outputPath = path.join(outputDir, card.filename);
      fs.writeFileSync(outputPath, Buffer.from(imageData, 'base64'));
      
      console.log(`✓ Generated ${card.name} -> ${outputPath}`);
      return true;
    } else {
      console.error(`No image data received for ${card.name}`);
      return false;
    }
    
  } catch (error) {
    console.error(`Error generating ${card.name}:`, error);
    return false;
  }
}

async function generateMissingCups() {
  console.log('Starting generation of missing Cups cards...');
  
  let successCount = 0;
  
  for (const card of missingCups) {
    const success = await generateCupCard(card);
    if (success) {
      successCount++;
    }
    
    // Small delay between generations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\nGeneration complete! Successfully created ${successCount}/${missingCups.length} cards.`);
}

generateMissingCups().catch(console.error);