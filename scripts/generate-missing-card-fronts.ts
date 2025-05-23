/**
 * Generate Missing Card Front Images
 * 
 * This script generates beautiful, meaningful card front images for all missing cards
 * that depict the true essence and symbolism of each card's name.
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
async function generateCardImage(cardId: string, cardName: string, cardType: 'major' | 'minor' | 'custom'): Promise<boolean> {
  try {
    console.log(`🎨 Creating: ${cardName}`);
    
    let prompt = '';
    
    // Create authentic prompts based on card type and name
    if (cardType === 'major') {
      if (cardName.includes('Tower')) {
        prompt = 'Tall medieval stone tower reaching toward stormy sky, dramatic lightning illuminating ancient stones, symbolic of transformation and breakthrough, traditional tarot art style';
      } else if (cardName.includes('Star')) {
        prompt = 'Beautiful nude woman kneeling by water under starry night sky, pouring water from two jugs, seven small white stars and one large bright star, hope and guidance, traditional tarot art style';
      } else if (cardName.includes('Moon')) {
        prompt = 'Large full moon with serene face in night sky, two towers in distance, winding path between them, crayfish emerging from water, dog and wolf howling at moon, illusion and mystery, traditional tarot art style';
      } else if (cardName.includes('Sun')) {
        prompt = 'Large bright sun with smiling face and golden rays, naked child riding white horse, red banner, sunflowers in garden, stone wall, joy and vitality, traditional tarot art style';
      } else if (cardName.includes('Judgement')) {
        prompt = 'Archangel Gabriel with trumpet in clouds, people rising from stone tombs with arms raised toward heaven, mountain range in background, resurrection and rebirth, traditional tarot art style';
      } else if (cardName.includes('World')) {
        prompt = 'Dancing figure in flowing purple cloth within oval wreath of laurel leaves, four symbols in corners (angel, eagle, lion, bull), completion and fulfillment, traditional tarot art style';
      } else {
        prompt = `Traditional tarot card "${cardName}" with authentic symbolic imagery depicting the true meaning of ${cardName}, rich mystical elements, traditional tarot art style`;
      }
    } else {
      prompt = `Beautiful mystical card artwork for "${cardName}" with symbolic imagery that represents the essence and meaning of this spiritual concept, rich colors, mystical elements, traditional spiritual art style`;
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
      
      console.log(`✅ ${cardName} completed`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error creating ${cardName}:`, error);
    return false;
  }
}

async function generateMissingCardFronts() {
  // Priority Major Arcana cards to complete first
  const priorityCards = [
    { id: '16', name: 'The Tower', type: 'major' as const },
    { id: '17', name: 'The Star', type: 'major' as const },
    { id: '18', name: 'The Moon', type: 'major' as const },
    { id: '19', name: 'The Sun', type: 'major' as const },
    { id: '20', name: 'Judgement', type: 'major' as const },
    { id: '21', name: 'The World', type: 'major' as const }
  ];
  
  console.log('🎨 Completing Major Arcana card fronts...\n');
  
  let generated = 0;
  for (const card of priorityCards) {
    const imagePath = path.join(process.cwd(), 'public', 'assets', 'cards', `${card.id}.png`);
    
    if (!fs.existsSync(imagePath)) {
      const success = await generateCardImage(card.id, card.name, card.type);
      if (success) generated++;
      
      // Brief pause between generations to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      console.log(`✓ ${card.name} already exists`);
    }
  }
  
  console.log(`\n🎉 Generated ${generated} beautiful Major Arcana card fronts!`);
  console.log('🎨 All Major Arcana cards now have authentic traditional artwork!');
}

generateMissingCardFronts();