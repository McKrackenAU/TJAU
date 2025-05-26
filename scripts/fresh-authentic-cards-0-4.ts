/**
 * Generate Fresh Authentic Cards 0-4 - Complete Replacement
 * Using working API key to create beautiful, traditional artwork
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateFreshCard(cardName: string, filename: string, prompt: string): Promise<boolean> {
  try {
    console.log(`🎨 Generating fresh authentic artwork for ${cardName}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "vivid"
    });

    if (response.data && response.data[0].url) {
      const imageUrl = response.data[0].url;
      const imageResponse = await fetch(imageUrl);
      
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
      }

      const imageBuffer = await imageResponse.arrayBuffer();
      const outputPath = path.join("public", "authentic-cards", "major-arcana", filename);
      
      ensureDirectoryExists(path.dirname(outputPath));
      fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
      
      console.log(`✅ Fresh authentic ${cardName} created: ${filename}`);
      return true;
    } else {
      console.error(`❌ No image data received for ${cardName}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error generating ${cardName}:`, error);
    return false;
  }
}

async function generateFreshCards0to4() {
  console.log("🌟 Starting fresh authentic card generation for Major Arcana 0-4...");
  
  const cards = [
    {
      name: "The Fool",
      filename: "00-fool-fresh.png",
      prompt: "A beautiful tarot card illustration of The Fool. A young traveler stands at the edge of a cliff, carrying a small bundle on a stick, with a white rose in hand symbolizing purity. A small white dog playfully follows at his feet. The sun shines brightly overhead with mountains in the distance. The figure wears colorful, flowing clothes and has an expression of joy and wonder. Traditional tarot art style with rich, vibrant colors and symbolic details. The card should capture the essence of new beginnings, innocence, and unlimited potential."
    },
    {
      name: "The Magician", 
      filename: "01-magician-fresh.png",
      prompt: "A beautiful tarot card illustration of The Magician. A confident figure stands before an altar with the four tarot suits displayed: a cup, pentacle, sword, and wand. One hand points upward to the heavens while the other points downward to earth, with an infinity symbol glowing above his head. He wears red and white robes symbolizing passion and purity. Roses and lilies bloom around him. Traditional tarot art style with rich, mystical colors. The card should capture the essence of manifestation, willpower, and the ability to channel divine energy into earthly reality."
    },
    {
      name: "The High Priestess",
      filename: "02-high-priestess-fresh.png", 
      prompt: "A beautiful tarot card illustration of The High Priestess. A serene woman sits between two pillars marked B and J (Boaz and Jachin), with a veil decorated with pomegranates behind her. She wears blue robes and a crown with lunar crescents. At her feet lies a scroll partially unrolled, and the moon phases are visible. Water flows gently in the background. Traditional tarot art style with deep blues, whites, and silver tones. The card should capture the essence of intuition, mystery, and hidden knowledge."
    },
    {
      name: "The Empress",
      filename: "03-empress-fresh.png",
      prompt: "A beautiful tarot card illustration of The Empress. A regal woman sits on a throne in a lush garden filled with wheat, symbolizing fertility and abundance. She wears a crown of twelve stars and flowing robes decorated with pomegranates. The Venus symbol appears prominently. A waterfall and forest create a nurturing natural backdrop. Traditional tarot art style with earth tones, greens, and golden yellows. The card should capture the essence of motherhood, fertility, nature, and creative abundance."
    },
    {
      name: "The Emperor",
      filename: "04-emperor-fresh.png", 
      prompt: "A beautiful tarot card illustration of The Emperor. A strong, bearded man sits on a stone throne decorated with ram heads, holding an ankh scepter. He wears red robes and armor, with a crown symbolizing his authority. Barren mountains rise behind him, representing his dominion over the material world. The Aries symbol appears prominently. Traditional tarot art style with bold reds, oranges, and stone grays. The card should capture the essence of authority, structure, leadership, and paternal power."
    }
  ];

  let successCount = 0;
  for (const card of cards) {
    if (await generateFreshCard(card.name, card.filename, card.prompt)) {
      successCount++;
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log(`\n🎯 Fresh card generation complete: ${successCount}/${cards.length} cards created successfully`);
  
  if (successCount === cards.length) {
    console.log("✨ All fresh authentic cards generated successfully!");
  } else {
    console.log("⚠️  Some cards failed to generate. Check the logs above for details.");
  }
}

generateFreshCards0to4().catch(console.error);