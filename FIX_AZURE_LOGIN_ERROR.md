# Fix Azure Login Error: Missing client-id and tenant-id

## 🚨 **Error Message**
```
Error: Login failed with Error: Using auth-type: SERVICE_PRINCIPAL. Not all values are present. Ensure 'client-id' and 'tenant-id' are supplied.
```

## 🔍 **What This Means**
The `AZURE_CREDENTIALS` secret in your GitHub repository is missing required fields or is not properly formatted.

## 🛠️ **Quick Fix**

### Step 1: Generate New Credentials
Run this PowerShell script to create proper credentials:

```powershell
.\verify-azure-credentials.ps1
```

This script will:
- ✅ Check your current Azure setup
- ✅ Create a new service principal with all required fields
- ✅ Verify the credentials are complete
- ✅ Save them to `azure-credentials.json`

### Step 2: Update GitHub Secrets
1. **Open** the generated `azure-credentials.json` file
2. **Copy** the ENTIRE content (including the curly braces)
3. **Go to** your GitHub repository
4. **Settings** → **Secrets and variables** → **Actions**
5. **Find** the `AZURE_CREDENTIALS` secret
6. **Click** the edit (pencil) icon
7. **Replace** the entire value with the new JSON content
8. **Save** the changes

## 🔍 **Manual Verification**

### Check Your Current Credentials
If you want to check what's wrong with your current credentials:

1. **Go to** GitHub repository → Settings → Secrets
2. **Click** on `AZURE_CREDENTIALS` secret
3. **Check** if it contains all these fields:

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

### Common Issues:
- ❌ **Missing `clientId`** → Generate new credentials
- ❌ **Missing `tenantId`** → Generate new credentials
- ❌ **Incomplete JSON** → Copy the entire JSON output
- ❌ **Extra characters** → Make sure you copy exactly what the script outputs

## 🔧 **Manual Creation (Alternative)**

If the script doesn't work, create credentials manually:

```powershell
# Login to Azure
az login

# Create service principal
az ad sp create-for-rbac `
    --name "expressaid-github-actions" `
    --description "Service Principal for ExpressAid GitHub Actions deployment" `
    --role contributor `
    --scopes /subscriptions/YOUR_SUBSCRIPTION_ID `
    --sdk-auth
```

**Important**: Copy the ENTIRE JSON output, including the curly braces `{}`.

## ✅ **Verification Checklist**

After updating the credentials:

- [ ] `AZURE_CREDENTIALS` secret contains complete JSON
- [ ] JSON has `clientId`, `clientSecret`, `subscriptionId`, `tenantId`
- [ ] `AZURE_WEBAPP_NAME` secret is set
- [ ] Pushed code to trigger new deployment

## 🚀 **Test the Fix**

1. **Update** the `AZURE_CREDENTIALS` secret in GitHub
2. **Push** a small change to trigger deployment:
   ```bash
   git add .
   git commit -m "Test Azure credentials fix"
   git push origin main
   ```
3. **Check** the GitHub Actions logs
4. **Verify** the deployment succeeds

## 🔍 **Still Having Issues?**

If the error persists:

1. **Check Azure CLI version**: `az --version`
2. **Verify Azure login**: `az account show`
3. **Check subscription**: `az account list --output table`
4. **Ensure you have admin rights** in your Azure subscription
5. **Contact Azure support** if you don't have sufficient permissions

## 🎯 **Expected Result**

After fixing the credentials, your GitHub Actions workflow should:
- ✅ Successfully authenticate with Azure
- ✅ Deploy your app to Azure Web App
- ✅ Show "Deployment completed successfully!" in the logs

The error should be completely resolved! 🎉 