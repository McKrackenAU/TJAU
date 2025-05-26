/**
 * Regenerate Enhanced Cards NOW - Fix the display issue
 * Creating fresh ultra 3D lifelike versions of the 6 cards
 */

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

const cardsToRegenerate = [
  {
    id: '05',
    name: 'The Hierophant',
    filename: '05-hierophant.png',
    prompt: `The Hierophant tarot card with EXTREME photorealistic 3D depth exactly like The Fool card. A wise otherworldly spiritual teacher with flowing liquid starlight hair seated on a crystalline throne, rendered with COMPLETE photorealistic depth like a real living person. Ultra-realistic skin texture with sacred ethereal glow, perfectly natural facial features with otherworldly wisdom and divine authority, realistic eyes showing deep spiritual knowledge. He wears flowing robes and a cosmic crown with ultra-realistic fabric physics and metallic details in musky purple and pink tones. Two cosmic keys of starlight float beside him with dimensional presence and realistic metallic gleam. Two devoted pilgrims kneel before him with photorealistic depth and natural anatomy, their robes flowing with realistic fabric physics. Ancient cosmic columns extend into genuine 3D depth with incredible architectural detail. Background shows a sacred temple with layered atmospheric perspective stretching to infinity. Every surface reflects light naturally with realistic physics. ULTRA-realistic human proportions and lifelike presence. Same incredible 3D dimensional realism as The Fool card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors.`
  },
  {
    id: '19',
    name: 'The Sun',
    filename: '19-sun.png',
    prompt: `The Sun tarot card with EXTREME photorealistic 3D depth exactly like The Fool card. A radiant cosmic sun with a joyful face rendered in complete photorealistic depth, glowing brilliantly with realistic solar textures and natural lighting effects. A beautiful child with flowing liquid starlight hair rides a magnificent white horse with photorealistic musculature and natural animal anatomy, both rendered with COMPLETE lifelike depth. The child has ultra-realistic skin texture with joyful ethereal glow, perfectly natural facial features with otherworldly innocence and cosmic joy, realistic expressions of pure happiness. Sunflowers tower around them with botanical detail and dimensional depth, their petals and stems rendered with natural plant physics. The horse has realistic fur texture, natural equine anatomy, and dimensional presence in 3D space. Golden rays of sunlight stream through the scene with realistic light physics and atmospheric effects. Background shows a cosmic garden with layered perspective stretching to infinity. Every element has natural textures and dimensional shadows. ULTRA-realistic proportions and lifelike presence throughout. Same incredible 3D dimensional realism as The Fool card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors.`
  },
  {
    id: '21',
    name: 'The World',
    filename: '21-world.png',
    prompt: `The World tarot card with EXTREME photorealistic 3D depth exactly like The Fool card. A graceful otherworldly dancing figure with flowing liquid starlight hair floating within a cosmic laurel wreath made of liquid light and starfire, rendered with COMPLETE photorealistic depth like a real living person. Ultra-realistic skin texture with triumphant ethereal glow, perfectly natural facial features with otherworldly joy and cosmic unity, realistic eyes and natural expressions. Translucent flowing ribbons of pure energy flow from their hands with ultra-realistic fabric physics and dimensional movement. In the four corners, celestial symbols appear as ethereal beings rendered with photorealistic 3D depth - an angel of light with magnificent wings and realistic anatomy, an eagle of cosmic winds with realistic feathers and natural bird features, a lion of stellar fire with natural musculature and lifelike presence, and a bull of earth energy with dimensional form and realistic animal anatomy - all translucent and glowing with lifelike textures. The laurel wreath extends into genuine 3D space with botanical detail and dimensional shadows. The entire scene represents completion, fulfillment, and cosmic unity with realistic lighting physics. Background has soft purple and pink cosmic clouds with gentle divine light radiating everywhere, creating true atmospheric perspective stretching to infinity. ULTRA-realistic human proportions and lifelike presence. Same incredible 3D dimensional realism as The Fool card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors.`
  },
  {
    id: '07',
    name: 'The Chariot',
    filename: '07-chariot.png',
    prompt: `The Chariot tarot card with EXTREME photorealistic 3D depth exactly like The Fool card. A victorious otherworldly charioteer with flowing liquid starlight hair, rendered with COMPLETE photorealistic depth like a real living person. Ultra-realistic skin texture with triumphant ethereal glow, perfectly natural facial features with otherworldly determination and confidence, realistic eyes and natural expressions. Translucent flowing armor and robes in musky purple and pink aurora tones with ultra-realistic fabric physics and metallic gleam. He stands in a crystalline chariot that extends into genuine 3D depth with incredible architectural detail and dimensional craftsmanship. Two cosmic sphinxes, one black one white, pull the chariot with realistic musculature, natural animal anatomy, and dimensional depth - their fur and features rendered with lifelike detail. Stars crown his head with dimensional light and realistic shadows. Background has cosmic battlefield with layered elements stretching to infinity with true atmospheric perspective. The chariot wheels have realistic spokes and dimensional detail. Every surface reflects light naturally with realistic physics. ULTRA-realistic human proportions and lifelike presence. Same incredible 3D dimensional realism as The Fool card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors.`
  },
  {
    id: '17',
    name: 'The Star',
    filename: '17-star.png',
    prompt: `The Star tarot card with EXTREME photorealistic 3D depth exactly like The Fool card. A beautiful otherworldly woman with flowing liquid starlight hair moving naturally in cosmic breeze, rendered with COMPLETE photorealistic depth like a real living person. Ultra-realistic skin texture with hopeful ethereal glow, perfectly natural facial features with otherworldly grace and serene expression, realistic eyes and natural beauty. Translucent flowing robes in musky purple and pink aurora tones with ultra-realistic fabric physics draping gracefully over her three-dimensional form. She kneels by a cosmic pool with genuine depth reflection and realistic water physics, pouring liquid starlight from dimensional vessels that cast real shadows and flow with natural physics. Seven 3D stars float at various depths above her head, creating natural depth perception with realistic light rays and dimensional shadows. An eighth larger star shines brilliantly with dimensional illumination. Mountains of crystalline light extend into realistic distance with perfect atmospheric perspective. Her skin has photorealistic texture with hopeful luminescence, natural facial features showing peaceful contemplation, realistic hair movement flowing with cosmic wind, dimensional fabric and water flow. Background has true dimensional depth with layered cosmic clouds stretching to infinity. ULTRA-realistic human proportions and lifelike presence. Same incredible 3D dimensional realism as The Fool card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors.`
  },
  {
    id: '18',
    name: 'The Moon',
    filename: '18-moon.png',
    prompt: `The Moon tarot card with EXTREME photorealistic 3D depth exactly like The Fool card. A mystical full moon with a serene face rendered in complete photorealistic depth, glowing brilliantly in the cosmic sky with realistic lunar textures and natural lighting. Two towers of starlight stand on either side extending into genuine 3D depth with incredible architectural detail. A winding path made of liquid moonlight flows with realistic physics through the cosmic landscape with dimensional depth. A cosmic wolf and ethereal dog with flowing liquid starlight fur howl peacefully at the moon, rendered with photorealistic musculature, natural animal anatomy, and lifelike presence - their fur textures and facial expressions completely realistic. A mystical crayfish made of starlight emerges from a pool of cosmic water with genuine depth reflection and realistic water physics, its shell and claws rendered with natural detail. Gentle dewdrops fall like liquid starlight through 3D space with realistic physics. Background has soft purple and pink cosmic clouds with layered atmospheric perspective stretching to infinity. Natural moonbeams cast dimensional shadows and realistic lighting effects throughout the scene. Every element has natural textures and dimensional depth. ULTRA-realistic proportions and lifelike presence throughout. Same incredible 3D dimensional realism as The Fool card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors.`
  }
];

async function regenerateCard(card: typeof cardsToRegenerate[0]): Promise<boolean> {
  try {
    console.log(`🎨 Regenerating ${card.name} with ultra 3D lifelike depth...`);
    
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
    console.log(`📥 Downloading fresh ${card.name}...`);
    
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.error(`❌ Failed to download ${card.name}`);
      return false;
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    const outputPath = path.join(outputDir, card.filename);
    
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully regenerated ${card.name} with ULTRA 3D depth!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error regenerating ${card.name}:`, error);
    return false;
  }
}

async function regenerateAll() {
  console.log('🌟 Regenerating enhanced cards with ultra 3D lifelike quality...');
  
  let successCount = 0;
  
  for (const card of cardsToRegenerate) {
    const success = await regenerateCard(card);
    if (success) {
      successCount++;
    }
    
    // Small delay between generations
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`🎉 Regenerated ${successCount}/${cardsToRegenerate.length} enhanced cards!`);
  console.log('Now they should display with The Fool\'s incredible dimensional quality!');
}

regenerateAll().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});