# Complete Deployment Guide - Iraq Businesses Dashboard

## Step 1: Deploy Backend (Cloudflare Worker)

### 1.1 Install Wrangler CLI
```bash
npm install -g wrangler
```

### 1.2 Login to Cloudflare
```bash
wrangler login
```
This will open your browser to authenticate with Cloudflare.

### 1.3 Create KV Namespace
```bash
cd C:\Users\HB LAPTOP STORE\Documents\puython-pro-scraper\iraq-businesses-dashboard
wrangler kv:namespace create "BUSINESS_DATA"
```

**Copy the namespace ID** (it will look like: `abc123def456`)

### 1.4 Update wrangler.toml
Open `wrangler.toml` and replace `your-kv-namespace-id` with the actual ID you got from step 1.3.

### 1.5 Upload Data to KV
```bash
node scripts/upload-to-kv.js
```

Or manually:
```bash
wrangler kv:key put "businesses" --path=data/businesses.json --binding=BUSINESS_DATA
```

### 1.6 Deploy the Worker
```bash
wrangler deploy
```

**Copy the worker URL** (it will look like: `https://iraq-businesses-dashboard.your-subdomain.workers.dev`)

---

## Step 2: Deploy Frontend (Cloudflare Pages)

### 2.1 Update API URL
Open `client/.env.production` and replace the URL with your actual worker URL from step 1.6:
```
VITE_API_URL=https://iraq-businesses-dashboard.your-subdomain.workers.dev
```

### 2.2 Build Frontend
```bash
cd client
npm run build
```

### 2.3 Deploy to Cloudflare Pages

**Option A: Direct Upload (Fastest)**
1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/)
2. Click "Create a project"
3. Select "Upload assets"
4. Upload the `client/dist` folder
5. Project name: `iraq-businesses-dashboard`
6. Click "Deploy"

**Option B: Connect to GitHub (Recommended)**
1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/)
2. Click "Create a project"
3. Select "Connect to Git"
4. Choose repository: `mahdialmuntadhar1-rgb/billboard3dnakedeye`
5. Build settings:
   - **Build command**: `cd client && npm install && npm run build`
   - **Build output directory**: `client/dist`
6. Click "Save and Deploy"

---

## Step 3: Test Your Deployment

### 3.1 Test Backend
Visit your worker URL:
```
https://iraq-businesses-dashboard.your-subdomain.workers.dev/api/health
```

You should see:
```json
{
  "success": true,
  "message": "API is running",
  "dataCount": 570
}
```

### 3.2 Test Frontend
Visit your Pages URL:
```
https://iraq-businesses-dashboard.pages.dev
```

You should see the dashboard with businesses loaded.

---

## Troubleshooting

### Backend Issues

**Worker returns 404:**
- Check that KV namespace is created
- Verify data is uploaded to KV
- Check wrangler.toml has correct namespace ID

**API returns empty data:**
- Verify KV data upload was successful
- Check worker logs: `wrangler tail`

### Frontend Issues

**404 on Cloudflare Pages:**
- Project hasn't been deployed yet
- Check deployment status in Cloudflare dashboard

**API connection errors:**
- Verify VITE_API_URL is correct in .env.production
- Check that backend worker is deployed and running
- Test backend API directly in browser

**Build errors:**
- Ensure all dependencies are installed
- Check Node.js version (should be 18+)
- Clear cache: `rm -rf node_modules && npm install`

---

## Quick Reference Commands

```bash
# Backend
wrangler login
wrangler kv:namespace create "BUSINESS_DATA"
wrangler kv:key put "businesses" --path=data/businesses.json --binding=BUSINESS_DATA
wrangler deploy
wrangler tail  # View logs

# Frontend
cd client
npm install
npm run build
# Then upload client/dist to Cloudflare Pages
```

---

## After Deployment

Your dashboard will be accessible at:
- **Frontend**: `https://iraq-businesses-dashboard.pages.dev`
- **Backend**: `https://iraq-businesses-dashboard.your-subdomain.workers.dev`

Both will be live and ready to use!
