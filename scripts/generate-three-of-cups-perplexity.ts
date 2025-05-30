/**
 * Generate Three of Cups with Ultra-Ethereal 3D Style using Perplexity API
 * Creating celebration, friendship, and joy with translucent, dreamlike qualities
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateThreeOfCupsWithPerplexity(): Promise<boolean> {
  try {
    console.log('🎨 Creating Three of Cups with ultra-ethereal 3D style...');
    
    // Get enhanced prompt using Perplexity for deeper symbolism
    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [{
          role: 'user',
          content: 'What are the traditional symbolic elements and meanings of the Three of Cups tarot card? Include details about celebration, friendship, community, and visual symbolism.'
        }],
        max_tokens: 300
      })
    });

    const perplexityData = await perplexityResponse.json();
    const symbolismInsight = perplexityData.choices[0].message.content;
    
    console.log('📚 Enhanced symbolism from Perplexity:', symbolismInsight);

    // Create enhanced prompt combining traditional meaning with ultra-ethereal style
    const prompt = `Ultra-ethereal 3D tarot card: Three of Cups. Three beautiful celestial women with translucent, dreamlike qualities celebrating together. Each holds a golden chalice raised in joyful toast. Their hair flows like liquid starlight in musky pink and purple hues. Faces have ethereal glow with celestial features. Scene shows celebration, friendship, and community joy. Background features soft clouds, floating golden light particles, and mystical energy swirls. The three cups gleam with inner light. Ultra-realistic 3D rendering with translucent skin, flowing fabric that seems to merge with light itself. Mystical atmosphere with depth and dimension. Professional tarot card composition with ornate border details. Hyper-detailed, magical realism style.`;

    // Generate image with OpenAI DALL-E 3
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
      console.error('❌ Failed to generate image:', data);
      return false;
    }

    const imageUrl = data.data[0].url;
    console.log('✅ Image generated successfully:', imageUrl);

    // Download and save the image
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Ensure directory exists
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'minor-arcana', 'cups');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, 'three-of-cups.png');
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log('💾 Three of Cups saved to:', outputPath);
    console.log('🎉 Three of Cups generated successfully with ultra-ethereal 3D style!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error generating Three of Cups:', error);
    return false;
  }
}

// Run the generation
generateThreeOfCupsWithPerplexity()
  .then(success => {
    if (success) {
      console.log('✨ Three of Cups creation complete!');
    } else {
      console.log('💫 Three of Cups generation encountered an issue');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Script error:', error);
    process.exit(1);
  });