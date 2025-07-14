# Cashfree Payment Gateway Setup

## Current Issue
The Cashfree API is returning authentication errors (401) because the credentials are not valid. The current credentials in the code are placeholder values.

## How to Fix

### Step 1: Get Cashfree Sandbox Credentials

1. Go to [Cashfree Merchant Dashboard](https://merchant.cashfree.com/)
2. Sign up for a merchant account if you don't have one
3. Navigate to the **API Keys** section
4. Copy your **App ID** and **Secret Key** from the sandbox environment

### Step 2: Update Environment Variables

Create a `.env` file in the backend directory with your actual credentials:

```bash
# Cashfree Configuration
CASHFREE_APP_ID=your_actual_app_id_here
CASHFREE_SECRET_KEY=your_actual_secret_key_here
CASHFREE_ENV=TEST
```

### Step 3: Test the Credentials

Run the test endpoint to verify your credentials work:

```bash
curl http://localhost:5000/api/cashfree/test-credentials
```

### Step 4: Restart the Server

After updating the credentials, restart your server:

```bash
node start.js
```

## Alternative: Use Mock Mode for Development

If you want to continue development without real Cashfree credentials, the current setup will automatically fall back to mock responses. The payment flow will work for testing, but no real payments will be processed.

## Troubleshooting

- **401 Authentication Error**: Invalid credentials - check your App ID and Secret Key
- **403 Forbidden**: Your account might not be activated for the sandbox environment
- **Network Error**: Check your internet connection and Cashfree API status

## Important Notes

- Always use sandbox credentials for development
- Never commit real production credentials to version control
- The mock mode is perfect for frontend development and testing
- Real payments require production credentials and proper merchant account setup 