import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

(async () => {
  console.log("Starting immediate generation...");
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: "Tarot card The Fool: person at cliff with dog and rose",
    size: "1024x1024",
  });
  
  if (response.data?.[0]?.url) {
    const img = await fetch(response.data[0].url);
    fs.writeFileSync("public/authentic-cards/major-arcana/immediate-fool.png", Buffer.from(await img.arrayBuffer()));
    console.log("✅ FOOL COMPLETED!");
  }
})();