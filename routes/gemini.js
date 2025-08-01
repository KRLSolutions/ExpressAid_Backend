const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

console.log("Gemini route loaded");

// Set Gemini API key directly
const GEMINI_API_KEY = 'AIzaSyB1FMtySEgCcfYDQHClv9M3Yj7e9JPJ5z4';

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  console.log("Gemini route hit", message);
  if (!message) return res.status(400).json({ reply: 'No message provided.' });

  // Gemini prompt for concise, medical, summary-style answers
  const prompt = `
You are a concise, expert medical health chatbot. 
Always summarize your answers, avoid long explanations, and focus on clear, actionable medical or health details.
If the user asks something non-medical, reply sarcastically and redirect them to health topics.
Always reply in the same language as the user's question.
User: ${message}
AI:
  `;

  try {
    console.log('Calling Gemini API with model: gemini-1.5-flash');
    
    // First, let's check what models are available
    const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`);
    console.log('Models API status:', modelsResponse.status);
    
    if (modelsResponse.ok) {
      const modelsData = await modelsResponse.json();
      console.log('Available models:', modelsData.data?.map(m => m.name) || 'No models found');
    }

    // Try with gemini-1.5-flash first
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
    
    console.log('Gemini API response status:', response.status);
    
    if (!response.ok) {
      console.error('Gemini API HTTP error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      
      // Try with gemini-1.5-pro as fallback
      console.log('Trying with gemini-1.5-pro as fallback...');
      const fallbackResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );
      
      if (!fallbackResponse.ok) {
        const fallbackErrorText = await fallbackResponse.text();
        console.error('Fallback API error:', fallbackErrorText);
        return res.status(500).json({ reply: 'Sorry, there was an error contacting Gemini API. Please try again later.' });
      }
      
      const fallbackData = await fallbackResponse.json();
      console.log('Fallback API response:', JSON.stringify(fallbackData, null, 2));
      
      if (fallbackData.error) {
        console.error('Fallback API returned error:', fallbackData.error);
        return res.status(500).json({ reply: 'Sorry, Gemini API returned an error: ' + fallbackData.error.message });
      }
      
      const reply = fallbackData?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't find a concise medical answer!";
      return res.json({ reply });
    }
    
    const geminiData = await response.json();
    console.log('Gemini API response:', JSON.stringify(geminiData, null, 2));
    
    if (geminiData.error) {
      console.error('Gemini API returned error:', geminiData.error);
      return res.status(500).json({ reply: 'Sorry, Gemini API returned an error: ' + geminiData.error.message });
    }
    
    const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't find a concise medical answer!";
    res.json({ reply });
  } catch (e) {
    console.error('Gemini API error:', e);
    res.status(500).json({ reply: 'Sorry, there was an error contacting Gemini. Please try again later.' });
  }
});

module.exports = router; 