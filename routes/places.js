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

// Reverse Geocoding to auto-fill address fields
router.post('/reverse-geocode', async (req, res) => {
  const { latitude, longitude } = req.body;
  
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }
  
  console.log('🌍 Reverse geocoding request for:', { latitude, longitude });
  
  try {
    // Call Google's Reverse Geocoding API
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;
    
    console.log('🌍 Reverse Geocoding API request:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('🌍 Reverse Geocoding API response status:', data.status);
    
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      console.error('❌ Reverse Geocoding API error:', data.error_message || data.status);
      return res.status(400).json({ 
        error: 'Unable to get address details for this location',
        details: data.error_message || data.status
      });
    }
    
    const result = data.results[0];
    const addressComponents = result.address_components;
    
    // Parse address components to extract individual fields
    const addressData = {
      formattedAddress: result.formatted_address,
      houseNumber: '',
      floor: '',
      block: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      country: ''
    };
    
    // Extract address components
    addressComponents.forEach(component => {
      const types = component.types;
      const value = component.long_name;
      
      if (types.includes('street_number')) {
        addressData.houseNumber = value;
      } else if (types.includes('route')) {
        // Street name could be used as landmark
        if (!addressData.landmark) {
          addressData.landmark = value;
        }
      } else if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
        // Sub-locality could be used as block or landmark
        if (!addressData.block) {
          addressData.block = value;
        } else if (!addressData.landmark) {
          addressData.landmark = value;
        }
      } else if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        addressData.city = value;
      } else if (types.includes('administrative_area_level_1')) {
        addressData.state = value;
      } else if (types.includes('postal_code')) {
        addressData.pincode = value;
      } else if (types.includes('country')) {
        addressData.country = value;
      }
    });
    
    // If no specific house number found, try to extract from formatted address
    if (!addressData.houseNumber) {
      const addressParts = result.formatted_address.split(',');
      const firstPart = addressParts[0].trim();
      // Check if first part contains a number (potential house number)
      const numberMatch = firstPart.match(/^(\d+)/);
      if (numberMatch) {
        addressData.houseNumber = numberMatch[1];
      }
    }
    
    console.log('🌍 Parsed address data:', addressData);
    
    res.json({
      success: true,
      address: addressData
    });
    
  } catch (err) {
    console.error('❌ Reverse Geocoding API error:', err);
    res.status(500).json({ error: 'Failed to reverse geocode location' });
  }
});

module.exports = router; 