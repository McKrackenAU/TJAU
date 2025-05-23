/**
 * Generate Authentic Empress and Emperor Cards
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateCard(cardNumber: number, cardName: string, prompt: string): Promise<boolean> {
  try {
    console.log(`🎨 Creating authentic ${cardName}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (response.data?.[0]?.url) {
      const imageUrl = response.data[0].url;
      const imageResponse = await fetch(imageUrl);
      const buffer = Buffer.from(await imageResponse.arrayBuffer());
      
      const assetsDir = path.join(process.cwd(), 'public', 'assets', 'cards');
      fs.mkdirSync(assetsDir, { recursive: true });
      
      fs.writeFileSync(path.join(assetsDir, `${cardNumber}.png`), buffer);
      
      console.log(`✅ Authentic ${cardName} completed!`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error creating ${cardName}:`, error);
    return false;
  }
}

async function generateEmpressEmperor() {
  const cards = [
    { 
      number: 3, 
      name: 'The Empress', 
      prompt: 'Beautiful pregnant woman in flowing white gown seated on luxurious throne in lush garden, golden wheat field behind, crown of twelve stars, Venus symbol on heart-shaped shield, flowing stream, cypress trees, abundance and fertility, traditional tarot style'
    },
    { 
      number: 4, 
      name: 'The Emperor', 
      prompt: 'Bearded mature man in red robes on solid stone throne with ram head armrests, golden crown and scepter, barren rocky mountains background, ankh symbol, authority and stability, traditional Rider-Waite tarot style'
    }
  ];
  
  console.log('🎨 Creating authentic Empress and Emperor with traditional symbolism...\n');
  
  for (const card of cards) {
    await generateCard(card.number, card.name, card.prompt);
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log(`\n🎉 Authentic Empress and Emperor cards completed!`);
}

generateEmpressEmperor();