# 🏥 Health Dashboard - ExpressAid

A comprehensive health monitoring system that allows users to track their vital signs, BMI, health goals, and medical information.

## 🚀 Features

### 📊 Health Metrics Tracking
- **BMI Calculator**: Automatic BMI calculation with health categorization
- **Vital Signs Monitoring**: Blood pressure, heart rate, temperature, oxygen saturation
- **Health History**: Track measurements over time with trends
- **Goal Setting**: Set and track health targets

### 🎯 User Experience
- **Modern UI**: Beautiful, intuitive interface with animations
- **Real-time Validation**: Input validation with color-coded feedback
- **Health Alerts**: Smart notifications for abnormal readings
- **Progress Tracking**: Visual charts and progress indicators

### 📱 Mobile-First Design
- **Responsive Layout**: Optimized for mobile devices
- **Touch-Friendly**: Large buttons and easy input forms
- **Offline Support**: Works with in-memory database when MongoDB unavailable
- **Smooth Animations**: Engaging user experience

## 🛠️ Technical Implementation

### Backend Architecture
```
ExpressAid_Backend/
├── models/
│   ├── HealthMetrics.js          # Health data model
│   └── InMemoryDB.js            # Fallback database
├── routes/
│   └── health.js                # Health API endpoints
└── server.js                    # Main server with health routes
```

### Frontend Screens
```
ExpressAid_Frontend/screens/
├── HealthDashboardScreen.tsx     # Main health dashboard
├── BMICalculatorScreen.tsx       # BMI calculator
└── VitalsEntryScreen.tsx         # Vital signs entry
```

## 📋 API Endpoints

### Health Metrics
- `GET /api/health/metrics` - Get user's health data
- `POST /api/health/basic-measurements` - Update height/weight/BMI
- `POST /api/health/vitals` - Update vital signs
- `POST /api/health/goals` - Set health goals
- `GET /api/health/history` - Get measurement history
- `POST /api/health/calculate-bmi` - Calculate BMI

### Medical Information
- `POST /api/health/emergency-contacts` - Add emergency contacts
- `POST /api/health/conditions` - Add health conditions
- `POST /api/health/medications` - Add medications
- `POST /api/health/allergies` - Add allergies

## 🎨 UI Components

### Health Dashboard
- **Welcome Section**: For new users with onboarding
- **BMI Card**: Current BMI with category and measurements
- **Vitals Grid**: Real-time vital signs display
- **Health Goals**: Progress tracking with visual indicators
- **Quick Actions**: Easy access to health features
- **Health Tips**: Educational content and advice

### BMI Calculator
- **Input Forms**: Height and weight with validation
- **Real-time Calculation**: Instant BMI computation
- **Category Display**: Color-coded BMI categories
- **Health Tips**: Personalized advice based on BMI
- **Save Integration**: Direct save to health profile

### Vitals Entry
- **Blood Pressure**: Systolic/diastolic with validation
- **Heart Rate**: BPM with normal range indicators
- **Temperature**: Celsius with fever detection
- **Oxygen Saturation**: SpO₂ with normal range
- **Blood Sugar**: mg/dL with diabetes monitoring
- **Real-time Validation**: Color-coded input feedback

## 🎯 Health Categories

### BMI Categories
- **Underweight**: < 18.5 (Orange)
- **Normal Weight**: 18.5 - 24.9 (Green)
- **Overweight**: 25.0 - 29.9 (Orange)
- **Obese**: ≥ 30.0 (Red)

### Blood Pressure Categories
- **Normal**: < 120/80 mmHg (Green)
- **Elevated**: 120-129/< 80 mmHg (Yellow)
- **High**: ≥ 130/≥ 80 mmHg (Orange)
- **Very High**: ≥ 140/≥ 90 mmHg (Red)

### Vital Sign Ranges
- **Heart Rate**: 60-100 bpm (Normal)
- **Temperature**: 36.1-37.2°C (Normal)
- **O₂ Saturation**: ≥ 95% (Normal)
- **Blood Sugar**: 70-140 mg/dL (Normal)

## 🚀 Setup Instructions

### Backend Setup
1. **Install Dependencies**:
   ```bash
   cd ExpressAid_Backend
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp env.example .env
   # Add your MongoDB connection string and JWT secret
   ```

3. **Start Server**:
   ```bash
   npm start
   ```

4. **Test Health Dashboard**:
   ```bash
   node test-health-dashboard.js
   ```

### Frontend Setup
1. **Install Dependencies**:
   ```bash
   cd ExpressAid_Frontend
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Run on Device**:
   ```bash
   npm run android  # For Android
   npm run ios      # For iOS
   ```

## 📊 Database Schema

### HealthMetrics Model
```javascript
{
  userId: String,                    // User identifier
  height: Number,                    // Height in cm
  weight: Number,                    // Weight in kg
  bmi: Number,                       // Calculated BMI
  bmiCategory: String,               // BMI category
  bloodPressure: {                   // Blood pressure
    systolic: Number,
    diastolic: Number,
    category: String
  },
  heartRate: Number,                 // Heart rate in bpm
  temperature: Number,               // Temperature in Celsius
  oxygenSaturation: Number,          // O₂ saturation percentage
  bloodSugar: Number,                // Blood sugar in mg/dL
  targetWeight: Number,              // Target weight goal
  targetBMI: Number,                 // Target BMI goal
  activityLevel: String,             // Activity level
  dailySteps: Number,                // Daily step count
  measurements: Array,               // Measurement history
  conditions: Array,                 // Health conditions
  medications: Array,                // Medications
  allergies: Array,                  // Allergies
  emergencyContacts: Array           // Emergency contacts
}
```

## 🎨 UI/UX Features

### Design Principles
- **Modern Aesthetics**: Clean, professional design
- **Accessibility**: High contrast and readable fonts
- **Intuitive Navigation**: Easy-to-use interface
- **Visual Feedback**: Color-coded health status
- **Progressive Disclosure**: Information revealed as needed

### Color Scheme
- **Primary Blue**: #2563eb (Brand color)
- **Success Green**: #4CAF50 (Normal/Healthy)
- **Warning Orange**: #FF9800 (Caution/Elevated)
- **Danger Red**: #F44336 (High/Alert)
- **Neutral Gray**: #64748b (Secondary text)

### Animations
- **Fade In**: Smooth content appearance
- **Slide Up**: Elegant screen transitions
- **Pulse**: Attention-grabbing alerts
- **Progress Bars**: Visual goal tracking

## 🔒 Security Features

### Data Protection
- **JWT Authentication**: Secure API access
- **Input Validation**: Server-side data validation
- **Rate Limiting**: API request throttling
- **Data Encryption**: Sensitive health data protection

### Privacy Compliance
- **User Consent**: Clear data usage policies
- **Data Retention**: Configurable data storage periods
- **Access Control**: User-specific data isolation
- **Audit Logging**: Data access tracking

## 🧪 Testing

### Backend Tests
```bash
# Run health dashboard tests
node test-health-dashboard.js

# Expected output:
# ✅ BMI calculated: 24.2 (Normal weight)
# ✅ Blood Pressure: 120/80 (Normal)
# ✅ Heart Rate: 72 bpm
# ✅ All health dashboard tests passed!
```

### API Testing
```bash
# Test health metrics endpoint
curl -X GET http://localhost:5000/api/health/metrics \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test BMI calculation
curl -X POST http://localhost:5000/api/health/basic-measurements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"height": 170, "weight": 70}'
```

## 📈 Future Enhancements

### Planned Features
- **Health Charts**: Interactive graphs and trends
- **Health Reminders**: Medication and appointment alerts
- **Doctor Integration**: Share data with healthcare providers
- **Health Insights**: AI-powered health recommendations
- **Wearable Integration**: Connect with fitness devices
- **Family Health**: Multi-user health tracking

### Technical Improvements
- **Real-time Updates**: WebSocket integration
- **Offline Sync**: Local data synchronization
- **Advanced Analytics**: Machine learning insights
- **Multi-language**: Internationalization support
- **Dark Mode**: Theme customization

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow existing patterns
2. **Testing**: Add tests for new features
3. **Documentation**: Update README for changes
4. **Security**: Validate all user inputs
5. **Performance**: Optimize for mobile devices

### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Implement changes
4. Add tests
5. Update documentation
6. Submit pull request

## 📞 Support

### Getting Help
- **Documentation**: Check this README
- **Issues**: Report bugs on GitHub
- **Discussions**: Join community discussions
- **Email**: Contact development team

### Common Issues
- **Database Connection**: Check MongoDB connection string
- **Authentication**: Verify JWT token configuration
- **Mobile Build**: Ensure all dependencies installed
- **API Errors**: Check request format and headers

## 📄 License

This health dashboard feature is part of the ExpressAid project and follows the same licensing terms.

---

**🏥 ExpressAid Health Dashboard** - Empowering users to take control of their health through modern technology and intuitive design.