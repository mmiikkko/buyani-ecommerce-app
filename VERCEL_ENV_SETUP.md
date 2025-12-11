# Vercel Environment Variables Setup

Copy these environment variables to your Vercel project settings (Settings → Environment Variables):

## Required Environment Variables

```
DB_URI=mysql://user:password@host:port/database?ssl=true
BETTER_AUTH_URL=https://your-app.vercel.app
BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
GMAIL_USER=your-email@gmail.com
GMAIL_APP_KEY=<generate Gmail app password>
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
PAYMONGO_SECRET_KEY=<your PayMongo secret key>
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## Important Notes:

1. **NEXT_PUBLIC_APP_URL**: This is used for GCash payment redirect URLs. Set it to your actual Vercel deployment URL (e.g., `https://buyani-ecommerce.vercel.app`). If not set, the app will try to use the request origin header.

2. **PAYMONGO_SECRET_KEY**: Get this from your PayMongo dashboard. Make sure you're using the **secret key**, not the public key.

3. **BETTER_AUTH_URL**: Must match your Vercel deployment URL exactly (including https://).

## Quick Setup Commands

### Generate Better Auth Secret
```bash
openssl rand -base64 32
```

### Get Gmail App Password
1. Enable 2FA on Gmail
2. Visit: https://myaccount.google.com/apppasswords
3. Generate password for "Mail"

### Google OAuth Setup
1. Visit: https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add redirect URIs:
   - `https://your-app.vercel.app/api/auth/callback/google`
   - `https://your-app.vercel.app/api/auth/sign-in`

### PayMongo Setup
1. Sign up at: https://paymongo.com/
2. Get your secret key from the dashboard
3. Make sure to use the **production** secret key for production deployments

## Vercel-Specific Configuration

After deploying, Vercel will automatically:
- Set `VERCEL_URL` environment variable
- Make your app accessible at `https://your-app.vercel.app`

The app will automatically use the request origin if `NEXT_PUBLIC_APP_URL` is not set, but it's recommended to set it explicitly for consistency.
