/**
 * Generate Correct Authentic Artwork for Major Arcana Cards 0-4
 * Fix the mismatched card images with proper traditional symbolism
 */
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface CardToGenerate {
  id: string;
  name: string;
  filename: string;
  prompt: string;
}

const correctCards: CardToGenerate[] = [
  {
    id: "0",
    name: "The Fool",
    filename: "correct-fool.png",
    prompt: `Create a beautiful, authentic tarot card artwork for The Fool (Major Arcana 0).

Traditional Rider-Waite symbolism:
- Young person standing at cliff's edge, stepping forward fearlessly
- Small knapsack on a stick containing life's possessions
- White rose in hand symbolizing purity and innocence
- Small loyal dog at feet representing instinct and faithful companionship
- Bright yellow sun shining in clear blue sky
- Snow-capped mountains in distant background
- The figure wears colorful clothes: red feather in cap, yellow tunic
- Expression of joy, wonder, and optimism
- About to step into the unknown with complete trust

Colors: Bright yellows, sky blues, pure whites, vibrant details
Style: Traditional tarot artwork with rich symbolic detail and classical composition.`
  },
  {
    id: "1",
    name: "The Magician", 
    filename: "correct-magician.png",
    prompt: `Create a beautiful, authentic tarot card artwork for The Magician (Major Arcana I).

Traditional Rider-Waite symbolism:
- Robed figure standing behind altar table
- Right hand pointing to heaven, left hand pointing to earth ("As above, so below")
- Infinity symbol (∞) floating above the magician's head
- Four suit symbols on the table: wand, cup, sword, pentacle
- Red outer robe symbolizing passion and power
- White inner garments representing purity of intention
- Garden setting with red roses and white lilies
- Belt shaped like an ouroboros (snake eating its tail)
- Confident, focused expression of mastery

Colors: Rich reds, pure whites, garden greens, golden accents
Style: Traditional tarot artwork showing mastery, willpower, and manifestation.`
  },
  {
    id: "2",
    name: "The High Priestess",
    filename: "correct-high-priestess.png", 
    prompt: `Create a beautiful, authentic tarot card artwork for The High Priestess (Major Arcana II).

Traditional Rider-Waite symbolism:
- Serene woman seated between two pillars
- Black pillar marked "B" (Boaz) and white pillar marked "J" (Jachin)
- Veil decorated with pomegranates hanging between pillars
- Crescent moon at her feet
- Blue robes flowing with spiritual knowledge
- Cross pendant on her chest representing divine balance
- Torah scroll partially hidden in her robes
- Crown with lunar crescents
- Calm water behind her reflecting subconscious depths

Colors: Deep blues, silver moonlight, black and white contrasts
Style: Traditional tarot artwork conveying intuition, mystery, and divine feminine wisdom.`
  },
  {
    id: "3", 
    name: "The Empress",
    filename: "correct-empress.png",
    prompt: `Create a beautiful, authentic tarot card artwork for The Empress (Major Arcana III).

Traditional Rider-Waite symbolism:
- Pregnant woman seated on luxurious cushioned throne
- Crown of twelve stars representing the zodiac
- Heart-shaped shield with Venus symbol
- Flowing robes in rich earth tones and royal fabrics
- Abundant natural setting with wheat field
- Flowing stream of clear water
- Lush trees bearing fruit
- Forest of cypress trees in background
- Maternal, nurturing expression of abundance

Colors: Rich greens, golden yellows, earth tones, royal fabrics
Style: Traditional tarot artwork showing motherhood, fertility, and natural abundance.`
  },
  {
    id: "4",
    name: "The Emperor", 
    filename: "correct-emperor.png",
    prompt: `Create a beautiful, authentic tarot card artwork for The Emperor (Major Arcana IV).

Traditional Rider-Waite symbolism:
- Bearded man seated on stone throne
- Golden crown and red robes of authority
- Ankh scepter in right hand representing life
- Orb in left hand symbolizing worldly dominion
- Ram heads carved into throne (Aries symbolism)
- Armor visible beneath robes showing protection
- Barren rocky mountains in background
- Stern but fair expression of leadership
- Throne positioned to command the landscape

Colors: Bold reds, imperial gold, stone gray, metallic armor
Style: Traditional tarot artwork conveying authority, structure, and paternal power.`
  }
];

async function generateCorrectCard(card: CardToGenerate): Promise<boolean> {
  try {
    console.log(`🎨 Generating correct ${card.name}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: card.prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (response.data && response.data[0]?.url) {
      const imageUrl = response.data[0].url;
      console.log(`📥 Downloading ${card.name}...`);
      
      const imageResponse = await fetch(imageUrl);
      const arrayBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const outputPath = path.join(process.cwd(), "public/authentic-cards/major-arcana", card.filename);
      fs.writeFileSync(outputPath, buffer);
      
      console.log(`✅ ${card.name} completed: ${outputPath}`);
      return true;
    }
    
    console.error(`❌ No image returned for ${card.name}`);
    return false;
  } catch (error) {
    console.error(`❌ Error generating ${card.name}:`, error);
    return false;
  }
}

async function generateAllCorrectCards() {
  console.log("🚀 Starting generation of correct Major Arcana 0-4...");
  
  for (const card of correctCards) {
    const success = await generateCorrectCard(card);
    if (success) {
      console.log(`🎉 ${card.name} generation successful!`);
    } else {
      console.log(`⚠️ ${card.name} generation failed, will retry later`);
    }
    
    // Delay between generations to respect rate limits
    if (card.id !== "4") {
      console.log("⏱️ Waiting 30 seconds before next generation...");
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
  
  console.log("🎯 All card generations completed!");
}

generateAllCorrectCards();