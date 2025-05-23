/**
 * Generate Missing Card Images - Complete Card Collection
 * 
 * This script generates high-quality tarot card images for all missing cards
 * and saves them permanently to the assets directory.
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
async function generateCardImage(cardName: string, cardType: 'major' | 'custom'): Promise<string | null> {
  try {
    console.log(`🎨 ${cardName}`);
    
    let prompt = `Traditional tarot card "${cardName}" with beautiful mystical symbolism, ornate details, rich colors, traditional tarot art style`;
    
    // Enhanced prompts for specific cards
    if (cardName.includes('Temperance')) {
      prompt = 'Angel with large wings pouring water between two cups, one foot on land one in water, iris flowers, triangle on robe, moderation and balance, traditional tarot art';
    } else if (cardName.includes('Devil')) {
      prompt = 'Horned figure with bat wings on black throne, inverted pentagram on forehead, two chained figures below, torch, materialism and bondage, traditional tarot art';
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (response.data?.[0]?.url) {
      return response.data[0].url;
    }
    
    return null;
  } catch (error) {
    console.error(`Error generating ${cardName}:`, error);
    return null;
  }
}

async function downloadAndSaveImage(imageUrl: string, filename: string): Promise<boolean> {
  try {
    const response = await fetch(imageUrl);
    const buffer = Buffer.from(await response.arrayBuffer());
    
    const assetsDir = path.join(process.cwd(), 'public', 'assets', 'cards');
    fs.mkdirSync(assetsDir, { recursive: true });
    
    fs.writeFileSync(path.join(assetsDir, filename), buffer);
    return true;
  } catch (error) {
    console.error('Error saving image:', error);
    return false;
  }
}

async function generateMissingCards() {
  // Focus on completing remaining Major Arcana cards
  const priorityCards = [
    { name: 'Temperance', file: '14.png', type: 'major' as const },
    { name: 'The Devil', file: '15.png', type: 'major' as const }
  ];
  
  console.log('🎨 Completing final Major Arcana cards...\n');
  
  let generated = 0;
  for (const card of priorityCards) {
    const imagePath = path.join(process.cwd(), 'public', 'assets', 'cards', card.file);
    
    if (!fs.existsSync(imagePath)) {
      const imageUrl = await generateCardImage(card.name, card.type);
      
      if (imageUrl) {
        const saved = await downloadAndSaveImage(imageUrl, card.file);
        if (saved) {
          console.log(`✅ ${card.name} completed`);
          generated++;
        }
      }
      
      // Brief pause between generations
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.log(`✓ ${card.name} already exists`);
    }
  }
  
  console.log(`\n🎉 Generated ${generated} final Major Arcana cards!`);
  console.log('🎨 Major Arcana collection now complete with beautiful authentic artwork!');
}

generateMissingCards();