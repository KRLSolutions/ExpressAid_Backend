# Vercel Deployment Script for ExpressAid Backend (PowerShell)
Write-Host "🚀 Starting Vercel deployment for ExpressAid Backend..." -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI is installed: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI is not installed. Installing now..." -ForegroundColor Yellow
    npm install -g vercel
}

# Check if user is logged in to Vercel
try {
    $whoami = vercel whoami
    Write-Host "✅ Logged in as: $whoami" -ForegroundColor Green
} catch {
    Write-Host "🔐 Please login to Vercel..." -ForegroundColor Yellow
    vercel login
}

# Navigate to backend directory
Set-Location ExpressAid_Backend

# Deploy to Vercel
Write-Host "📦 Deploying to Vercel..." -ForegroundColor Green
vercel --prod

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host "🌐 Your backend is now live on Vercel!" -ForegroundColor Green
Write-Host "📝 Don't forget to update your frontend BackendURl.js with the new Vercel URL" -ForegroundColor Yellow