/**
 * Complete Major Arcana Card Fronts - Generate All 22 Cards
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateMajorCard(cardId: string, cardName: string, prompt: string): Promise<boolean> {
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

async function completeMajorArcana() {
  const majorCards = [
    { id: '1', name: 'The Magician', prompt: 'Robed figure with wand raised, infinity symbol above head, altar with cup sword pentacle and wand, red roses and white lilies, manifestation, traditional tarot art' },
    { id: '2', name: 'The High Priestess', prompt: 'Seated woman between black and white pillars, crescent moon crown, blue robes, pomegranate curtain, scroll of divine law, intuition, traditional tarot art' },
    { id: '3', name: 'The Empress', prompt: 'Pregnant woman on golden throne in lush garden, wheat field, flowing stream, venus symbol on heart shield, crown of twelve stars, fertility, traditional tarot art' }
  ];
  
  console.log('🎨 Generating Major Arcana card fronts...\n');
  
  let generated = 0;
  for (const card of majorCards) {
    const imagePath = path.join(process.cwd(), 'public', 'assets', 'cards', `${card.id}.png`);
    
    if (!fs.existsSync(imagePath)) {
      const success = await generateMajorCard(card.id, card.name, card.prompt);
      if (success) generated++;
      
      // Brief pause between generations
      await new Promise(resolve => setTimeout(resolve, 3000));
    } else {
      console.log(`✓ ${card.name} already exists`);
    }
  }
  
  console.log(`\n🎉 Generated ${generated} beautiful Major Arcana cards!`);
}

completeMajorArcana();