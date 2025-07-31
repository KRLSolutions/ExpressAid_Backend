const fetch = require('node-fetch');

async function testDeployedGemini() {
  console.log('🧪 Testing deployed Gemini API...');
  
  try {
    // Test the deployed Gemini API
    console.log('Testing deployed Gemini chat endpoint...');
    const chatResponse = await fetch('https://expressaid-p533i5eoca-uc.a.run.app/api/gemini-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, how are you?'
      })
    });
    
    console.log('Response status:', chatResponse.status);
    const chatData = await chatResponse.json();
    console.log('Chat response:', JSON.stringify(chatData, null, 2));
    
  } catch (error) {
    console.error('❌ Deployed Gemini API test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testDeployedGemini(); 