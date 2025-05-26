/**
 * Create Fresh Enhanced Sun Card
 * Direct replacement with ultra 3D depth
 */

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function createFreshEnhancedSun(): Promise<void> {
  console.log('🌟 Creating completely fresh enhanced Sun card...');
  
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Ultra-realistic 3D The Sun tarot card with extreme photorealistic depth. A radiant cosmic sun with joyful face in complete dimensional realism. Beautiful child with flowing starlight hair riding magnificent white horse, both with lifelike musculature and natural anatomy. Ultra-realistic skin textures, natural facial features, cosmic joy expression. Towering sunflowers with botanical detail and dimensional depth. Golden sunlight rays with realistic light physics. Cosmic garden background with layered atmospheric perspective. Same incredible 3D dimensional realism as professional photography. Ultra-ethereal style with musky purple and pink cosmic colors.",
      n: 1,
      size: "1024x1792",
      quality: "hd",
      style: "natural"
    });

    if (response.data?.[0]?.url) {
      const imageResponse = await fetch(response.data[0].url);
      const buffer = await imageResponse.arrayBuffer();
      
      // Save with timestamp to force refresh
      const timestamp = Date.now();
      const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', '19-sun.png');
      
      fs.writeFileSync(outputPath, Buffer.from(buffer));
      
      console.log(`✨ Fresh enhanced Sun created! Size: ${buffer.byteLength} bytes`);
      console.log(`📁 Saved to: ${outputPath}`);
      
      // Verify the file was created
      const stats = fs.statSync(outputPath);
      console.log(`📊 File confirmed: ${stats.size} bytes, modified: ${stats.mtime}`);
    }
  } catch (error) {
    console.error('❌ Error creating enhanced Sun:', error);
  }
}

createFreshEnhancedSun();