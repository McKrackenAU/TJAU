/**
 * Quick Card Generator - Generate essential Major Arcana cards
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
async function generateCard(cardName: string, fileName: string): Promise<boolean> {
  try {
    console.log(`🎨 ${cardName}`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Beautiful traditional tarot card "${cardName}" with authentic symbolic imagery, mystical elements, rich colors, traditional tarot art style`,
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
      
      fs.writeFileSync(path.join(assetsDir, fileName), buffer);
      
      console.log(`✅ ${cardName} complete`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error: ${cardName}`, error);
    return false;
  }
}

async function generateEssentialCards() {
  const cards = [
    { name: 'The Hierophant', file: '5.png' },
    { name: 'The Lovers', file: '6.png' },
    { name: 'The Chariot', file: '7.png' },
    { name: 'Strength', file: '8.png' },
    { name: 'The Hermit', file: '9.png' }
  ];
  
  console.log('🎨 Creating Major Arcana artwork...\n');
  
  let generated = 0;
  for (const card of cards) {
    const imagePath = path.join(process.cwd(), 'public', 'assets', 'cards', card.file);
    
    if (!fs.existsSync(imagePath)) {
      const success = await generateCard(card.name, card.file);
      if (success) generated++;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      console.log(`✓ ${card.name} exists`);
    }
  }
  
  console.log(`\n🎉 Generated ${generated} new cards!`);
}

generateEssentialCards();