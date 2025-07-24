#!/bin/bash

# Azure Web App Setup Script for ExpressAid Backend
# This script creates and configures an Azure Web App for the ExpressAid backend

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 ExpressAid Azure Web App Setup${NC}"
echo "====================================="

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed. Please install it first:${NC}"
    echo "https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Azure. Please login:${NC}"
    az login
fi

# Configuration
RESOURCE_GROUP="expressaid-backend-rg"
APP_SERVICE_PLAN="expressaid-backend-plan"
WEB_APP_NAME="expressaid-backend"
LOCATION="eastus"

echo -e "${BLUE}📋 Configuration:${NC}"
echo "Resource Group: $RESOURCE_GROUP"
echo "App Service Plan: $APP_SERVICE_PLAN"
echo "Web App Name: $WEB_APP_NAME"
echo "Location: $LOCATION"
echo ""

# Step 1: Create Resource Group
echo -e "${BLUE}📦 Step 1: Creating Resource Group...${NC}"
if az group show --name $RESOURCE_GROUP &> /dev/null; then
    echo -e "${GREEN}✅ Resource group already exists${NC}"
else
    az group create --name $RESOURCE_GROUP --location $LOCATION
    echo -e "${GREEN}✅ Resource group created${NC}"
fi

# Step 2: Create App Service Plan
echo -e "${BLUE}📦 Step 2: Creating App Service Plan...${NC}"
if az appservice plan show --name $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${GREEN}✅ App Service Plan already exists${NC}"
else
    az appservice plan create --name $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP --sku F1 --is-linux
    echo -e "${GREEN}✅ App Service Plan created${NC}"
fi

# Step 3: Create Web App
echo -e "${BLUE}📦 Step 3: Creating Web App...${NC}"
if az webapp show --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${GREEN}✅ Web App already exists${NC}"
else
    az webapp create --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --plan $APP_SERVICE_PLAN --runtime "NODE|18-lts"
    echo -e "${GREEN}✅ Web App created${NC}"
fi

# Step 4: Configure Environment Variables
echo -e "${BLUE}📦 Step 4: Configuring Environment Variables...${NC}"
az webapp config appsettings set --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --settings \
    NODE_ENV=production \
    PORT=8080 \
    AWS_ACCESS_KEY_ID=AKIAX2GA5I6XGINGEPWR \
    AWS_SECRET_ACCESS_KEY=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 \
    AWS_REGION=us-east-1 \
    MONGODB_URI=mongodb+srv://admin:LHONNmuaD6FzhAGO@cluster0.hibzkks.mongodb.net/expressaid?retryWrites=true&w=majority \
    JWT_SECRET=057bed89eb41d8de095d6419121b9edc5685025a154893bb26c2dc41b65e67c7254cbe8202c4654deef8514fc158404ef6952736b54953ce0b4b2f484267853f \
    CASHFREE_APP_ID=TEST10393719a08909e07f6157a7221e91739301 \
    CASHFREE_SECRET_KEY=cfsk_ma_test_d81a3c09420dcde848287e6b7aacfca5_3f2bf834 \
    CASHFREE_ENV=TEST \
    SMS_SERVICE=aws-sns

echo -e "${GREEN}✅ Environment variables configured${NC}"

# Step 5: Enable HTTPS
echo -e "${BLUE}📦 Step 5: Enabling HTTPS...${NC}"
az webapp update --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --https-only true
echo -e "${GREEN}✅ HTTPS enabled${NC}"

# Step 6: Get Publish Profile
echo -e "${BLUE}📦 Step 6: Getting Publish Profile...${NC}"
PUBLISH_PROFILE=$(az webapp deployment list-publishing-credentials --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --query publishingUserName --output tsv)

if [ -z "$PUBLISH_PROFILE" ]; then
    echo -e "${RED}❌ Failed to get publish profile${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Publish profile retrieved${NC}"

# Step 7: Display Results
echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "====================="
echo -e "${BLUE}🌐 Your Web App URL:${NC}"
echo "https://$WEB_APP_NAME.azurewebsites.net"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Add these secrets to your GitHub repository:"
echo "   - AZURE_WEBAPP_NAME: $WEB_APP_NAME"
echo "   - AZURE_WEBAPP_PUBLISH_PROFILE: (get from Azure Portal)"
echo ""
echo "2. Push your code to GitHub to trigger deployment"
echo ""
echo -e "${BLUE}🔧 Useful Commands:${NC}"
echo "View logs: az webapp log tail --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP"
echo "Restart app: az webapp restart --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP"
echo "View settings: az webapp config appsettings list --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP"
echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo "- Get the publish profile from Azure Portal for GitHub Actions"
echo "- Update environment variables with your actual values"
echo "- Test the deployment after pushing to GitHub" 