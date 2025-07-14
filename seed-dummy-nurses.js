const mongoose = require('mongoose');
const config = require('./config');
const Nurse = require('./models/Nurse');

// Comprehensive Bangalore area coordinates and dummy nurse data
const bangaloreAreas = [
  // North Bangalore
  {
    name: 'Hebbal',
    coordinates: [77.5946, 13.0507],
    nurses: [
      {
        name: 'Dr. Priya Sharma',
        phoneNumber: '+919876543210',
        age: 32,
        sex: 'female',
        experience: 8,
        specializations: ['General Nursing', 'Home Health Care', 'Elderly Care'],
        rating: 4.8,
        totalOrders: 156,
        completedOrders: 152
      },
      {
        name: 'Dr. Rajesh Kumar',
        phoneNumber: '+919876543211',
        age: 35,
        sex: 'male',
        experience: 10,
        specializations: ['Emergency Care', 'IV Therapy', 'Wound Care'],
        rating: 4.9,
        totalOrders: 203,
        completedOrders: 198
      },
      {
        name: 'Dr. Anjali Desai',
        phoneNumber: '+919876543212',
        age: 29,
        sex: 'female',
        experience: 6,
        specializations: ['Pediatric Nursing', 'Vaccination', 'Health Checkup'],
        rating: 4.7,
        totalOrders: 134,
        completedOrders: 130
      }
    ]
  },
  {
    name: 'Yelahanka',
    coordinates: [77.5964, 13.1007],
    nurses: [
      {
        name: 'Dr. Suresh Reddy',
        phoneNumber: '+919876543213',
        age: 40,
        sex: 'male',
        experience: 12,
        specializations: ['Geriatric Care', 'Chronic Disease Management', 'Post-Surgery Care'],
        rating: 4.9,
        totalOrders: 178,
        completedOrders: 175
      },
      {
        name: 'Dr. Kavya Rao',
        phoneNumber: '+919876543214',
        age: 28,
        sex: 'female',
        experience: 5,
        specializations: ['General Nursing', 'Home Health Care', 'Elderly Care'],
        rating: 4.6,
        totalOrders: 89,
        completedOrders: 87
      }
    ]
  },
  {
    name: 'Doddaballapur Road',
    coordinates: [77.5946, 13.0507],
    nurses: [
      {
        name: 'Dr. Vikram Malhotra',
        phoneNumber: '+919876543215',
        age: 37,
        sex: 'male',
        experience: 11,
        specializations: ['Emergency Care', 'Wound Care', 'Post-Surgery Care'],
        rating: 4.9,
        totalOrders: 189,
        completedOrders: 185
      }
    ]
  },

  // East Bangalore
  {
    name: 'Whitefield',
    coordinates: [77.7498, 12.9692],
    nurses: [
      {
        name: 'Dr. Meera Iyer',
        phoneNumber: '+919876543216',
        age: 30,
        sex: 'female',
        experience: 7,
        specializations: ['Mental Health Support', 'General Nursing', 'Home Health Care'],
        rating: 4.6,
        totalOrders: 134,
        completedOrders: 130
      },
      {
        name: 'Dr. Arun Singh',
        phoneNumber: '+919876543217',
        age: 33,
        sex: 'male',
        experience: 9,
        specializations: ['Emergency Care', 'IV Therapy', 'Wound Dressing'],
        rating: 4.8,
        totalOrders: 167,
        completedOrders: 163
      },
      {
        name: 'Dr. Sunita Verma',
        phoneNumber: '+919876543218',
        age: 31,
        sex: 'female',
        experience: 7,
        specializations: ['General Nursing', 'Elderly Care', 'Home Health Care'],
        rating: 4.7,
        totalOrders: 112,
        completedOrders: 109
      }
    ]
  },
  {
    name: 'Marathahalli',
    coordinates: [77.6964, 12.9587],
    nurses: [
      {
        name: 'Dr. Rekha Joshi',
        phoneNumber: '+919876543219',
        age: 36,
        sex: 'female',
        experience: 9,
        specializations: ['Geriatric Care', 'Chronic Disease Management', 'Mental Health Support'],
        rating: 4.9,
        totalOrders: 198,
        completedOrders: 194
      },
      {
        name: 'Dr. Deepak Sharma',
        phoneNumber: '+919876543220',
        age: 32,
        sex: 'male',
        experience: 7,
        specializations: ['Emergency Care', 'IV Therapy', 'Wound Care'],
        rating: 4.7,
        totalOrders: 123,
        completedOrders: 120
      }
    ]
  },
  {
    name: 'Bellandur',
    coordinates: [77.6726, 12.9352],
    nurses: [
      {
        name: 'Dr. Manoj Gupta',
        phoneNumber: '+919876543221',
        age: 34,
        sex: 'male',
        experience: 8,
        specializations: ['IV Therapy', 'Wound Dressing', 'Emergency Care'],
        rating: 4.8,
        totalOrders: 145,
        completedOrders: 142
      },
      {
        name: 'Dr. Neha Patel',
        phoneNumber: '+919876543222',
        age: 27,
        sex: 'female',
        experience: 4,
        specializations: ['Pediatric Nursing', 'Vaccination', 'Health Checkup'],
        rating: 4.5,
        totalOrders: 67,
        completedOrders: 65
      }
    ]
  },
  {
    name: 'Sarjapur',
    coordinates: [77.7246, 12.9141],
    nurses: [
      {
        name: 'Dr. Ramesh Kumar',
        phoneNumber: '+919876543223',
        age: 39,
        sex: 'male',
        experience: 13,
        specializations: ['Geriatric Care', 'Chronic Disease Management', 'Post-Surgery Care'],
        rating: 4.9,
        totalOrders: 223,
        completedOrders: 220
      }
    ]
  },

  // South Bangalore
  {
    name: 'Koramangala',
    coordinates: [77.6245, 12.9352],
    nurses: [
      {
        name: 'Dr. Anjali Patel',
        phoneNumber: '+919876543224',
        age: 28,
        sex: 'female',
        experience: 6,
        specializations: ['Pediatric Nursing', 'Health Checkup', 'Vaccination'],
        rating: 4.7,
        totalOrders: 89,
        completedOrders: 87
      },
      {
        name: 'Dr. Suresh Reddy',
        phoneNumber: '+919876543225',
        age: 40,
        sex: 'male',
        experience: 12,
        specializations: ['Geriatric Care', 'Chronic Disease Management', 'Post-Surgery Care'],
        rating: 4.9,
        totalOrders: 178,
        completedOrders: 175
      },
      {
        name: 'Dr. Kavya Rao',
        phoneNumber: '+919876543226',
        age: 29,
        sex: 'female',
        experience: 5,
        specializations: ['Pediatric Nursing', 'Vaccination', 'Health Checkup'],
        rating: 4.5,
        totalOrders: 67,
        completedOrders: 65
      }
    ]
  },
  {
    name: 'HSR Layout',
    coordinates: [77.6413, 12.9141],
    nurses: [
      {
        name: 'Dr. Vikram Malhotra',
        phoneNumber: '+919876543227',
        age: 37,
        sex: 'male',
        experience: 11,
        specializations: ['Emergency Care', 'Wound Care', 'Post-Surgery Care'],
        rating: 4.9,
        totalOrders: 189,
        completedOrders: 185
      },
      {
        name: 'Dr. Sunita Verma',
        phoneNumber: '+919876543228',
        age: 31,
        sex: 'female',
        experience: 7,
        specializations: ['General Nursing', 'Elderly Care', 'Home Health Care'],
        rating: 4.7,
        totalOrders: 112,
        completedOrders: 109
      }
    ]
  },
  {
    name: 'Electronic City',
    coordinates: [77.6726, 12.8458],
    nurses: [
      {
        name: 'Dr. Manoj Gupta',
        phoneNumber: '+919876543229',
        age: 34,
        sex: 'male',
        experience: 8,
        specializations: ['IV Therapy', 'Wound Dressing', 'Emergency Care'],
        rating: 4.8,
        totalOrders: 145,
        completedOrders: 142
      },
      {
        name: 'Dr. Rekha Joshi',
        phoneNumber: '+919876543230',
        age: 36,
        sex: 'female',
        experience: 9,
        specializations: ['Geriatric Care', 'Chronic Disease Management', 'Mental Health Support'],
        rating: 4.9,
        totalOrders: 198,
        completedOrders: 194
      }
    ]
  },
  {
    name: 'Bannerghatta Road',
    coordinates: [77.5946, 12.8458],
    nurses: [
      {
        name: 'Dr. Deepak Sharma',
        phoneNumber: '+919876543231',
        age: 32,
        sex: 'male',
        experience: 7,
        specializations: ['Emergency Care', 'IV Therapy', 'Wound Care'],
        rating: 4.7,
        totalOrders: 123,
        completedOrders: 120
      },
      {
        name: 'Dr. Neha Patel',
        phoneNumber: '+919876543232',
        age: 27,
        sex: 'female',
        experience: 4,
        specializations: ['Pediatric Nursing', 'Vaccination', 'Health Checkup'],
        rating: 4.5,
        totalOrders: 67,
        completedOrders: 65
      }
    ]
  },
  {
    name: 'JP Nagar',
    coordinates: [77.5846, 12.8958],
    nurses: [
      {
        name: 'Dr. Ramesh Kumar',
        phoneNumber: '+919876543233',
        age: 39,
        sex: 'male',
        experience: 13,
        specializations: ['Geriatric Care', 'Chronic Disease Management', 'Post-Surgery Care'],
        rating: 4.9,
        totalOrders: 223,
        completedOrders: 220
      },
      {
        name: 'Dr. Anjali Desai',
        phoneNumber: '+919876543234',
        age: 29,
        sex: 'female',
        experience: 6,
        specializations: ['Pediatric Nursing', 'Vaccination', 'Health Checkup'],
        rating: 4.7,
        totalOrders: 134,
        completedOrders: 130
      }
    ]
  },

  // West Bangalore
  {
    name: 'Indiranagar',
    coordinates: [77.6401, 12.9789],
    nurses: [
      {
        name: 'Dr. Meera Iyer',
        phoneNumber: '+919876543235',
        age: 30,
        sex: 'female',
        experience: 7,
        specializations: ['Mental Health Support', 'General Nursing', 'Home Health Care'],
        rating: 4.6,
        totalOrders: 134,
        completedOrders: 130
      },
      {
        name: 'Dr. Arun Singh',
        phoneNumber: '+919876543236',
        age: 33,
        sex: 'male',
        experience: 9,
        specializations: ['Emergency Care', 'IV Therapy', 'Wound Dressing'],
        rating: 4.8,
        totalOrders: 167,
        completedOrders: 163
      }
    ]
  },
  {
    name: 'Domlur',
    coordinates: [77.6401, 12.9589],
    nurses: [
      {
        name: 'Dr. Sunita Verma',
        phoneNumber: '+919876543237',
        age: 31,
        sex: 'female',
        experience: 7,
        specializations: ['General Nursing', 'Elderly Care', 'Home Health Care'],
        rating: 4.7,
        totalOrders: 112,
        completedOrders: 109
      }
    ]
  },
  {
    name: 'Malleswaram',
    coordinates: [77.5701, 13.0089],
    nurses: [
      {
        name: 'Dr. Manoj Gupta',
        phoneNumber: '+919876543238',
        age: 34,
        sex: 'male',
        experience: 8,
        specializations: ['IV Therapy', 'Wound Dressing', 'Emergency Care'],
        rating: 4.8,
        totalOrders: 145,
        completedOrders: 142
      },
      {
        name: 'Dr. Rekha Joshi',
        phoneNumber: '+919876543239',
        age: 36,
        sex: 'female',
        experience: 9,
        specializations: ['Geriatric Care', 'Chronic Disease Management', 'Mental Health Support'],
        rating: 4.9,
        totalOrders: 198,
        completedOrders: 194
      }
    ]
  },
  {
    name: 'Rajajinagar',
    coordinates: [77.5501, 12.9889],
    nurses: [
      {
        name: 'Dr. Deepak Sharma',
        phoneNumber: '+919876543240',
        age: 32,
        sex: 'male',
        experience: 7,
        specializations: ['Emergency Care', 'IV Therapy', 'Wound Care'],
        rating: 4.7,
        totalOrders: 123,
        completedOrders: 120
      }
    ]
  },
  {
    name: 'Vijayanagar',
    coordinates: [77.5401, 12.9789],
    nurses: [
      {
        name: 'Dr. Neha Patel',
        phoneNumber: '+919876543241',
        age: 27,
        sex: 'female',
        experience: 4,
        specializations: ['Pediatric Nursing', 'Vaccination', 'Health Checkup'],
        rating: 4.5,
        totalOrders: 67,
        completedOrders: 65
      }
    ]
  },

  // Central Bangalore
  {
    name: 'MG Road',
    coordinates: [77.5946, 12.9716],
    nurses: [
      {
        name: 'Dr. Ramesh Kumar',
        phoneNumber: '+919876543242',
        age: 39,
        sex: 'male',
        experience: 13,
        specializations: ['Geriatric Care', 'Chronic Disease Management', 'Post-Surgery Care'],
        rating: 4.9,
        totalOrders: 223,
        completedOrders: 220
      },
      {
        name: 'Dr. Anjali Desai',
        phoneNumber: '+919876543243',
        age: 29,
        sex: 'female',
        experience: 6,
        specializations: ['Pediatric Nursing', 'Vaccination', 'Health Checkup'],
        rating: 4.7,
        totalOrders: 134,
        completedOrders: 130
      }
    ]
  },
  {
    name: 'Brigade Road',
    coordinates: [77.5946, 12.9716],
    nurses: [
      {
        name: 'Dr. Meera Iyer',
        phoneNumber: '+919876543244',
        age: 30,
        sex: 'female',
        experience: 7,
        specializations: ['Mental Health Support', 'General Nursing', 'Home Health Care'],
        rating: 4.6,
        totalOrders: 134,
        completedOrders: 130
      }
    ]
  },
  {
    name: 'Cubbon Park',
    coordinates: [77.5946, 12.9716],
    nurses: [
      {
        name: 'Dr. Arun Singh',
        phoneNumber: '+919876543245',
        age: 33,
        sex: 'male',
        experience: 9,
        specializations: ['Emergency Care', 'IV Therapy', 'Wound Dressing'],
        rating: 4.8,
        totalOrders: 167,
        completedOrders: 163
      }
    ]
  },

  // Additional Areas
  {
    name: 'Yeshwanthpur',
    coordinates: [77.5446, 13.0289],
    nurses: [
      {
        name: 'Dr. Sunita Verma',
        phoneNumber: '+919876543246',
        age: 31,
        sex: 'female',
        experience: 7,
        specializations: ['General Nursing', 'Elderly Care', 'Home Health Care'],
        rating: 4.7,
        totalOrders: 112,
        completedOrders: 109
      }
    ]
  },
  {
    name: 'Peenya',
    coordinates: [77.5146, 13.0189],
    nurses: [
      {
        name: 'Dr. Manoj Gupta',
        phoneNumber: '+919876543247',
        age: 34,
        sex: 'male',
        experience: 8,
        specializations: ['IV Therapy', 'Wound Dressing', 'Emergency Care'],
        rating: 4.8,
        totalOrders: 145,
        completedOrders: 142
      }
    ]
  },
  {
    name: 'Jayanagar',
    coordinates: [77.5846, 12.9258],
    nurses: [
      {
        name: 'Dr. Rekha Joshi',
        phoneNumber: '+919876543248',
        age: 36,
        sex: 'female',
        experience: 9,
        specializations: ['Geriatric Care', 'Chronic Disease Management', 'Mental Health Support'],
        rating: 4.9,
        totalOrders: 198,
        completedOrders: 194
      }
    ]
  },
  {
    name: 'Banashankari',
    coordinates: [77.5646, 12.9158],
    nurses: [
      {
        name: 'Dr. Deepak Sharma',
        phoneNumber: '+919876543249',
        age: 32,
        sex: 'male',
        experience: 7,
        specializations: ['Emergency Care', 'IV Therapy', 'Wound Care'],
        rating: 4.7,
        totalOrders: 123,
        completedOrders: 120
      }
    ]
  },
  {
    name: 'Uttarahalli',
    coordinates: [77.5446, 12.9058],
    nurses: [
      {
        name: 'Dr. Neha Patel',
        phoneNumber: '+919876543250',
        age: 27,
        sex: 'female',
        experience: 4,
        specializations: ['Pediatric Nursing', 'Vaccination', 'Health Checkup'],
        rating: 4.5,
        totalOrders: 67,
        completedOrders: 65
      }
    ]
  },
  {
    name: 'Bommanahalli',
    coordinates: [77.6246, 12.8858],
    nurses: [
      {
        name: 'Dr. Ramesh Kumar',
        phoneNumber: '+919876543251',
        age: 39,
        sex: 'male',
        experience: 13,
        specializations: ['Geriatric Care', 'Chronic Disease Management', 'Post-Surgery Care'],
        rating: 4.9,
        totalOrders: 223,
        completedOrders: 220
      }
    ]
  },
  {
    name: 'Hosur Road',
    coordinates: [77.6446, 12.8758],
    nurses: [
      {
        name: 'Dr. Anjali Desai',
        phoneNumber: '+919876543252',
        age: 29,
        sex: 'female',
        experience: 6,
        specializations: ['Pediatric Nursing', 'Vaccination', 'Health Checkup'],
        rating: 4.7,
        totalOrders: 134,
        completedOrders: 130
      }
    ]
  },
  {
    name: 'Anekal',
    coordinates: [77.6946, 12.7058],
    nurses: [
      {
        name: 'Dr. Meera Iyer',
        phoneNumber: '+919876543253',
        age: 30,
        sex: 'female',
        experience: 7,
        specializations: ['Mental Health Support', 'General Nursing', 'Home Health Care'],
        rating: 4.6,
        totalOrders: 134,
        completedOrders: 130
      }
    ]
  }
];

// Generate unique nurse ID
const generateNurseId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `NURSE_${timestamp}_${random}`;
};

// Generate license number
const generateLicenseNumber = (index) => {
  return `BLR_NURSE_${String(index + 1).padStart(4, '0')}`;
};

// Connect to MongoDB
mongoose.connect(config.mongodb.uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Seed dummy nurses
const seedDummyNurses = async () => {
  try {
    // Clear existing nurses (optional - comment out if you want to keep existing)
    // await Nurse.deleteMany({});
    // console.log('Cleared existing nurses');

    let nurseIndex = 0;
    const createdNurses = [];

    for (const area of bangaloreAreas) {
      for (const nurseData of area.nurses) {
        // Check if nurse already exists
        const existingNurse = await Nurse.findOne({ phoneNumber: nurseData.phoneNumber });
        if (existingNurse) {
          console.log(`Nurse ${nurseData.name} already exists, skipping...`);
          continue;
        }

        const nurse = new Nurse({
          nurseId: generateNurseId(),
          phoneNumber: nurseData.phoneNumber,
          name: nurseData.name,
          age: nurseData.age,
          sex: nurseData.sex,
          specializations: nurseData.specializations,
          experience: nurseData.experience,
          licenseNumber: generateLicenseNumber(nurseIndex),
          currentAddress: `${area.name}, Bangalore, Karnataka`,
          location: {
            type: 'Point',
            coordinates: area.coordinates
          },
          rating: nurseData.rating,
          totalOrders: nurseData.totalOrders,
          completedOrders: nurseData.completedOrders,
          earnings: Math.floor(nurseData.completedOrders * 500), // ₹500 per order
          availability: 'available',
          isActive: true,
          isApproved: true,
          isPhoneVerified: true,
          serviceRadius: 8, // 8km service radius
          workingHours: {
            monday: { start: '08:00', end: '20:00', isWorking: true },
            tuesday: { start: '08:00', end: '20:00', isWorking: true },
            wednesday: { start: '08:00', end: '20:00', isWorking: true },
            thursday: { start: '08:00', end: '20:00', isWorking: true },
            friday: { start: '08:00', end: '20:00', isWorking: true },
            saturday: { start: '09:00', end: '18:00', isWorking: true },
            sunday: { start: '09:00', end: '18:00', isWorking: true }
          }
        });

        await nurse.save();
        createdNurses.push(nurse);
        console.log(`✅ Created nurse: ${nurseData.name} in ${area.name}`);
        nurseIndex++;
      }
    }

    console.log(`\n🎉 Successfully created ${createdNurses.length} dummy nurses!`);
    console.log('\n📍 Areas covered:');
    bangaloreAreas.forEach(area => {
      console.log(`   - ${area.name}: ${area.nurses.length} nurses`);
    });

    console.log('\n📊 Summary:');
    console.log(`   Total Areas: ${bangaloreAreas.length}`);
    console.log(`   Total Nurses: ${createdNurses.length}`);
    console.log(`   Average Nurses per Area: ${(createdNurses.length / bangaloreAreas.length).toFixed(1)}`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding dummy nurses:', error);
    mongoose.connection.close();
  }
};

// Run the seeding
seedDummyNurses(); 