/**
 * Create Cups Court Cards with VERY Clear Chalice Symbolism
 * Each card must prominently display cups/chalices as the main focal point
 */

import fs from 'fs';
import path from 'path';

const courtCards = [
  {
    name: 'Page of Cups',
    filename: 'page-of-cups.png',
    prompt: "Ultra-photorealistic 3D Page of Cups tarot card. Young male figure with flowing ethereal hair in purple and pink tones, standing and holding a LARGE ORNATE GOLDEN CHALICE prominently in the center of the image as the main focal point. The chalice should be enormous, detailed, and clearly visible with mystical water or energy flowing from it. Multiple smaller cups and chalices floating around him. The cup/chalice is the most important element - make it huge, central, and impossible to miss. Translucent robes in purple and pink. Ultra-ethereal dreamlike quality with photographic realism. Magical atmosphere."
  },
  {
    name: 'Knight of Cups',
    filename: 'knight-of-cups.png',
    prompt: "Ultra-photorealistic 3D Knight of Cups tarot card. Male knight on white horse, raising a MASSIVE ORNATE GOLDEN CHALICE high above his head as the central focal point of the entire image. The chalice should dominate the composition - enormous, detailed, and clearly the main subject. Flowing ethereal hair in purple and pink tones. Multiple cups and chalices attached to his armor and horse's bridle. The raised chalice should be impossible to miss - make it the largest element in the image. Translucent armor in purple and pink. Ultra-ethereal dreamlike quality with photographic realism. River background."
  },
  {
    name: 'Queen of Cups',
    filename: 'queen-of-cups.png',
    prompt: "Ultra-photorealistic 3D Queen of Cups tarot card. Female queen sitting on throne, cradling a GIGANTIC ORNATE GOLDEN CHALICE in her lap with both hands - this chalice should be the centerpiece of the entire image. The chalice should be enormous, incredibly detailed, and clearly the main subject. Flowing ethereal hair in purple and pink tones. Her throne should be decorated with multiple cups and chalices. The main chalice should glow with mystical energy and be impossible to ignore. Translucent robes and crown in purple and pink. Ultra-ethereal dreamlike quality with photographic realism. Water lilies background."
  },
  {
    name: 'King of Cups',
    filename: 'king-of-cups.png',
    prompt: "Ultra-photorealistic 3D King of Cups tarot card. Mature male king with beard sitting on throne, holding a COLOSSAL ORNATE GOLDEN CHALICE in front of his chest with both hands - this chalice should be the dominant feature of the entire image. The chalice should be massive, incredibly detailed, and the clear focal point. Flowing ethereal hair and beard in purple and pink tones. His throne decorated with cups and chalices. The main chalice should overflow with cosmic energy and be the largest visual element. Translucent royal robes and crown in purple and pink. Ultra-ethereal dreamlike quality with photographic realism. Ocean background with ship."
  }
];

async function generateChaliceCard(card: typeof courtCards[0]): Promise<boolean> {
  try {
    console.log(`🏆 Creating ${card.name} with PROMINENT chalice...`);
    
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
          guidance_scale: 8.5,
          negative_prompt: "no cups, no chalices, empty hands, modern objects"
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
    
    console.log(`✨ ${card.name} created with PROMINENT chalice! Size: ${buffer.byteLength} bytes`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error creating ${card.name}:`, error);
    return false;
  }
}

async function createChaliceCourt() {
  console.log('🏆 Creating Cups Court Cards with VERY PROMINENT chalices...');
  
  let successCount = 0;
  
  for (const card of courtCards) {
    const success = await generateChaliceCard(card);
    if (success) successCount++;
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 4000));
  }
  
  console.log(`✅ Court Cards completed! ${successCount}/${courtCards.length} cards with prominent chalices`);
}

createChaliceCourt();