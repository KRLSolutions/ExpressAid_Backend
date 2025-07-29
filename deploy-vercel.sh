#!/bin/bash

# Vercel Deployment Script for ExpressAid Backend
echo "🚀 Starting Vercel deployment for ExpressAid Backend..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    vercel login
fi

# Navigate to backend directory
cd ExpressAid_Backend

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo "🌐 Your backend is now live on Vercel!"
echo "📝 Don't forget to update your frontend BackendURl.js with the new Vercel URL"