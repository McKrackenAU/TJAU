/**
 * Generate Authentic Major Arcana Cards with Traditional Symbolism
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateAuthenticCard(cardNumber: number, cardName: string, prompt: string): Promise<boolean> {
  try {
    console.log(`🎨 Creating authentic ${cardName} (${cardNumber}.png)...`);
    
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

async function generateAuthenticMajorArcana() {
  // Authentic Major Arcana cards with traditional symbolism
  const authenticCards = [
    { 
      number: 0, 
      name: 'The Fool', 
      prompt: 'Young man in colorful clothes stepping toward cliff edge, small white bag on stick, loyal white dog at feet, bright sun and mountains, carefree expression, new beginnings, traditional Rider-Waite tarot style' 
    },
    { 
      number: 1, 
      name: 'The Magician', 
      prompt: 'Robed figure with right hand raised holding wand pointing to sky, left hand pointing to earth, infinity symbol floating above head, altar table with cup sword wand and pentacle, red roses and white lilies, as above so below, traditional tarot art' 
    },
    { 
      number: 2, 
      name: 'The High Priestess', 
      prompt: 'Seated woman between black pillar B and white pillar J, blue robes with flowing water, crescent moon crown, scroll marked TORA, pomegranate curtain behind, intuition and mystery, traditional tarot style' 
    }
  ];
  
  console.log('🎨 Creating authentic Major Arcana with traditional symbolism...\n');
  
  let generated = 0;
  for (const card of authenticCards) {
    const success = await generateAuthenticCard(card.number, card.name, card.prompt);
    if (success) generated++;
    
    // Brief pause between generations
    await new Promise(resolve => setTimeout(resolve, 4000));
  }
  
  console.log(`\n🎉 Generated ${generated} authentic Major Arcana cards!`);
  console.log('🎨 Each card now represents its true traditional meaning and symbolism!');
}

generateAuthenticMajorArcana();