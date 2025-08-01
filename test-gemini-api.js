const fetch = require('node-fetch');

async function testGeminiAPI() {
  console.log('🔍 Testing Gemini API');
  console.log('=====================\n');

  const GEMINI_API_KEY = 'AIzaSyB1FMtySEgCcfYDQHClv9M3Yj7e9JPJ5z4';
  const testMessage = 'What are the symptoms of diabetes?';

  console.log('1. Testing API Key...');
  console.log('   API Key:', GEMINI_API_KEY.substring(0, 10) + '...');

  console.log('\n2. Testing Gemini Models List...');
  try {
    const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`);
    console.log('   Status:', modelsResponse.status);
    
    if (modelsResponse.ok) {
      const modelsData = await modelsResponse.json();
      console.log('   Available models:', modelsData.data?.map(m => m.name) || 'No models found');
    } else {
      const errorText = await modelsResponse.text();
      console.log('   Error:', errorText);
    }
  } catch (error) {
    console.log('   Error fetching models:', error.message);
  }

  console.log('\n3. Testing Gemini Chat API...');
  const prompt = `
You are a concise, expert medical health chatbot. 
Always summarize your answers, avoid long explanations, and focus on clear, actionable medical or health details.
If the user asks something non-medical, reply sarcastically and redirect them to health topics.
Always reply in the same language as the user's question.
User: ${testMessage}
AI:
  `;

  try {
    console.log('   Sending request to Gemini API...');
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    console.log('   Response status:', response.status);
    console.log('   Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Success! Response data:');
      console.log('   Candidates:', data.candidates?.length || 0);
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.log('   Reply:', data.candidates[0].content.parts[0].text);
      } else {
        console.log('   No text in response');
        console.log('   Full response:', JSON.stringify(data, null, 2));
      }
    } else {
      const errorText = await response.text();
      console.log('   ❌ Error response:', errorText);
    }
  } catch (error) {
    console.log('   ❌ Network error:', error.message);
  }

  console.log('\n4. Testing with different model...');
  try {
    const response2 = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    console.log('   Response status:', response2.status);
    
    if (response2.ok) {
      const data2 = await response2.json();
      console.log('   ✅ Success with gemini-1.5-pro!');
      if (data2.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.log('   Reply:', data2.candidates[0].content.parts[0].text);
      }
    } else {
      const errorText = await response2.text();
      console.log('   ❌ Error with gemini-1.5-pro:', errorText);
    }
  } catch (error) {
    console.log('   ❌ Network error with gemini-1.5-pro:', error.message);
  }
}

testGeminiAPI(); 