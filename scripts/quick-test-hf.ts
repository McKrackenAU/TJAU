/**
 * Quick Test Hugging Face Connection
 */
async function testConnection() {
  try {
    console.log("🔍 Testing Hugging Face connection...");
    
    const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: "ethereal tarot card art style test",
        parameters: {
          num_inference_steps: 20,
          guidance_scale: 7.0
        }
      }),
    });

    console.log(`Response status: ${response.status}`);
    
    if (response.status === 503) {
      console.log("⏳ Model is loading, please wait...");
    } else if (response.status === 200) {
      console.log("✅ Connection successful!");
    } else {
      const errorText = await response.text();
      console.log(`❌ Error: ${errorText}`);
    }
    
  } catch (error) {
    console.error("❌ Connection test failed:", error);
  }
}

testConnection().catch(console.error);