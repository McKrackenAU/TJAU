/**
 * Direct Chalice Generation - One Card at a Time
 */

import fs from 'fs';
import path from 'path';

async function createDirectChaliceCard(cardName: string, filename: string, prompt: string): Promise<void> {
  console.log(`🏆 Creating ${cardName} with direct chalice focus...`);
  
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
          num_inference_steps: 45,
          guidance_scale: 8.0
        }
      }),
    });

    if (!response.ok) {
      console.error(`❌ API error: ${response.status}`);
      return;
    }

    const buffer = await response.arrayBuffer();
    
    const dir = path.join(process.cwd(), 'public', 'authentic-cards', 'minor-arcana', 'cups');
    const outputPath = path.join(dir, filename);
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ ${cardName} created with chalice! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error(`❌ Error creating ${cardName}:`, error);
  }
}

// Create Page of Cups first
const pagePrompt = "Tarot card: young male page character holding large ornate golden chalice goblet cup in both hands, the chalice is prominently displayed in center, ethereal purple and pink magical lighting, ultra-realistic 3D artwork, fantasy tarot style";

createDirectChaliceCard('Page of Cups', 'page-of-cups.png', pagePrompt);