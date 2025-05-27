/**
 * Force Clear Chalice Imagery in Court Cards
 * Very direct prompts focusing ONLY on the cup/chalice as main subject
 */

import fs from 'fs';
import path from 'path';

const courtCards = [
  {
    name: 'Page of Cups',
    filename: 'page-of-cups.png',
    prompt: "Close-up portrait of young male Page holding enormous golden chalice cup in both hands directly in front of camera. The chalice cup is the ONLY focus - massive, ornate, golden, taking up half the image. Ultra-realistic 3D ethereal quality with purple pink tones. The cup/chalice must be crystal clear and obvious. No other objects. Just person and giant chalice cup. Photorealistic with magical atmosphere."
  },
  {
    name: 'Knight of Cups',
    filename: 'knight-of-cups.png',
    prompt: "Male knight on horse raising enormous golden chalice cup high above head with both hands. The chalice cup is the ONLY focus - massive, ornate, golden, taking up center of image. Ultra-realistic 3D ethereal quality with purple pink tones. The raised cup/chalice must be crystal clear and obvious. Horse and rider supporting giant chalice cup display. Photorealistic with magical atmosphere."
  },
  {
    name: 'Queen of Cups',
    filename: 'queen-of-cups.png',
    prompt: "Female queen sitting and holding enormous golden chalice cup in her lap with both hands. The chalice cup is the ONLY focus - massive, ornate, golden, taking up center of image. Ultra-realistic 3D ethereal quality with purple pink tones. The cup/chalice must be crystal clear and obvious. Throne and queen supporting giant chalice cup display. Photorealistic with magical atmosphere."
  },
  {
    name: 'King of Cups',
    filename: 'king-of-cups.png',
    prompt: "Male king with beard holding enormous golden chalice cup at chest level with both hands. The chalice cup is the ONLY focus - massive, ornate, golden, taking up center of image. Ultra-realistic 3D ethereal quality with purple pink tones. The cup/chalice must be crystal clear and obvious. Throne and king supporting giant chalice cup display. Photorealistic with magical atmosphere."
  }
];

async function forceChaliceCard(card: typeof courtCards[0]): Promise<boolean> {
  try {
    console.log(`🍷 FORCING ${card.name} with GIANT chalice cup...`);
    
    const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: card.prompt,
        parameters: {
          width: 512,
          height: 768,
          num_inference_steps: 50,
          guidance_scale: 9.0,
          negative_prompt: "sword, wand, staff, weapon, empty hands, no cup, no chalice"
        }
      }),
    });

    if (!response.ok) {
      console.error(`❌ ${card.name} failed: ${response.status}`);
      return false;
    }

    const buffer = await response.arrayBuffer();
    
    const dir = path.join(process.cwd(), 'public', 'authentic-cards', 'minor-arcana', 'cups');
    const outputPath = path.join(dir, card.filename);
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ ${card.name} FORCED with giant chalice cup! Size: ${buffer.byteLength} bytes`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error creating ${card.name}:`, error);
    return false;
  }
}

async function forceChaliceCourt() {
  console.log('🍷 FORCING all Court Cards to show GIANT chalice cups...');
  
  for (const card of courtCards) {
    await forceChaliceCard(card);
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('✅ All Court Cards FORCED with giant chalice cups!');
}

forceChaliceCourt();