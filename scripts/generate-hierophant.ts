/**
 * Generate Single Card: The Hierophant (5)
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateHierophant() {
  try {
    console.log(`🎨 Generating authentic artwork for The Hierophant (5)...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Traditional Rider-Waite tarot card The Hierophant: seated religious figure in papal robes on throne between two pillars, raising right hand in blessing, holding golden staff with triple cross, two kneeling acolytes below receiving teachings, ornate church setting with stained glass windows, keys at feet symbolizing spiritual knowledge, sacred wisdom and religious tradition, vertical tarot card format",
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    if (!response.data?.[0]?.url) {
      console.error(`❌ No image URL returned for The Hierophant`);
      return false;
    }

    // Download the image
    const imageResponse = await fetch(response.data[0].url);
    if (!imageResponse.ok) {
      console.error(`❌ Failed to download image: ${imageResponse.statusText}`);
      return false;
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save as numbered file
    const filename = `5.png`;
    const filepath = path.join("public", "assets", "cards", filename);
    
    fs.writeFileSync(filepath, buffer);
    console.log(`✅ Saved authentic The Hierophant as ${filename}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error generating The Hierophant:`, error);
    return false;
  }
}

// Run the generation
generateHierophant().then(success => {
  if (success) {
    console.log("🌟 The Hierophant generated successfully!");
  } else {
    console.log("❌ Failed to generate The Hierophant");
  }
}).catch(console.error);