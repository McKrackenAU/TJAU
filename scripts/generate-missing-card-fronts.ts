/**
 * Generate Missing Card Front Images
 * 
 * This script generates beautiful, meaningful card front images for all missing cards
 * that depict the true essence and symbolism of each card's name.
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
async function generateCardImage(cardId: string, cardName: string, cardType: 'major' | 'minor' | 'custom'): Promise<boolean> {
  try {
    console.log(`Generating image for: ${cardName} (${cardId})`);
    
    // Create detailed prompt based on card type and meaning
    let prompt = '';
    
    if (cardType === 'major') {
      // Major Arcana cards need rich symbolic imagery
      const majorPrompts = {
        'The Fool': 'A young person stepping off a cliff edge with a small bag, white dog companion, yellow sky, mountains in distance, symbolizing new beginnings and adventure, tarot card art style',
        'The Magician': 'A robed figure with one hand pointing up and one down, wand raised, infinity symbol above head, roses and lilies below, red robe, symbolizing manifestation and will, tarot card art style',
        'The High Priestess': 'A seated woman between two pillars marked B and J, crescent moon crown, blue robes, pomegranate curtain behind, scroll of divine law, symbolizing intuition and mystery, tarot card art style',
        'The Empress': 'A pregnant woman on a throne in lush nature, wheat field, flowing river, venus symbol on heart-shaped shield, crown of stars, symbolizing fertility and abundance, tarot card art style',
        'The Emperor': 'A bearded man on stone throne, ram heads carved on throne, red robes, golden crown, scepter, mountains behind, symbolizing authority and structure, tarot card art style',
        'The Hierophant': 'A religious figure with triple crown, two crossed keys, two kneeling disciples, pillars, raised hand in blessing, symbolizing tradition and spiritual guidance, tarot card art style',
        'The Lovers': 'A man and woman under a large angel with red wings, tree of life behind woman, tree of knowledge behind man, mountain in distance, symbolizing love and choices, tarot card art style',
        'The Chariot': 'A warrior in chariot pulled by black and white sphinxes, starry canopy, city behind, crescent moons on shoulders, symbolizing determination and control, tarot card art style',
        'Strength': 'A woman gently opening a lion\'s mouth, infinity symbol above head, white robes, flower garland, symbolizing inner strength and courage, tarot card art style',
        'The Hermit': 'An old man holding a lantern containing a six-pointed star, gray robes, walking stick, snowy mountain peaks, symbolizing soul searching and guidance, tarot card art style',
        'Wheel of Fortune': 'A large wheel with Hebrew letters and alchemical symbols, sphinx on top, snake descending, Anubis ascending, clouds around, symbolizing cycles and destiny, tarot card art style',
        'Justice': 'A crowned figure holding scales in left hand and sword in right, purple robes, red curtain, pillars, symbolizing balance and fairness, tarot card art style',
        'The Hanged Man': 'A man hanging upside down from a T-shaped tree, hands behind back, halo around head, calm expression, symbolizing sacrifice and new perspective, tarot card art style',
        'Death': 'A skeleton in black armor on white horse, black flag with white rose, tower and ship in distance, sun rising, symbolizing transformation and rebirth, tarot card art style',
        'Temperance': 'An angel with red wings pouring water between two cups, one foot on land one in water, iris flowers, mountain in distance, symbolizing balance and moderation, tarot card art style',
        'The Devil': 'A horned figure with bat wings, inverted pentagram, two chained figures below, torch in hand, symbolizing bondage and materialism, tarot card art style',
        'The Tower': 'A tall tower struck by lightning, crown falling from top, two figures falling, 22 flames, dark stormy sky, symbolizing sudden change and revelation, tarot card art style',
        'The Star': 'A nude woman kneeling by water, pouring water from two jugs, seven small stars and one large star above, bird in tree, symbolizing hope and inspiration, tarot card art style',
        'The Moon': 'Two towers, path leading between them, crayfish in water, dog and wolf howling, large moon with face, 32 rays, symbolizing illusion and subconscious, tarot card art style',
        'The Sun': 'A large sun with face and rays, naked child on white horse, sunflowers behind stone wall, red banner, symbolizing joy and success, tarot card art style',
        'Judgement': 'An angel with trumpet, people rising from graves with arms raised, mountain range, cross on banner, symbolizing rebirth and awakening, tarot card art style',
        'The World': 'A dancing figure in purple cloth, wreath border, four symbols in corners (angel, eagle, lion, bull), symbolizing completion and fulfillment, tarot card art style'
      };
      
      prompt = majorPrompts[cardName as keyof typeof majorPrompts] || `Tarot card artwork depicting ${cardName}, rich symbolic imagery, mystical and spiritual, traditional tarot art style`;
    } else if (cardType === 'minor') {
      // Minor Arcana based on suit and number
      const suit = cardName.toLowerCase().includes('wands') ? 'wands' : 
                   cardName.toLowerCase().includes('cups') ? 'cups' :
                   cardName.toLowerCase().includes('swords') ? 'swords' : 'pentacles';
      
      if (cardName.includes('Ace')) {
        prompt = `A single ${suit.slice(0, -1)} emerging from a cloud, hand holding it, symbolic of new beginnings in ${suit}, tarot card art style`;
      } else if (cardName.includes('Page')) {
        prompt = `A young person holding a ${suit.slice(0, -1)}, study and learning pose, earth tones, tarot card art style`;
      } else if (cardName.includes('Knight')) {
        prompt = `A knight on horseback carrying a ${suit.slice(0, -1)}, dynamic movement, action and adventure, tarot card art style`;
      } else if (cardName.includes('Queen')) {
        prompt = `A regal queen on throne holding a ${suit.slice(0, -1)}, nurturing and wise expression, rich robes, tarot card art style`;
      } else if (cardName.includes('King')) {
        prompt = `A powerful king on throne holding a ${suit.slice(0, -1)}, authoritative and mature, golden crown, tarot card art style`;
      } else {
        // Numbered cards
        const number = cardName.split(' ')[0];
        prompt = `${number} ${suit} arranged in meaningful pattern, symbolic composition representing the energy of ${cardName}, tarot card art style`;
      }
    } else {
      // Custom oracle cards
      prompt = `Beautiful oracle card artwork depicting ${cardName}, spiritual and mystical imagery, ethereal and inspiring, oracle card art style`;
    }
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (response.data?.[0]?.url) {
      // Download and save the image
      const imageUrl = response.data[0].url;
      const imageResponse = await fetch(imageUrl);
      const arrayBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Ensure directory exists
      const assetsDir = path.join(process.cwd(), 'public', 'assets', 'cards');
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }
      
      // Save the image
      const filename = path.join(assetsDir, `${cardId}.png`);
      fs.writeFileSync(filename, buffer);
      
      console.log(`✓ Generated: ${cardName} -> ${cardId}.png`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error generating ${cardName}:`, error);
    return false;
  }
}

async function generateMissingCardFronts() {
  try {
    // Get all cards from the API
    const response = await fetch('http://localhost:5000/api/cards');
    const cards = await response.json();
    
    console.log(`Found ${cards.length} total cards`);
    
    // Find missing card images
    const missingCards = [];
    for (const card of cards) {
      const imagePath = path.join(process.cwd(), 'public', 'assets', 'cards', `${card.id}.png`);
      if (!fs.existsSync(imagePath)) {
        missingCards.push({
          id: card.id,
          name: card.name,
          arcana: card.arcana
        });
      }
    }
    
    console.log(`Found ${missingCards.length} missing card images`);
    
    if (missingCards.length === 0) {
      console.log('All cards already have images!');
      return;
    }
    
    // Generate images in batches to avoid rate limiting
    const batchSize = 3;
    let successCount = 0;
    
    for (let i = 0; i < missingCards.length; i += batchSize) {
      const batch = missingCards.slice(i, i + batchSize);
      console.log(`\nProcessing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(missingCards.length/batchSize)}`);
      
      const batchPromises = batch.map(card => 
        generateCardImage(card.id, card.name, card.arcana)
      );
      
      const results = await Promise.all(batchPromises);
      successCount += results.filter(success => success).length;
      
      // Wait between batches to respect rate limits
      if (i + batchSize < missingCards.length) {
        console.log('Waiting 30 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    }
    
    console.log(`\n✅ Generated ${successCount}/${missingCards.length} card images successfully!`);
    
  } catch (error) {
    console.error('Error in generateMissingCardFronts:', error);
  }
}

generateMissingCardFronts();