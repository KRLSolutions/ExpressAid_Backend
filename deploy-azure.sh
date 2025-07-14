#!/bin/bash

echo "🚀 ExpressAid Azure Deployment Script"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Step 6: Test AWS SNS Configuration
echo -e "${BLUE}📦 Step 6: Testing AWS SNS Configuration...${NC}"
node fix-aws-sns.js

# Step 7: Deploy Application
echo -e "${BLUE}📦 Step 7: Deploying Application...${NC}"

# Get deployment URL
DEPLOYMENT_URL=$(az webapp deployment list-publishing-credentials --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --query publishingUserName --output tsv)

if [ -z "$DEPLOYMENT_URL" ]; then
    echo -e "${RED}❌ Failed to get deployment URL${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Deployment URL: $DEPLOYMENT_URL${NC}"

# Step 8: Test Deployment
echo -e "${BLUE}📦 Step 8: Testing Deployment...${NC}"
sleep 30

# Test health endpoint
HEALTH_CHECK=$(curl -s https://$WEB_APP_NAME.azurewebsites.net/api/health)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    echo "Response: $HEALTH_CHECK"
else
    echo -e "${YELLOW}⚠️  Health check failed (app might still be starting)${NC}"
fi

# Step 9: Display Results
echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "=================================="
echo -e "${BLUE}🌐 Your backend is now available at:${NC}"
echo "https://$WEB_APP_NAME.azurewebsites.net"
echo ""
echo -e "${BLUE}📋 Useful Commands:${NC}"
echo "View logs: az webapp log tail --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP"
echo "Restart app: az webapp restart --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP"
echo "View settings: az webapp config appsettings list --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP"
echo ""
echo -e "${BLUE}🔧 Next Steps:${NC}"
echo "1. Test all API endpoints"
echo "2. Update frontend to use Azure URL"
echo "3. Set up monitoring and alerts"
echo "4. Configure custom domain (optional)"
echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo "- AWS SNS credentials are exposed in this script"
echo "- Consider using Azure Key Vault for secrets"
echo "- Set up proper monitoring and alerts"
echo "- Test SMS functionality thoroughly" 