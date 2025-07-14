# Azure Credentials Verification Script
# This script helps verify and fix Azure credentials for GitHub Actions

Write-Host "🔍 Azure Credentials Verification" -ForegroundColor Blue
Write-Host "===============================" -ForegroundColor Blue

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

# Check if azure-credentials.json exists
if (Test-Path "azure-credentials.json") {
    Write-Host "📄 Found existing azure-credentials.json" -ForegroundColor Yellow
    $existingCreds = Get-Content "azure-credentials.json" -Raw | ConvertFrom-Json
    
    Write-Host "🔍 Checking existing credentials..." -ForegroundColor Blue
    
    $requiredFields = @("clientId", "clientSecret", "subscriptionId", "tenantId")
    $missingFields = @()
    
    foreach ($field in $requiredFields) {
        if (-not $existingCreds.$field) {
            $missingFields += $field
        }
    }
    
    if ($missingFields.Count -gt 0) {
        Write-Host "❌ Missing required fields: $($missingFields -join ', ')" -ForegroundColor Red
        Write-Host "Creating new credentials..." -ForegroundColor Yellow
    } else {
        Write-Host "✅ Existing credentials look valid" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Current credentials:" -ForegroundColor Blue
        Write-Host "Client ID: $($existingCreds.clientId)" -ForegroundColor White
        Write-Host "Tenant ID: $($existingCreds.tenantId)" -ForegroundColor White
        Write-Host "Subscription ID: $($existingCreds.subscriptionId)" -ForegroundColor White
        Write-Host ""
        Write-Host "🔧 To use these credentials:" -ForegroundColor Blue
        Write-Host "1. Copy the entire content of azure-credentials.json" -ForegroundColor White
        Write-Host "2. Add it as AZURE_CREDENTIALS secret in GitHub" -ForegroundColor White
        Write-Host ""
        return
    }
}

# Create new service principal
Write-Host "📦 Creating new Service Principal..." -ForegroundColor Blue

# Delete existing service principal if it exists
try {
    az ad sp delete --id "expressaid-github-actions" 2>$null
    Write-Host "🗑️  Deleted existing service principal" -ForegroundColor Yellow
} catch {
    # Service principal doesn't exist, which is fine
}

# Create new service principal
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
    Write-Host "🔍 Verifying credentials..." -ForegroundColor Blue
    Write-Host "Client ID: $($creds.clientId)" -ForegroundColor White
    Write-Host "Tenant ID: $($creds.tenantId)" -ForegroundColor White
    Write-Host "Subscription ID: $($creds.subscriptionId)" -ForegroundColor White
    
    # Check if all required fields are present
    $requiredFields = @("clientId", "clientSecret", "subscriptionId", "tenantId")
    $missingFields = @()
    
    foreach ($field in $requiredFields) {
        if (-not $creds.$field) {
            $missingFields += $field
        }
    }
    
    if ($missingFields.Count -gt 0) {
        Write-Host "❌ ERROR: Missing required fields: $($missingFields -join ', ')" -ForegroundColor Red
        Write-Host "Please try again or contact Azure support" -ForegroundColor Yellow
        exit 1
    } else {
        Write-Host "✅ All required fields are present" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "🎉 Credentials generated successfully!" -ForegroundColor Green
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