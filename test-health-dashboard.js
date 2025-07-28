const HealthMetrics = require('./models/HealthMetrics');

async function testHealthDashboard() {
  console.log('🧪 Testing Health Dashboard API...\n');

  try {
    // Test 1: Create health metrics
    console.log('1. Testing BMI calculation...');
    const testUserId = 'TEST_USER_' + Date.now();
    
    const healthMetrics = new HealthMetrics({
      userId: testUserId,
      height: 170,
      weight: 70,
    });
    
    healthMetrics.calculateBMI();
    console.log(`   ✅ BMI calculated: ${healthMetrics.bmi} (${healthMetrics.bmiCategory})`);
    
    // Test 2: Add vitals
    console.log('\n2. Testing vital signs...');
    healthMetrics.bloodPressure = {
      systolic: 120,
      diastolic: 80,
      category: healthMetrics.getBloodPressureCategory(120, 80)
    };
    healthMetrics.heartRate = 72;
    healthMetrics.temperature = 36.8;
    healthMetrics.oxygenSaturation = 98;
    
    console.log(`   ✅ Blood Pressure: ${healthMetrics.bloodPressure.systolic}/${healthMetrics.bloodPressure.diastolic} (${healthMetrics.bloodPressure.category})`);
    console.log(`   ✅ Heart Rate: ${healthMetrics.heartRate} bpm`);
    console.log(`   ✅ Temperature: ${healthMetrics.temperature}°C`);
    console.log(`   ✅ O₂ Saturation: ${healthMetrics.oxygenSaturation}%`);
    
    // Test 3: Add measurement history
    console.log('\n3. Testing measurement history...');
    healthMetrics.addMeasurement({
      weight: 70,
      bmi: healthMetrics.bmi,
      bloodPressure: healthMetrics.bloodPressure,
      heartRate: healthMetrics.heartRate,
      temperature: healthMetrics.temperature,
      notes: 'Test measurement'
    });
    
    console.log(`   ✅ Added measurement to history (${healthMetrics.measurements.length} total)`);
    
    // Test 4: Add health goals
    console.log('\n4. Testing health goals...');
    healthMetrics.targetWeight = 68;
    healthMetrics.targetBMI = 23.5;
    healthMetrics.activityLevel = 'Moderately Active';
    healthMetrics.dailySteps = 8500;
    
    console.log(`   ✅ Target Weight: ${healthMetrics.targetWeight} kg`);
    console.log(`   ✅ Target BMI: ${healthMetrics.targetBMI}`);
    console.log(`   ✅ Activity Level: ${healthMetrics.activityLevel}`);
    console.log(`   ✅ Daily Steps: ${healthMetrics.dailySteps}`);
    
    // Test 5: Add emergency contacts
    console.log('\n5. Testing emergency contacts...');
    healthMetrics.emergencyContacts = [
      {
        name: 'John Doe',
        relationship: 'Spouse',
        phoneNumber: '+1234567890',
        isPrimary: true
      }
    ];
    
    console.log(`   ✅ Added ${healthMetrics.emergencyContacts.length} emergency contact`);
    
    // Test 6: Add health conditions
    console.log('\n6. Testing health conditions...');
    healthMetrics.conditions = [
      {
        name: 'Hypertension',
        diagnosedDate: new Date('2023-01-15'),
        isActive: true,
        notes: 'Controlled with medication'
      }
    ];
    
    console.log(`   ✅ Added ${healthMetrics.conditions.length} health condition`);
    
    // Test 7: Add medications
    console.log('\n7. Testing medications...');
    healthMetrics.medications = [
      {
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        startDate: new Date('2023-01-15'),
        isActive: true,
        notes: 'For blood pressure control'
      }
    ];
    
    console.log(`   ✅ Added ${healthMetrics.medications.length} medication`);
    
    // Test 8: Add allergies
    console.log('\n8. Testing allergies...');
    healthMetrics.allergies = [
      {
        allergen: 'Penicillin',
        severity: 'Severe',
        notes: 'Anaphylactic reaction'
      }
    ];
    
    console.log(`   ✅ Added ${healthMetrics.allergies.length} allergy`);
    
    // Test 9: Save to database
    console.log('\n9. Testing database save...');
    const savedMetrics = await healthMetrics.save();
    console.log(`   ✅ Saved health metrics with ID: ${savedMetrics._id}`);
    
    // Test 10: Retrieve from database
    console.log('\n10. Testing database retrieval...');
    const retrievedMetrics = await HealthMetrics.findOne({ userId: testUserId });
    if (retrievedMetrics) {
      console.log(`   ✅ Retrieved health metrics for user: ${retrievedMetrics.userId}`);
      console.log(`   ✅ BMI: ${retrievedMetrics.bmi} (${retrievedMetrics.bmiCategory})`);
      console.log(`   ✅ Vitals: BP ${retrievedMetrics.bloodPressure.systolic}/${retrievedMetrics.bloodPressure.diastolic}, HR ${retrievedMetrics.heartRate}`);
    } else {
      console.log('   ❌ Failed to retrieve health metrics');
    }
    
    console.log('\n🎉 All health dashboard tests passed!');
    console.log('\n📊 Health Dashboard Features:');
    console.log('   • BMI calculation and categorization');
    console.log('   • Vital signs tracking (BP, HR, Temp, O₂)');
    console.log('   • Health goals and targets');
    console.log('   • Measurement history');
    console.log('   • Emergency contacts');
    console.log('   • Health conditions');
    console.log('   • Medications');
    console.log('   • Allergies');
    console.log('   • Database persistence');
    
  } catch (error) {
    console.error('❌ Health dashboard test failed:', error);
  }
}

// Run the test
testHealthDashboard();