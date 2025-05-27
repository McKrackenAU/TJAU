/**
 * Simple Chalice Fix - Direct Clear Cup Generation
 */

import fs from 'fs';
import path from 'path';

async function createClearChaliceCard(name: string, filename: string): Promise<void> {
  console.log(`🏆 Creating ${name} with very clear chalice...`);
  
  let prompt = "";
  
  if (name === "Page of Cups") {
    prompt = "Ultra-photorealistic 3D Page of Cups tarot card with breathtaking ethereal quality. Teenage male figure with flowing liquid starlight hair in shimmering purple and pink tones, holding ornate golden chalice at waist level with both hands. Ultra-realistic skin texture with youthful pink ethereal glow, perfectly natural masculine facial features. The chalice is clearly visible and prominent but proportional to his body. Translucent flowing robes in rich musky purple and pink aurora tones. Ultra-ethereal dreamlike whimsical quality. Completely original artistic interpretation. Photographic realism with magical pink purple atmosphere.";
  } else if (name === "Knight of Cups") {
    prompt = "Knight on horse holding medium-sized golden chalice cup goblet tucked under one arm while riding, chalice is clearly visible at side, not above head, showing full knight figure, tarot card style, purple pink ethereal lighting";
  } else if (name === "Queen of Cups") {
    prompt = "Ultra-photorealistic 3D Queen of Cups tarot card with breathtaking ethereal quality. Intuitive female queen with flowing liquid starlight hair in shimmering purple and pink tones, sitting on crystalline throne while holding ornate golden chalice in her lap with both hands. Ultra-realistic skin texture with nurturing pink ethereal glow, perfectly natural feminine facial features. The chalice is clearly visible and prominent but proportional. Translucent flowing robes and crown in rich musky purple and pink aurora tones. Ultra-ethereal dreamlike whimsical quality. Completely original artistic interpretation. Photographic realism with magical pink purple atmosphere.";
  } else if (name === "King of Cups") {
    prompt = "Ultra-photorealistic 3D King of Cups tarot card with breathtaking ethereal quality. Wise mature male king with flowing liquid starlight hair and regal beard in shimmering purple and pink tones, sitting on magnificent crystalline throne while holding ornate golden chalice at chest level with both hands. Ultra-realistic skin texture with compassionate pink ethereal glow, perfectly natural masculine facial features. The chalice is clearly visible and prominent but proportional. Translucent flowing royal robes and crown in rich musky purple and pink aurora tones. Ultra-ethereal dreamlike whimsical quality. Completely original artistic interpretation. Photographic realism with magical pink purple atmosphere.";
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

// Create 3D lifelike King of Cups
createClearChaliceCard('King of Cups', 'king-of-cups.png');