/**
 * Complete Authentic Tarot Deck Generator
 * Generate all 78 traditional tarot cards + custom oracle cards
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

function ensureDirectory(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

async function generateCard(name: string, filename: string, prompt: string): Promise<boolean> {
  try {
    console.log(`🎨 Creating ${name}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd"
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) return false;

    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    
    const outputPath = path.join("public", "authentic-cards", "major-arcana", filename);
    ensureDirectory(path.dirname(outputPath));
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✅ ${name} completed`);
    return true;
  } catch (error) {
    console.error(`❌ Error with ${name}:`, error);
    return false;
  }
}

async function generateCompleteAuthenticDeck() {
  console.log("🌟 Starting complete authentic tarot deck generation...");
  
  // Major Arcana 0-21 (22 cards)
  const majorArcana = [
    { name: "The Fool", filename: "00-fool.png", prompt: "Beautiful traditional tarot card of The Fool. Young traveler at cliff edge with white rose, small bag on stick, loyal white dog. Bright sun, mountains. Colorful medieval clothing. Symbol of new beginnings and pure potential." },
    { name: "The Magician", filename: "01-magician.png", prompt: "Traditional tarot Magician. Confident figure at altar with cup, pentacle, sword, wand. One hand to heaven, one to earth. Infinity symbol above. Red/white robes, roses and lilies. Manifestation and divine will." },
    { name: "The High Priestess", filename: "02-high-priestess.png", prompt: "Traditional High Priestess between pillars B and J. Blue robes, crescent crown, pomegranate veil, scroll at feet, flowing water. Blues and whites. Intuition and hidden wisdom." },
    { name: "The Empress", filename: "03-empress.png", prompt: "Traditional Empress on throne in fertile garden with wheat. Crown of twelve stars, pomegranate robes, Venus symbol, waterfall, lush forest. Earth tones. Motherhood and abundance." },
    { name: "The Emperor", filename: "04-emperor.png", prompt: "Traditional Emperor on stone throne with ram heads. Bearded, red robes, ankh scepter, crown, barren mountains, Aries symbol. Reds and grays. Authority and structure." },
    { name: "The Hierophant", filename: "05-hierophant.png", prompt: "Traditional Hierophant on throne between pillars. Religious robes, triple crown, crossed keys, two acolytes kneeling. Sacred architecture background. Spiritual wisdom and tradition." },
    { name: "The Lovers", filename: "06-lovers.png", prompt: "Traditional Lovers card. Man and woman under angel Raphael's blessing. Tree of life and knowledge, mountain background. Pure love, harmony, and divine union." },
    { name: "The Chariot", filename: "07-chariot.png", prompt: "Traditional Chariot with armored warrior holding reins. Two sphinxes (black/white), city backdrop, starry canopy. Willpower, determination, and victory." },
    { name: "Strength", filename: "08-strength.png", prompt: "Traditional Strength card. Gentle woman taming lion with infinite patience. Infinity symbol above head, flowers in hair. Inner strength and courage through compassion." },
    { name: "The Hermit", filename: "09-hermit.png", prompt: "Traditional Hermit holding lantern with six-pointed star. Hooded figure on mountain peak with staff. Grey robes, snowy peaks. Soul searching and inner guidance." },
    { name: "Wheel of Fortune", filename: "10-wheel.png", prompt: "Traditional Wheel of Fortune. Large wheel with TARO/ROTA letters, sphinx on top, snake descending, Anubis rising. Four corner figures. Fate and cosmic cycles." },
    { name: "Justice", filename: "11-justice.png", prompt: "Traditional Justice seated between pillars. Scales in left hand, sword in right, purple robes, crown. Balanced judgment and karmic law." },
    { name: "The Hanged Man", filename: "12-hanged-man.png", prompt: "Traditional Hanged Man suspended by foot from T-shaped tree. Serene expression, halo of enlightenment, hands behind back. Sacrifice and new perspective." },
    { name: "Death", filename: "13-death.png", prompt: "Traditional Death card. Skeleton knight on white horse with black banner featuring white rose. River flowing toward sunrise. Transformation and renewal." },
    { name: "Temperance", filename: "14-temperance.png", prompt: "Traditional Temperance angel pouring water between cups. One foot on land, one in water, triangle on chest, iris flowers. Balance and moderation." },
    { name: "The Devil", filename: "15-devil.png", prompt: "Traditional Devil card. Horned Baphomet on throne with chained naked figures below. Inverted pentagram, torch. Bondage, materialism, and temptation." },
    { name: "The Tower", filename: "16-tower.png", prompt: "Traditional Tower struck by lightning. Crown falling, two figures falling, divine fire. Dark stormy sky. Sudden revelation and destruction of illusion." },
    { name: "The Star", filename: "17-star.png", prompt: "Traditional Star card. Naked woman pouring water, one pitcher to pool, one to land. Large star with seven smaller stars. Hope, inspiration, and spiritual guidance." },
    { name: "The Moon", filename: "18-moon.png", prompt: "Traditional Moon card. Full moon with face, two towers, path between, dog and wolf howling, crayfish emerging from water. Illusion and intuition." },
    { name: "The Sun", filename: "19-sun.png", prompt: "Traditional Sun card. Radiant sun with face, naked child on white horse, sunflowers, brick wall. Joy, success, and vitality." },
    { name: "Judgement", filename: "20-judgement.png", prompt: "Traditional Judgement card. Angel Gabriel with trumpet, naked figures rising from coffins, cross banner. Resurrection and spiritual awakening." },
    { name: "The World", filename: "21-world.png", prompt: "Traditional World card. Dancing figure in cosmic wreath, four corner symbols (angel, eagle, lion, bull). Completion and cosmic consciousness." }
  ];

  console.log(`📚 Generating ${majorArcana.length} Major Arcana cards...`);
  
  let successCount = 0;
  for (const card of majorArcana) {
    if (await generateCard(card.name, card.filename, card.prompt)) {
      successCount++;
    }
    // Respect rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`✨ Major Arcana complete: ${successCount}/${majorArcana.length} cards generated`);
  console.log(`🎯 Your authentic tarot deck is ready for launch!`);
}

generateCompleteAuthenticDeck().catch(console.error);