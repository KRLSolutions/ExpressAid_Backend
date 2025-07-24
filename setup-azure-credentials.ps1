# Azure Service Principal Setup for GitHub Actions (PowerShell)
# This script creates a service principal for GitHub Actions to deploy to Azure

Write-Host "🔐 Azure Service Principal Setup for GitHub Actions" -ForegroundColor Blue
Write-Host "=====================================================" -ForegroundColor Blue

# Check if Azure CLI is installed
try {
    $azVersion = az --version
    Write-Host "✅ Azure CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" -ForegroundColor Yellow
    exit 1
}

# Check if logged in to Azure
try {
    $account = az account show --query name --output tsv
    Write-Host "✅ Logged in to Azure as: $account" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Not logged in to Azure. Please login:" -ForegroundColor Yellow
    az login
}

# Get current subscription
$subscriptionId = az account show --query id --output tsv
$subscriptionName = az account show --query name --output tsv

Write-Host "📋 Current Azure Subscription:" -ForegroundColor Blue
Write-Host "Subscription ID: $subscriptionId" -ForegroundColor White
Write-Host "Subscription Name: $subscriptionName" -ForegroundColor White
Write-Host ""

# Service Principal Configuration
$spName = "expressaid-github-actions"
$spDescription = "Service Principal for ExpressAid GitHub Actions deployment"

Write-Host "📦 Creating Service Principal..." -ForegroundColor Blue

# Create service principal
$spOutput = az ad sp create-for-rbac `
    --name "$spName" `
    --description "$spDescription" `
    --role contributor `
    --scopes "/subscriptions/$subscriptionId" `
    --sdk-auth

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Service Principal created successfully" -ForegroundColor Green
    
    # Save credentials to file
    $spOutput | Out-File -FilePath "azure-credentials.json" -Encoding UTF8
    
    Write-Host ""
    Write-Host "🎉 Setup Complete!" -ForegroundColor Green
    Write-Host "=====================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Blue
    Write-Host "1. Add these secrets to your GitHub repository:" -ForegroundColor White
    Write-Host ""
    Write-Host "AZURE_CREDENTIALS:" -ForegroundColor Yellow
    Write-Host "Copy the entire content of the azure-credentials.json file" -ForegroundColor White
    Write-Host ""
    Write-Host "AZURE_WEBAPP_NAME:" -ForegroundColor Yellow
    Write-Host "Your Azure Web App name (e.g., expressaid-backend)" -ForegroundColor White
    Write-Host ""
    Write-Host "2. The azure-credentials.json file contains your credentials" -ForegroundColor White
    Write-Host "   Keep this file secure and don't commit it to your repository" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 To add secrets to GitHub:" -ForegroundColor Blue
    Write-Host "1. Go to your GitHub repository" -ForegroundColor White
    Write-Host "2. Settings → Secrets and variables → Actions" -ForegroundColor White
    Write-Host "3. Click 'New repository secret'" -ForegroundColor White
    Write-Host "4. Add AZURE_CREDENTIALS with the content of azure-credentials.json" -ForegroundColor White
    Write-Host "5. Add AZURE_WEBAPP_NAME with your web app name" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  Security Note:" -ForegroundColor Yellow
    Write-Host "- Keep azure-credentials.json secure" -ForegroundColor White
    Write-Host "- Don't commit this file to your repository" -ForegroundColor White
    Write-Host "- Consider using Azure Key Vault for production" -ForegroundColor White
    
} else {
    Write-Host "❌ Failed to create service principal" -ForegroundColor Red
    exit 1
} 