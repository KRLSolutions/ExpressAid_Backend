#!/bin/bash

echo "🚀 ExpressAid Production Deployment Script"
echo "=========================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file with your production configuration:"
    echo ""
    echo "NODE_ENV=production"
    echo "PORT=5000"
    echo "AWS_ACCESS_KEY_ID=AKIAX2GA5I6XGINGEPWR"
    echo "AWS_SECRET_ACCESS_KEY=V8+h8DeePyxlbAsMo9jVYi+3DuuY9XsSBRqdfMKp"
    echo "AWS_REGION=us-east-1"
    echo "MONGODB_URI=your_mongodb_atlas_connection_string"
    echo "JWT_SECRET=your_super_secure_jwt_secret_here"
    echo ""
    exit 1
fi

echo "✅ Environment file found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if MongoDB URI is set
if grep -q "MONGODB_URI" .env; then
    echo "✅ MongoDB URI configured"
else
    echo "⚠️  MongoDB URI not set - will use in-memory database"
fi

# Check if AWS credentials are set
if grep -q "AWS_ACCESS_KEY_ID" .env; then
    echo "✅ AWS credentials configured"
else
    echo "❌ AWS credentials not set"
    exit 1
fi

# Test the application
echo "🧪 Testing application..."
node test-aws-sns.js

echo ""
echo "🎉 Setup complete! Your app is ready for deployment."
echo ""
echo "Next steps:"
echo "1. Deploy to Railway/Heroku/DigitalOcean"
echo "2. Set environment variables on your hosting platform"
echo "3. Deploy your frontend app"
echo "4. Test everything in production"
echo ""
echo "📖 See PRODUCTION_DEPLOYMENT.md for detailed instructions" 