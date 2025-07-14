const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const GOOGLE_API_KEY = 'AIzaSyBt6vwj4W_smVmNXDPwHQLdFBVpHQgM78c'; // Your API key

// Proxy for Places Autocomplete
router.get('/autocomplete', async (req, res) => {
  const { input } = req.query;
  if (!input) return res.status(400).json({ error: 'Missing input' });
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch autocomplete' });
  }
});

// Proxy for Place Details
router.get('/details', async (req, res) => {
  const { place_id } = req.query;
  if (!place_id) return res.status(400).json({ error: 'Missing place_id' });
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(place_id)}&key=${GOOGLE_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch place details' });
  }
});

module.exports = router; 