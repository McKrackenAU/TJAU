/**
 * Quick Check for OpenAI Image Service Availability
 */
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function checkImageService(): Promise<void> {
  console.log("🔍 Checking OpenAI image service status...");
  
  try {
    const start = Date.now();
    
    await openai.images.generate({
      model: "dall-e-2",
      prompt: "test",
      n: 1,
      size: "256x256"
    });
    
    const duration = Date.now() - start;
    console.log(`✅ Image service is working! Response time: ${duration}ms`);
    console.log("🚀 Ready to generate your tarot cards!");
    
  } catch (error: any) {
    console.log("⏳ Image service still experiencing delays");
    console.log("💡 We'll try again in a bit...");
  }
}

checkImageService();