/**
 * Simple Chalice Fix - Direct Clear Cup Generation
 */

import fs from 'fs';
import path from 'path';

async function createClearChaliceCard(name: string, filename: string): Promise<void> {
  console.log(`🏆 Creating ${name} with very clear chalice...`);
  
  let prompt = "";
  
  if (name === "Page of Cups") {
    prompt = "Young man in robes holding medium-sized golden chalice cup goblet in both hands at waist level, chalice is clearly visible but not covering face, showing full face and upper body, tarot card style, purple pink ethereal lighting";
  } else if (name === "Knight of Cups") {
    prompt = "Knight on horse holding medium-sized golden chalice cup goblet tucked under one arm while riding, chalice is clearly visible at side, not above head, showing full knight figure, tarot card style, purple pink ethereal lighting";
  } else if (name === "Queen of Cups") {
    prompt = "Queen woman sitting holding large golden chalice cup goblet in her hands, the chalice is huge and clearly visible, tarot card style, purple pink ethereal lighting";
  } else if (name === "King of Cups") {
    prompt = "King man with beard holding large golden chalice cup goblet in both hands, the chalice is huge and clearly visible, tarot card style, purple pink ethereal lighting";
  }
  
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width: 512,
          height: 768,
          num_inference_steps: 30,
          guidance_scale: 7.5
        }
      }),
    });

    if (!response.ok) {
      console.error(`❌ ${name} failed: ${response.status}`);
      return;
    }

    const buffer = await response.arrayBuffer();
    
    const dir = path.join(process.cwd(), 'public', 'authentic-cards', 'minor-arcana', 'cups');
    const outputPath = path.join(dir, filename);
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ ${name} created with clear chalice! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error(`❌ Error creating ${name}:`, error);
  }
}

// Fix Knight of Cups with chalice under arm
createClearChaliceCard('Knight of Cups', 'knight-of-cups.png');