/**
 * Sequential Card Generation - One by One for Speed
 * Generate cards individually to avoid rate limiting
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

// Ultra-ethereal style matching The Fool
const ETHEREAL_STYLE = `ultra-ethereal, translucent, dreamlike quality, cascading liquid starlight hair, celestial features, musky pink and purple color palette, soft luminous glow, mystical atmosphere, spiritual symbolism, flowing robes with starlight patterns, gentle cosmic energy, serene expression, otherworldly beauty`;

// Major Arcana cards (1-21, since 0-Fool is complete)
const MAJOR_ARCANA = [
  { id: '1', name: 'The Magician', filename: '01-magician.png' },
  { id: '2', name: 'The High Priestess', filename: '02-high-priestess.png' },
  { id: '3', name: 'The Empress', filename: '03-empress.png' },
  { id: '4', name: 'The Emperor', filename: '04-emperor.png' },
  { id: '5', name: 'The Hierophant', filename: '05-hierophant.png' }
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

async function generateMajorArcanaSequentially() {
  console.log('🌟 Starting sequential Major Arcana generation...');
  console.log('✨ Using ultra-ethereal style matching The Fool card');
  
  const majorPrompts = {
    '1': `The Magician tarot card, ${ETHEREAL_STYLE}, figure with one hand pointing to heaven and one to earth, magical tools on altar, infinity symbol above head, red roses and white lilies, traditional tarot symbolism enhanced with ethereal elements`,
    '2': `The High Priestess tarot card, ${ETHEREAL_STYLE}, seated between two pillars, crescent moon crown, scroll of divine law, pomegranates, veil of mysteries, traditional tarot symbolism enhanced with ethereal elements`,
    '3': `The Empress tarot card, ${ETHEREAL_STYLE}, pregnant figure on throne, venus symbol, wheat field, flowing river, crown of twelve stars, abundant nature, traditional tarot symbolism enhanced with ethereal elements`,
    '4': `The Emperor tarot card, ${ETHEREAL_STYLE}, figure on stone throne, ram heads, armor, aries symbol, mountains, red robes, stern expression, leadership, traditional tarot symbolism enhanced with ethereal elements`,
    '5': `The Hierophant tarot card, ${ETHEREAL_STYLE}, religious figure with triple crown, crossed keys, two acolytes, blessing gesture, pillars, spiritual wisdom, traditional tarot symbolism enhanced with ethereal elements`
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
      console.log(`📊 Progress: ${successCount}/${MAJOR_ARCANA.length} cards completed`);
    }
    
    // Small delay between cards to be respectful to the API
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`🎉 Sequential generation complete! ${successCount}/${MAJOR_ARCANA.length} cards generated successfully`);
  
  // Check total cards now
  const totalCards = fs.readdirSync('public/authentic-cards/major-arcana').filter(f => f.endsWith('.png')).length;
  console.log(`📋 Total Major Arcana cards now: ${totalCards}/22`);
}

generateMajorArcanaSequentially();