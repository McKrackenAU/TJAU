/**
 * Fix Major Arcana Cards 0-4 with Correct Authentic Artwork
 * Generate proper symbolic imagery that matches each card's meaning
 */
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface CardData {
  id: string;
  name: string;
  filename: string;
  prompt: string;
}

const cardsToFix: CardData[] = [
  {
    id: "0",
    name: "The Fool",
    filename: "00-fool-correct.png",
    prompt: `Create a beautiful, authentic tarot card artwork for The Fool (Major Arcana 0).

Traditional symbolism:
- A young person standing at the edge of a cliff, about to step into the unknown
- A small bag or knapsack containing life's experiences
- A white rose symbolizing purity and innocence
- A small dog as a faithful companion representing instinct
- The sun shining brightly behind, representing optimism
- Mountains in the distance symbolizing challenges ahead
- Bright, optimistic colors: yellows, whites, light blues
- The figure looking upward with joy and wonder

Style: Classical tarot card artwork, vibrant colors, detailed symbolic imagery. The card should convey new beginnings, innocence, and the spirit of adventure.`
  },
  {
    id: "1", 
    name: "The Magician",
    filename: "01-magician-correct.png",
    prompt: `Create a beautiful, authentic tarot card artwork for The Magician (Major Arcana I).

Traditional symbolism:
- A robed figure standing behind an altar/table
- One hand pointing to the sky, one to the earth (as above, so below)
- The four suit symbols on the table: wand, cup, sword, pentacle
- An infinity symbol (∞) above the magician's head
- Red robes symbolizing passion and power
- White inner garments representing purity of intent
- A lush garden with roses and lilies
- Tools of manifestation arranged purposefully

Style: Classical tarot card artwork, rich reds and golds, detailed symbolic imagery. The card should convey mastery, willpower, and the ability to manifest desires.`
  },
  {
    id: "2",
    name: "The High Priestess", 
    filename: "02-high-priestess-correct.png",
    prompt: `Create a beautiful, authentic tarot card artwork for The High Priestess (Major Arcana II).

Traditional symbolism:
- A serene woman seated between two pillars (one black, one white)
- The letters B and J on the pillars (Boaz and Jachin)
- A veil decorated with pomegranates behind her
- A crescent moon at her feet
- Blue robes representing spiritual knowledge
- A scroll partially hidden in her robes (the Torah)
- A cross on her chest symbolizing divine wisdom
- Calm, moonlit atmosphere

Style: Classical tarot card artwork, deep blues and silvers, mystical and serene atmosphere. The card should convey intuition, hidden knowledge, and divine feminine wisdom.`
  },
  {
    id: "3",
    name: "The Empress",
    filename: "03-empress-correct.png", 
    prompt: `Create a beautiful, authentic tarot card artwork for The Empress (Major Arcana III).

Traditional symbolism:
- A pregnant woman seated on a luxurious throne in nature
- A crown of twelve stars representing the zodiac
- A heart-shaped shield with the symbol of Venus
- Abundant flowing robes in rich earth tones
- A lush garden with flowing stream
- Wheat fields representing fertility and abundance
- Fruit trees and blooming flowers
- Warm, nurturing atmosphere with golden light

Style: Classical tarot card artwork, rich greens and golds, abundant natural imagery. The card should convey motherhood, fertility, abundance, and nurturing energy.`
  },
  {
    id: "4",
    name: "The Emperor",
    filename: "04-emperor-correct.png",
    prompt: `Create a beautiful, authentic tarot card artwork for The Emperor (Major Arcana IV).

Traditional symbolism:
- A bearded man seated on a stone throne
- A crown and red robes symbolizing authority
- An orb and scepter representing worldly power
- Ram heads carved on the throne (Aries symbolism)
- Barren mountains in the background showing structure
- Armor visible beneath robes showing protection
- Strong, authoritative posture
- Rich reds and oranges with golden accents

Style: Classical tarot card artwork, bold reds and golds, strong architectural elements. The card should convey leadership, authority, structure, and paternal power.`
  }
];

async function generateCorrectCard(card: CardData): Promise<boolean> {
  try {
    console.log(`🔮 Generating correct artwork for ${card.name}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      prompt: card.prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (response.data && response.data[0]?.url) {
      const imageUrl = response.data[0].url;
      console.log(`✨ ${card.name} generated successfully, downloading...`);
      
      // Download and save the image
      const imageResponse = await fetch(imageUrl);
      const arrayBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const outputPath = path.join(process.cwd(), "public/authentic-cards/major-arcana", card.filename);
      fs.writeFileSync(outputPath, buffer);
      
      console.log(`🎉 ${card.name} saved: ${outputPath}`);
      return true;
    } else {
      console.error(`❌ No image URL returned for ${card.name}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error generating ${card.name}:`, error);
    return false;
  }
}

async function fixMajorArcana04() {
  console.log("🚀 Starting generation of correct Major Arcana cards 0-4...");
  
  for (const card of cardsToFix) {
    const success = await generateCorrectCard(card);
    if (success) {
      console.log(`✅ ${card.name} completed successfully`);
      // Add delay between generations to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.log(`❌ ${card.name} failed to generate`);
    }
  }
  
  console.log("🎉 Major Arcana 0-4 correction process complete!");
}

fixMajorArcana04();