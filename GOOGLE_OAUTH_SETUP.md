# Google OAuth Setup for Gmail Login

## Steps to Enable Gmail Login:

### 1. Create Google OAuth App
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth client ID"
5. Select "Web application"
6. Add authorized redirect URI: `https://iraq-businesses-dashboard.mahdialmuntadhar1.workers.dev/api/auth/google/callback`
7. Save and note your **Client ID** and **Client Secret**

### 2. Set Cloudflare Worker Secrets
```bash
# Set Google OAuth secrets
wrangler secret put GOOGLE_CLIENT_ID
# Paste your Client ID when prompted

wrangler secret put GOOGLE_CLIENT_SECRET  
# Paste your Client Secret when prompted

# Optional: Set frontend URL for redirects
wrangler secret put FRONTEND_URL
# Enter: https://billboard3dnakedeye-mor.vercel.app
```

### 3. Deploy Worker
```bash
wrangler deploy --minify
```

### 4. Test Gmail Login
1. Open frontend: https://billboard3dnakedeye-mor.vercel.app
2. Click "🔑 Sign In" → "Continue with Google"
3. Should redirect to Google OAuth flow
4. After authentication, returns to app with user logged in

## Security Notes:
- Never expose Client Secret in frontend code
- Redirect URI must exactly match worker URL
- Enable Google+ API if needed for user profile data
- Consider adding domain verification for production

## Current Status:
⚠️ Google OAuth not configured yet - shows friendly error message
✅ Email/password authentication works
✅ Forgot password works
