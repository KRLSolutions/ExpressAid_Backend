# 🚀 ExpressAid Production Deployment Guide

## Prerequisites
- ✅ AWS SNS configured (DONE)
- ✅ Backend API working (DONE)
- ✅ Frontend app working (DONE)

## Step 1: Set Up MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for free account
3. Create a new cluster (M0 Free tier)

### 1.2 Configure Database
1. Create database user with password
2. Add your IP to whitelist (or 0.0.0.0/0 for all)
3. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/expressaid?retryWrites=true&w=majority
   ```

### 1.3 Update Environment Variables
Create `.env` file in backend/:
```env
NODE_ENV=production
PORT=5000
AWS_ACCESS_KEY_ID=AKIAX2GA5I6XGINGEPWR
AWS_SECRET_ACCESS_KEY=V8+h8DeePyxlbAsMo9jVYi+3DuuY9XsSBRqdfMKp
AWS_REGION=us-east-1
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expressaid
JWT_SECRET=your_super_secure_jwt_secret_here
```

## Step 2: Deploy Backend

### Option A: Deploy to Railway (Recommended)
1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Set environment variables in Railway dashboard
4. Deploy automatically

### Option B: Deploy to Heroku
1. Install Heroku CLI
2. Create Heroku app
3. Set environment variables
4. Deploy with Git

### Option C: Deploy to DigitalOcean/AWS EC2
1. Set up VPS
2. Install Node.js, PM2
3. Clone repository
4. Set environment variables
5. Start with PM2

## Step 3: Deploy Frontend

### Option A: Deploy to Expo (Easiest)
1. Install Expo CLI: `npm install -g @expo/cli`
2. Build for production: `expo build:android` or `expo build:ios`
3. Submit to app stores

### Option B: Deploy to EAS Build
1. Install EAS CLI: `npm install -g @expo/eas-cli`
2. Configure eas.json
3. Build: `eas build --platform android`

### Option C: Deploy to App Stores
1. Build APK/IPA
2. Create developer accounts
3. Submit to Google Play/App Store

## Step 4: Update Frontend Configuration

Update `frontend/services/api.js`:
```javascript
// Change from localhost to your production backend URL
const API_BASE_URL = 'https://your-backend-domain.com/api';
```

## Step 5: Security & Monitoring

### 5.1 Security Checklist
- [ ] Use HTTPS everywhere
- [ ] Set strong JWT secret
- [ ] Enable rate limiting
- [ ] Set up CORS properly
- [ ] Use environment variables
- [ ] Enable AWS SNS spending limits

### 5.2 Monitoring Setup
- [ ] Set up AWS CloudWatch
- [ ] Monitor API response times
- [ ] Set up error tracking (Sentry)
- [ ] Monitor SMS delivery rates

## Step 6: Testing Production

### 6.1 Test SMS Delivery
```bash
curl -X POST https://your-backend.com/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+919346048610"}'
```

### 6.2 Test Complete Flow
1. Send OTP to real phone
2. Verify OTP
3. Create user profile
4. Test all features

## Step 7: Go Live Checklist

- [ ] Backend deployed and tested
- [ ] Frontend deployed and tested
- [ ] Database connected
- [ ] SMS working
- [ ] All features tested
- [ ] Error monitoring set up
- [ ] Backup strategy in place

## Cost Estimation

### Monthly Costs (1000 users)
- **AWS SNS**: ~$6.45 (1000 SMS)
- **MongoDB Atlas**: Free tier
- **Railway/Heroku**: $5-20
- **Total**: ~$10-25/month

### Scaling Considerations
- **10,000 users**: ~$65/month
- **100,000 users**: ~$650/month

## Support & Maintenance

### Regular Tasks
- Monitor error logs
- Check SMS delivery rates
- Update dependencies
- Backup database
- Monitor costs

### Emergency Contacts
- AWS Support
- MongoDB Support
- Your hosting provider

---

## 🎯 Next Steps

1. **Choose deployment platform** (Railway recommended)
2. **Set up MongoDB Atlas**
3. **Deploy backend**
4. **Deploy frontend**
5. **Test everything**
6. **Go live!**

Your app is ready for production! 🚀 