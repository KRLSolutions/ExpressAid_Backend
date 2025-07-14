# ExpressAid Backend

A Node.js backend for the ExpressAid mobile application with phone authentication and user management.

## Features

- Phone number authentication with OTP
- JWT-based authentication
- User profile management
- Address management
- MongoDB database

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/expressaid
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
PORT=5000
```

3. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication

#### Send OTP
- **POST** `/api/auth/send-otp`
- **Body:** `{ "phoneNumber": "+1234567890" }`
- **Response:** `{ "message": "OTP sent successfully", "phoneNumber": "1234567890", "otp": "123456" }`

#### Verify OTP
- **POST** `/api/auth/verify-otp`
- **Body:** `{ "phoneNumber": "+1234567890", "otp": "123456" }`
- **Response:** `{ "message": "OTP verified successfully", "token": "jwt-token", "user": {...} }`

#### Update Profile
- **POST** `/api/auth/update-profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "name": "John Doe", "dateOfBirth": "1990-01-01" }`

#### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`

### User Management

#### Get Addresses
- **GET** `/api/users/addresses`
- **Headers:** `Authorization: Bearer <token>`

#### Add Address
- **POST** `/api/users/addresses`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "type": "home", "address": "123 Main St", "city": "New York", "state": "NY", "pincode": "10001" }`

#### Update Address
- **PUT** `/api/users/addresses/:addressId`
- **Headers:** `Authorization: Bearer <token>`

#### Delete Address
- **DELETE** `/api/users/addresses/:addressId`
- **Headers:** `Authorization: Bearer <token>`

#### Set Default Address
- **PATCH** `/api/users/addresses/:addressId/default`
- **Headers:** `Authorization: Bearer <token>`

## Development

### Running in Development Mode
```bash
npm run dev
```

### Testing
```bash
npm test
```

## SMS Integration

Currently, OTP is logged to console in development mode. To integrate with SMS services:

1. **Twilio**: Set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` in environment variables
2. **AWS SNS**: Configure AWS credentials and SNS settings
3. **Other services**: Modify the SMS sending logic in `routes/auth.js`

## Database Schema

### User Model
```javascript
{
  phoneNumber: String (required, unique),
  name: String,
  dateOfBirth: Date,
  isPhoneVerified: Boolean,
  otp: {
    code: String,
    expiresAt: Date
  },
  addresses: [{
    type: String (home/work/other),
    address: String,
    landmark: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: Boolean
  }]
}
``` 