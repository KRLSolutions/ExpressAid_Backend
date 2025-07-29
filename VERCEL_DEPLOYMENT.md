# Vercel Deployment Guide for ExpressAid Backend

This guide will help you deploy your Express.js backend to Vercel using the CLI.

## Prerequisites

1. **Node.js** (v14 or higher)
2. **Vercel CLI** - Install globally: `npm install -g vercel`
3. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)

## Files Created for Vercel Deployment

### 1. `vercel.json`
- Main configuration file for Vercel
- Defines build settings and routing
- Sets environment variables and function timeouts

### 2. `api/index.js`
- Serverless function entry point
- Imports and exports the Express app

### 3. `.vercelignore`
- Excludes unnecessary files from deployment
- Reduces deployment size and improves performance

### 4. Modified `server.js`
- Removed direct server listening (not needed for serverless)
- Added Vercel-specific CORS origins
- Proper app export for serverless deployment

## Deployment Steps

### Option 1: Using PowerShell Script (Windows)
```powershell
# Run the deployment script
.\deploy-vercel.ps1
```

### Option 2: Using Bash Script (Linux/Mac)
```bash
# Make script executable
chmod +x deploy-vercel.sh

# Run the deployment script
./deploy-vercel.sh
```

### Option 3: Manual Deployment
```bash
# Navigate to backend directory
cd ExpressAid_Backend

# Login to Vercel (if not already logged in)
vercel login

# Deploy to production
vercel --prod
```

## Environment Variables Setup

You'll need to set up environment variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:

```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
GEMINI_API_KEY=your_gemini_api_key
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
```

## Post-Deployment Steps

### 1. Update Frontend URL
After deployment, update your frontend's `BackendURl.js`:

```javascript
// Replace with your Vercel deployment URL
export const url = 'https://your-backend-name.vercel.app/api'
```

### 2. Test Your Deployment
Visit your deployment URL and test the health endpoint:
```
https://your-backend-name.vercel.app/api/health
```

### 3. Update CORS Origins
If you have a frontend deployed on Vercel, add its domain to the CORS origins in `server.js`.

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Ensure all required environment variables are set in Vercel dashboard
   - Redeploy after setting variables

2. **CORS Errors**
   - Add your frontend domain to CORS origins in `server.js`
   - Update the origins array with your actual frontend URL

3. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Ensure IP whitelist includes Vercel's IP ranges

4. **Function Timeout**
   - Increase timeout in `vercel.json` if needed
   - Optimize database queries and external API calls

### Debugging

1. **Check Vercel Logs**
   ```bash
   vercel logs
   ```

2. **Test Locally with Vercel**
   ```bash
   vercel dev
   ```

3. **Check Function Logs**
   - Go to Vercel dashboard → Functions → View logs

## Performance Optimization

1. **Database Connection Pooling**
   - Implement connection pooling for MongoDB
   - Use connection reuse in serverless environment

2. **Caching**
   - Implement Redis or in-memory caching
   - Cache frequently accessed data

3. **Image Optimization**
   - Use Vercel's image optimization
   - Compress images before upload

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to git
   - Use Vercel's environment variable system

2. **CORS Configuration**
   - Only allow necessary origins
   - Regularly review and update CORS settings

3. **Rate Limiting**
   - Current setup includes rate limiting
   - Monitor and adjust limits as needed

## Monitoring and Analytics

1. **Vercel Analytics**
   - Enable Vercel Analytics in dashboard
   - Monitor function performance

2. **Custom Monitoring**
   - Implement health checks
   - Monitor database connections
   - Track API response times

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Express.js Documentation**: [expressjs.com](https://expressjs.com)

## Next Steps

After successful deployment:

1. ✅ Test all API endpoints
2. ✅ Update frontend configuration
3. ✅ Set up monitoring and alerts
4. ✅ Configure custom domain (optional)
5. ✅ Set up CI/CD pipeline (optional)

Your ExpressAid backend is now ready for production on Vercel! 🚀