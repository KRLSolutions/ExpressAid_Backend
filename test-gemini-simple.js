const fetch = require('node-fetch');

async function testGeminiSimple() {
  console.log('🔍 Simple Gemini API Test');
  console.log('==========================\n');

  const GEMINI_API_KEY = 'AIzaSyB1FMtySEgCcfYDQHClv9M3Yj7e9JPJ5z4';
  const testMessage = 'how are you';

  console.log('1. Testing direct Gemini API call...');
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: testMessage }] }]
        })
      }
    );

    console.log('   Response status:', response.status);
    console.log('   Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Success!');
      console.log('   Reply:', data.candidates?.[0]?.content?.parts?.[0]?.text);
    } else {
      const errorText = await response.text();
      console.log('   ❌ Error:', errorText);
    }
  } catch (error) {
    console.log('   ❌ Network error:', error.message);
  }

  console.log('\n2. Testing Firebase Functions endpoint...');
  
  try {
    const firebaseResponse = await fetch(
      'https://expressaid-p533i5eoca-uc.a.run.app/api/gemini/chat',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: testMessage })
      }
    );

    console.log('   Firebase status:', firebaseResponse.status);
    
    if (firebaseResponse.ok) {
      const firebaseData = await firebaseResponse.json();
      console.log('   ✅ Firebase Success!');
      console.log('   Reply:', firebaseData.reply);
    } else {
      const errorText = await firebaseResponse.text();
      console.log('   ❌ Firebase Error:', errorText);
    }
  } catch (error) {
    console.log('   ❌ Firebase Network error:', error.message);
  }
}

testGeminiSimple(); 