# Manual Azure Credentials Generator
# This script creates the complete JSON credentials manually

Write-Host "🔐 Manual Azure Credentials Generator" -ForegroundColor Blue
Write-Host "===================================" -ForegroundColor Blue

# Your provided credentials
$clientId = "72a7a2d7-20a0-4b95-ae04-8c0e31c9e3c6"
$tenantId = "d19dcf49-4f43-4880-b318-ead6db58ddd1"

Write-Host "📋 Using provided credentials:" -ForegroundColor Blue
Write-Host "Client ID: $clientId" -ForegroundColor White
Write-Host "Tenant ID: $tenantId" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  IMPORTANT: You need to get the client secret from Azure Portal" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Steps to get client secret:" -ForegroundColor Blue
Write-Host "1. Go to Azure Portal: https://portal.azure.com" -ForegroundColor White
Write-Host "2. Search for 'App registrations'" -ForegroundColor White
Write-Host "3. Find your app: expressaid-github-actions" -ForegroundColor White
Write-Host "4. Go to 'Certificates & secrets'" -ForegroundColor White
Write-Host "5. Click 'New client secret'" -ForegroundColor White
Write-Host "6. Add description: 'GitHub Actions'" -ForegroundColor White
Write-Host "7. Set expiration (e.g., 12 months)" -ForegroundColor White
Write-Host "8. Click 'Add'" -ForegroundColor White
Write-Host "9. Copy the secret value immediately" -ForegroundColor White
Write-Host ""

# Get subscription ID from user
$subscriptionId = Read-Host "Enter your Azure Subscription ID (or press Enter to use a placeholder)"

if ([string]::IsNullOrWhiteSpace($subscriptionId)) {
    $subscriptionId = "your-subscription-id-here"
    Write-Host "⚠️  Using placeholder subscription ID. Please replace it with your actual subscription ID." -ForegroundColor Yellow
}

# Get client secret from user
$clientSecret = Read-Host "Enter the client secret from Azure Portal"

if ([string]::IsNullOrWhiteSpace($clientSecret)) {
    Write-Host "❌ Client secret is required!" -ForegroundColor Red
    Write-Host "Please get it from Azure Portal and run this script again." -ForegroundColor Yellow
    exit 1
}

# Create the complete JSON
$credentials = @{
    clientId = $clientId
    clientSecret = $clientSecret
    subscriptionId = $subscriptionId
    tenantId = $tenantId
    activeDirectoryEndpointUrl = "https://login.microsoftonline.com"
    resourceManagerEndpointUrl = "https://management.azure.com/"
    activeDirectoryGraphResourceId = "https://graph.windows.net/"
    sqlManagementEndpointUrl = "https://management.core.windows.net:8443/"
    galleryEndpointUrl = "https://gallery.azure.com/"
    managementEndpointUrl = "https://management.core.windows.net/"
}

# Convert to JSON
$jsonCredentials = $credentials | ConvertTo-Json -Depth 10

# Save to file
$jsonCredentials | Out-File -FilePath "azure-credentials.json" -Encoding UTF8

Write-Host ""
Write-Host "✅ Credentials generated successfully!" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green
Write-Host ""
Write-Host "📄 File created: azure-credentials.json" -ForegroundColor Blue
Write-Host ""
Write-Host "🔍 Generated credentials:" -ForegroundColor Blue
Write-Host "Client ID: $clientId" -ForegroundColor White
Write-Host "Tenant ID: $tenantId" -ForegroundColor White
Write-Host "Subscription ID: $subscriptionId" -ForegroundColor White
Write-Host "Client Secret: [HIDDEN]" -ForegroundColor White
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