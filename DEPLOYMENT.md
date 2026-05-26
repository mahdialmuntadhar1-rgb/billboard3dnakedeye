# Deployment Guide for Iraq Businesses Dashboard

## Quick Deployment to Cloudflare Pages

### Step 1: Build the Frontend
```bash
cd client
npm run build
```

### Step 2: Deploy to Cloudflare Pages

#### Option A: Direct Upload (Fastest)

1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/)
2. Click "Create a project"
3. Select "Upload assets"
4. Upload the `client/dist` folder
5. Project name: `iraq-businesses-dashboard`
6. Click "Deploy"

#### Option B: Connect to GitHub

1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/)
2. Click "Create a project"
3. Select "Connect to Git"
4. Choose your repository: `mahdialmuntadhar1-rgb/billboard3dnakedeye`
5. Configure build settings:
   - **Build command**: `cd client && npm install && npm run build`
   - **Build output directory**: `client/dist`
6. Click "Save and Deploy"

### Step 3: Deploy Backend (Cloudflare Workers)

The backend needs to be deployed separately as a Cloudflare Worker.

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Deploy the worker:
```bash
cd iraq-businesses-dashboard
wrangler deploy
```

4. Note the worker URL (e.g., `https://iraq-businesses-dashboard.your-subdomain.workers.dev`)

### Step 4: Update Frontend API URL

After deploying the backend, update the frontend to use the correct API URL:

1. In `client/src/App.jsx`, change the API calls to use the worker URL
2. Or set environment variable `VITE_API_URL` to the worker URL

## Alternative: Deploy to Vercel

### Deploy Frontend to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd client
vercel
```

### Deploy Backend to Vercel

You'll need to convert the Express app to Vercel serverless functions.

## Current Status

- ✅ Frontend built successfully
- ✅ Backend running locally on port 5000
- ✅ Frontend running locally on port 3000
- ⏳ Cloudflare Pages deployment needed
- ⏳ Cloudflare Workers deployment needed

## Access URLs After Deployment

- **Frontend**: `https://iraq-businesses-dashboard.pages.dev` (or your custom domain)
- **Backend**: `https://iraq-businesses-dashboard.your-subdomain.workers.dev`

## Troubleshooting

### 404 Error on Cloudflare Pages
- The project hasn't been deployed yet
- Follow the deployment steps above
- Check the Cloudflare Pages dashboard for deployment status

### API Connection Issues
- Ensure the backend is deployed
- Update the API URL in the frontend
- Check CORS settings in the backend

### Build Errors
- Ensure all dependencies are installed
- Check Node.js version (should be 18+)
- Clear cache: `rm -rf node_modules && npm install`
