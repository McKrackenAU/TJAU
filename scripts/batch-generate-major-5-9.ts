/**
 * Batch Generate Major Arcana Cards 5-9
 * The Hierophant, The Lovers, The Chariot, Strength, The Hermit
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateCard(cardName: string, filename: string, prompt: string): Promise<boolean> {
  try {
    console.log(`\n🎨 Generating ${cardName}...`);
    
    const directory = "public/authentic-cards/major-arcana";
    ensureDirectoryExists(directory);
    
    const response = await openai.images.generate({
      model: "dall-e-3", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    });

    if (!response.data[0]?.url) {
      throw new Error("No image URL returned");
    }

    const imageResponse = await fetch(response.data[0].url);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download: ${imageResponse.statusText}`);
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const fullPath = path.join(directory, filename);
    
    fs.writeFileSync(fullPath, imageBuffer);
    
    console.log(`✅ SUCCESS: ${cardName} -> ${fullPath}`);
    return true;
    
  } catch (error) {
    console.error(`❌ FAILED: ${cardName}:`, error);
    return false;
  }
}

async function generateBatch5to9() {
  console.log("🌟 Generating Major Arcana Cards 5-9...");
  
  const cards = [
    {
      name: "The Hierophant",
      filename: "05-hierophant.png",
      prompt: "A magnificent spiritual teacher seated on an ornate throne between two stone pillars, wearing elaborate religious robes and a triple crown. He holds golden keys in one hand and raises the other in blessing. Before him kneel two devoted students. Rich burgundy and gold colors, stained glass windows in background, sacred symbols of spiritual wisdom and divine knowledge. Traditional tarot art style, mystical and reverent atmosphere."
    },
    {
      name: "The Lovers",
      filename: "06-lovers.png", 
      prompt: "A beautiful couple standing in a lush garden beneath a radiant angel with spread wings. The woman gazes at the angel while the man looks to her, symbolizing choice between earthly and divine love. Behind the woman grows the Tree of Knowledge with fruit, behind the man the Tree of Life with flames. Mountains and blue sky in background. Soft pastels and warm golden light, romantic yet spiritual atmosphere."
    },
    {
      name: "The Chariot",
      filename: "07-chariot.png",
      prompt: "A triumphant warrior standing in a magnificent chariot pulled by two sphinxes - one black, one white - representing opposing forces under control. The charioteer wears armor decorated with crescents and stars, holding a crystal wand. A canopy of stars above, city walls in background. Bold blues, golds, and silver, conveying victory, willpower, and determination."
    },
    {
      name: "Strength",
      filename: "08-strength.png",
      prompt: "A graceful woman in flowing white robes gently closing the jaws of a golden lion with her bare hands. She wears a crown of flowers and an infinity symbol hovers above her head. The scene radiates calm power and inner strength. Soft greens and golds, peaceful meadow setting, demonstrating courage through gentleness and love conquering force."
    },
    {
      name: "The Hermit",
      filename: "09-hermit.png",
      prompt: "An elderly wise man in grey robes standing on a snow-capped mountain peak, holding up a lantern containing a six-pointed star. He carries a staff and looks down a winding path, offering guidance to seekers below. Deep blues and greys with golden lantern light, conveying wisdom, introspection, and spiritual guidance through inner light."
    }
  ];

  let successCount = 0;
  
  for (const card of cards) {
    const success = await generateCard(card.name, card.filename, card.prompt);
    if (success) successCount++;
    
    // 3-second delay between generations to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log(`\n🎉 Batch 5-9 Complete! Generated ${successCount}/${cards.length} cards successfully.`);
  console.log("Next: Cards 10-14 (Wheel of Fortune through Temperance)");
}

generateBatch5to9().catch(console.error);