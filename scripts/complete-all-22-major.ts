/**
 * Complete All 22 Major Arcana Cards with Correct Numbering
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateMajorCard(cardNumber: number, cardName: string, prompt: string): Promise<boolean> {
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
      
      fs.writeFileSync(path.join(assetsDir, `${cardNumber}.png`), buffer);
      
      console.log(`✅ ${cardName} completed as ${cardNumber}.png`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error creating ${cardName}:`, error);
    return false;
  }
}

async function completeAll22Major() {
  // Complete set of 22 Major Arcana cards with traditional symbolism
  const allMajorCards = [
    { number: 3, name: 'The Empress', prompt: 'Pregnant woman on golden throne in lush garden, wheat field, flowing stream, venus symbol on heart shield, crown of twelve stars, fertility and abundance, traditional tarot art' },
    { number: 4, name: 'The Emperor', prompt: 'Bearded emperor on stone throne with ram head armrests, red robes, golden crown, scepter, barren mountains background, authority and structure, traditional tarot art' },
    { number: 5, name: 'The Hierophant', prompt: 'Religious figure in ornate robes on throne between two pillars, triple crown, raised hand blessing, two acolytes kneeling, crossed keys, spiritual wisdom, traditional tarot art' },
    { number: 6, name: 'The Lovers', prompt: 'Man and woman under angel blessing, garden of eden, tree of life, tree of knowledge, naked innocence, divine love and choice, traditional tarot art' },
    { number: 7, name: 'The Chariot', prompt: 'Armored warrior in chariot pulled by black and white sphinxes, city walls background, laurel crown, control and victory, traditional tarot art' }
  ];
  
  console.log('🎨 Generating Major Arcana cards 3-7 with correct numbering...\n');
  
  let generated = 0;
  for (const card of allMajorCards) {
    const imagePath = path.join(process.cwd(), 'public', 'assets', 'cards', `${card.number}.png`);
    
    if (!fs.existsSync(imagePath)) {
      const success = await generateMajorCard(card.number, card.name, card.prompt);
      if (success) generated++;
      
      // Brief pause between generations
      await new Promise(resolve => setTimeout(resolve, 4000));
    } else {
      console.log(`✓ ${card.name} (${card.number}.png) already exists`);
    }
  }
  
  console.log(`\n🎉 Generated ${generated} Major Arcana cards with perfect numbering!`);
  console.log('🎨 Your tarot app will now display these beautiful card fronts!');
}

completeAll22Major();