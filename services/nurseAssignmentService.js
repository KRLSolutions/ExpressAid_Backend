const Nurse = require('../models/Nurse');

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

// Get area name from coordinates (approximate)
const getAreaFromCoordinates = (latitude, longitude) => {
  const areas = [
    { name: 'Whitefield', lat: 12.9692, lon: 77.7498, radius: 5 },
    { name: 'Koramangala', lat: 12.9352, lon: 77.6245, radius: 4 },
    { name: 'Indiranagar', lat: 12.9789, lon: 77.6401, radius: 3 },
    { name: 'HSR Layout', lat: 12.9141, lon: 77.6413, radius: 3 },
    { name: 'Electronic City', lat: 12.8458, lon: 77.6726, radius: 4 },
    { name: 'Marathahalli', lat: 12.9587, lon: 77.6964, radius: 4 }
  ];

  for (const area of areas) {
    const distance = calculateDistance(latitude, longitude, area.lat, area.lon);
    if (distance <= area.radius) {
      return area.name;
    }
  }
  
  return 'Bangalore'; // Default fallback
};

// Find available nurses near the order location
const findAvailableNurses = async (latitude, longitude, serviceRadius = 10) => {
  try {
    // Find nurses within service radius
    const nurses = await Nurse.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: serviceRadius * 1000 // Convert km to meters
        }
      },
      availability: 'available',
      isActive: true,
      isApproved: true
    }).limit(10);

    // Calculate exact distances and filter by service radius
    const nursesWithDistance = nurses
      .map(nurse => {
        const distance = calculateDistance(
          latitude, 
          longitude, 
          nurse.location.coordinates[1], 
          nurse.location.coordinates[0]
        );
        return {
          ...nurse.toObject(),
          distance
        };
      })
      .filter(nurse => nurse.distance <= nurse.serviceRadius)
      .sort((a, b) => a.distance - b.distance); // Sort by distance

    return nursesWithDistance;
  } catch (error) {
    console.error('Error finding available nurses:', error);
    return [];
  }
};

// Automatically assign a nurse to an order
const assignNurseToOrder = async (orderId, orderLocation) => {
  try {
    const { latitude, longitude } = orderLocation;
    
    // Find available nurses
    const availableNurses = await findAvailableNurses(latitude, longitude);
    
    if (availableNurses.length === 0) {
      console.log('No available nurses found for order:', orderId);
      return null;
    }

    // Select the best nurse (closest with good rating)
    const selectedNurse = availableNurses[0];
    
    // Calculate estimated arrival time (15-30 minutes based on distance)
    const baseTime = 15; // 15 minutes base
    const distanceTime = Math.min(selectedNurse.distance * 2, 15); // 2 min per km, max 15 min
    const estimatedMinutes = Math.round(baseTime + distanceTime);
    const estimatedArrival = new Date(Date.now() + estimatedMinutes * 60 * 1000);

    // Prepare nurse details for order
    const assignedNurse = {
      nurseId: selectedNurse.nurseId,
      name: selectedNurse.name,
      phoneNumber: selectedNurse.phoneNumber,
      age: selectedNurse.age,
      sex: selectedNurse.sex,
      experience: selectedNurse.experience,
      specializations: selectedNurse.specializations,
      rating: selectedNurse.rating,
      totalOrders: selectedNurse.totalOrders,
      completedOrders: selectedNurse.completedOrders,
      currentAddress: selectedNurse.currentAddress,
      distance: selectedNurse.distance,
      assignedAt: new Date(),
      estimatedArrival
    };

    console.log(`✅ Assigned nurse ${selectedNurse.name} to order ${orderId}`);
    console.log(`📍 Distance: ${selectedNurse.distance}km, ETA: ${estimatedMinutes} minutes`);

    return assignedNurse;
  } catch (error) {
    console.error('Error assigning nurse to order:', error);
    return null;
  }
};

// Get area information for display
const getAreaInfo = (latitude, longitude) => {
  const areaName = getAreaFromCoordinates(latitude, longitude);
  return {
    areaName,
    city: 'Bangalore',
    state: 'Karnataka'
  };
};

module.exports = {
  calculateDistance,
  getAreaFromCoordinates,
  findAvailableNurses,
  assignNurseToOrder,
  getAreaInfo
}; 