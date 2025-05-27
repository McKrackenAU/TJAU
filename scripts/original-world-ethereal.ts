/**
 * Original World - Commercially Reusable
 * Ethereal 3D lifelike quality with pink purple palette
 */

import fs from 'fs';
import path from 'path';

async function createOriginalWorld(): Promise<void> {
  console.log('🌍 Creating original World card...');
  
  try {
    const prompt = "Ultra-photorealistic 3D original The World tarot card design, completely unique and commercially reusable. Dancing cosmic figure with flowing liquid starlight hair in shimmering purple and pink tones in center of ethereal laurel wreath, rendered with complete lifelike depth like a real living person. Ultra-realistic skin texture with universal pink ethereal glow, perfectly natural facial features with cosmic wisdom and completion. Translucent flowing scarves with gossamer fabric physics in rich musky purple and pink aurora tones, creating graceful movement. Four corner symbols with realistic anatomy and dimensional depth - ethereal angel, cosmic eagle, mystical lion, and sacred bull - all rendered in matching purple and pink tones with lifelike detail. Laurel wreath extending in genuine 3D with botanical detail, leaves glowing with pink and purple cosmic energy. Cosmic mandala background with infinite layers and atmospheric depth. Stars and celestial elements throughout in ethereal purple and pink lighting. Ultra-ethereal dreamlike whimsical quality with translucent gossamer elements. Completely original artistic interpretation with no copyrighted elements. Photographic realism with magical pink purple atmosphere showing completion and fulfillment.";

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
          guidance_scale: 8.0
        }
      }),
    });

    if (!response.ok) {
      console.error(`❌ API error: ${response.status}`);
      return;
    }

    const buffer = await response.arrayBuffer();
    const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', '21-world.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Original World created! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createOriginalWorld();