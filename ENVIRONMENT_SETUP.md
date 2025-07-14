# 🔧 Environment Setup Guide

## 📋 What You Need

### 1. MongoDB Atlas Connection String
```
mongodb+srv://username:password@cluster.mongodb.net/expressaid?retryWrites=true&w=majority
```

### 2. JWT Secret (Generated)
```
057bed89eb41d8de095d6419121b9edc5685025a154893bb26c2dc41b65e67c7254cbe8202c4654deef8514fc158404ef6952736b54953ce0b4b2f484267853f
```

### 3. AWS SNS Credentials (Already configured)
```
AWS_ACCESS_KEY_ID=AKIAX2GA5I6XGINGEPWR
AWS_SECRET_ACCESS_KEY=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
AWS_REGION=us-east-1
```

## 🗄️ MongoDB Atlas Setup Steps

### Step 1: Create Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free"
3. Sign up with email/password

### Step 2: Create Database
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select cloud provider (AWS recommended)
4. Choose region (us-east-1 for best performance)
5. Click "Create"

### Step 3: Database User
1. Go to "Database Access" → "Add New Database User"
2. Username: `expressaid_user`
3. Password: Create a strong password (save it!)
4. Privileges: "Read and write to any database"
5. Click "Add User"

### Step 4: Network Access
1. Go to "Network Access" → "Add IP Address"
2. Click "Allow Access from Anywhere" (0.0.0.0/0)
3. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your actual password

## 🔐 JWT Secret (Already Generated)

Your secure JWT secret:
```
057bed89eb41d8de095d6419121b9edc5685025a154893bb26c2dc41b65e67c7254cbe8202c4654deef8514fc158404ef6952736b54953ce0b4b2f484267853f
```

## 📝 Complete .env File

Create a `.env` file in the `backend/` directory:

```env
# Environment
NODE_ENV=production
PORT=5000

# MongoDB Atlas (Replace with your connection string)
MONGODB_URI=mongodb+srv://expressaid_user:your_password@cluster.mongodb.net/expressaid?retryWrites=true&w=majority

# JWT Secret (Generated)
JWT_SECRET=057bed89eb41d8de095d6419121b9edc5685025a154893bb26c2dc41b65e67c7254cbe8202c4654deef8514fc158404ef6952736b54953ce0b4b2f484267853f

# AWS SNS (Already configured)
AWS_ACCESS_KEY_ID=AKIAX2GA5I6XGINGEPWR
AWS_SECRET_ACCESS_KEY=V8+h8DeePyxlbAsMo9jVYi+3DuuY9XsSBRqdfMKp
AWS_REGION=us-east-1

# Frontend URL (Update when you deploy)
FRONTEND_URL=http://localhost:3000
```

## 🧪 Test Your Setup

After creating the `.env` file:

```bash
# Test MongoDB connection
node test-mongodb.js

# Test AWS SNS
node test-aws-sns.js

# Start server
node server.js
```

## 🔒 Security Notes

1. **Never commit `.env` file to Git**
2. **Keep JWT secret secure**
3. **Use strong database password**
4. **Limit network access in production**
5. **Rotate AWS keys regularly**

## 🚀 Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user with strong password
- [ ] Network access configured
- [ ] Connection string obtained
- [ ] JWT secret generated
- [ ] .env file created
- [ ] All services tested
- [ ] Ready for deployment 