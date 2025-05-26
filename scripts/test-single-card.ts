/**
 * Test Single Card Generation - Verify API Connection
 */

import fs from 'fs';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

async function testSingleCard() {
  try {
    console.log('🧪 Testing Hugging Face API connection...');
    
    const prompt = `The Magician tarot card, ultra-ethereal, translucent, dreamlike quality, cascading liquid starlight hair, celestial features, musky pink and purple color palette, figure with one hand pointing to heaven and one to earth, magical tools on altar, infinity symbol above head`;
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            width: 512,
            height: 768,
            guidance_scale: 7.5,
            num_inference_steps: 50
          }
        }),
      }
    );

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      return false;
    }

    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!fs.existsSync('public/authentic-cards/major-arcana')) {
      fs.mkdirSync('public/authentic-cards/major-arcana', { recursive: true });
    }

    fs.writeFileSync('public/authentic-cards/major-arcana/01-magician.png', buffer);
    console.log('✅ Test successful! Generated The Magician card');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

testSingleCard();