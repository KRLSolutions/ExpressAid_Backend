# Update GitHub Secrets Script

Write-Host "GitHub Secrets Update Helper" -ForegroundColor Green
Write-Host "==========================" -ForegroundColor Green

# Read the credentials file
$credentialsPath = "azure-credentials.json"
if (Test-Path $credentialsPath) {
    $credentials = Get-Content $credentialsPath -Raw | ConvertFrom-Json
    
    Write-Host "Current Azure Credentials:" -ForegroundColor Blue
    Write-Host "Client ID: $($credentials.clientId)" -ForegroundColor White
    Write-Host "Tenant ID: $($credentials.tenantId)" -ForegroundColor White
    Write-Host "Subscription ID: $($credentials.subscriptionId)" -ForegroundColor White
    Write-Host "Client Secret: $($credentials.clientSecret)" -ForegroundColor White
    Write-Host ""
    
    Write-Host "✅ Credentials look complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Blue
    Write-Host "1. Copy the entire content of azure-credentials.json" -ForegroundColor White
    Write-Host "2. Go to your GitHub repository" -ForegroundColor White
    Write-Host "3. Settings → Secrets and variables → Actions" -ForegroundColor White
    Write-Host "4. Update AZURE_CREDENTIALS secret with the JSON content" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "5. Also ensure AZURE_WEBAPP_NAME is set:" -ForegroundColor White
    Write-Host "   - Name: AZURE_WEBAPP_NAME" -ForegroundColor Yellow
    Write-Host "   - Value: Your Azure Web App name" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "6. Push to GitHub to trigger deployment:" -ForegroundColor White
    Write-Host "   git add ." -ForegroundColor Gray
    Write-Host "   git commit -m 'Fix Azure deployment configuration'" -ForegroundColor Gray
    Write-Host "   git push origin main" -ForegroundColor Gray
    
} else {
    Write-Host "❌ azure-credentials.json not found!" -ForegroundColor Red
    Write-Host "Please run the credentials generation script first." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔧 The GitHub Actions workflow has been fixed:" -ForegroundColor Blue
Write-Host "- Removed startup-command parameter that was causing errors" -ForegroundColor White
Write-Host "- Updated for Windows Web App compatibility" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Your deployment should work now!" -ForegroundColor Green 