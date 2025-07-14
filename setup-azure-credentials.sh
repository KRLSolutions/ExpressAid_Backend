#!/bin/bash

# Azure Service Principal Setup for GitHub Actions
# This script creates a service principal for GitHub Actions to deploy to Azure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔐 Azure Service Principal Setup for GitHub Actions${NC}"
echo "====================================================="

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

# Get current subscription
SUBSCRIPTION_ID=$(az account show --query id --output tsv)
SUBSCRIPTION_NAME=$(az account show --query name --output tsv)

echo -e "${BLUE}📋 Current Azure Subscription:${NC}"
echo "Subscription ID: $SUBSCRIPTION_ID"
echo "Subscription Name: $SUBSCRIPTION_NAME"
echo ""

# Service Principal Configuration
SP_NAME="expressaid-github-actions"
SP_DESCRIPTION="Service Principal for ExpressAid GitHub Actions deployment"

echo -e "${BLUE}📦 Creating Service Principal...${NC}"

# Create service principal
SP_OUTPUT=$(az ad sp create-for-rbac \
    --name "$SP_NAME" \
    --description "$SP_DESCRIPTION" \
    --role contributor \
    --scopes /subscriptions/$SUBSCRIPTION_ID \
    --sdk-auth)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Service Principal created successfully${NC}"
    
    # Save credentials to file
    echo "$SP_OUTPUT" > azure-credentials.json
    
    echo ""
    echo -e "${GREEN}🎉 Setup Complete!${NC}"
    echo "====================="
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo "1. Add these secrets to your GitHub repository:"
    echo ""
    echo -e "${YELLOW}AZURE_CREDENTIALS:${NC}"
    echo "Copy the entire content of the azure-credentials.json file"
    echo ""
    echo -e "${YELLOW}AZURE_WEBAPP_NAME:${NC}"
    echo "Your Azure Web App name (e.g., expressaid-backend)"
    echo ""
    echo "2. The azure-credentials.json file contains your credentials"
    echo "   Keep this file secure and don't commit it to your repository"
    echo ""
    echo -e "${BLUE}🔧 To add secrets to GitHub:${NC}"
    echo "1. Go to your GitHub repository"
    echo "2. Settings → Secrets and variables → Actions"
    echo "3. Click 'New repository secret'"
    echo "4. Add AZURE_CREDENTIALS with the content of azure-credentials.json"
    echo "5. Add AZURE_WEBAPP_NAME with your web app name"
    echo ""
    echo -e "${YELLOW}⚠️  Security Note:${NC}"
    echo "- Keep azure-credentials.json secure"
    echo "- Don't commit this file to your repository"
    echo "- Consider using Azure Key Vault for production"
    
else
    echo -e "${RED}❌ Failed to create service principal${NC}"
    exit 1
fi 