# Update Azure Credentials Script

Write-Host "Updating Azure Credentials" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green

# Read the current file
$currentContent = Get-Content "azure-credentials.json" -Raw
$credentials = $currentContent | ConvertFrom-Json

Write-Host "Current credentials:" -ForegroundColor Blue
Write-Host "Client ID: $($credentials.clientId)" -ForegroundColor White
Write-Host "Tenant ID: $($credentials.tenantId)" -ForegroundColor White
Write-Host "Subscription ID: $($credentials.subscriptionId)" -ForegroundColor White
Write-Host "Client Secret: $($credentials.clientSecret)" -ForegroundColor White
Write-Host ""

# Get subscription ID
$subscriptionId = Read-Host "Enter your Azure Subscription ID"

if (-not [string]::IsNullOrWhiteSpace($subscriptionId)) {
    $credentials.subscriptionId = $subscriptionId
    Write-Host "Updated Subscription ID" -ForegroundColor Green
}

# Get client secret
$clientSecret = Read-Host "Enter your Client Secret from Azure Portal"

if (-not [string]::IsNullOrWhiteSpace($clientSecret)) {
    $credentials.clientSecret = $clientSecret
    Write-Host "Updated Client Secret" -ForegroundColor Green
}

# Save updated credentials
$credentials | ConvertTo-Json -Depth 10 | Out-File -FilePath "azure-credentials.json" -Encoding UTF8

Write-Host ""
Write-Host "Credentials updated successfully!" -ForegroundColor Green
Write-Host "File: azure-credentials.json" -ForegroundColor Blue
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Blue
Write-Host "1. Copy the entire content of azure-credentials.json" -ForegroundColor White
Write-Host "2. Go to your GitHub repository" -ForegroundColor White
Write-Host "3. Settings → Secrets and variables → Actions" -ForegroundColor White
Write-Host "4. Add/Update AZURE_CREDENTIALS secret with the JSON content" -ForegroundColor Yellow
Write-Host "5. Add AZURE_WEBAPP_NAME secret with your web app name" -ForegroundColor Yellow 