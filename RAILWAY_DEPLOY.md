# Deploy Proxy to Railway + Main App to Vercel

## Step 1: Deploy Proxy to Railway

### 1.1 Push Latest Code
```bash
git add -A
git commit -m "Add Railway configuration"
git push
```

### 1.2 Create New Project on Railway
1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository: `brun95/brawler-finder-explorer`
5. Railway will start deploying automatically

### 1.3 Configure Environment Variables
In Railway dashboard:
1. Go to your project → Variables
2. Add these variables:
   ```
   NEXT_PUBLIC_PUBLIC_BASE_URL=https://api.brawlstars.com/v1
   NEXT_PUBLIC_PUBLIC_BASE_CDN_URL=https://api.brawlify.com/v1
   SECRET_API_KEY=<your-api-key-will-add-after-getting-ip>
   ```

### 1.4 Get Railway's Public IP
1. In Railway dashboard, go to Settings
2. Click "Networking"
3. Click "Generate Domain" (this gives you a public URL)
4. Copy the domain (e.g., `your-app.up.railway.app`)
5. **Important:** To get the static IP, run this in your terminal:
   ```bash
   nslookup your-app.up.railway.app
   ```
   Note the IP address (this is your static IP!)

### 1.5 Update Brawl Stars API Key
1. Go to https://developer.brawlstars.com/#/
2. Create new API key
3. Add the Railway IP address you just found
4. Copy the new API key
5. Update `SECRET_API_KEY` in Railway dashboard → Variables

### 1.6 Verify Deployment
Test your proxy:
```bash
curl https://your-app.up.railway.app/brawlers
```

You should see JSON data of brawlers!

## Step 2: Deploy Main App to Vercel

### 2.1 Update Environment Variable
First, let's set the proxy URL in your local .env for testing:

Add to `.env`:
```
PROXY_SERVER_URL=https://your-app.up.railway.app
```

### 2.2 Update Next.js API Routes
We need to update ALL API routes to use the proxy. Let me know if you want me to do this, or you can do it manually:

In each API route file, replace:
```javascript
const { NEXT_PUBLIC_PUBLIC_BASE_URL, SECRET_API_KEY } = process.env;
```

With:
```javascript
const BASE_URL = process.env.PROXY_SERVER_URL || process.env.NEXT_PUBLIC_PUBLIC_BASE_URL;
const SECRET_API_KEY = process.env.SECRET_API_KEY;
```

And update axios calls to use `BASE_URL` and remove the Authorization header (proxy handles it).

### 2.3 Deploy to Vercel
1. Push your code:
   ```bash
   git add -A
   git commit -m "Configure for Railway proxy"
   git push
   ```

2. Go to https://vercel.com/new
3. Import your repository
4. Add Environment Variables:
   ```
   PROXY_SERVER_URL=https://your-app.up.railway.app
   SUPABASE_URL=https://djhcsmvyykevekkmjrqa.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<your-key>
   DATABASE_URL=<supabase-postgres-url>
   ```
5. Deploy!

## Step 3: Test Everything

### Test Proxy (Railway)
```bash
curl https://your-app.up.railway.app/players/2G0VQ0YLC
```

### Test Main App (Vercel)
```bash
curl https://your-app.vercel.app/api/players/2G0VQ0YLC
```

Both should return player data!

## Troubleshooting

### Railway deployment fails
- Check logs in Railway dashboard
- Make sure all env vars are set
- Verify `proxyServer.js` exists in repo

### Can't get Railway IP
```bash
# Alternative method
ping your-app.up.railway.app
# Or use online DNS lookup tools
```

### Vercel app gets 403 from proxy
- Verify Railway proxy is running (check Railway logs)
- Test proxy directly with curl
- Check Railway env vars are set correctly

## Cost Breakdown
- **Railway Free Tier**: $5 free credit/month (enough for proxy)
- **Vercel Free Tier**: Free
- **Total**: $0/month 🎉

## Next Steps
After both are deployed and working:
1. Update Supabase DATABASE_URL in Vercel
2. Test all API endpoints
3. Enjoy your deployed app!
