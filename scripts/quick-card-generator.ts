/**
 * Quick Card Generator - Generate essential Major Arcana cards
 */

import OpenAI from "openai";
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets', 'cards');

// Essential Major Arcana cards to generate first
const essentialCards = [
  { name: 'The Magician', file: 'the-magician.png' },
  { name: 'The High Priestess', file: 'the-high-priestess.png' },
  { name: 'The Empress', file: 'the-empress.png' },
  { name: 'The Emperor', file: 'the-emperor.png' },
  { name: 'The Sun', file: 'the-sun.png' },
];

async function generateCard(cardName: string, fileName: string): Promise<boolean> {
  try {
    console.log(`🎨 Creating ${cardName}...`);
    
    const prompt = `Create a beautiful traditional tarot card illustration that clearly depicts "${cardName}". The image should show the specific character, symbols, and imagery associated with ${cardName} in classic tarot tradition. Style: mystical tarot art, rich symbolism, professional card design.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) throw new Error("No image URL returned");

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error(`Download failed`);
    
    const buffer = await imageResponse.arrayBuffer();
    fs.writeFileSync(path.join(ASSETS_DIR, fileName), Buffer.from(buffer));
    console.log(`✅ Saved ${fileName}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed ${cardName}:`, error);
    return false;
  }
}

async function generateEssentialCards() {
  console.log('🚀 Generating essential Major Arcana cards...\n');
  
  for (const card of essentialCards) {
    await generateCard(card.name, card.file);
    // Small delay between cards
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n🎉 Essential cards generated!');
}

generateEssentialCards();