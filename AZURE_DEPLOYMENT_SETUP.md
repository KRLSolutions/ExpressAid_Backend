# Azure Web App Deployment Setup

This guide will help you set up automatic deployment to Azure Web App using GitHub Actions.

## Prerequisites

1. **Azure Account**: You need an active Azure subscription
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Azure CLI** (optional, for local deployment)

## Step 1: Create Azure Web App

### Option A: Using Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Web App" and select it
4. Fill in the details:
   - **Resource Group**: Create new or use existing
   - **Name**: `expressaid-backend` (or your preferred name)
   - **Publish**: Code
   - **Runtime stack**: Node 18 LTS
   - **Operating System**: Linux
   - **Region**: Choose closest to your users
   - **App Service Plan**: Create new (F1 for free tier)
5. Click "Review + create" then "Create"

### Option B: Using Azure CLI

```bash
# Login to Azure
az login

# Create resource group
az group create --name expressaid-backend-rg --location eastus

# Create app service plan
az appservice plan create --name expressaid-backend-plan --resource-group expressaid-backend-rg --sku F1 --is-linux

# Create web app
az webapp create --name expressaid-backend --resource-group expressaid-backend-rg --plan expressaid-backend-plan --runtime "NODE|18-lts"
```

## Step 2: Configure Environment Variables

In Azure Portal, go to your Web App → Configuration → Application settings and add:

```
NODE_ENV=production
PORT=8080
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_ENV=TEST
SMS_SERVICE=aws-sns
```

## Step 3: Create Azure Service Principal

You need to create a service principal for GitHub Actions to authenticate with Azure.

### Option A: Using the provided script

```bash
# Run the setup script (if you have Azure CLI)
./setup-azure-credentials.sh
```

### Option B: Manual creation

```bash
# Login to Azure
az login

# Create service principal
az ad sp create-for-rbac \
    --name "expressaid-github-actions" \
    --description "Service Principal for ExpressAid GitHub Actions deployment" \
    --role contributor \
    --scopes /subscriptions/YOUR_SUBSCRIPTION_ID \
    --sdk-auth
```

This will output JSON credentials. Save this output securely.

## Step 4: Configure GitHub Secrets

In your GitHub repository:

1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add these secrets:

### Required Secrets:
- `AZURE_CREDENTIALS`: The JSON output from the service principal creation
- `AZURE_WEBAPP_NAME`: Your Azure Web App name (e.g., `expressaid-backend`)

### Example AZURE_CREDENTIALS format:
```json
{
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "subscriptionId": "your-subscription-id",
  "tenantId": "your-tenant-id",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

## Step 5: Push to GitHub

The GitHub Actions workflow will automatically trigger when you push to `main` or `master` branch:

```bash
git add .
git commit -m "Add Azure deployment workflow"
git push origin main
```

## Step 6: Monitor Deployment

1. Go to your GitHub repository
2. Click "Actions" tab
3. You'll see the deployment progress
4. Check the logs if there are any issues

## Step 7: Verify Deployment

After successful deployment, your app will be available at:
```
https://your-webapp-name.azurewebsites.net
```

Test the health endpoint:
```
https://your-webapp-name.azurewebsites.net/api/health
```

## Troubleshooting

### Common Issues:

1. **Authentication Fails**: 
   - Check that AZURE_CREDENTIALS secret is correctly formatted
   - Ensure the service principal has contributor role
   - Verify the subscription ID matches your Azure subscription

2. **Build Fails**: Check the GitHub Actions logs for specific errors
3. **App Won't Start**: Check Azure Web App logs in the portal
4. **Environment Variables**: Ensure all required env vars are set in Azure
5. **Port Issues**: Make sure your app listens on `process.env.PORT`

### Useful Commands:

```bash
# View Azure Web App logs
az webapp log tail --name your-webapp-name --resource-group your-resource-group

# Restart the app
az webapp restart --name your-webapp-name --resource-group your-resource-group

# View app settings
az webapp config appsettings list --name your-webapp-name --resource-group your-resource-group

# Test service principal
az login --service-principal -u YOUR_CLIENT_ID -p YOUR_CLIENT_SECRET --tenant YOUR_TENANT_ID
```

## Security Best Practices

1. **Use Azure Key Vault** for sensitive environment variables
2. **Enable HTTPS only** in Azure Web App settings
3. **Set up monitoring and alerts**
4. **Regular security updates**
5. **Use service principals** instead of personal accounts for CI/CD
6. **Rotate service principal credentials** regularly

## Cost Optimization

1. **Use F1 (Free) tier** for development
2. **Scale down** during non-business hours
3. **Monitor usage** in Azure portal
4. **Set up spending limits**

## Next Steps

1. **Set up custom domain** (optional)
2. **Configure SSL certificate**
3. **Set up monitoring and alerts**
4. **Create staging environment**
5. **Set up database backups**

## Support

If you encounter issues:

1. Check [Azure Web App documentation](https://docs.microsoft.com/en-us/azure/app-service/)
2. Review [GitHub Actions documentation](https://docs.github.com/en/actions)
3. Check Azure Web App logs in the portal
4. Review GitHub Actions logs in your repository 