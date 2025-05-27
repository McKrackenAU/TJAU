/**
 * Enhanced Hanged Man - Hugging Face Style
 * Man hanging upside down with The High Priestess quality
 */

import fs from 'fs';
import path from 'path';

async function enhanceHangedManHF(): Promise<void> {
  console.log('🙃 Creating enhanced Hanged Man with Hugging Face...');
  
  try {
    const prompt = "Ultra-realistic 3D The Hanged Man tarot card with extreme photorealistic depth exactly like The High Priestess. A serene man hanging upside down by one foot from a cosmic tree, rendered with complete lifelike depth like a real living person. Ultra-realistic skin texture with peaceful ethereal glow, perfectly natural facial features with otherworldly serenity and enlightenment, realistic eyes showing inner peace despite being inverted. His body is suspended upside down with realistic anatomy, flowing liquid starlight hair falling downward due to gravity. Translucent robes flowing naturally downward with ultra-realistic fabric physics in musky purple and pink tones. His arms are behind his back, one leg bent creating a figure-4 shape as he hangs from the living cosmic tree. The tree extends into genuine 3D depth with intricate bark texture and dimensional branches. Golden halo of light around his head with dimensional radiance. Background shows cosmic sacrifice scene with layered atmospheric perspective stretching to infinity. Every surface reflects light naturally with realistic physics. The hanging pose shows true gravitational effects on hair and clothing. Same incredible 3D dimensional realism as The High Priestess card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors.";

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
    
    const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', '12-hanged-man.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Enhanced Hanged Man created! Size: ${buffer.byteLength} bytes`);
    console.log(`📁 Saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error with Hugging Face service:', error);
  }
}

enhanceHangedManHF();