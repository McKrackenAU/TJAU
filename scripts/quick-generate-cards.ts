/**
 * Quick Generation - One Card at a Time
 */
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateFool() {
  console.log("🎨 Generating The Fool...");
  
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: "The Fool tarot card: young person at cliff edge, white rose, small dog, bright sun, knapsack on stick, optimistic expression, traditional tarot art style",
    n: 1,
    size: "1024x1024",
    quality: "standard",
  });

  if (response.data?.[0]?.url) {
    const imageResponse = await fetch(response.data[0].url);
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    fs.writeFileSync("public/authentic-cards/major-arcana/final-fool.png", buffer);
    console.log("✅ The Fool completed!");
    return true;
  }
  return false;
}

generateFool();