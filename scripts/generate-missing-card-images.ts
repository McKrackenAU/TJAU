/**
 * Generate Missing Card Images
 * 
 * This script checks for any missing card images in the cache
 * and generates them using the API with proper rate limiting.
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function imageExists(cardId: string): boolean {
  const imagePath = path.join(process.cwd(), 'public', 'assets', 'cards', `${cardId}.png`);
  return fs.existsSync(imagePath);
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
async function generateCardImage(cardId: string): Promise<boolean> {
  try {
    const cardNames: Record<string, string> = {
      '0': 'The Fool',
      '1': 'The Magician', 
      '2': 'The High Priestess',
      '3': 'The Empress',
      '4': 'The Emperor',
      '5': 'The Hierophant',
      '6': 'The Lovers',
      '7': 'The Chariot',
      '8': 'Strength',
      '9': 'The Hermit',
      '10': 'Wheel of Fortune',
      '11': 'Justice',
      '12': 'The Hanged Man',
      '13': 'Death',
      '14': 'Temperance',
      '15': 'The Devil',
      '16': 'The Tower',
      '17': 'The Star',
      '18': 'The Moon',
      '19': 'The Sun',
      '20': 'Judgement',
      '21': 'The World'
    };
    
    const cardName = cardNames[cardId] || `Card ${cardId}`;
    console.log(`🎨 ${cardName}`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Traditional tarot card "${cardName}" with beautiful mystical symbolism, rich colors, ornate details, traditional tarot art style`,
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
      
      console.log(`✅ ${cardName} complete`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error generating card ${cardId}:`, error);
    return false;
  }
}

async function processCardBatches(cards: { id: string, name: string }[]): Promise<void> {
  console.log(`🎨 Generating ${cards.length} card images...\n`);
  
  let generated = 0;
  for (const card of cards) {
    if (!imageExists(card.id)) {
      const success = await generateCardImage(card.id);
      if (success) generated++;
      
      // Brief pause between generations
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      console.log(`✓ ${card.name} exists`);
    }
  }
  
  console.log(`\n🎉 Generated ${generated} beautiful card images!`);
}

async function main() {
  // Check for missing Major Arcana cards
  const majorCards = [
    { id: '0', name: 'The Fool' },
    { id: '1', name: 'The Magician' },
    { id: '2', name: 'The High Priestess' },
    { id: '20', name: 'Judgement' }
  ];
  
  await processCardBatches(majorCards);
  
  console.log('\n🎨 Card generation process complete!');
}

main();