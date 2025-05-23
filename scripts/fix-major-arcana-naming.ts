/**
 * Generate Major Arcana with Correct Numbered Filenames
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateNumberedCard(cardNumber: number, cardName: string, prompt: string): Promise<boolean> {
  try {
    console.log(`🎨 Creating ${cardName} (${cardNumber}.png)...`);
    
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
      
      // Save with the correct numbered filename
      fs.writeFileSync(path.join(assetsDir, `${cardNumber}.png`), buffer);
      
      console.log(`✅ ${cardName} saved as ${cardNumber}.png`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error creating ${cardName}:`, error);
    return false;
  }
}

async function fixMajorArcanaNaming() {
  // Generate the first few Major Arcana cards with correct numbering
  const majorCards = [
    { number: 0, name: 'The Fool', prompt: 'Young traveler at cliff edge with small bundle, loyal white dog companion, bright mountain landscape, new beginning adventure, traditional tarot card art style' },
    { number: 1, name: 'The Magician', prompt: 'Robed figure with wand raised high, infinity symbol above head, altar with cup sword pentacle and wand, red roses and white lilies, manifestation, traditional tarot art' },
    { number: 2, name: 'The High Priestess', prompt: 'Seated woman between black and white pillars, crescent moon crown, blue robes, pomegranate curtain, scroll of divine law, intuition, traditional tarot art' }
  ];
  
  console.log('🎨 Creating Major Arcana with correct numbered filenames...\n');
  
  let generated = 0;
  for (const card of majorCards) {
    const imagePath = path.join(process.cwd(), 'public', 'assets', 'cards', `${card.number}.png`);
    
    if (!fs.existsSync(imagePath)) {
      const success = await generateNumberedCard(card.number, card.name, card.prompt);
      if (success) generated++;
      
      // Brief pause between generations
      await new Promise(resolve => setTimeout(resolve, 3000));
    } else {
      console.log(`✓ ${card.name} (${card.number}.png) already exists`);
    }
  }
  
  console.log(`\n🎉 Generated ${generated} Major Arcana cards with correct filenames!`);
  console.log('🎨 These cards should now appear in your tarot app!');
}

fixMajorArcanaNaming();