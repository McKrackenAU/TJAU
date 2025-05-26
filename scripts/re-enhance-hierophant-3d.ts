/**
 * Re-enhance Hierophant with Ultra 3D Lifelike Quality
 * Matching The Fool's incredible dimensional depth exactly
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

async function reEnhance3DHierophant(): Promise<boolean> {
  try {
    console.log('🎨 Re-enhancing The Hierophant with ultra 3D lifelike depth...');
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    const outputPath = path.join(outputDir, '05-hierophant.png');
    
    const prompt = `The Hierophant tarot card with EXTREME photorealistic 3D depth and ultra-lifelike presence exactly like The Fool card. A magnificent otherworldly spiritual figure with flowing liquid starlight hair and ethereal beard cascading naturally with realistic hair physics, rendered with COMPLETE photorealistic depth like a real living person. Ultra-realistic skin texture with divine ethereal glow, perfectly natural facial features with otherworldly wisdom, realistic eyes that seem to look directly at viewer. Translucent ceremonial robes in musky purple and pink aurora tones with ultra-realistic fabric physics draping gracefully over his fully three-dimensional muscular form. He sits on a crystalline throne with incredible architectural detail extending into genuine 3D depth between two massive pillars. Holding crossed keys of pure starlight that gleam with realistic metallic reflection and cast dimensional shadows. Two acolytes kneel before him rendered with photorealistic human anatomy and depth. Above his head floats a triple crown with realistic shadows and light physics. Background has sacred cosmic temple with layered architectural elements stretching infinitely with perfect atmospheric perspective. Photorealistic skin with spiritual luminescence, natural facial expressions, realistic beard and hair movement, dimensional fabric flow. ULTRA-realistic human proportions and lifelike presence. Same incredible 3D dimensional realism as The Fool card.`;

    console.log('📡 Generating with ULTRA enhanced 3D parameters...');
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: "flat, 2D, cartoon, anime, illustration, drawing, sketch, painting, unrealistic, artificial, low quality, blurry, distorted, ugly, deformed, text, watermark, signature, frame, border, stylized, artistic",
            num_inference_steps: 45,
            guidance_scale: 10.0,
            width: 512,
            height: 768
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully re-enhanced The Hierophant with ULTRA 3D depth!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Re-enhancing The Hierophant with ultra 3D lifelike depth...');
  
  const success = await reEnhance3DHierophant();
  
  if (success) {
    console.log('🎉 Hierophant ultra enhancement completed!');
  } else {
    console.log('❌ Enhancement failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});