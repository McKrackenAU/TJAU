/**
 * Quick Three of Cups Generation with Enhanced Symbolism
 */

import fs from 'fs';
import path from 'path';

async function generateThreeOfCups(): Promise<boolean> {
  try {
    console.log('Creating Three of Cups with ultra-ethereal style...');
    
    // Enhanced prompt based on traditional symbolism and ultra-ethereal style
    const prompt = `Ultra-ethereal 3D tarot card: Three of Cups. Three beautiful celestial women celebrating together, each holding a golden chalice raised in joyful toast. Their hair flows like liquid starlight in musky pink and purple hues. Translucent, dreamlike skin with ethereal glow. Scene shows celebration, friendship, and community joy. Background features soft mystical clouds, floating golden light particles. The three cups gleam with inner divine light. Ultra-realistic 3D rendering with flowing ethereal fabric. Magical atmosphere with depth and dimension. Professional tarot card composition, hyper-detailed.`;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY_TWO}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        style: 'vivid'
      })
    });

    const data = await response.json();
    
    if (!data.data || !data.data[0]?.url) {
      console.error('Failed to generate image:', data);
      return false;
    }

    const imageUrl = data.data[0].url;
    console.log('Image generated successfully');

    // Download and save
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'minor-arcana', 'cups');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, 'three-of-cups.png');
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log('Three of Cups saved successfully');
    return true;
    
  } catch (error) {
    console.error('Error generating Three of Cups:', error);
    return false;
  }
}

generateThreeOfCups().then(success => {
  process.exit(success ? 0 : 1);
});