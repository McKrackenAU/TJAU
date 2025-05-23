/**
 * Generate Missing Cards in Small Batches
 * This generates cards more efficiently in smaller batches
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
async function generateAndSaveCard(cardName: string, filename: string): Promise<boolean> {
  try {
    console.log(`🎨 ${cardName}`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Traditional tarot card "${cardName}" with authentic symbolic imagery, mystical elements, rich colors, traditional art style`,
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
      
      fs.writeFileSync(path.join(assetsDir, filename), buffer);
      
      console.log(`✅ ${cardName} complete`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error: ${cardName}`, error);
    return false;
  }
}

async function generateBatch() {
  const majorArcana = [
    { name: 'Justice', file: '11.png' },
    { name: 'The Hanged Man', file: '12.png' },
    { name: 'Death', file: '13.png' },
    { name: 'Temperance', file: '14.png' },
    { name: 'The Devil', file: '15.png' }
  ];
  
  console.log('🎨 Creating Major Arcana batch...\n');
  
  let generated = 0;
  for (const card of majorArcana) {
    const imagePath = path.join(process.cwd(), 'public', 'assets', 'cards', card.file);
    
    if (!fs.existsSync(imagePath)) {
      const success = await generateAndSaveCard(card.name, card.file);
      if (success) generated++;
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      console.log(`✓ ${card.name} exists`);
    }
  }
  
  console.log(`\n🎉 Generated ${generated} beautiful cards!`);
}

generateBatch();