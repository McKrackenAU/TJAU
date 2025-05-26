/**
 * Launch Ready Card Generator
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

async function createCard(name: string, filename: string, prompt: string): Promise<boolean> {
  try {
    console.log(`🎨 Creating ${name}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard"
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      console.log(`❌ No image URL for ${name}`);
      return false;
    }

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.log(`❌ Failed to fetch image for ${name}`);
      return false;
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    
    const outputDir = path.join("public", "authentic-cards", "major-arcana");
    fs.mkdirSync(outputDir, { recursive: true });
    
    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✅ ${name} created successfully!`);
    return true;
  } catch (error) {
    console.log(`❌ Error creating ${name}:`, error);
    return false;
  }
}

async function generateLaunchCards() {
  console.log("🌟 Starting card generation for launch...");
  
  const startTime = Date.now();
  let successCount = 0;
  
  const cards = [
    {
      name: "The Fool",
      filename: "00-fool.png", 
      prompt: "Beautiful traditional tarot card illustration of The Fool. A joyful young person stands at the edge of a cliff, holding a white rose and carrying a small bundle on a stick. A loyal white dog follows at their feet. The sun shines brightly in a clear blue sky with distant mountains. The figure wears colorful, flowing medieval-style clothing. Traditional tarot art style with vibrant colors representing new beginnings, innocence, and unlimited potential."
    }
  ];

  for (const card of cards) {
    const success = await createCard(card.name, card.filename, card.prompt);
    if (success) successCount++;
    
    // Short delay between cards
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const duration = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n🎯 Generation complete: ${successCount}/${cards.length} cards created in ${duration}s`);
  
  if (successCount > 0) {
    console.log("✨ Your authentic cards are ready for launch!");
  }
}

generateLaunchCards().catch(console.error);