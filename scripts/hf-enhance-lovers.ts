/**
 * Enhanced Lovers - Hugging Face Style
 * Male and female couple matching The High Priestess quality
 */

import fs from 'fs';
import path from 'path';

async function enhanceLoversHF(): Promise<void> {
  console.log('💕 Creating enhanced Lovers with Hugging Face...');
  
  try {
    const prompt = "Ultra-realistic 3D The Lovers tarot card with extreme photorealistic depth exactly like The High Priestess. A beautiful male and female couple with flowing liquid starlight hair standing together in cosmic garden, rendered with complete lifelike depth like real living people. Ultra-realistic skin texture with loving ethereal glow, perfectly natural facial features with otherworldly romance and deep connection, realistic eyes gazing at each other with cosmic love. The man and woman both wearing translucent flowing robes with ultra-realistic fabric physics in musky purple and pink tones. Above them, a magnificent angel with realistic wings and natural anatomy blesses their union with dimensional presence. Tree of knowledge with cosmic apples extending into genuine 3D depth with botanical detail. Tree of life with flowing energy extending into realistic distance. Background shows paradise garden with layered atmospheric perspective stretching to infinity. Every surface reflects light naturally with realistic physics. Same incredible 3D dimensional realism as The High Priestess card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors.";

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
          num_inference_steps: 50,
          guidance_scale: 7.5
        }
      }),
    });

    if (!response.ok) {
      console.error(`❌ Hugging Face API error: ${response.status} ${response.statusText}`);
      return;
    }

    const buffer = await response.arrayBuffer();
    
    const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', '06-lovers.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Enhanced Lovers created! Size: ${buffer.byteLength} bytes`);
    console.log(`📁 Saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error with Hugging Face service:', error);
  }
}

enhanceLoversHF();