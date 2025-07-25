const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const GOOGLE_API_KEY = 'AIzaSyBt6vwj4W_smVmNXDPwHQLdFBVpHQgM78c'; // Your API key

// Proxy for Places Autocomplete
router.get('/autocomplete', async (req, res) => {
  const { input } = req.query;
  if (!input) return res.status(400).json({ error: 'Missing input' });
  
  // Add components to restrict to India and types for better results
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&components=country:in&types=address&key=${GOOGLE_API_KEY}`;
  
  console.log('🔍 Places API request:', url);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('🔍 Places API response status:', data.status);
    console.log('🔍 Places API predictions count:', data.predictions ? data.predictions.length : 0);
    res.json(data);
  } catch (err) {
    console.error('❌ Places API error:', err);
    res.status(500).json({ error: 'Failed to fetch autocomplete' });
  }
});

// Proxy for Place Details
router.get('/details', async (req, res) => {
  const { place_id } = req.query;
  if (!place_id) return res.status(400).json({ error: 'Missing place_id' });
  
  // Add fields parameter to get only needed data
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(place_id)}&fields=geometry,formatted_address&key=${GOOGLE_API_KEY}`;
  
  console.log('🔍 Place Details API request:', url);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('🔍 Place Details API response status:', data.status);
    res.json(data);
  } catch (err) {
    console.error('❌ Place Details API error:', err);
    res.status(500).json({ error: 'Failed to fetch place details' });
  }
});

module.exports = router; 