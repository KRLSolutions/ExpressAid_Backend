const mongoose = require('mongoose');
const config = require('./config');
const Nurse = require('./models/Nurse');

const AREAS = [
  // Central Bangalore
  { name: 'MG Road', coords: [77.6190, 12.9756] },
  { name: 'Brigade Road', coords: [77.6088, 12.9740] },
  { name: 'Commercial Street', coords: [77.6081, 12.9842] },
  { name: 'Shivajinagar', coords: [77.6050, 12.9916] },
  { name: 'Vasanth Nagar', coords: [77.5946, 12.9892] },
  { name: 'Richmond Town', coords: [77.6011, 12.9622] },
  { name: 'Cunningham Road', coords: [77.5942, 12.9882] },
  { name: 'Shanti Nagar', coords: [77.6017, 12.9545] },
  { name: 'Infantry Road', coords: [77.6062, 12.9832] },
  { name: 'Chikpet', coords: [77.5770, 12.9698] },
  { name: 'Tasker Town', coords: [77.6067, 12.9847] },
  { name: 'Palace Road', coords: [77.5887, 12.9912] },
  // North Bangalore
  { name: 'Hebbal', coords: [77.5920, 13.0358] },
  { name: 'Yelahanka', coords: [77.5963, 13.1007] },
  { name: 'Sahakar Nagar', coords: [77.5946, 13.0602] },
  { name: 'Jakkur', coords: [77.6205, 13.0722] },
  { name: 'Thanisandra', coords: [77.6412, 13.0607] },
  { name: 'RT Nagar', coords: [77.5946, 13.0196] },
  { name: 'Amruthahalli', coords: [77.6202, 13.0702] },
  { name: 'Hegde Nagar', coords: [77.6412, 13.0672] },
  { name: 'Kodigehalli', coords: [77.5920, 13.0602] },
  { name: 'Kempapura', coords: [77.6202, 13.0602] },
  { name: 'Vidyaranyapura', coords: [77.5521, 13.0852] },
  { name: 'BEL Circle', coords: [77.5562, 13.0402] },
  { name: 'Bagalur', coords: [77.7100, 13.1391] },
  { name: 'Hennur', coords: [77.6520, 13.0482] },
  { name: 'Kogilu', coords: [77.6205, 13.0922] },
  // South Bangalore
  { name: 'Jayanagar', coords: [77.5838, 12.9250] },
  { name: 'JP Nagar', coords: [77.5856, 12.9066] },
  { name: 'Banashankari', coords: [77.5467, 12.9180] },
  { name: 'Basavanagudi', coords: [77.5736, 12.9416] },
  { name: 'Uttarahalli', coords: [77.5467, 12.9066] },
  { name: 'Kumaraswamy Layout', coords: [77.5736, 12.9066] },
  { name: 'BTM Layout', coords: [77.6101, 12.9166] },
  { name: 'Padmanabhanagar', coords: [77.5602, 12.9250] },
  { name: 'Girinagar', coords: [77.5467, 12.9416] },
  { name: 'Kanakapura Road', coords: [77.5736, 12.8900] },
  { name: 'Anjanapura', coords: [77.5736, 12.8800] },
  { name: 'ISRO Layout', coords: [77.5736, 12.9000] },
  // East Bangalore
  { name: 'Whitefield', coords: [77.7500, 12.9698] },
  { name: 'Marathahalli', coords: [77.6974, 12.9569] },
  { name: 'Indiranagar', coords: [77.6400, 12.9716] },
  { name: 'Koramangala', coords: [77.6229, 12.9352] },
  { name: 'Domlur', coords: [77.6412, 12.9582] },
  { name: 'CV Raman Nagar', coords: [77.6702, 12.9842] },
  { name: 'KR Puram', coords: [77.6974, 13.0096] },
  { name: 'Brookefield', coords: [77.7172, 12.9698] },
  { name: 'Mahadevapura', coords: [77.6974, 12.9882] },
  { name: 'Kadugodi', coords: [77.7600, 13.0080] },
  { name: 'Hoodi', coords: [77.7100, 12.9912] },
  { name: 'Ramamurthy Nagar', coords: [77.6842, 13.0250] },
  { name: 'Bellandur', coords: [77.6842, 12.9250] },
  { name: 'Sarjapur Road', coords: [77.7167, 12.9081] },
  { name: 'Varthur', coords: [77.7500, 12.9352] },
  { name: 'Kundalahalli', coords: [77.7172, 12.9569] },
  // West Bangalore
  { name: 'Rajajinagar', coords: [77.5562, 12.9916] },
  { name: 'Malleswaram', coords: [77.5696, 13.0096] },
  { name: 'Vijayanagar', coords: [77.5449, 12.9716] },
  { name: 'Basaveshwaranagar', coords: [77.5390, 12.9916] },
  { name: 'Magadi Road', coords: [77.5390, 12.9716] },
  { name: 'Kamakshipalya', coords: [77.5390, 12.9616] },
  { name: 'Sunkadakatte', coords: [77.5390, 12.9516] },
  { name: 'Nandini Layout', coords: [77.5390, 13.0016] },
  { name: 'Peenya', coords: [77.5150, 13.0400] },
  { name: 'Dasarahalli', coords: [77.5150, 13.0600] },
  { name: 'Nayandahalli', coords: [77.5390, 12.9416] },
  // Outskirts & Emerging Areas
  { name: 'Devanahalli', coords: [77.7100, 13.2432] },
  { name: 'Hoskote', coords: [77.7872, 13.0707] },
  { name: 'Doddaballapura', coords: [77.5375, 13.2927] },
  { name: 'Nelamangala', coords: [77.3936, 13.0982] },
  { name: 'Electronic City', coords: [77.6842, 12.8392] },
  { name: 'Chandapura', coords: [77.6932, 12.7672] },
  { name: 'Attibele', coords: [77.7672, 12.7832] },
  { name: 'Jigani', coords: [77.6082, 12.7842] },
  { name: 'Sarjapura', coords: [77.7850, 12.8616] },
  { name: 'Bidadi', coords: [77.3832, 12.7962] },
  { name: 'Kanakapura', coords: [77.4200, 12.5522] },
];

async function main() {
  await mongoose.connect(config.mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  // Remove all existing nurses
  await Nurse.deleteMany({});
  console.log('Cleared existing nurses');

  const nurses = AREAS.map((area, i) => ({
    nurseId: `NURSE_${area.name.replace(/\s+/g, '').toUpperCase()}_${i+1}`,
    name: `Nurse ${area.name}`,
    phoneNumber: `+91900000${(100 + i).toString().padStart(3, '0')}`,
    location: { type: 'Point', coordinates: area.coords },
    isActive: true,
    isAvailable: true,
    specializations: ['General Nursing'],
    password: 'password123', // default password
    availability: 'available',
    isApproved: true,
  }));

  await Nurse.insertMany(nurses);
  console.log(`Seeded ${nurses.length} nurses for all major Bangalore areas.`);
  mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); }); 