const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

console.log("Gemini route loaded");

// Set Gemini API key directly
const GEMINI_API_KEY = 'AIzaSyB1FMtySEgCcfYDQHClv9M3Yj7e9JPJ5z4';

router.post('/api/gemini-chat', async (req, res) => {
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
    console.log('Calling Gemini API with model: gemini-2.5-flash');
    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    
    if (!geminiRes.ok) {
      console.error('Gemini API HTTP error:', geminiRes.status, geminiRes.statusText);
      const errorText = await geminiRes.text();
      console.error('Gemini API error response:', errorText);
      return res.status(500).json({ reply: 'Sorry, there was an error contacting Gemini API.' });
    }
    
    const geminiData = await geminiRes.json();
    console.log('Gemini API response:', JSON.stringify(geminiData, null, 2));
    
    if (geminiData.error) {
      console.error('Gemini API returned error:', geminiData.error);
      return res.status(500).json({ reply: 'Sorry, Gemini API returned an error: ' + geminiData.error.message });
    }
    
    const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't find a concise medical answer!";
    res.json({ reply });
  } catch (e) {
    console.error('Gemini API error:', e);
    res.status(500).json({ reply: 'Sorry, there was an error contacting Gemini.' });
  }
});

module.exports = router; 