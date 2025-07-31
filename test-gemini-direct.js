const fetch = require('node-fetch');

async function testGeminiDirect() {
  console.log('🧪 Testing Gemini API directly...');
  
  const GEMINI_API_KEY = 'AIzaSyB1FMtySEgCcfYDQHClv9M3Yj7e9JPJ5z4';
  
  try {
    // Test 1: Check if API key is valid
    console.log('1. Testing API key validity...');
    const modelsResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1/models?key=' + GEMINI_API_KEY
    );
    const modelsData = await modelsResponse.json();
    console.log('Models response status:', modelsResponse.status);
    console.log('Available models:', modelsData.models?.map(m => m.name) || 'No models found');
    
    // Test 2: Test direct Gemini API call
    console.log('\n2. Testing direct Gemini API call...');
    const prompt = 'Hello, how are you?';
    const geminiResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    
    console.log('Gemini response status:', geminiResponse.status);
    const geminiData = await geminiResponse.json();
    console.log('Gemini response:', JSON.stringify(geminiData, null, 2));
    
    if (geminiData.candidates && geminiData.candidates[0]) {
      console.log('✅ Gemini API is working! Response:', geminiData.candidates[0].content.parts[0].text);
    } else {
      console.log('❌ Gemini API returned no candidates');
    }
    
  } catch (error) {
    console.error('❌ Direct Gemini API test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testGeminiDirect(); 