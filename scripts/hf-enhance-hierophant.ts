/**
 * Enhanced Hierophant - Hugging Face Style
 * Matching The High Priestess quality and style
 */

import fs from 'fs';
import path from 'path';

async function enhanceHierophantHF(): Promise<void> {
  console.log('🎨 Creating enhanced Hierophant with Hugging Face...');
  
  try {
    const prompt = "Ultra-realistic 3D The Hierophant tarot card with extreme photorealistic depth exactly like The High Priestess. Wise spiritual teacher with flowing liquid starlight hair seated on crystalline throne, rendered with complete lifelike depth like a real living person. Ultra-realistic skin texture with sacred ethereal glow, perfectly natural facial features with otherworldly wisdom and divine authority, realistic eyes showing deep spiritual knowledge. Flowing robes and cosmic crown with ultra-realistic fabric physics and metallic details in musky purple and pink tones. Two cosmic keys of starlight floating beside him with dimensional presence and realistic metallic gleam. Two devoted pilgrims kneeling before him with photorealistic depth and natural anatomy, their robes flowing with realistic fabric physics. Ancient cosmic columns extending into genuine 3D depth with incredible architectural detail. Sacred temple background with layered atmospheric perspective stretching to infinity. Every surface reflects light naturally with realistic physics. Same incredible 3D dimensional realism as The High Priestess card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors.";

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
    
    const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', '05-hierophant.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Enhanced Hierophant created! Size: ${buffer.byteLength} bytes`);
    console.log(`📁 Saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error with Hugging Face service:', error);
  }
}

enhanceHierophantHF();