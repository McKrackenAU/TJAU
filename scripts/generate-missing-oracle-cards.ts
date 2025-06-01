/**
 * Generate Missing Oracle Cards
 * Create ultra-ethereal 3D oracle cards matching High Priestess style using Stability AI
 */

import fs from "fs";
import path from "path";

// Ultra-ethereal style matching The High Priestess
const ETHEREAL_STYLE = `ultra-ethereal translucent dreamlike quality, 3D lifelike character with liquid starlight hair flowing like cosmic rivers, celestial features with subtle luminescent skin, deep purples magentas rose pinks lavender color palette, mystical atmospheric lighting, floating ethereal particles, divine feminine energy, cosmic consciousness, transcendent spiritual aura, photorealistic 3D render`;

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateCardImage(cardData: { name: string, filename: string, prompt: string }): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${cardData.name}...`);
    
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`
      },
      body: JSON.stringify({
        text_prompts: [{ text: `${cardData.prompt}, ${ETHEREAL_STYLE}` }],
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
      
      const filePath = path.join('public/authentic-cards/oracle', cardData.filename);
      fs.writeFileSync(filePath, imageBuffer);
      
      console.log(`✅ Generated: ${cardData.name} -> ${filePath}`);
      return true;
    } else {
      console.error(`❌ Failed to generate ${cardData.name}: No image data`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error generating ${cardData.name}:`, error);
    return false;
  }
}

async function generateMissingOracleCards() {
  console.log('🌟 Generating missing oracle cards with ultra-ethereal style...');
  
  const missingCards = [
    { 
      name: 'Element of Fire', 
      filename: 'element-of-fire.png', 
      prompt: `Element of Fire oracle card, ${ETHEREAL_STYLE}, dancing flames, phoenix rising, solar energy, passion and transformation, fire spirits, molten gold accents` 
    },
    { 
      name: 'Cosmic Connections', 
      filename: 'cosmic-connections.png', 
      prompt: `Cosmic Connections oracle card, ${ETHEREAL_STYLE}, interweaving galaxies, stellar networks, cosmic web, universal connectivity, star bridges, celestial pathways` 
    },
    { 
      name: 'Spiritual Awakening', 
      filename: 'spiritual-awakening.png', 
      prompt: `Spiritual Awakening oracle card, ${ETHEREAL_STYLE}, lotus blooming, third eye opening, rays of enlightenment, consciousness expansion, divine revelation` 
    },
    { 
      name: 'Elemental Allies', 
      filename: 'elemental-allies.png', 
      prompt: `Elemental Allies oracle card, ${ETHEREAL_STYLE}, four elemental beings united, air sylphs, earth gnomes, water undines, fire salamanders, harmony of elements` 
    },
    { 
      name: 'Chakra Activation', 
      filename: 'chakra-activation.png', 
      prompt: `Chakra Activation oracle card, ${ETHEREAL_STYLE}, seven spinning chakras, rainbow energy centers, kundalini serpent, energy alignment, spiritual awakening` 
    },
    { 
      name: 'Crystals and Gemstones', 
      filename: 'crystals-gemstones.png', 
      prompt: `Crystals and Gemstones oracle card, ${ETHEREAL_STYLE}, healing crystals radiating light, amethyst clusters, rose quartz, clear quartz, gemstone energy grid` 
    },
    { 
      name: 'Energy Clearing', 
      filename: 'energy-clearing.png', 
      prompt: `Energy Clearing oracle card, ${ETHEREAL_STYLE}, cleansing white light, sage smoke, energy purification, aura cleansing, spiritual renewal` 
    },
    { 
      name: 'Divine Purpose', 
      filename: 'divine-purpose.png', 
      prompt: `Divine Purpose oracle card, ${ETHEREAL_STYLE}, sacred mission, soul purpose, divine calling, spiritual destiny, golden path of purpose` 
    }
  ];

  ensureDirectoryExists('public/authentic-cards/oracle');
  
  for (const card of missingCards) {
    await generateCardImage(card);
    // Small delay between generations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('🎉 Missing oracle card generation complete!');
}

generateMissingOracleCards().catch(console.error);