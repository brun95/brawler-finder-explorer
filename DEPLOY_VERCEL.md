# Deploy to Vercel (Free Tier)

## Prerequisites
You need a Brawl Stars API key **without IP restrictions** because Vercel uses dynamic IPs.

## Step 1: Create Unrestricted API Key

1. Go to https://developer.brawlstars.com/#/
2. Click "Create New Key"
3. **Important:** Leave the IP field empty (don't add any IPs)
4. Save and copy the API key

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. Push your code to GitHub:
   ```bash
   git add -A
   git commit -m "Ready for Vercel deployment"
   git push
   ```

2. Go to https://vercel.com
3. Sign in with GitHub
4. Click "Add New Project"
5. Import your repository: `brun95/brawler-finder-explorer`
6. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: (leave default)
   - Output Directory: (leave default)

7. Add Environment Variables:
   ```
   NEXT_PUBLIC_PUBLIC_BASE_URL=https://api.brawlstars.com/v1
   NEXT_PUBLIC_PUBLIC_BASE_CDN_URL=https://api.brawlify.com/v1
   SECRET_API_KEY=<your-unrestricted-api-key>
   SUPABASE_URL=https://djhcsmvyykevekkmjrqa.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<your-supabase-key>
   DATABASE_URL=<your-supabase-connection-string>
   ```

8. Click "Deploy"

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts and add environment variables when asked
```

## Step 3: Configure Database

Since you're using Supabase, update the `DATABASE_URL`:

1. Go to Supabase → Project Settings → Database
2. Copy the connection string (URI format)
3. Update in Vercel: Settings → Environment Variables → `DATABASE_URL`

Example:
```
postgresql://postgres:[password]@db.djhcsmvyykevekkmjrqa.supabase.co:5432/postgres
```

## Step 4: Test Deployment

Once deployed, test these endpoints:

```bash
# Brawlers list
curl https://your-app.vercel.app/api/brawlers

# Player data
curl https://your-app.vercel.app/api/players/2G0VQ0YLC

# Events
curl https://your-app.vercel.app/api/events
```

## Troubleshooting

### Build fails
- Check environment variables are set correctly
- View build logs in Vercel dashboard
- Make sure all dependencies are in `package.json`

### API returns 403
- Verify your API key has **NO IP restrictions**
- Check the key is correctly set in Vercel environment variables
- Redeploy after changing env vars

### Database errors
- Verify DATABASE_URL points to Supabase (not `file:./dev.db`)
- Run migrations: `npx prisma generate` locally, then redeploy

## Security Note

Since your API key has no IP restrictions:
- Don't commit it to GitHub
- Rotate it regularly
- Monitor usage in Brawl Stars developer portal
- The key is only used server-side (Next.js API routes), not exposed to clients

## Cost
- **Vercel Free Tier**: 100GB bandwidth/month, unlimited requests
- **Database**: Free with Supabase (500MB storage, 2GB transfer)
- **Total**: $0/month 🎉
