/**
 * Simple Chalice Fix - Direct Clear Cup Generation
 */

import fs from 'fs';
import path from 'path';

async function createClearChaliceCard(name: string, filename: string): Promise<void> {
  console.log(`🏆 Creating ${name} with very clear chalice...`);
  
  let prompt = "";
  
  if (name === "Page of Cups") {
    prompt = "Young man in robes holding large golden chalice cup goblet in both hands in front of him, the chalice is huge and clearly visible, tarot card style, purple pink ethereal lighting";
  } else if (name === "Knight of Cups") {
    prompt = "Knight on horse holding up large golden chalice cup goblet high above head, the chalice is huge and clearly visible, tarot card style, purple pink ethereal lighting";
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

// Create one at a time
createClearChaliceCard('Page of Cups', 'page-of-cups.png');