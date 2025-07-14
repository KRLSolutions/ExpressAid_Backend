# Production Setup Guide

## 🚀 Complete Production Setup for ExpressAid

### Prerequisites
- AWS Account
- MongoDB Atlas Account
- Domain name (optional)

---

## 📱 **Step 1: AWS SNS Setup**

### 1.1 Create AWS Account
1. Go to [AWS Console](https://aws.amazon.com/)
2. Create a new account (free tier available)
3. Complete verification

### 1.2 Create IAM User for SNS
1. Go to **IAM** → **Users** → **Create User**
2. Name: `expressaid-sns-user`
3. Select **Programmatic access**
4. Attach policy: `AmazonSNSFullAccess`
5. Copy **Access Key ID** and **Secret Access Key**

### 1.3 Enable SMS in SNS
1. Go to **SNS** → **Text messaging (SMS)**
2. Click **Move out of SMS sandbox**
3. Fill out the form for production SMS
4. Wait for approval (24-48 hours)

### 1.4 Test SMS (Sandbox Mode)
- Initially, you can only send to verified numbers
- Add your phone number in SNS console
- Test OTP delivery

---

## 🗄️ **Step 2: MongoDB Atlas Setup**

### 2.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create new project: `ExpressAid`

### 2.2 Create Cluster
1. Click **Build a Database**
2. Choose **FREE** tier (M0)
3. Select cloud provider (AWS/Google Cloud/Azure)
4. Select region (closest to your users)
5. Click **Create**

### 2.3 Configure Database Access
1. Go to **Database Access**
2. Click **Add New Database User**
3. Username: `expressaid-user`
4. Password: Generate strong password
5. Role: **Read and write to any database**
6. Click **Add User**

### 2.4 Configure Network Access
1. Go to **Network Access**
2. Click **Add IP Address**
3. For development: Click **Allow Access from Anywhere** (0.0.0.0/0)
4. For production: Add your server IP

### 2.5 Get Connection String
1. Go to **Database** → **Connect**
2. Choose **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your database password
5. Replace `<dbname>` with `expressaid`

---

## 🔧 **Step 3: Environment Configuration**

### 3.1 Create Production .env File
Create `.env` file in backend directory:

```env
# Environment
NODE_ENV=production
PORT=5000

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-strong-jwt-secret-key-here

# MongoDB Atlas
MONGODB_URI=mongodb+srv://expressaid-user:your-password@cluster0.mongodb.net/expressaid?retryWrites=true&w=majority

# SMS Service
SMS_SERVICE=aws-sns

# AWS SNS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# Optional: Twilio (alternative)
# TWILIO_ACCOUNT_SID=your-twilio-sid
# TWILIO_AUTH_TOKEN=your-twilio-token
# TWILIO_PHONE_NUMBER=+1234567890
```

### 3.2 Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🧪 **Step 4: Testing Production Setup**

### 4.1 Test Database Connection
```bash
cd backend
npm start
```

Check console for:
```
✅ Connected to MongoDB Atlas
🚀 Server running on port 5000
🌍 Environment: production
📱 SMS Provider: aws-sns
🗄️ Database: MongoDB Atlas
```

### 4.2 Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "ExpressAid Backend is running",
  "environment": "production",
  "database": {
    "type": "MongoDB Atlas",
    "status": "Connected",
    "host": "cluster0.mongodb.net"
  },
  "sms": {
    "provider": "aws-sns",
    "configured": true
  }
}
```

### 4.3 Test SMS Delivery
```bash
node test-api.js
```

Check for:
```
📱 [AWS SNS] OTP sent to +1234567890: 123456
📱 [AWS SNS] Message ID: abc123-def456
```

---

## 🌐 **Step 5: Deployment Options**

### 5.1 Heroku Deployment
1. Install Heroku CLI
2. Create Heroku app
3. Set environment variables in Heroku dashboard
4. Deploy:
```bash
git add .
git commit -m "Production ready"
git push heroku main
```

### 5.2 AWS EC2 Deployment
1. Launch EC2 instance
2. Install Node.js and PM2
3. Clone repository
4. Set environment variables
5. Start with PM2:
```bash
pm2 start server.js --name expressaid
pm2 startup
pm2 save
```

### 5.3 Railway Deployment
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

---

## 🔒 **Step 6: Security Best Practices**

### 6.1 Environment Variables
- Never commit `.env` files
- Use different secrets for each environment
- Rotate secrets regularly

### 6.2 Database Security
- Use strong passwords
- Enable MongoDB Atlas security features
- Restrict network access

### 6.3 API Security
- Use HTTPS in production
- Implement rate limiting
- Add request validation
- Monitor API usage

### 6.4 SMS Security
- Monitor SMS costs
- Set up billing alerts
- Implement SMS rate limiting
- Log all SMS activities

---

## 📊 **Step 7: Monitoring & Logging**

### 7.1 Application Monitoring
- Set up error tracking (Sentry)
- Monitor API response times
- Track user registration rates

### 7.2 Database Monitoring
- Monitor MongoDB Atlas metrics
- Set up alerts for high usage
- Track query performance

### 7.3 SMS Monitoring
- Monitor AWS SNS delivery rates
- Track SMS costs
- Set up billing alerts

---

## 💰 **Cost Estimation**

### AWS SNS (SMS)
- **Free Tier**: 1,000 SMS/month
- **After Free**: $0.00645 per SMS
- **Monthly Cost** (10,000 SMS): ~$58

### MongoDB Atlas
- **Free Tier**: 512MB storage, shared RAM
- **Paid Tier**: $9/month for 2GB storage

### Total Monthly Cost
- **Small Scale** (< 1,000 users): ~$0-10
- **Medium Scale** (1,000-10,000 users): ~$50-100
- **Large Scale** (> 10,000 users): ~$200+

---

## 🚨 **Troubleshooting**

### Common Issues:

1. **MongoDB Connection Failed**
   - Check connection string
   - Verify network access
   - Check database user credentials

2. **SMS Not Sending**
   - Verify AWS credentials
   - Check SMS sandbox status
   - Verify phone number format

3. **JWT Token Issues**
   - Check JWT_SECRET is set
   - Verify token expiration
   - Check clock synchronization

### Support:
- AWS SNS: AWS Support
- MongoDB Atlas: MongoDB Support
- Application: Check logs and health endpoint 