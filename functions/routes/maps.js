const express = require('express');
const router = express.Router();
const axios = require('axios');

// TODO: Replace with your actual Google Maps API key (keep this secret!)
// IMPORTANT: Replace this with your actual Google Maps API key
// Make sure it has Directions API enabled
const GOOGLE_MAPS_API_KEY = 'AIzaSyBt6vwj4W_smVmNXDPwHQLdFBVpHQgM78c';

// POST /api/maps/directions
router.post('/directions', async (req, res) => {
  try {
    const { origin, destination } = req.body;
    console.log('Directions request:', { origin, destination });
    
    if (!origin || !destination) {
      console.log('Missing origin or destination');
      return res.status(400).json({ error: 'origin and destination required' });
    }
    
    const originStr = `${origin.lat},${origin.lng}`;
    const destStr = `${destination.lat},${destination.lng}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destStr}&key=${GOOGLE_MAPS_API_KEY}`;
    
    console.log('Calling Google Directions API:', url);
    const response = await axios.get(url);
    const data = response.data;
    
    console.log('Google Directions API response status:', data.status);
    
    if (data.status !== 'OK') {
      console.log('Google Directions API error:', data.error_message || data.status);
      return res.status(400).json({ error: data.error_message || data.status });
    }
    
    const route = data.routes[0];
    const leg = route.legs[0];
    
    console.log('Directions calculated successfully:', {
      distance: leg.distance?.text,
      duration: leg.duration?.text,
      polylinePoints: route.overview_polyline.points?.length || 0
    });
    
    res.json({
      polyline: route.overview_polyline.points,
      distance: leg.distance,
      duration: leg.duration,
      start_location: leg.start_location,
      end_location: leg.end_location
    });
  } catch (err) {
    console.error('Directions API error:', err);
    console.error('Error details:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch directions' });
  }
});

module.exports = router; 