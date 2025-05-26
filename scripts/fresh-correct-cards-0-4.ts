/**
 * Generate Fresh, Correct Cards 0-4 - 2025 Authentic Edition
 * Replace any cached incorrect images with properly authentic artwork
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

async function generateCorrectCard(cardName: string, filename: string, prompt: string): Promise<boolean> {
  try {
    console.log(`\n🎨 Creating fresh authentic ${cardName}...`);
    
    const directory = "public/authentic-cards/major-arcana";
    ensureDirectoryExists(directory);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    });

    if (response.data?.[0]?.url) {
      const imageResponse = await fetch(response.data[0].url);
      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
      const fullPath = path.join(directory, filename);
      
      fs.writeFileSync(fullPath, imageBuffer);
      
      console.log(`✅ SUCCESS: Fresh ${cardName} -> ${fullPath}`);
      return true;
    }
    
    return false;
    
  } catch (error) {
    console.error(`❌ Failed ${cardName}:`, error);
    return false;
  }
}

async function generateFreshCards0to4() {
  console.log("🌟 Creating Fresh Authentic Major Arcana Cards 0-4...");
  
  const cards = [
    {
      name: "The Fool",
      filename: "00-fool-fresh.png",
      prompt: "A young traveler standing at the edge of a cliff, wearing colorful clothes and carrying a small bag on a stick. A white rose in one hand symbolizing purity, a small white dog at his feet representing loyalty and protection. Mountains and bright sky in background, sun shining overhead. The figure looks upward with optimism and wonder, embodying new beginnings, innocence, and unlimited potential. Vibrant colors, joyful and adventurous atmosphere."
    },
    {
      name: "The Magician",
      filename: "01-magician-fresh.png",
      prompt: "A confident figure in red robes standing behind an altar table, pointing one hand upward to heaven and one downward to earth. On the table are the four tarot suits: a wand, cup, sword, and pentacle. Above his head floats an infinity symbol, and roses and lilies grow around him. Red and white robes symbolizing passion and purity. Dynamic pose showing mastery of the elements and connection between spiritual and material worlds."
    },
    {
      name: "The High Priestess",
      filename: "02-high-priestess-fresh.png",
      prompt: "A serene woman seated between two pillars - one black (Boaz) and one white (Jachin) - wearing flowing blue robes and a crown with a crescent moon. Behind her hangs a tapestry decorated with pomegranates. At her feet flows a stream of consciousness. She holds a scroll marked 'TORA' representing hidden knowledge. Mystical and ethereal atmosphere with soft blue and silver tones, embodying intuition, mystery, and inner wisdom."
    },
    {
      name: "The Empress",
      filename: "03-empress-fresh.png",
      prompt: "A beautiful, pregnant woman in flowing robes sitting on a throne in a lush garden. She wears a crown of twelve stars and holds a scepter topped with a globe. Around her grow abundant wheat fields, trees bearing fruit, and a waterfall flows nearby. The scene radiates fertility, abundance, and nurturing energy. Rich greens, golds, and earth tones, representing motherhood, nature, and creative abundance."
    },
    {
      name: "The Emperor",
      filename: "04-emperor-fresh.png",
      prompt: "A powerful, bearded ruler seated on a stone throne decorated with ram heads (symbol of Aries). He wears armor beneath red robes and holds an ankh-shaped scepter representing life and power. Behind him are barren mountains showing his dominion over the material world. His expression is stern but fair, embodying authority, structure, and paternal protection. Strong reds and oranges with stone greys, representing leadership and stability."
    }
  ];

  let successCount = 0;
  
  for (const card of cards) {
    const success = await generateCorrectCard(card.name, card.filename, card.prompt);
    if (success) successCount++;
    
    // 3-second delay between generations
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log(`\n🎉 Fresh Cards 0-4 Complete! Generated ${successCount}/${cards.length} cards successfully.`);
  console.log("These fresh images will replace any cached incorrect versions!");
}

generateFreshCards0to4().catch(console.error);