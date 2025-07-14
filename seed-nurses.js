const mongoose = require('mongoose');
const Nurse = require('./models/Nurse');
const config = require('./config');

// Connect to MongoDB
mongoose.connect(config.mongodb.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const nurses = [
  {
    nurseId: 'NURSE_1',
    phoneNumber: '+919876543210',
    name: 'Nurse Alice',
    age: 28,
    sex: 'female',
    email: 'alice@expressaid.com',
    specializations: ['elderly_care', 'iv_drip', 'health_checkup'],
    experience: 5,
    licenseNumber: 'NUR001',
    location: {
      type: 'Point',
      coordinates: [77.5946, 12.9716], // Bangalore center
    },
    currentAddress: 'MG Road, Bangalore',
    availability: 'available',
    isPhoneVerified: true,
    isApproved: true,
    isActive: true,
    rating: 4.8,
    totalOrders: 45,
    completedOrders: 42,
    earnings: 12500,
  },
  {
    nurseId: 'NURSE_2',
    phoneNumber: '+919876543211',
    name: 'Nurse Bob',
    age: 32,
    sex: 'male',
    email: 'bob@expressaid.com',
    specializations: ['wound_dressing', 'vaccination', 'emergency_care'],
    experience: 8,
    licenseNumber: 'NUR002',
    location: {
      type: 'Point',
      coordinates: [77.6846, 12.9816], // Whitefield
    },
    currentAddress: 'Whitefield, Bangalore',
    availability: 'available',
    isPhoneVerified: true,
    isApproved: true,
    isActive: true,
    rating: 4.9,
    totalOrders: 67,
    completedOrders: 65,
    earnings: 18900,
  },
  {
    nurseId: 'NURSE_3',
    phoneNumber: '+919876543212',
    name: 'Nurse Carol',
    age: 26,
    sex: 'female',
    email: 'carol@expressaid.com',
    specializations: ['elderly_care', 'health_checkup'],
    experience: 3,
    licenseNumber: 'NUR003',
    location: {
      type: 'Point',
      coordinates: [77.7246, 12.8456], // Electronic City
    },
    currentAddress: 'Electronic City, Bangalore',
    availability: 'available',
    isPhoneVerified: true,
    isApproved: true,
    isActive: true,
    rating: 4.7,
    totalOrders: 23,
    completedOrders: 22,
    earnings: 6800,
  },
  {
    nurseId: 'NURSE_4',
    phoneNumber: '+919876543213',
    name: 'Nurse Dave',
    age: 35,
    sex: 'male',
    email: 'dave@expressaid.com',
    specializations: ['iv_drip', 'emergency_care', 'vaccination'],
    experience: 10,
    licenseNumber: 'NUR004',
    location: {
      type: 'Point',
      coordinates: [77.6246, 12.9346], // Koramangala
    },
    currentAddress: 'Koramangala, Bangalore',
    availability: 'available',
    isPhoneVerified: true,
    isApproved: true,
    isActive: true,
    rating: 4.6,
    totalOrders: 89,
    completedOrders: 87,
    earnings: 23400,
  },
];

async function seedNurses() {
  try {
    console.log('🌱 Seeding nurses...');
    
    for (const nurseData of nurses) {
      const existingNurse = await Nurse.findOne({ nurseId: nurseData.nurseId });
      
      if (existingNurse) {
        console.log(`Updated: ${nurseData.name}`);
        await Nurse.findOneAndUpdate({ nurseId: nurseData.nurseId }, nurseData, { new: true });
      } else {
        console.log(`Inserted: ${nurseData.name}`);
        const nurse = new Nurse(nurseData);
        await nurse.save();
      }
    }
    
    console.log('✅ Nurses seeded successfully!');
    console.log(`📊 Total nurses in database: ${await Nurse.countDocuments()}`);
    
  } catch (error) {
    console.error('❌ Error seeding nurses:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedNurses(); 