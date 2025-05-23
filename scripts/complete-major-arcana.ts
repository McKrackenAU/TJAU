/**
 * Complete Major Arcana Collection - All 22 Cards
 * 
 * Generates authentic, symbolic artwork for all Major Arcana cards
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
async function generateCard(cardId: string, cardName: string, prompt: string): Promise<boolean> {
  try {
    console.log(`🎨 ${cardName}`);
    
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
    console.error(`Error: ${cardName}`, error);
    return false;
  }
}

async function generateAllMajorArcana() {
  const cards = [
    { id: '0', name: 'The Fool', prompt: 'Young person stepping off cliff, small bag, white dog, yellow sky, mountains, new beginnings, tarot art style' },
    { id: '1', name: 'The Magician', prompt: 'Robed figure, wand raised, infinity symbol, roses and lilies, manifestation, tarot art style' },
    { id: '2', name: 'The High Priestess', prompt: 'Seated woman, two pillars B and J, crescent moon crown, blue robes, pomegranate curtain, intuition, tarot art style' },
    { id: '3', name: 'The Empress', prompt: 'Pregnant woman on throne, wheat field, flowing river, venus symbol, crown of stars, fertility, tarot art style' },
    { id: '4', name: 'The Emperor', prompt: 'Bearded king on stone throne, ram heads, red robes, golden crown, mountains, authority, tarot art style' },
    { id: '5', name: 'The Hierophant', prompt: 'Religious figure, triple crown, crossed keys, two disciples, pillars, blessing, tradition, tarot art style' },
    { id: '6', name: 'The Lovers', prompt: 'Man and woman under angel, tree of life, tree of knowledge, mountain, love and choices, tarot art style' },
    { id: '7', name: 'The Chariot', prompt: 'Warrior in chariot, black and white sphinxes, starry canopy, city, determination, tarot art style' },
    { id: '8', name: 'Strength', prompt: 'Woman gently opening lion mouth, infinity symbol, white robes, flower garland, inner strength, tarot art style' },
    { id: '9', name: 'The Hermit', prompt: 'Old man with lantern containing star, gray robes, walking stick, snowy peaks, guidance, tarot art style' },
    { id: '10', name: 'Wheel of Fortune', prompt: 'Large wheel, Hebrew letters, sphinx on top, snake descending, Anubis ascending, destiny, tarot art style' },
    { id: '11', name: 'Justice', prompt: 'Crowned figure, scales in left hand, sword in right, purple robes, red curtain, balance, tarot art style' },
    { id: '12', name: 'The Hanged Man', prompt: 'Man hanging upside down from T-shaped tree, hands behind back, halo, sacrifice, tarot art style' },
    { id: '13', name: 'Death', prompt: 'Skeleton in black armor on white horse, black flag with white rose, tower, transformation, tarot art style' },
    { id: '14', name: 'Temperance', prompt: 'Angel with red wings pouring water between cups, one foot on land one in water, moderation, tarot art style' },
    { id: '15', name: 'The Devil', prompt: 'Horned figure with bat wings, inverted pentagram, two chained figures, torch, bondage, tarot art style' },
    { id: '16', name: 'The Tower', prompt: 'Tall tower struck by lightning, crown falling, two figures falling, flames, sudden change, tarot art style' },
    { id: '17', name: 'The Star', prompt: 'Nude woman kneeling by water, pouring from two jugs, seven small stars and one large star, hope, tarot art style' },
    { id: '18', name: 'The Moon', prompt: 'Two towers, path between them, crayfish in water, dog and wolf howling, large moon with face, illusion, tarot art style' },
    { id: '19', name: 'The Sun', prompt: 'Large sun with face and rays, naked child on white horse, sunflowers, stone wall, joy, tarot art style' },
    { id: '20', name: 'Judgement', prompt: 'Angel with trumpet, people rising from graves with arms raised, mountain range, rebirth, tarot art style' },
    { id: '21', name: 'The World', prompt: 'Dancing figure in purple cloth, wreath border, four symbols in corners (angel, eagle, lion, bull), completion, tarot art style' }
  ];
  
  console.log('🎨 Creating complete Major Arcana collection...\n');
  
  let generated = 0;
  for (const card of cards) {
    const imagePath = path.join(process.cwd(), 'public', 'assets', 'cards', `${card.id}.png`);
    
    if (!fs.existsSync(imagePath)) {
      const success = await generateCard(card.id, card.name, card.prompt);
      if (success) generated++;
      
      // Brief pause between generations
      await new Promise(resolve => setTimeout(resolve, 3000));
    } else {
      console.log(`✓ ${card.name} exists`);
    }
  }
  
  console.log(`\n🎉 Generated ${generated} new Major Arcana cards!`);
}

generateAllMajorArcana();