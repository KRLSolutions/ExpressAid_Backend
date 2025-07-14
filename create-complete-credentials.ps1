# Create Complete Azure Credentials
# This script creates the complete JSON credentials using your client ID and tenant ID

Write-Host "🔐 Creating Complete Azure Credentials" -ForegroundColor Blue
Write-Host "=====================================" -ForegroundColor Blue

# Your provided credentials
$clientId = "72a7a2d7-20a0-4b95-ae04-8c0e31c9e3c6"
$tenantId = "d19dcf49-4f43-4880-b318-ead6db58ddd1"

Write-Host "📋 Using provided credentials:" -ForegroundColor Blue
Write-Host "Client ID: $clientId" -ForegroundColor White
Write-Host "Tenant ID: $tenantId" -ForegroundColor White
Write-Host ""

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

# Create service principal with your provided client ID
Write-Host "📦 Creating Service Principal..." -ForegroundColor Blue

# Create service principal
$spOutput = az ad sp create-for-rbac `
    --name "expressaid-github-actions" `
    --description "Service Principal for ExpressAid GitHub Actions deployment" `
    --role contributor `
    --scopes "/subscriptions/$subscriptionId" `
    --sdk-auth

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Service Principal created successfully" -ForegroundColor Green
    
    # Save credentials to file
    $spOutput | Out-File -FilePath "azure-credentials.json" -Encoding UTF8
    
    # Verify the credentials
    $creds = $spOutput | ConvertFrom-Json
    
    Write-Host ""
    Write-Host "🔍 Generated credentials:" -ForegroundColor Blue
    Write-Host "Client ID: $($creds.clientId)" -ForegroundColor White
    Write-Host "Tenant ID: $($creds.tenantId)" -ForegroundColor White
    Write-Host "Subscription ID: $($creds.subscriptionId)" -ForegroundColor White
    Write-Host "Client Secret: [HIDDEN]" -ForegroundColor White
    
    Write-Host ""
    Write-Host "🎉 Complete credentials generated!" -ForegroundColor Green
    Write-Host "=====================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Blue
    Write-Host "1. Copy the entire content of azure-credentials.json" -ForegroundColor White
    Write-Host "2. Go to your GitHub repository" -ForegroundColor White
    Write-Host "3. Settings → Secrets and variables → Actions" -ForegroundColor White
    Write-Host "4. Add new repository secret:" -ForegroundColor White
    Write-Host "   - Name: AZURE_CREDENTIALS" -ForegroundColor Yellow
    Write-Host "   - Value: Paste the entire JSON content" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "5. Also add:" -ForegroundColor White
    Write-Host "   - Name: AZURE_WEBAPP_NAME" -ForegroundColor Yellow
    Write-Host "   - Value: Your Azure Web App name (e.g., expressaid-backend)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "⚠️  Security Note:" -ForegroundColor Yellow
    Write-Host "- Keep azure-credentials.json secure" -ForegroundColor White
    Write-Host "- Don't commit this file to your repository" -ForegroundColor White
    Write-Host "- The file contains sensitive information" -ForegroundColor White
    
} else {
    Write-Host "❌ Failed to create service principal" -ForegroundColor Red
    Write-Host "Error: $spOutput" -ForegroundColor Red
    exit 1
} 