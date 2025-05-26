/**
 * Test OpenAI DALL-E 3 Speed and Availability
 */

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function testOpenAISpeed() {
  try {
    console.log('🧪 Testing OpenAI DALL-E 3 speed and availability...');
    const startTime = Date.now();
    
    // Test with a simple prompt similar to our style
    const prompt = `A mystical tarot card showing The Magician, ethereal and translucent style with dreamlike quality, figure with one hand pointing up and one down, magical tools on altar, soft glowing colors, traditional tarot symbolism`;
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log(`✅ OpenAI DALL-E 3 test successful!`);
    console.log(`⏱️ Generation time: ${duration} seconds`);
    console.log(`🖼️ Image URL: ${response.data[0].url}`);
    
    return {
      success: true,
      duration: duration,
      imageUrl: response.data[0].url
    };
    
  } catch (error) {
    console.error('❌ OpenAI test failed:', error);
    return {
      success: false,
      error: error
    };
  }
}

testOpenAISpeed();