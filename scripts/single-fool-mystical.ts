/**
 * Generate Single Mystical Fool Card
 * Test the musky pink and purple aesthetic
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

async function generateFoolCard(): Promise<void> {
  try {
    console.log('🎨 Generating The Fool with mystical pink and purple aesthetic...');
    
    ensureDirectory('public/authentic-cards/major-arcana');
    
    const prompt = "An ultra-ethereal translucent mystical being stepping off a cliff with cascading luminous hair like liquid starlight, celestial angelic features, soft magical aura, gossamer knapsack, glowing white rose, and small spirit dog, deep musky pink and purple gradients with iridescent shimmer, floating sparkles and divine light rays, dreamlike otherworldly essence, flowing translucent fabrics that merge with mist, tarot card style, spiritual art";
    
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
            negative_prompt: "blurry, low quality, distorted, modern elements, text, watermark, bright colors, neon",
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
      console.error('❌ API Error:', errorText);
      return;
    }

    const imageBuffer = await response.arrayBuffer();
    const outputPath = path.join('public/authentic-cards/major-arcana', '00-fool.png');
    
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    console.log('✅ The Fool generated successfully with mystical aesthetic!');
    console.log('📁 Saved to:', outputPath);
  } catch (error) {
    console.error('❌ Error generating The Fool:', error);
  }
}

generateFoolCard();