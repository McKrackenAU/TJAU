/**
 * Quick Generate Missing Cups Cards
 */

import fs from 'fs';

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

async function generateCard(name: string, filename: string, prompt: string) {
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

  const result = await response.json();
  
  if (result.artifacts && result.artifacts.length > 0) {
    const imageData = result.artifacts[0].base64;
    const outputPath = `public/authentic-cards/minor-arcana/cups/${filename}`;
    fs.writeFileSync(outputPath, Buffer.from(imageData, 'base64'));
    console.log(`✓ Created ${name}`);
    return true;
  }
  
  return false;
}

// Generate Three of Cups
generateCard(
  "Three of Cups",
  "three-of-cups.png",
  "Ultra-ethereal Three of Cups tarot card with translucent, dreamlike qualities. Three celestial figures with liquid starlight hair in flowing robes, raising glowing chalices in celebration. Musky pink and purple color palette with cosmic background. Luminous, 3D lifelike appearance with divine radiance and mystical atmosphere. Professional tarot card design with ornate border."
).then(() => {
  console.log('Three of Cups generation complete');
}).catch(console.error);