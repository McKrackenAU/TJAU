/**
 * Generate Missing Cards in Small Batches
 * This generates cards more efficiently in smaller batches
 */

import OpenAI from "openai";
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets', 'cards');

// First batch - most important missing major arcana
const firstBatch = [
  { id: '1', name: 'The Magician', file: 'the-magician.png' },
  { id: '2', name: 'The High Priestess', file: 'the-high-priestess.png' },
  { id: '3', name: 'The Empress', file: 'the-empress.png' },
  { id: '4', name: 'The Emperor', file: 'the-emperor.png' },
  { id: '19', name: 'The Sun', file: 'the-sun.png' },
  { id: '18', name: 'The Moon', file: 'the-moon.png' },
  { id: '17', name: 'The Star', file: 'the-star.png' },
];

async function generateAndSaveCard(cardName: string, filename: string): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${cardName}...`);
    
    const prompt = `Create a beautiful traditional tarot art style illustration for "${cardName}". 
    The image should be:
    - High quality mystical tarot card art
    - Rich in symbolic meaning
    - Professional tarot aesthetic
    - Detailed and visually striking`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard", // Using standard for faster generation
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) throw new Error("No image URL returned");

    // Download and save
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error(`Download failed: ${imageResponse.statusText}`);
    
    const buffer = await imageResponse.arrayBuffer();
    const filepath = path.join(ASSETS_DIR, filename);
    
    fs.writeFileSync(filepath, Buffer.from(buffer));
    console.log(`✅ Saved ${filename}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to generate ${cardName}:`, error);
    return false;
  }
}

async function generateBatch() {
  console.log('🚀 Generating first batch of major arcana cards...\n');
  
  let successCount = 0;
  
  for (const card of firstBatch) {
    const success = await generateAndSaveCard(card.name, card.file);
    if (success) successCount++;
    
    // Wait 1 second between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n🎉 Batch complete! Generated ${successCount}/${firstBatch.length} cards`);
  console.log(`📁 Images saved to: ${ASSETS_DIR}`);
}

generateBatch().catch(console.error);