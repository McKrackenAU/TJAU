/**
 * Generate The Emperor and Empress Cards
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateCard(cardId: string, cardName: string, prompt: string): Promise<boolean> {
  try {
    console.log(`🎨 Creating ${cardName}...`);
    
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
      
      fs.writeFileSync(path.join(assetsDir, `${cardId}.png`), buffer);
      
      console.log(`✅ ${cardName} completed!`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error creating ${cardName}:`, error);
    return false;
  }
}

async function generateEmperorEmpress() {
  const cards = [
    { 
      id: '4', 
      name: 'The Emperor', 
      prompt: 'Bearded emperor on stone throne with ram head armrests, red robes, golden crown, scepter, barren mountains background, authority and structure, traditional tarot art'
    },
    { 
      id: '5', 
      name: 'The Hierophant', 
      prompt: 'Religious figure in ornate robes on throne between two pillars, triple crown, raised hand blessing, two acolytes kneeling, crossed keys, spiritual wisdom, traditional tarot art'
    }
  ];
  
  console.log('🎨 Creating The Emperor and Hierophant...\n');
  
  for (const card of cards) {
    const imagePath = path.join(process.cwd(), 'public', 'assets', 'cards', `${card.id}.png`);
    
    if (!fs.existsSync(imagePath)) {
      await generateCard(card.id, card.name, card.prompt);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.log(`✓ ${card.name} already exists`);
    }
  }
  
  console.log(`\n🎉 Emperor and Hierophant card generation complete!`);
}

generateEmperorEmpress();