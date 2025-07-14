# Cashfree Sandbox Credentials Setup Guide

## Step-by-Step Process to Get Proper Credentials

### Step 1: Access Cashfree Merchant Dashboard

1. **Go to Cashfree Merchant Dashboard**
   - Visit: https://merchant.cashfree.com/
   - Click "Sign Up" if you don't have an account
   - Or "Login" if you already have an account

### Step 2: Complete Merchant Registration

1. **Business Details**
   - Fill in your business name
   - Select business type (Individual/Company)
   - Enter your PAN number
   - Provide business address

2. **Bank Account Details**
   - Enter your bank account number
   - Provide IFSC code
   - Upload cancelled cheque or bank statement

3. **Contact Information**
   - Enter your mobile number
   - Provide email address
   - Set up security questions

### Step 3: Navigate to API Keys Section

1. **After Login**
   - Go to "Settings" or "Developer" section
   - Look for "API Keys" or "Integration"
   - Click on "API Keys" or "Get API Keys"

### Step 4: Get Sandbox Credentials

1. **Switch to Sandbox Mode**
   - Look for a toggle or dropdown to switch between "Production" and "Sandbox"
   - Make sure you're in **Sandbox** mode

2. **Generate API Keys**
   - Click "Generate New API Key" or "Create API Key"
   - You'll get two keys:
     - **App ID** (starts with "TEST" for sandbox)
     - **Secret Key** (starts with "cfsk_ma_test_" for sandbox)

### Step 5: Copy Your Credentials

Your credentials will look like this:
```
App ID: TEST1234567890abcdef1234567890abcdef
Secret Key: cfsk_ma_test_1234567890abcdef1234567890abcdef_1234567890abcdef
```

### Step 6: Update Your Environment

1. **Create .env file** in your backend directory:
```bash
# Cashfree Configuration
CASHFREE_APP_ID=YOUR_ACTUAL_APP_ID_HERE
CASHFREE_SECRET_KEY=YOUR_ACTUAL_SECRET_KEY_HERE
CASHFREE_ENV=TEST
```

2. **Replace the placeholder values** with your actual credentials

### Step 7: Test Your Credentials

Run the test script to verify:
```bash
node test-cashfree-integration.js
```

## Common Issues and Solutions

### Issue 1: "Account Not Activated"
**Solution:**
- Complete your merchant profile
- Upload required documents
- Wait for account approval (usually 24-48 hours)

### Issue 2: "Invalid API Key"
**Solution:**
- Make sure you're using sandbox credentials, not production
- Check that you copied the entire key without extra spaces
- Verify the key format (App ID starts with "TEST", Secret Key starts with "cfsk_ma_test_")

### Issue 3: "API Key Not Found"
**Solution:**
- Ensure you're logged into the correct merchant account
- Check if you're in the right environment (sandbox vs production)
- Try regenerating the API keys

## Alternative: Quick Test Credentials

If you're having trouble with the merchant dashboard, you can use these **test credentials** for development:

```bash
# Test Credentials (for development only)
CASHFREE_APP_ID=TEST10393719a08909e07f6157a7221e91739301
CASHFREE_SECRET_KEY=cfsk_ma_test_d81a3c09420dcde848287e6b7aacfca5_3f2bf834
CASHFREE_ENV=TEST
```

**Note:** These test credentials will still give 401 errors, but they're properly formatted for testing the integration.

## Verification Steps

1. **Check Credential Format:**
   - App ID should start with "TEST"
   - Secret Key should start with "cfsk_ma_test_"
   - Both should be long strings (30+ characters)

2. **Test with Minimal Order:**
   ```bash
   curl -X POST http://localhost:5000/api/cashfree/test-credentials
   ```

3. **Check Response:**
   - If you get a successful response, your credentials are working
   - If you still get 401, the credentials might be invalid or the account not activated

## Important Notes

- **Never commit real credentials to version control**
- **Always use sandbox credentials for development**
- **Production credentials require additional verification**
- **The mock mode is perfect for frontend development**

## Support

If you're still having issues:
1. Check Cashfree's official documentation: https://docs.cashfree.com/
2. Contact Cashfree support through the merchant dashboard
3. Use the mock mode for development until you get proper credentials 