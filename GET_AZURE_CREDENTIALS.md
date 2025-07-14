# How to Get AZURE_CREDENTIALS for GitHub Actions

## 🚀 **Quick Method (Recommended)**

### Step 1: Install Azure CLI
1. **Download** from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
2. **Install** on your Windows machine
3. **Restart** your terminal/PowerShell

### Step 2: Run the Setup Script
```powershell
# In PowerShell, run:
.\setup-azure-credentials.ps1
```

This will:
- ✅ Login to Azure
- ✅ Create a service principal
- ✅ Save credentials to `azure-credentials.json`
- ✅ Show you exactly what to do next

### Step 3: Add to GitHub Secrets
1. **Open** `azure-credentials.json` file
2. **Copy** the entire content
3. **Go to** your GitHub repository
4. **Settings** → **Secrets and variables** → **Actions**
5. **New repository secret**
6. **Name**: `AZURE_CREDENTIALS`
7. **Value**: Paste the entire JSON content

---

## 🔧 **Manual Method (Alternative)**

### Step 1: Login to Azure CLI
```powershell
az login
```

### Step 2: Create Service Principal
```powershell
az ad sp create-for-rbac `
    --name "expressaid-github-actions" `
    --description "Service Principal for ExpressAid GitHub Actions deployment" `
    --role contributor `
    --scopes /subscriptions/YOUR_SUBSCRIPTION_ID `
    --sdk-auth
```

### Step 3: Copy the Output
The command will output JSON like this:
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

### Step 4: Add to GitHub Secrets
1. **Copy** the entire JSON output
2. **Go to** GitHub repository → Settings → Secrets
3. **Add** `AZURE_CREDENTIALS` secret with the JSON content

---

## 🎯 **What You Need**

### Required GitHub Secrets:
1. **`AZURE_CREDENTIALS`**: The JSON output from service principal creation
2. **`AZURE_WEBAPP_NAME`**: Your Azure Web App name (e.g., `expressaid-backend`)

### Example AZURE_CREDENTIALS Format:
```json
{
  "clientId": "12345678-1234-1234-1234-123456789012",
  "clientSecret": "your-secret-here",
  "subscriptionId": "87654321-4321-4321-4321-210987654321",
  "tenantId": "11111111-1111-1111-1111-111111111111",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

---

## 🔍 **Troubleshooting**

### Common Issues:

1. **"az command not found"**
   - Install Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

2. **"Not logged in"**
   - Run: `az login`

3. **"Insufficient privileges"**
   - Make sure you have admin rights in your Azure subscription
   - Contact your Azure admin if needed

4. **"Invalid JSON"**
   - Make sure you copy the ENTIRE JSON output
   - Don't add extra characters or formatting

### Useful Commands:
```powershell
# Check if Azure CLI is installed
az --version

# Login to Azure
az login

# Check current subscription
az account show

# List all subscriptions
az account list --output table
```

---

## ✅ **Success Checklist**

- [ ] Azure CLI installed
- [ ] Logged in to Azure (`az login`)
- [ ] Service principal created
- [ ] JSON credentials copied
- [ ] `AZURE_CREDENTIALS` secret added to GitHub
- [ ] `AZURE_WEBAPP_NAME` secret added to GitHub
- [ ] Pushed code to trigger deployment

Once you complete these steps, your GitHub Actions workflow will be able to authenticate with Azure and deploy your app! 🎉 