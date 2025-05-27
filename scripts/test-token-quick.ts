/**
 * Quick Token Test - hf_API_TOKEN_THREE
 */

async function testToken() {
  const token = process.env.hf_API_TOKEN_THREE;
  
  if (!token) {
    console.log("❌ hf_API_TOKEN_THREE not found");
    return;
  }
  
  console.log(`🔑 Testing token: ${token.substring(0, 10)}...`);
  
  try {
    const response = await fetch("https://huggingface.co/api/whoami", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log("✅ Token works! User:", result.name || "authenticated");
      return true;
    } else {
      console.log(`❌ Token failed: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log("❌ Error:", error.message);
    return false;
  }
}

testToken();