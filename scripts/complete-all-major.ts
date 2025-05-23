/**
 * Complete All Major Arcana Cards - Systematic Generation
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateCard(cardId: string, cardName: string, prompt: string): Promise<boolean> {
  try {
    console.log(`🎨 Creating ${cardName}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
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

async function completeAllMajor() {
  // Batch 1: Core Major Arcana cards
  const batch1 = [
    { id: '6', name: 'The Lovers', prompt: 'Man and woman under angel blessing, garden of eden, tree of life, tree of knowledge, naked innocence, divine love, traditional tarot art' },
    { id: '7', name: 'The Chariot', prompt: 'Armored warrior in chariot pulled by black and white sphinxes, city in background, laurel crown, control and victory, traditional tarot art' },
    { id: '8', name: 'Strength', prompt: 'Woman gently closing lions mouth with infinite love, white dress, flowers in hair, infinity symbol above head, inner strength, traditional tarot art' }
  ];
  
  console.log('🎨 Generating Major Arcana batch 1...\n');
  
  for (const card of batch1) {
    const imagePath = path.join(process.cwd(), 'public', 'assets', 'cards', `${card.id}.png`);
    
    if (!fs.existsSync(imagePath)) {
      await generateCard(card.id, card.name, card.prompt);
      await new Promise(resolve => setTimeout(resolve, 3000));
    } else {
      console.log(`✓ ${card.name} already exists`);
    }
  }
  
  console.log(`\n🎉 Batch 1 complete! Continuing with more Major Arcana cards...`);
}

completeAllMajor();