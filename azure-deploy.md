# 🚀 Azure Deployment Guide for ExpressAid Backend

## Prerequisites
- Azure account with subscription
- Azure CLI installed
- Node.js application ready

## Step 1: Azure App Service Setup

### 1.1 Create Azure App Service
```bash
# Login to Azure
az login

# Create resource group
az group create --name expressaid-backend-rg --location eastus

# Create App Service Plan (Free tier for testing)
az appservice plan create --name expressaid-backend-plan --resource-group expressaid-backend-rg --sku F1 --is-linux

# Create Web App
az webapp create --name expressaid-backend --resource-group expressaid-backend-rg --plan expressaid-backend-plan --runtime "NODE|18-lts"
```

### 1.2 Configure Environment Variables
```bash
# Set environment variables in Azure
az webapp config appsettings set --name expressaid-backend --resource-group expressaid-backend-rg --settings \
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
```

## Step 2: Deploy Application

### 2.1 Using Azure CLI
```bash
# Navigate to backend directory
cd backend

# Deploy to Azure
az webapp deployment source config-local-git --name expressaid-backend --resource-group expressaid-backend-rg

# Get deployment URL
az webapp deployment list-publishing-credentials --name expressaid-backend --resource-group expressaid-backend-rg

# Deploy using Git
git remote add azure <deployment-url>
git push azure main
```

### 2.2 Using GitHub Actions (Recommended)
Create `.github/workflows/azure-deploy.yml`:
```yaml
name: Deploy to Azure
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'expressaid-backend'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: ./backend
```

## Step 3: Configure CORS for Azure

Update `server.js` CORS configuration:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://192.168.0.3:3000', 
    'exp://192.168.0.3:8081',
    'http://10.0.2.2:5000',
    'http://localhost:5000',
    'exp://localhost:8081',
    'https://expressaid-backend.azurewebsites.net', // Add Azure URL
    'https://your-frontend-domain.com' // Add your frontend domain
  ],
  credentials: true
}));
```

## Step 4: Test Deployment

### 4.1 Health Check
```bash
curl https://expressaid-backend.azurewebsites.net/api/health
```

### 4.2 Test SMS
```bash
curl -X POST https://expressaid-backend.azurewebsites.net/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+919346048610"}'
```

## Step 5: Monitoring & Logs

### 5.1 View Logs
```bash
az webapp log tail --name expressaid-backend --resource-group expressaid-backend-rg
```

### 5.2 Application Insights (Optional)
```bash
# Create Application Insights
az monitor app-insights component create --app expressaid-insights --location eastus --resource-group expressaid-backend-rg --application-type web

# Get instrumentation key
az monitor app-insights component show --app expressaid-insights --resource-group expressaid-backend-rg --query instrumentationKey
```

## Step 6: Custom Domain (Optional)

```bash
# Add custom domain
az webapp config hostname add --webapp-name expressaid-backend --resource-group expressaid-backend-rg --hostname api.expressaid.com
```

## Step 7: SSL Certificate

Azure App Service provides free SSL certificates. Enable HTTPS:
```bash
az webapp update --name expressaid-backend --resource-group expressaid-backend-rg --https-only true
```

## Cost Estimation

### Azure App Service Pricing (Monthly)
- **F1 (Free)**: $0/month (1 GB RAM, shared CPU)
- **B1 (Basic)**: $13/month (1.75 GB RAM, dedicated CPU)
- **S1 (Standard)**: $73/month (1.75 GB RAM, dedicated CPU)

### Recommended for Production
- Start with **B1 Basic** plan for better performance
- Scale up as needed

## Troubleshooting

### Common Issues
1. **Port Configuration**: Azure uses port 8080, not 5000
2. **Environment Variables**: Ensure all are set in Azure App Settings
3. **CORS Issues**: Update CORS configuration with your frontend domain
4. **MongoDB Connection**: Ensure MongoDB Atlas allows Azure IPs

### Useful Commands
```bash
# Restart app
az webapp restart --name expressaid-backend --resource-group expressaid-backend-rg

# View app settings
az webapp config appsettings list --name expressaid-backend --resource-group expressaid-backend-rg

# Update app settings
az webapp config appsettings set --name expressaid-backend --resource-group expressaid-backend-rg --settings KEY=VALUE
```

## Security Best Practices

1. **Environment Variables**: Never commit secrets to Git
2. **HTTPS Only**: Enable HTTPS redirect
3. **Rate Limiting**: Already configured in server.js
4. **CORS**: Restrict to specific domains
5. **Monitoring**: Set up Application Insights

## Next Steps

1. Deploy to Azure App Service
2. Test all endpoints
3. Update frontend to use Azure URL
4. Monitor performance and logs
5. Set up alerts for errors

Your backend will be available at: `https://expressaid-backend.azurewebsites.net` 