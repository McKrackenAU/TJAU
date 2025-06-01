/**
 * Generate Single Oracle Card - Stability AI
 */

import fs from "fs";
import path from "path";

const ETHEREAL_STYLE = `ultra-ethereal translucent dreamlike quality, 3D lifelike character with liquid starlight hair flowing like cosmic rivers, celestial features with subtle luminescent skin, deep purples magentas rose pinks lavender color palette, mystical atmospheric lighting, floating ethereal particles, divine feminine energy, cosmic consciousness, transcendent spiritual aura, photorealistic 3D render`;

async function generateSingleCard(name: string, filename: string, prompt: string): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${name}...`);
    
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`
      },
      body: JSON.stringify({
        text_prompts: [{ text: `${prompt}, ${ETHEREAL_STYLE}` }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1
      })
    });

    if (!response.ok) {
      throw new Error(`Stability API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    
    if (responseData.artifacts && responseData.artifacts[0]?.base64) {
      const base64Image = responseData.artifacts[0].base64;
      const imageBuffer = Buffer.from(base64Image, 'base64');
      
      const filePath = path.join('public/authentic-cards/oracle', filename);
      fs.writeFileSync(filePath, imageBuffer);
      
      console.log(`✅ Generated: ${name} -> ${filePath}`);
      return true;
    } else {
      console.error(`❌ Failed to generate ${name}: No image data`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error generating ${name}:`, error);
    return false;
  }
}

// Get card details from command line arguments
const cardName = process.argv[2];
const cards = {
  'cosmic-connections': {
    name: 'Cosmic Connections',
    filename: 'cosmic-connections.png',
    prompt: 'A mystical oracle card representing cosmic connections, featuring ethereal beings connected by streams of starlight and cosmic energy'
  },
  'spiritual-awakening': {
    name: 'Spiritual Awakening',
    filename: 'spiritual-awakening.png',
    prompt: 'A mystical oracle card representing spiritual awakening, featuring a luminous figure emerging from meditation with chakras glowing and third eye opening'
  },
  'elemental-allies': {
    name: 'Elemental Allies',
    filename: 'elemental-allies.png',
    prompt: 'A mystical oracle card representing elemental allies, featuring ethereal spirits of earth water fire and air united in harmony'
  },
  'chakra-activation': {
    name: 'Chakra Activation',
    filename: 'chakra-activation.png',
    prompt: 'A mystical oracle card representing chakra activation, featuring a luminous figure with all seven chakras spinning and glowing with vibrant energy'
  },
  'crystals-gemstones': {
    name: 'Crystals and Gemstones',
    filename: 'crystals-gemstones.png',
    prompt: 'A mystical oracle card representing crystals and gemstones, featuring an ethereal figure surrounded by floating luminous crystals and sacred geometry'
  },
  'energy-clearing': {
    name: 'Energy Clearing',
    filename: 'energy-clearing.png',
    prompt: 'A mystical oracle card representing energy clearing, featuring an ethereal figure surrounded by cleansing light and dissolving negative energy'
  },
  'divine-purpose': {
    name: 'Divine Purpose',
    filename: 'divine-purpose.png',
    prompt: 'A mystical oracle card representing divine purpose, featuring an ethereal figure receiving divine light and guidance from cosmic sources'
  }
};

async function main() {
  if (!cardName || !cards[cardName]) {
    console.log('Available cards:', Object.keys(cards).join(', '));
    return;
  }

  const card = cards[cardName];
  await generateSingleCard(card.name, card.filename, card.prompt);
}

main().catch(console.error);