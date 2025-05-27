/**
 * Batch Enhance All Requested Cards with Hugging Face
 * Creating all cards with High Priestess quality and style
 */

import fs from 'fs';
import path from 'path';

const cardsToEnhance = [
  {
    name: 'The Chariot',
    filename: '07-chariot.png',
    prompt: "Ultra-realistic 3D The Chariot tarot card with extreme photorealistic depth exactly like The High Priestess. Victorious otherworldly charioteer with flowing liquid starlight hair, rendered with complete lifelike depth like a real living person. Ultra-realistic skin texture with triumphant ethereal glow, perfectly natural facial features with otherworldly determination. Translucent flowing armor in musky purple and pink tones. Crystalline chariot with incredible 3D detail. Two cosmic sphinxes pulling the chariot with realistic anatomy. Ultra-ethereal dreamy style with musky purple and pink cosmic colors."
  },
  {
    name: 'The Hanged Man',
    filename: '12-hanged-man.png',
    prompt: "Ultra-realistic 3D The Hanged Man tarot card with extreme photorealistic depth exactly like The High Priestess. A serene man hanging upside down by one foot from a cosmic tree, rendered with complete lifelike depth. Ultra-realistic skin texture with peaceful ethereal glow, perfectly natural facial features showing inner peace. His body suspended upside down with realistic anatomy, flowing liquid starlight hair falling downward due to gravity. Translucent robes flowing naturally downward with ultra-realistic fabric physics in musky purple and pink tones. Ultra-ethereal dreamy style."
  },
  {
    name: 'Death',
    filename: '13-death.png',
    prompt: "Ultra-realistic 3D Death tarot card with extreme photorealistic depth exactly like The High Priestess. Skeletal figure in flowing black robes with liquid starlight essence, rendered with complete lifelike depth. Ultra-realistic bone texture with ethereal glow, perfectly natural anatomical structure with otherworldly presence. White horse with realistic musculature and flowing mane. Translucent death banner flowing with ultra-realistic fabric physics in musky purple and pink tones. River and sunrise background with genuine 3D depth. Ultra-ethereal dreamy style with musky purple and pink cosmic colors."
  },
  {
    name: 'The Star',
    filename: '17-star.png',
    prompt: "Ultra-realistic 3D The Star tarot card with extreme photorealistic depth exactly like The High Priestess. Beautiful ethereal woman kneeling by cosmic waters with flowing liquid starlight hair, rendered with complete lifelike depth like a real living person. Ultra-realistic skin texture with stellar ethereal glow, perfectly natural facial features with otherworldly serenity. Translucent flowing robes in musky purple and pink tones with ultra-realistic fabric physics. Seven smaller stars and one large star above with dimensional light. Water pools extending into genuine 3D depth with realistic reflections. Ultra-ethereal dreamy style with musky purple and pink cosmic colors."
  },
  {
    name: 'The Moon',
    filename: '18-moon.png',
    prompt: "Ultra-realistic 3D The Moon tarot card with extreme photorealistic depth exactly like The High Priestess. Large cosmic moon with realistic crater details and ethereal glow, rendered with complete dimensional depth. Two towers extending into genuine 3D depth with incredible architectural detail. Wolf and dog howling with realistic animal anatomy and natural fur texture. Crayfish emerging from water with realistic crustacean detail. Path winding into infinite distance with layered atmospheric perspective. Ultra-realistic water reflections. Ultra-ethereal dreamy style with musky purple and pink cosmic colors."
  },
  {
    name: 'The Sun',
    filename: '19-sun.png',
    prompt: "Ultra-realistic 3D The Sun tarot card with extreme photorealistic depth exactly like The High Priestess. Radiant cosmic sun with realistic solar flares and dimensional light rays, rendered with complete lifelike depth. Joyful child on white horse with flowing liquid starlight hair, ultra-realistic skin texture with solar ethereal glow, perfectly natural facial features with pure happiness. White horse with realistic musculature and flowing mane. Sunflower garden extending into genuine 3D depth with botanical detail. Ultra-ethereal dreamy style with musky purple and pink cosmic colors."
  },
  {
    name: 'Judgement',
    filename: '20-judgement.png',
    prompt: "Ultra-realistic 3D Judgement tarot card with extreme photorealistic depth exactly like The High Priestess. Archangel Gabriel with flowing liquid starlight hair and realistic wings, rendered with complete lifelike depth like a real divine being. Ultra-realistic skin texture with heavenly ethereal glow, perfectly natural facial features with divine authority. Translucent flowing robes with ultra-realistic fabric physics in musky purple and pink tones. People rising from graves with realistic human anatomy and natural expressions. Trumpet with dimensional metallic detail. Ultra-ethereal dreamy style with musky purple and pink cosmic colors."
  },
  {
    name: 'The World',
    filename: '21-world.png',
    prompt: "Ultra-realistic 3D The World tarot card with extreme photorealistic depth exactly like The High Priestess. Dancing cosmic figure with flowing liquid starlight hair in center of laurel wreath, rendered with complete lifelike depth like a real living person. Ultra-realistic skin texture with universal ethereal glow, perfectly natural facial features with cosmic wisdom. Translucent flowing scarves with ultra-realistic fabric physics in musky purple and pink tones. Four corner symbols (angel, eagle, lion, bull) with realistic anatomy and dimensional depth. Laurel wreath extending in genuine 3D with botanical detail. Ultra-ethereal dreamy style with musky purple and pink cosmic colors."
  }
];

async function generateCard(card: typeof cardsToEnhance[0]): Promise<boolean> {
  try {
    console.log(`🎨 Creating ${card.name}...`);
    
    const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: card.prompt,
        parameters: {
          width: 512,
          height: 768,
          num_inference_steps: 50,
          guidance_scale: 7.5
        }
      }),
    });

    if (!response.ok) {
      console.error(`❌ ${card.name} failed: ${response.status} ${response.statusText}`);
      return false;
    }

    const buffer = await response.arrayBuffer();
    const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', card.filename);
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ ${card.name} enhanced! Size: ${buffer.byteLength} bytes`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error creating ${card.name}:`, error);
    return false;
  }
}

async function enhanceAllCards() {
  console.log('🚀 Starting batch enhancement of all cards...');
  
  let successCount = 0;
  
  for (const card of cardsToEnhance) {
    const success = await generateCard(card);
    if (success) successCount++;
    
    // Wait between requests to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`\n✅ Enhancement complete! ${successCount}/${cardsToEnhance.length} cards successfully enhanced`);
  console.log('All cards now have the same incredible 3D depth as The High Priestess!');
}

enhanceAllCards();