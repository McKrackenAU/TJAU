/**
 * Complete Authentic Major Arcana Collection
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateCard(cardNumber: number, cardName: string, prompt: string): Promise<boolean> {
  try {
    console.log(`🎨 Creating authentic ${cardName}...`);
    
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
      
      fs.writeFileSync(path.join(assetsDir, `${cardNumber}.png`), buffer);
      
      console.log(`✅ Authentic ${cardName} completed!`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error creating ${cardName}:`, error);
    return false;
  }
}

async function completeAuthenticMajor() {
  // More authentic Major Arcana cards with traditional symbolism
  const cards = [
    { 
      number: 5, 
      name: 'The Hierophant', 
      prompt: 'Religious leader in ornate papal robes on throne between two pillars, triple crown, raised right hand in blessing, two acolytes kneeling before him, crossed keys at feet, spiritual wisdom and tradition, traditional tarot style'
    },
    { 
      number: 6, 
      name: 'The Lovers', 
      prompt: 'Naked man and woman in Garden of Eden under large angel with purple wings, tree of life behind woman with flames, tree of knowledge behind man with serpent, divine love and choice, traditional Rider-Waite style'
    },
    { 
      number: 7, 
      name: 'The Chariot', 
      prompt: 'Armored warrior with crown of stars sitting in chariot pulled by black sphinx and white sphinx, city walls in background, blue canopy with stars, control and victory, traditional tarot art'
    }
  ];
  
  console.log('🎨 Creating more authentic Major Arcana cards...\n');
  
  for (const card of cards) {
    await generateCard(card.number, card.name, card.prompt);
    await new Promise(resolve => setTimeout(resolve, 4000));
  }
  
  console.log(`\n🎉 More authentic Major Arcana cards completed!`);
}

completeAuthenticMajor();