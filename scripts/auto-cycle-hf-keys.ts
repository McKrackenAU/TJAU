/**
 * Auto-Cycle Through Fresh Hugging Face Keys
 * Try each new key until one works for generating improved Cups cards
 */

import fs from "fs";
import path from "path";

// List of new HF key environment variable names (containing TWO or THREE)
const NEW_HF_KEYS = [
  'HF_API_TOKEN_TWO',
  'HUGGINGFACE_API_TOKEN_THREE', 
  'HFACE_API_TOKEN_THREE'
];

const HF_API = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

async function testHuggingFaceKey(keyName: string, token: string): Promise<boolean> {
  try {
    console.log(`🔑 Testing key: ${keyName}...`);
    
    // Test with a simple API call first
    const testResponse = await fetch("https://huggingface.co/api/whoami", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    
    if (!testResponse.ok) {
      console.log(`❌ Key ${keyName} failed authentication`);
      return false;
    }
    
    console.log(`✅ Key ${keyName} authenticated successfully!`);
    return true;
    
  } catch (error) {
    console.log(`❌ Key ${keyName} failed:`, error.message);
    return false;
  }
}

async function generateCardWithKey(keyName: string, token: string): Promise<boolean> {
  try {
    console.log(`🎨 Generating Three of Cups with ${keyName}...`);
    
    const prompt = "Ultra-ethereal 3D Three of Cups tarot card, three joyful friends celebrating together, each holding golden chalice raised in toast, exactly three ornate cups prominently displayed, translucent figures with flowing starlight hair, cosmic pink and purple nebulae background, ultra-realistic 3D depth, mystical celebration scene";
    
    const response = await fetch(HF_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          num_inference_steps: 30,
          guidance_scale: 7.5,
          width: 1024,
          height: 1024
        }
      }),
    });

    if (!response.ok) {
      console.log(`❌ Generation failed with ${keyName}: ${response.status}`);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    const outputPath = path.join("public", "authentic-cards", "minor-arcana", "cups", "three-of-cups.png");
    
    fs.writeFileSync(outputPath, new Uint8Array(imageBuffer));
    console.log(`🎉 SUCCESS! Three of Cups generated with ${keyName}!`);
    return true;
    
  } catch (error) {
    console.log(`❌ Generation error with ${keyName}:`, error.message);
    return false;
  }
}

async function autoFindWorkingKey() {
  console.log("🔧 Auto-cycling through fresh Hugging Face keys...\n");
  
  for (const keyName of NEW_HF_KEYS) {
    const token = process.env[keyName];
    
    if (!token) {
      console.log(`⏭️  ${keyName} not found in environment, skipping...`);
      continue;
    }
    
    console.log(`\n🧪 Testing ${keyName}...`);
    
    // First test authentication
    const authSuccess = await testHuggingFaceKey(keyName, token);
    if (!authSuccess) {
      continue;
    }
    
    // If auth works, try generating
    const genSuccess = await generateCardWithKey(keyName, token);
    if (genSuccess) {
      console.log(`\n🎉 FOUND WORKING KEY: ${keyName}`);
      console.log("✅ Three of Cups generated successfully!");
      console.log("🚀 Ready to generate remaining improved Cups cards!");
      return keyName;
    }
    
    // Small delay before trying next key
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log("\n❌ No working keys found. Please add fresh Hugging Face tokens.");
  return null;
}

autoFindWorkingKey().catch(console.error);