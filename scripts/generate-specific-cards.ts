/**
 * Generate Specific Card Images
 * 
 * This script generates images for specified card IDs with rate limiting
 * to prevent API throttling.
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
async function generateCardImage(cardId: string, name: string, retryCount = 0): Promise<boolean> {
  try {
    console.log(`🎨 Creating: ${name}`);
    
    let prompt = `Beautiful traditional tarot card "${name}" with authentic mystical symbolism, rich colors, ornate details, traditional tarot art style`;
    
    // Specific prompts for major cards
    if (name.includes('Star')) {
      prompt = 'Peaceful woman by water under starry sky, seven stars above, hope and guidance, traditional tarot art';
    } else if (name.includes('Sun')) {
      prompt = 'Bright golden sun with rays, joyful child on white horse, garden with sunflowers, happiness and success, traditional tarot art';
    } else if (name.includes('Moon')) {
      prompt = 'Mystical moon with face in night sky, two towers, winding path, dog and wolf, crayfish in water, traditional tarot art';
    } else if (name.includes('World')) {
      prompt = 'Dancing figure in flowing cloth within laurel wreath, four symbols in corners, completion and achievement, traditional tarot art';
    }

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
      
      console.log(`✅ ${name} completed`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error creating ${name}:`, error);
    if (retryCount < 2) {
      console.log(`Retrying ${name}...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      return generateCardImage(cardId, name, retryCount + 1);
    }
    return false;
  }
}

async function processCardBatches(cards: { id: string, name: string }[]): Promise<void> {
  console.log(`\n🎨 Processing ${cards.length} cards...\n`);
  
  let generated = 0;
  for (const card of cards) {
    if (!imageExists(card.id)) {
      const success = await generateCardImage(card.id, card.name);
      if (success) generated++;
      
      // Wait between generations to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.log(`✓ ${card.name} already exists`);
    }
  }
  
  console.log(`\n🎉 Generated ${generated} new beautiful card images!`);
}

async function main() {
  // Focus on completing Major Arcana cards first
  const majorArcanaCards = [
    { id: '17', name: 'The Star' },
    { id: '18', name: 'The Moon' },
    { id: '19', name: 'The Sun' },
    { id: '21', name: 'The World' }
  ];
  
  await processCardBatches(majorArcanaCards);
  
  console.log('\n🎨 Major Arcana card generation complete!');
}

main();