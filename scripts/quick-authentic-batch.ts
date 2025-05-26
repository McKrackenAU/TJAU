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
      prompt: "An ethereal mystical figure stepping off a cliff with flowing luminous hair, angelic features, magical glow, knapsack, white rose, and small dog, soft musky pink and purple gradients, dreamy sparkles and light effects, enchanting otherworldly appearance, flowing fabrics, tarot card style, spiritual art"
    },
    {
      name: "The Magician",
      filename: "01-magician.png",
      prompt: "An ethereal mystical figure with flowing luminous hair, angelic features, magical glow, pointing one hand up and one down, infinity symbol above head, altar with cup sword wand and pentacle, soft musky pink and purple gradients, dreamy sparkles and light effects, enchanting otherworldly appearance, flowing robes, tarot card style"
    },
    {
      name: "The High Priestess",
      filename: "02-high-priestess.png",
      prompt: "An ethereal mystical woman with flowing luminous hair, angelic features, magical glow, sitting between two pillars, crescent moon crown, pomegranates on veil, scroll of divine law, soft musky pink and purple gradients, dreamy sparkles and light effects, enchanting otherworldly appearance, flowing robes, mystical temple background"
    },
    {
      name: "The Empress",
      filename: "03-empress.png",
      prompt: "An ethereal mystical crowned woman with flowing luminous hair, angelic features, magical glow, Venus symbol, flowing gown, wheat field, flowing water, soft musky pink and purple gradients, dreamy sparkles and light effects, enchanting otherworldly appearance, maternal goddess imagery, tarot card style"
    },
    {
      name: "The Emperor",
      filename: "04-emperor.png",
      prompt: "An ethereal mystical bearded ruler with flowing luminous hair, angelic features, magical glow, on stone throne with ram heads, armor, scepter, mountains in background, soft musky pink and purple gradients, dreamy sparkles and light effects, enchanting otherworldly appearance, flowing fabrics, tarot card style"
    },
    {
      name: "The Hierophant",
      filename: "05-hierophant.png",
      prompt: "A religious figure with triple crown, two keys, two kneeling disciples, pillars, spiritual teacher imagery, mystical tarot style, musky pink and purple palette, dreamy mystical atmosphere"
    },
    {
      name: "The Lovers",
      filename: "06-lovers.png",
      prompt: "Adam and Eve under angel Raphael, tree of knowledge and tree of life, mountain, choice and union symbolism, mystical tarot art, soft musky pink and purple colors, ethereal dreamy lighting"
    },
    {
      name: "The Chariot",
      filename: "07-chariot.png",
      prompt: "A warrior in chariot pulled by two sphinxes, city in background, starry canopy, determination and willpower symbols, mystical tarot style, musky pink and purple tones, ethereal atmosphere"
    },
    {
      name: "Strength",
      filename: "08-strength.png",
      prompt: "A woman gently closing a lion's mouth, infinity symbol above head, flowers, inner strength and courage symbolism, mystical tarot art, soft musky pink and purple palette, dreamy mystical lighting"
    },
    {
      name: "The Hermit",
      filename: "09-hermit.png",
      prompt: "An old man with lantern and staff on mountain peak, six-pointed star in lantern, inner wisdom and guidance symbols, mystical tarot style, musky pink and purple colors, ethereal dreamy atmosphere"
    },
    {
      name: "Wheel of Fortune",
      filename: "10-wheel.png",
      prompt: "A large wheel with TARO letters, sphinx on top, snake on left, angel figures, clouds, cycles and destiny symbolism, mystical tarot art, soft musky pink and purple tones, ethereal lighting"
    },
    {
      name: "Justice",
      filename: "11-justice.png",
      prompt: "A figure holding scales and sword, sitting between pillars, balance and fairness symbols, mystical tarot style, musky pink and purple palette, dreamy mystical atmosphere"
    },
    {
      name: "The Hanged Man",
      filename: "12-hanged-man.png",
      prompt: "A man hanging upside down from a T-shaped tree, serene expression, halo, sacrifice and new perspective symbolism, mystical tarot art, soft musky pink and purple colors, ethereal dreamy lighting"
    },
    {
      name: "Death",
      filename: "13-death.png",
      prompt: "A skeleton in black armor on white horse, flag with white rose, transformation and rebirth symbols, mystical tarot style, musky pink and purple tones, ethereal atmosphere"
    },
    {
      name: "Temperance",
      filename: "14-temperance.png",
      prompt: "An angel pouring water between two cups, one foot on land one in water, balance and moderation symbolism, mystical tarot art, soft musky pink and purple palette, dreamy mystical lighting"
    },
    {
      name: "The Devil",
      filename: "15-devil.png",
      prompt: "A horned figure with two chained humans below, inverted pentagram, temptation and bondage symbols, mystical tarot style, musky pink and purple colors, ethereal dreamy atmosphere"
    },
    {
      name: "The Tower",
      filename: "16-tower.png",
      prompt: "A tall tower struck by lightning, crown falling off, two figures falling, sudden change and revelation symbolism, mystical tarot art, soft musky pink and purple tones, ethereal lighting"
    },
    {
      name: "The Star",
      filename: "17-star.png",
      prompt: "A woman pouring water, seven small stars and one large star, hope and spiritual guidance symbols, mystical tarot style, musky pink and purple palette, dreamy mystical atmosphere"
    },
    {
      name: "The Moon",
      filename: "18-moon.png",
      prompt: "A moon face with two towers, dog and wolf howling, crayfish emerging from water, illusion and intuition symbolism, mystical tarot art, soft musky pink and purple colors, ethereal dreamy lighting"
    },
    {
      name: "The Sun",
      filename: "19-sun.png",
      prompt: "A bright sun with face, child on white horse, sunflowers, joy and success symbols, mystical tarot style, musky pink and purple tones, ethereal atmosphere"
    },
    {
      name: "Judgement",
      filename: "20-judgement.png",
      prompt: "Angel Gabriel blowing trumpet, people rising from graves, rebirth and judgment symbolism, mystical tarot art, soft musky pink and purple palette, dreamy mystical lighting"
    },
    {
      name: "The World",
      filename: "21-world.png",
      prompt: "A dancing figure in oval wreath, four corner symbols (angel, eagle, lion, bull), completion and fulfillment symbols, mystical tarot style, musky pink and purple colors, ethereal dreamy atmosphere"
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