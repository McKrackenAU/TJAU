/**
 * Complete All Cards Sequential Generation - Fast and Efficient
 * Generate all remaining cards one by one for optimal speed
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

// Ultra-ethereal style matching The Fool
const ETHEREAL_STYLE = `ultra-ethereal, translucent, dreamlike quality, cascading liquid starlight hair, celestial features, musky pink and purple color palette, soft luminous glow, mystical atmosphere, spiritual symbolism, flowing robes with starlight patterns, gentle cosmic energy, serene expression, otherworldly beauty`;

// All remaining Major Arcana cards (2-21, since 0-1 are complete)
const MAJOR_ARCANA = [
  { id: '2', name: 'The High Priestess', filename: '02-high-priestess.png' },
  { id: '3', name: 'The Empress', filename: '03-empress.png' },
  { id: '4', name: 'The Emperor', filename: '04-emperor.png' },
  { id: '5', name: 'The Hierophant', filename: '05-hierophant.png' },
  { id: '6', name: 'The Lovers', filename: '06-lovers.png' },
  { id: '7', name: 'The Chariot', filename: '07-chariot.png' },
  { id: '8', name: 'Strength', filename: '08-strength.png' },
  { id: '9', name: 'The Hermit', filename: '09-hermit.png' },
  { id: '10', name: 'Wheel of Fortune', filename: '10-wheel.png' },
  { id: '11', name: 'Justice', filename: '11-justice.png' },
  { id: '12', name: 'The Hanged Man', filename: '12-hanged-man.png' },
  { id: '13', name: 'Death', filename: '13-death.png' },
  { id: '14', name: 'Temperance', filename: '14-temperance.png' },
  { id: '15', name: 'The Devil', filename: '15-devil.png' },
  { id: '16', name: 'The Tower', filename: '16-tower.png' },
  { id: '17', name: 'The Star', filename: '17-star.png' },
  { id: '18', name: 'The Moon', filename: '18-moon.png' },
  { id: '19', name: 'The Sun', filename: '19-sun.png' },
  { id: '20', name: 'Judgement', filename: '20-judgement.png' },
  { id: '21', name: 'The World', filename: '21-world.png' }
];

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateSingleCard(cardData: { name: string, filename: string, prompt: string }): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${cardData.name}...`);
    const startTime = Date.now();
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: cardData.prompt,
          parameters: {
            width: 512,
            height: 768,
            guidance_scale: 7.5,
            num_inference_steps: 50
          }
        }),
      }
    );

    if (!response.ok) {
      console.error(`❌ Failed to generate ${cardData.name}: ${response.statusText}`);
      return false;
    }

    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    ensureDirectoryExists('public/authentic-cards/major-arcana');
    const filepath = path.join('public/authentic-cards/major-arcana', cardData.filename);
    fs.writeFileSync(filepath, buffer);

    const duration = (Date.now() - startTime) / 1000;
    console.log(`✅ Generated ${cardData.name} in ${duration}s: ${filepath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error generating ${cardData.name}:`, error);
    return false;
  }
}

async function generateAllCardsSequentially() {
  console.log('🌟 Starting complete sequential card generation...');
  console.log('✨ Using ultra-ethereal style matching The Fool and Magician cards');
  
  const majorPrompts = {
    '2': `The High Priestess tarot card, ${ETHEREAL_STYLE}, seated between two pillars, crescent moon crown, scroll of divine law, pomegranates, veil of mysteries, traditional tarot symbolism enhanced with ethereal elements`,
    '3': `The Empress tarot card, ${ETHEREAL_STYLE}, pregnant figure on throne, venus symbol, wheat field, flowing river, crown of twelve stars, abundant nature, traditional tarot symbolism enhanced with ethereal elements`,
    '4': `The Emperor tarot card, ${ETHEREAL_STYLE}, figure on stone throne, ram heads, armor, aries symbol, mountains, red robes, stern expression, leadership, traditional tarot symbolism enhanced with ethereal elements`,
    '5': `The Hierophant tarot card, ${ETHEREAL_STYLE}, religious figure with triple crown, crossed keys, two acolytes, blessing gesture, pillars, spiritual wisdom, traditional tarot symbolism enhanced with ethereal elements`,
    '6': `The Lovers tarot card, ${ETHEREAL_STYLE}, man and woman, angel above with sun rays, tree of life, tree of knowledge, mountain, choice and union, traditional tarot symbolism enhanced with ethereal elements`,
    '7': `The Chariot tarot card, ${ETHEREAL_STYLE}, warrior in chariot, two sphinxes, crescent moons on shoulders, city background, triumph and control, traditional tarot symbolism enhanced with ethereal elements`,
    '8': `Strength tarot card, ${ETHEREAL_STYLE}, woman gently closing lion's mouth, infinity symbol above head, white robes, roses, inner strength and courage, traditional tarot symbolism enhanced with ethereal elements`,
    '9': `The Hermit tarot card, ${ETHEREAL_STYLE}, old wise figure with lantern and staff, snowy mountain peak, six-pointed star in lantern, soul searching, traditional tarot symbolism enhanced with ethereal elements`,
    '10': `Wheel of Fortune tarot card, ${ETHEREAL_STYLE}, large wheel with TARO letters, sphinx on top, snake descending, angel ascending, four creatures in corners, traditional tarot symbolism enhanced with ethereal elements`,
    '11': `Justice tarot card, ${ETHEREAL_STYLE}, figure holding scales and sword, pillars, crown, balanced judgment, purple robes, truth and fairness, traditional tarot symbolism enhanced with ethereal elements`,
    '12': `The Hanged Man tarot card, ${ETHEREAL_STYLE}, figure suspended upside down from T-shaped tree, halo, crossed legs, sacrifice and surrender, traditional tarot symbolism enhanced with ethereal elements`,
    '13': `Death tarot card, ${ETHEREAL_STYLE}, skeleton in black armor on white horse, bishop, child, woman, rising sun, transformation and renewal, traditional tarot symbolism enhanced with ethereal elements`,
    '14': `Temperance tarot card, ${ETHEREAL_STYLE}, angel pouring water between cups, one foot on land one in water, iris flowers, moderation and patience, traditional tarot symbolism enhanced with ethereal elements`,
    '15': `The Devil tarot card, ${ETHEREAL_STYLE}, horned figure on throne, chained man and woman, inverted pentagram, torch, material bondage and temptation, traditional tarot symbolism enhanced with ethereal elements`,
    '16': `The Tower tarot card, ${ETHEREAL_STYLE}, tall tower struck by lightning, crown falling, two figures falling, sudden change and revelation, traditional tarot symbolism enhanced with ethereal elements`,
    '17': `The Star tarot card, ${ETHEREAL_STYLE}, nude woman pouring water, seven small stars and one large star, ibis bird, hope and inspiration, traditional tarot symbolism enhanced with ethereal elements`,
    '18': `The Moon tarot card, ${ETHEREAL_STYLE}, moon with face, two towers, dog and wolf howling, crayfish, pool of water, illusion and intuition, traditional tarot symbolism enhanced with ethereal elements`,
    '19': `The Sun tarot card, ${ETHEREAL_STYLE}, bright sun with face, child on white horse, sunflowers, red banner, joy and vitality, traditional tarot symbolism enhanced with ethereal elements`,
    '20': `Judgement tarot card, ${ETHEREAL_STYLE}, angel Gabriel with trumpet, people rising from graves, mountains, resurrection and rebirth, traditional tarot symbolism enhanced with ethereal elements`,
    '21': `The World tarot card, ${ETHEREAL_STYLE}, nude figure with purple sash, laurel wreath, four creatures in corners, completion and fulfillment, traditional tarot symbolism enhanced with ethereal elements`
  };

  let successCount = 0;
  
  for (const card of MAJOR_ARCANA) {
    const prompt = majorPrompts[card.id as keyof typeof majorPrompts];
    const success = await generateSingleCard({
      name: card.name,
      filename: card.filename,
      prompt
    });
    
    if (success) {
      successCount++;
      console.log(`📊 Progress: ${successCount}/${MAJOR_ARCANA.length} remaining cards completed`);
    }
    
    // Small delay between cards to be respectful to the API
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log(`🎉 Sequential generation complete! ${successCount}/${MAJOR_ARCANA.length} remaining cards generated successfully`);
  
  // Check total cards now
  const totalCards = fs.readdirSync('public/authentic-cards/major-arcana').filter(f => f.endsWith('.png')).length;
  console.log(`📋 Total Major Arcana cards now: ${totalCards}/22`);
  
  if (totalCards === 22) {
    console.log('🚀 All Major Arcana cards completed! Ready for app launch!');
  }
}

generateAllCardsSequentially();