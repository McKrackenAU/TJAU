/**
 * Quick Authentic Card Generation - Launch Ready
 * Generate all 22 Major Arcana cards efficiently using Hugging Face
 */
import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('❌ HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

function ensureDirectory(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateCard(cardName: string, filename: string, prompt: string): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${cardName}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: "blurry, low quality, distorted, modern elements, text, watermark",
            num_inference_steps: 30,
            guidance_scale: 7.5,
            width: 512,
            height: 768
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error for ${cardName}:`, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    const outputPath = path.join('public/authentic-cards/major-arcana', filename);
    
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    console.log(`✅ ${cardName} generated successfully!`);
    return true;
  } catch (error) {
    console.error(`❌ Error generating ${cardName}:`, error);
    return false;
  }
}

async function generateAllCards() {
  console.log('🚀 Starting quick generation for all 22 Major Arcana cards...');
  
  ensureDirectory('public/authentic-cards/major-arcana');

  const cards = [
    {
      name: "The Fool",
      filename: "00-fool.png",
      prompt: "A young person stepping off a cliff with a knapsack, white rose, and small dog, traditional tarot card style, mystical symbolism, detailed illustration, spiritual art"
    },
    {
      name: "The Magician",
      filename: "01-magician.png",
      prompt: "A figure in robes with one hand pointing up and one down, infinity symbol above head, altar with cup sword wand and pentacle, traditional tarot symbolism"
    },
    {
      name: "The High Priestess",
      filename: "02-high-priestess.png",
      prompt: "A woman in blue robes sitting between two pillars, crescent moon crown, pomegranates on veil, scroll of divine law, mystical temple background"
    },
    {
      name: "The Empress",
      filename: "03-empress.png",
      prompt: "A crowned woman in flowing gown with Venus symbol, pregnant figure, wheat field, flowing water, traditional maternal goddess imagery"
    },
    {
      name: "The Emperor",
      filename: "04-emperor.png",
      prompt: "A bearded ruler on stone throne with ram heads, armor, scepter, mountains in background, symbol of authority and stability"
    },
    {
      name: "The Hierophant",
      filename: "05-hierophant.png",
      prompt: "A religious figure with triple crown, two keys, two kneeling disciples, pillars, traditional spiritual teacher imagery"
    },
    {
      name: "The Lovers",
      filename: "06-lovers.png",
      prompt: "Adam and Eve under angel Raphael, tree of knowledge and tree of life, mountain, representing choice and union"
    },
    {
      name: "The Chariot",
      filename: "07-chariot.png",
      prompt: "A warrior in chariot pulled by two sphinxes, city in background, starry canopy, symbols of determination and willpower"
    },
    {
      name: "Strength",
      filename: "08-strength.png",
      prompt: "A woman gently closing a lion's mouth, infinity symbol above head, flowers, representing inner strength and courage"
    },
    {
      name: "The Hermit",
      filename: "09-hermit.png",
      prompt: "An old man with lantern and staff on mountain peak, six-pointed star in lantern, seeking inner wisdom and guidance"
    },
    {
      name: "Wheel of Fortune",
      filename: "10-wheel.png",
      prompt: "A large wheel with TARO letters, sphinx on top, snake on left, angel figures, clouds, representing cycles and destiny"
    },
    {
      name: "Justice",
      filename: "11-justice.png",
      prompt: "A figure holding scales and sword, sitting between pillars, blindfolded or clear-eyed, representing balance and fairness"
    },
    {
      name: "The Hanged Man",
      filename: "12-hanged-man.png",
      prompt: "A man hanging upside down from a T-shaped tree, serene expression, halo, representing sacrifice and new perspective"
    },
    {
      name: "Death",
      filename: "13-death.png",
      prompt: "A skeleton in black armor on white horse, flag with white rose, representing transformation and rebirth"
    },
    {
      name: "Temperance",
      filename: "14-temperance.png",
      prompt: "An angel pouring water between two cups, one foot on land one in water, representing balance and moderation"
    },
    {
      name: "The Devil",
      filename: "15-devil.png",
      prompt: "A horned figure with two chained humans below, inverted pentagram, representing temptation and bondage"
    },
    {
      name: "The Tower",
      filename: "16-tower.png",
      prompt: "A tall tower struck by lightning, crown falling off, two figures falling, representing sudden change and revelation"
    },
    {
      name: "The Star",
      filename: "17-star.png",
      prompt: "A woman pouring water, seven small stars and one large star, representing hope and spiritual guidance"
    },
    {
      name: "The Moon",
      filename: "18-moon.png",
      prompt: "A moon face with two towers, dog and wolf howling, crayfish emerging from water, representing illusion and intuition"
    },
    {
      name: "The Sun",
      filename: "19-sun.png",
      prompt: "A bright sun with face, child on white horse, sunflowers, representing joy and success"
    },
    {
      name: "Judgement",
      filename: "20-judgement.png",
      prompt: "Angel Gabriel blowing trumpet, people rising from graves, representing rebirth and judgment"
    },
    {
      name: "The World",
      filename: "21-world.png",
      prompt: "A dancing figure in oval wreath, four corner symbols (angel, eagle, lion, bull), representing completion and fulfillment"
    }
  ];

  let successCount = 0;
  
  for (const card of cards) {
    const success = await generateCard(card.name, card.filename, card.prompt);
    if (success) {
      successCount++;
    }
    
    // Small delay between generations
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n🎉 Generation complete! ${successCount}/${cards.length} cards generated successfully.`);
  console.log('Your authentic tarot deck is ready for launch! 🚀');
}

generateAllCards().catch(console.error);