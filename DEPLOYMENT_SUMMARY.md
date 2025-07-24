# ExpressAid Backend - Azure Deployment Summary

## 🚀 What's Been Created

I've set up a complete CI/CD pipeline for your ExpressAid backend to automatically deploy to Azure Web App when you push to GitHub. Here's what was created:

### 1. GitHub Actions Workflow
**File**: `.github/workflows/azure-deploy.yml`

This workflow automatically:
- Triggers on push to `main` or `master` branch
- Sets up Node.js 18.x environment
- Installs dependencies
- Builds the application
- Authenticates with Azure using service principal
- Deploys to Azure Web App
- Includes health checks

### 2. Azure Configuration
**File**: `web.config`

Configures IIS to properly handle your Node.js application with:
- Proper routing rules
- Security settings
- Error handling

### 3. Deployment Scripts
**Files**: 
- `deploy-azure.sh` - For local deployment
- `setup-azure.sh` - For initial Azure setup
- `setup-azure-credentials.sh` - For creating Azure service principal

### 4. Documentation
**Files**:
- `AZURE_DEPLOYMENT_SETUP.md` - Complete setup guide
- `DEPLOYMENT_SUMMARY.md` - This summary

## 📋 Quick Setup Steps

### Step 1: Create Azure Web App
Run the setup script (if you have Azure CLI):
```bash
# On Windows, you can run this in Git Bash or WSL
./setup-azure.sh
```

Or manually create in Azure Portal:
1. Go to Azure Portal
2. Create a new Web App
3. Choose Node.js 18 LTS runtime
4. Use Linux OS

### Step 2: Create Azure Service Principal
Run the credentials setup script:
```bash
# This will create azure-credentials.json
./setup-azure-credentials.sh
```

Or manually create using Azure CLI:
```bash
az ad sp create-for-rbac \
    --name "expressaid-github-actions" \
    --description "Service Principal for ExpressAid GitHub Actions deployment" \
    --role contributor \
    --scopes /subscriptions/YOUR_SUBSCRIPTION_ID \
    --sdk-auth
```

### Step 3: Configure GitHub Secrets
In your GitHub repository → Settings → Secrets and variables → Actions:

**Required Secrets:**
- `AZURE_CREDENTIALS`: The JSON output from service principal creation (content of azure-credentials.json)
- `AZURE_WEBAPP_NAME`: Your Azure Web App name (e.g., `expressaid-backend`)

### Step 4: Push to GitHub
```bash
git add .
git commit -m "Add Azure deployment workflow"
git push origin main
```

## 🔧 Environment Variables

Make sure these are set in your Azure Web App:

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

## 🌐 Your App URL

After deployment, your app will be available at:
```
https://your-webapp-name.azurewebsites.net
```

Test endpoints:
- Health check: `/api/health`
- Status: `/api/status`
- Test: `/api/test`

## 📊 Monitoring

### GitHub Actions
- Go to your repository → Actions tab
- View deployment progress and logs

### Azure Portal
- Go to your Web App → Log stream
- View real-time application logs

## 🔍 Troubleshooting

### Common Issues:

1. **Authentication Fails**
   - Check that AZURE_CREDENTIALS secret is correctly formatted
   - Ensure the service principal has contributor role
   - Verify the subscription ID matches your Azure subscription

2. **Build Fails**
   - Check GitHub Actions logs
   - Ensure all dependencies are in `package.json`

3. **App Won't Start**
   - Check Azure Web App logs
   - Verify environment variables are set
   - Ensure app listens on `process.env.PORT`

4. **Environment Variables**
   - Double-check all required variables are set in Azure
   - Use Azure Key Vault for sensitive data

### Useful Commands:

```bash
# View Azure logs
az webapp log tail --name your-webapp-name --resource-group your-resource-group

# Restart app
az webapp restart --name your-webapp-name --resource-group your-resource-group

# View settings
az webapp config appsettings list --name your-webapp-name --resource-group your-resource-group

# Test service principal
az login --service-principal -u YOUR_CLIENT_ID -p YOUR_CLIENT_SECRET --tenant YOUR_TENANT_ID
```

## 🛡️ Security Best Practices

1. **Use Azure Key Vault** for sensitive environment variables
2. **Enable HTTPS only** in Azure Web App settings
3. **Set up monitoring and alerts**
4. **Regular security updates**
5. **Use service principals** for CI/CD
6. **Rotate service principal credentials** regularly

## 💰 Cost Optimization

1. **Use F1 (Free) tier** for development
2. **Scale down** during non-business hours
3. **Monitor usage** in Azure portal
4. **Set up spending limits**

## 🎯 Next Steps

1. **Test the deployment** by pushing to GitHub
2. **Update your frontend** to use the Azure URL
3. **Set up monitoring and alerts**
4. **Configure custom domain** (optional)
5. **Set up staging environment**

## 📞 Support

If you encounter issues:

1. Check the detailed setup guide: `AZURE_DEPLOYMENT_SETUP.md`
2. Review GitHub Actions logs in your repository
3. Check Azure Web App logs in the portal
4. Verify all environment variables are set correctly
5. Ensure Azure service principal has proper permissions

## 🎉 Success!

Once everything is set up, every time you push to your `main` branch, your app will automatically deploy to Azure Web App! 🚀 