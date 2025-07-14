#!/bin/bash

# Azure Web App Deployment Script
# This script deploys the ExpressAid backend to Azure Web App

set -e

echo "🚀 Starting Azure Web App deployment..."

# Check if required environment variables are set
if [ -z "$AZURE_WEBAPP_NAME" ]; then
    echo "❌ Error: AZURE_WEBAPP_NAME environment variable is not set"
    exit 1
fi

if [ -z "$AZURE_WEBAPP_PUBLISH_PROFILE" ]; then
    echo "❌ Error: AZURE_WEBAPP_PUBLISH_PROFILE environment variable is not set"
    exit 1
fi

# Create publish profile file
echo "$AZURE_WEBAPP_PUBLISH_PROFILE" > publish-profile.txt

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run tests (optional)
echo "🧪 Running tests..."
npm test || echo "⚠️  Tests failed, but continuing deployment..."

# Create deployment package
echo "📦 Creating deployment package..."
zip -r deploy.zip . -x "node_modules/*" ".git/*" ".github/*" "*.log" "*.md" "deploy-azure.sh" "publish-profile.txt"

# Deploy to Azure Web App
echo "🚀 Deploying to Azure Web App: $AZURE_WEBAPP_NAME"
az webapp deployment source config-zip \
    --resource-group $(echo $AZURE_WEBAPP_PUBLISH_PROFILE | jq -r '.resourceGroup') \
    --name $AZURE_WEBAPP_NAME \
    --src deploy.zip

# Clean up
rm -f deploy.zip publish-profile.txt

echo "✅ Deployment completed successfully!"
echo "🌐 Your app should be available at: https://$AZURE_WEBAPP_NAME.azurewebsites.net" 