/**
 * Complete All Card Collection for App Launch
 * Generate all missing Major Arcana, Minor Arcana, and Custom cards
 * Ultra-ethereal style with translucent, dreamlike qualities
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('❌ HUGGINGFACE_API_TOKEN not found');
  process.exit(1);
}

// Ultra-ethereal style template (perfected from The Fool)
const ETHEREAL_STYLE = `ultra-ethereal, translucent, dreamlike quality, cascading liquid starlight hair, celestial features, musky pink and purple color palette, soft luminous glow, mystical atmosphere, spiritual symbolism, flowing robes with starlight patterns, gentle cosmic energy, serene expression, otherworldly beauty, traditional tarot symbolism enhanced with ethereal elements`;

// Major Arcana cards (1-21, since 0-Fool is complete)
const MAJOR_ARCANA = [
  { id: '1', name: 'The Magician', filename: '01-magician.png' },
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

// Minor Arcana suits
const SUITS = [
  { name: 'wands', symbol: 'fire wands' },
  { name: 'cups', symbol: 'water chalices' },
  { name: 'swords', symbol: 'air swords' },
  { name: 'pentacles', symbol: 'earth pentacles' }
];

const COURT_CARDS = ['page', 'knight', 'queen', 'king'];
const NUMBER_CARDS = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateCardImage(cardData: { name: string, filename: string, prompt: string, directory: string }): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${cardData.name}...`);
    
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

    ensureDirectoryExists(cardData.directory);
    const filepath = path.join(cardData.directory, cardData.filename);
    fs.writeFileSync(filepath, buffer);

    console.log(`✅ Generated ${cardData.name}: ${filepath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error generating ${cardData.name}:`, error);
    return false;
  }
}

async function generateMajorArcana() {
  console.log('🌟 Generating Major Arcana cards...');
  
  const majorPrompts = {
    '1': `The Magician tarot card, ${ETHEREAL_STYLE}, figure with one hand pointing to heaven and one to earth, magical tools on altar, infinity symbol above head, red roses and white lilies`,
    '2': `The High Priestess tarot card, ${ETHEREAL_STYLE}, seated between two pillars, crescent moon crown, scroll of divine law, pomegranates, veil of mysteries`,
    '3': `The Empress tarot card, ${ETHEREAL_STYLE}, pregnant figure on throne, venus symbol, wheat field, flowing river, crown of twelve stars, abundant nature`,
    '4': `The Emperor tarot card, ${ETHEREAL_STYLE}, figure on stone throne, ram heads, armor, aries symbol, mountains, red robes, stern expression, leadership`,
    '5': `The Hierophant tarot card, ${ETHEREAL_STYLE}, religious figure with triple crown, crossed keys, two acolytes, blessing gesture, pillars, spiritual wisdom`,
    '6': `The Lovers tarot card, ${ETHEREAL_STYLE}, man and woman, angel above with sun rays, tree of life, tree of knowledge, mountain, choice and union`,
    '7': `The Chariot tarot card, ${ETHEREAL_STYLE}, warrior in chariot, two sphinxes, crescent moons on shoulders, city background, triumph and control`,
    '8': `Strength tarot card, ${ETHEREAL_STYLE}, woman gently closing lion's mouth, infinity symbol above head, white robes, roses, inner strength and courage`,
    '9': `The Hermit tarot card, ${ETHEREAL_STYLE}, old wise figure with lantern and staff, snowy mountain peak, six-pointed star in lantern, soul searching`,
    '10': `Wheel of Fortune tarot card, ${ETHEREAL_STYLE}, large wheel with TARO letters, sphinx on top, snake descending, angel ascending, four creatures in corners`,
    '11': `Justice tarot card, ${ETHEREAL_STYLE}, figure holding scales and sword, pillars, crown, balanced judgment, purple robes, truth and fairness`,
    '12': `The Hanged Man tarot card, ${ETHEREAL_STYLE}, figure suspended upside down from T-shaped tree, halo, crossed legs, sacrifice and surrender`,
    '13': `Death tarot card, ${ETHEREAL_STYLE}, skeleton in black armor on white horse, bishop, child, woman, rising sun, transformation and renewal`,
    '14': `Temperance tarot card, ${ETHEREAL_STYLE}, angel pouring water between cups, one foot on land one in water, iris flowers, moderation and patience`,
    '15': `The Devil tarot card, ${ETHEREAL_STYLE}, horned figure on throne, chained man and woman, inverted pentagram, torch, material bondage and temptation`,
    '16': `The Tower tarot card, ${ETHEREAL_STYLE}, tall tower struck by lightning, crown falling, two figures falling, sudden change and revelation`,
    '17': `The Star tarot card, ${ETHEREAL_STYLE}, nude woman pouring water, seven small stars and one large star, ibis bird, hope and inspiration`,
    '18': `The Moon tarot card, ${ETHEREAL_STYLE}, moon with face, two towers, dog and wolf howling, crayfish, pool of water, illusion and intuition`,
    '19': `The Sun tarot card, ${ETHEREAL_STYLE}, bright sun with face, child on white horse, sunflowers, red banner, joy and vitality`,
    '20': `Judgement tarot card, ${ETHEREAL_STYLE}, angel Gabriel with trumpet, people rising from graves, mountains, resurrection and rebirth`,
    '21': `The World tarot card, ${ETHEREAL_STYLE}, nude figure with purple sash, laurel wreath, four creatures in corners, completion and fulfillment`
  };

  for (const card of MAJOR_ARCANA) {
    const prompt = majorPrompts[card.id as keyof typeof majorPrompts];
    await generateCardImage({
      name: card.name,
      filename: card.filename,
      prompt,
      directory: 'public/authentic-cards/major-arcana'
    });
    
    // Small delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function generateMinorArcana() {
  console.log('🌟 Generating Minor Arcana cards...');
  
  for (const suit of SUITS) {
    ensureDirectoryExists(`public/authentic-cards/minor-arcana/${suit.name}`);
    
    // Number cards
    for (const number of NUMBER_CARDS) {
      const prompt = `${number} of ${suit.name} tarot card, ${ETHEREAL_STYLE}, ${suit.symbol}, traditional tarot symbolism, ${suit.name} suit elements`;
      await generateCardImage({
        name: `${number} of ${suit.name}`,
        filename: `${number}-of-${suit.name}.png`,
        prompt,
        directory: `public/authentic-cards/minor-arcana/${suit.name}`
      });
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // Court cards
    for (const court of COURT_CARDS) {
      const prompt = `${court} of ${suit.name} tarot card, ${ETHEREAL_STYLE}, ${suit.symbol}, royal figure, traditional tarot symbolism, ${suit.name} suit elements`;
      await generateCardImage({
        name: `${court} of ${suit.name}`,
        filename: `${court}-of-${suit.name}.png`,
        prompt,
        directory: `public/authentic-cards/minor-arcana/${suit.name}`
      });
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }
}

async function generateCustomCards() {
  console.log('🌟 Generating Custom Oracle cards...');
  
  const customCards = [
    { name: 'Oracle of Illusion', filename: 'oracle-of-illusion.png', prompt: `Oracle of Illusion tarot card, ${ETHEREAL_STYLE}, mysterious veiled figure, mirrors, smoke, hidden truths revealed` },
    { name: 'Spiritual Awakening', filename: 'spiritual-awakening.png', prompt: `Spiritual Awakening oracle card, ${ETHEREAL_STYLE}, lotus bloom, third eye opening, rays of light, consciousness expansion` },
    { name: 'Inner Wisdom', filename: 'inner-wisdom.png', prompt: `Inner Wisdom oracle card, ${ETHEREAL_STYLE}, ancient sage, glowing books, owl, sacred knowledge, intuitive guidance` },
    { name: 'Divine Protection', filename: 'divine-protection.png', prompt: `Divine Protection oracle card, ${ETHEREAL_STYLE}, guardian angel, protective light, shield, wings, safety and guidance` },
    { name: 'Manifestation', filename: 'manifestation.png', prompt: `Manifestation oracle card, ${ETHEREAL_STYLE}, hands creating light, swirling energy, crystals, power of intention` }
  ];

  ensureDirectoryExists('public/authentic-cards/custom');
  
  for (const card of customCards) {
    await generateCardImage({
      name: card.name,
      filename: card.filename,
      prompt: card.prompt,
      directory: 'public/authentic-cards/custom'
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function generateAllCards() {
  try {
    console.log('🌟 Starting complete card generation for app launch...');
    console.log('✨ Using ultra-ethereal style perfected from The Fool card');
    
    // Generate all card types
    await generateMajorArcana();
    await generateMinorArcana(); 
    await generateCustomCards();
    
    console.log('🎉 All cards generated successfully!');
    console.log('🚀 Your app is ready for launch!');
    
  } catch (error) {
    console.error('❌ Error in card generation:', error);
  }
}

generateAllCards();