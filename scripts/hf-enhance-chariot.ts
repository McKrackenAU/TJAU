/**
 * Enhanced Chariot - Hugging Face Style
 * Matching The High Priestess quality and style
 */

import fs from 'fs';
import path from 'path';

async function enhanceChariotHF(): Promise<void> {
  console.log('🏇 Creating enhanced Chariot with Hugging Face...');
  
  try {
    const prompt = "Ultra-realistic 3D The Chariot tarot card with extreme photorealistic depth exactly like The High Priestess. Victorious otherworldly charioteer with flowing liquid starlight hair, rendered with complete lifelike depth like a real living person. Ultra-realistic skin texture with triumphant ethereal glow, perfectly natural facial features with otherworldly determination and confidence, realistic eyes and natural expressions. Translucent flowing armor and robes in musky purple and pink aurora tones with ultra-realistic fabric physics and metallic gleam. He stands in a crystalline chariot that extends into genuine 3D depth with incredible architectural detail and dimensional craftsmanship. Two cosmic sphinxes, one black one white, pull the chariot with realistic musculature, natural animal anatomy, and dimensional depth - their fur and features rendered with lifelike detail. Stars crown his head with dimensional light and realistic shadows. Background has cosmic battlefield with layered elements stretching to infinity with true atmospheric perspective. The chariot wheels have realistic spokes and dimensional detail. Every surface reflects light naturally with realistic physics. Same incredible 3D dimensional realism as The High Priestess card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors.";

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
    
    const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', '07-chariot.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Enhanced Chariot created! Size: ${buffer.byteLength} bytes`);
    console.log(`📁 Saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error with Hugging Face service:', error);
  }
}

enhanceChariotHF();