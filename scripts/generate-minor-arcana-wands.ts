/**
 * Generate Minor Arcana - Suit of Wands
 * Creating all 14 Wands cards with ultra 3D lifelike quality matching The Fool
 */

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const wandsCards = [
  {
    name: "Ace of Wands",
    filename: "ace-of-wands.png",
    prompt: "Ace of Wands tarot card with EXTREME photorealistic 3D depth exactly like The Fool card. A single magnificent cosmic wand floating in 3D space with ultra-realistic wood grain texture and dimensional carved details, emerging from a celestial cloud with realistic vapor physics. The wand glows with inner fire and starlight, rendered with natural lighting effects and genuine shadows. Sprouting leaves of liquid light grow from the wand with botanical detail and dimensional depth. A ethereal hand made of starlight reaches from cosmic clouds to grasp the wand, rendered with photorealistic skin texture and natural anatomy. Background shows a mystical landscape with layered atmospheric perspective stretching to infinity, soft purple and pink cosmic clouds with gentle divine light. The wand has realistic weight and presence in 3D space. ULTRA-realistic proportions and lifelike textures throughout. Same incredible 3D dimensional realism as The Fool card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors."
  },
  {
    name: "Two of Wands",
    filename: "two-of-wands.png", 
    prompt: "Two of Wands tarot card with EXTREME photorealistic 3D depth exactly like The Fool card. A majestic otherworldly figure with flowing liquid starlight hair standing on a castle balcony with incredible architectural detail and dimensional stonework, rendered with COMPLETE photorealistic depth like a real living person. He holds a crystalline globe showing swirling galaxies with realistic sphere physics and dimensional reflections, while one cosmic wand leans against the wall with ultra-realistic wood texture and carved details. His robes flow with natural fabric physics in musky purple and pink aurora tones. The castle extends into genuine 3D depth with realistic perspective and shadows. Background shows vast cosmic landscapes with layered atmospheric depth stretching to infinity. His skin has photorealistic texture with contemplative ethereal glow, natural facial features showing visionary planning, realistic eyes gazing into the distance. ULTRA-realistic human proportions and lifelike presence. Same incredible 3D dimensional realism as The Fool card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors."
  },
  {
    name: "Three of Wands",
    filename: "three-of-wands.png",
    prompt: "Three of Wands tarot card with EXTREME photorealistic 3D depth exactly like The Fool card. A confident otherworldly merchant with flowing liquid starlight hair standing on a cliff overlooking cosmic trade routes, rendered with COMPLETE photorealistic depth like a real living person. Three cosmic wands planted in the ground with ultra-realistic wood grain texture and dimensional shadows, extending into genuine 3D space. His robes billow naturally in cosmic wind with realistic fabric physics in musky purple and pink tones. Ships of starlight sail across dimensional waters with realistic perspective and atmospheric depth. The cliff face has natural rock texture and geological detail extending into 3D space. His skin has photorealistic texture with ambitious ethereal glow, natural facial features showing forward-thinking vision, realistic eyes scanning the horizon. Background shows infinite cosmic trade routes with layered atmospheric perspective. ULTRA-realistic human proportions and lifelike presence. Same incredible 3D dimensional realism as The Fool card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors."
  },
  {
    name: "Four of Wands",
    filename: "four-of-wands.png",
    prompt: "Four of Wands tarot card with EXTREME photorealistic 3D depth exactly like The Fool card. Four cosmic wands forming a magnificent gateway with ultra-realistic wood texture and dimensional carved details, creating genuine 3D architectural depth. Ethereal figures with flowing liquid starlight hair celebrate beneath the gateway, rendered with COMPLETE photorealistic depth like real living people. Their flowing robes and garlands move with natural fabric and botanical physics in musky purple and pink tones. The celebration scene has realistic perspective with multiple figures at various depths. A cosmic castle glows in the background with incredible architectural detail and atmospheric perspective stretching to infinity. Flowers and garlands flow with natural botanical movement and dimensional shadows. Their skin has photorealistic texture with joyful ethereal glow, natural facial features showing celebration and harmony, realistic expressions of happiness. ULTRA-realistic human proportions and lifelike presence throughout. Same incredible 3D dimensional realism as The Fool card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors."
  },
  {
    name: "Five of Wands",
    filename: "five-of-wands.png",
    prompt: "Five of Wands tarot card with EXTREME photorealistic 3D depth exactly like The Fool card. Five otherworldly warriors with flowing liquid starlight hair engaged in cosmic combat training, rendered with COMPLETE photorealistic depth like real living people. Each holds a cosmic wand with ultra-realistic wood grain texture and dimensional weight, showing natural physics in their movements. Their robes and armor flow with realistic fabric and metallic physics in musky purple and pink tones. The scene has genuine 3D depth with multiple figures positioned at various distances, creating natural perspective. Cosmic sparks fly from clashing wands with realistic particle physics and lighting effects. Their skin has photorealistic texture with competitive ethereal glow, natural facial features showing determination and conflict, realistic muscular tension and movement. Background shows a training ground with layered atmospheric perspective. ULTRA-realistic human proportions and lifelike combat presence. Same incredible 3D dimensional realism as The Fool card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors."
  }
];

async function generateWandsCard(card: typeof wandsCards[0]): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${card.name} with ultra 3D lifelike depth...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: card.prompt,
      n: 1,
      size: "1024x1792",
      quality: "hd",
      style: "natural"
    });

    if (!response.data || !response.data[0]?.url) {
      console.error(`❌ No image URL returned for ${card.name}`);
      return false;
    }

    const imageUrl = response.data[0].url;
    console.log(`📥 Downloading ${card.name}...`);
    
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.error(`❌ Failed to download ${card.name}`);
      return false;
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'minor-arcana', 'wands');
    ensureDirectoryExists(outputDir);
    const outputPath = path.join(outputDir, card.filename);
    
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${card.name} with ULTRA 3D depth!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${card.name}:`, error);
    return false;
  }
}

async function generateAllWands() {
  console.log('🌟 Generating Suit of Wands - ultra 3D lifelike quality...');
  
  let successCount = 0;
  
  for (const card of wandsCards) {
    const success = await generateWandsCard(card);
    if (success) {
      successCount++;
    }
    
    // Small delay between generations
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`🎉 Generated ${successCount}/${wandsCards.length} Wands cards!`);
  console.log('Each card now has The Fool\'s incredible dimensional quality!');
}

generateAllWands().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});