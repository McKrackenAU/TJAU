/**
 * Generate Brand New Authentic Cards - Direct Generation
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

async function generateNewCard(cardName: string, filename: string, prompt: string): Promise<boolean> {
  try {
    console.log(`🎨 Creating brand new ${cardName}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd"
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      console.error(`❌ No image URL for ${cardName}`);
      return false;
    }

    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    
    const outputPath = path.join("public", "authentic-cards", "major-arcana", filename);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✅ New ${cardName} created successfully!`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating ${cardName}:`, error);
    return false;
  }
}

async function generateNewCards() {
  const cards = [
    {
      name: "The Fool",
      filename: "new-fool-authentic.png",
      prompt: "Beautiful tarot card art of The Fool. A joyful young person stands at a cliff edge, carrying a white rose and small bag on a stick. A loyal white dog follows. Bright sun overhead, mountains in distance. Colorful medieval-style clothing. Traditional tarot symbolism with vibrant colors representing new beginnings and pure potential."
    },
    {
      name: "The Magician", 
      filename: "new-magician-authentic.png",
      prompt: "Beautiful tarot card art of The Magician. A confident figure stands before an altar with cup, pentacle, sword, and wand. One hand points to heaven, one to earth. Infinity symbol above head. Red and white robes. Roses and lilies around. Traditional tarot symbolism representing manifestation and divine will."
    },
    {
      name: "The High Priestess",
      filename: "new-priestess-authentic.png", 
      prompt: "Beautiful tarot card art of The High Priestess. Serene woman between two pillars marked B and J. Blue robes, crescent moon crown. Pomegranate veil behind. Scroll at feet, water flowing. Traditional tarot symbolism with blues and whites representing intuition and hidden wisdom."
    },
    {
      name: "The Empress",
      filename: "new-empress-authentic.png",
      prompt: "Beautiful tarot card art of The Empress. Regal woman on throne in fertile garden with wheat fields. Crown of twelve stars, flowing robes with pomegranates. Venus symbol visible. Waterfall and lush forest. Traditional tarot symbolism with earth tones representing motherhood and abundance."
    },
    {
      name: "The Emperor",
      filename: "new-emperor-authentic.png", 
      prompt: "Beautiful tarot card art of The Emperor. Strong bearded man on stone throne with ram head decorations. Red robes, ankh scepter, crown of authority. Barren mountains behind. Aries symbol. Traditional tarot symbolism with reds and grays representing leadership and structure."
    }
  ];

  console.log("🌟 Generating completely new authentic cards...");
  
  for (const card of cards) {
    await generateNewCard(card.name, card.filename, card.prompt);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("✨ New authentic card generation complete!");
}

generateNewCards().catch(console.error);