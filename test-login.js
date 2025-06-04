import fetch from 'node-fetch';

async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    
    const response = await fetch('https://421bbc5c-ec80-4610-9e7c-cb65af501ba1-00-3m8a2xelw67r8.spock.replit.dev/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'Jo BB',
        password: 'password'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testLogin();